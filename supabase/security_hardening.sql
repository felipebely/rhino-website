-- Apply this migration in the Supabase SQL editor before deploying the matching
-- frontend changes. It removes anonymous table access and replaces it with
-- narrow, token-scoped customer functions and authenticated admin policies.

CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS access_token_hash bytea;

-- Old tracking URLs deliberately stop working after this migration. Existing
-- rows receive unrecoverable random hashes so they cannot be accessed publicly.
UPDATE public.orders
SET access_token_hash = extensions.digest(extensions.gen_random_bytes(32), 'sha256')
WHERE access_token_hash IS NULL;

ALTER TABLE public.orders
  ALTER COLUMN access_token_hash SET NOT NULL;

CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_logs ENABLE ROW LEVEL SECURITY;

-- Remove every prior policy from private tables, including policies that may
-- have been created outside the checked-in schema files.
DO $migration$
DECLARE
  policy_row record;
BEGIN
  FOR policy_row IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('admin_users', 'orders', 'order_items', 'order_logs')
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON %I.%I',
      policy_row.policyname,
      policy_row.schemaname,
      policy_row.tablename
    );
  END LOOP;
END
$migration$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

CREATE POLICY "Admins can read their membership"
ON public.admin_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can read orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can update orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can read order items"
ON public.order_items
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can read order logs"
ON public.order_logs
FOR SELECT
TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can read all products" ON public.products;
CREATE POLICY "Admins can read all products"
ON public.products
FOR SELECT
TO authenticated
USING (public.is_admin());

REVOKE ALL ON TABLE public.admin_users FROM anon, authenticated;
REVOKE ALL ON TABLE public.orders FROM anon, authenticated;
REVOKE ALL ON TABLE public.order_items FROM anon, authenticated;
REVOKE ALL ON TABLE public.order_logs FROM anon, authenticated;

GRANT SELECT ON TABLE public.admin_users TO authenticated;
GRANT SELECT, UPDATE ON TABLE public.orders TO authenticated;
GRANT SELECT ON TABLE public.order_items TO authenticated;
GRANT SELECT ON TABLE public.order_logs TO authenticated;

CREATE OR REPLACE FUNCTION public.place_order(
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_contact_channel text,
  p_delivery_date date,
  p_payment_method text,
  p_items jsonb
)
RETURNS TABLE(order_id uuid, access_token text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  item jsonb;
  item_product_id uuid;
  item_quantity integer;
  item_price numeric(10, 2);
  order_total numeric(10, 2) := 0;
  new_order_id uuid;
  new_access_token text := encode(extensions.gen_random_bytes(32), 'hex');
  local_today date := timezone('America/Sao_Paulo', now())::date;
BEGIN
  IF p_customer_name IS NULL
     OR length(trim(p_customer_name)) NOT BETWEEN 1 AND 120 THEN
    RAISE EXCEPTION 'Invalid customer name';
  END IF;

  IF p_customer_email IS NULL
     OR length(trim(p_customer_email)) NOT BETWEEN 3 AND 254 THEN
    RAISE EXCEPTION 'Invalid customer email';
  END IF;

  IF p_customer_phone IS NULL
     OR length(trim(p_customer_phone)) NOT BETWEEN 3 AND 30 THEN
    RAISE EXCEPTION 'Invalid customer phone';
  END IF;

  IF p_contact_channel IS NULL
     OR p_contact_channel NOT IN ('WhatsApp', 'E-mail') THEN
    RAISE EXCEPTION 'Invalid contact channel';
  END IF;

  IF p_payment_method IS NULL
     OR p_payment_method NOT IN ('PIX', 'Pagamento na Entrega') THEN
    RAISE EXCEPTION 'Invalid payment method';
  END IF;

  IF p_delivery_date IS NULL
     OR p_delivery_date < local_today
     OR p_delivery_date > local_today + 14
     OR extract(isodow FROM p_delivery_date) <> 3 THEN
    RAISE EXCEPTION 'Invalid delivery date';
  END IF;

  IF p_items IS NULL
     OR jsonb_typeof(p_items) <> 'array'
     OR jsonb_array_length(p_items) NOT BETWEEN 1 AND 50 THEN
    RAISE EXCEPTION 'Invalid order items';
  END IF;

  FOR item IN SELECT value FROM jsonb_array_elements(p_items)
  LOOP
    BEGIN
      item_product_id := (item->>'product_id')::uuid;
      item_quantity := (item->>'quantity')::integer;
    EXCEPTION WHEN invalid_text_representation THEN
      RAISE EXCEPTION 'Invalid order item';
    END;

    IF item_quantity NOT BETWEEN 1 AND 100 THEN
      RAISE EXCEPTION 'Invalid quantity';
    END IF;

    SELECT price
    INTO item_price
    FROM public.products
    WHERE id = item_product_id
      AND is_active = true;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product is unavailable';
    END IF;

    order_total := order_total + (item_price * item_quantity);
  END LOOP;

  INSERT INTO public.orders (
    customer_name,
    customer_email,
    customer_phone,
    contact_channel,
    delivery_date,
    payment_method,
    status,
    total_amount,
    access_token_hash
  )
  VALUES (
    trim(p_customer_name),
    trim(p_customer_email),
    trim(p_customer_phone),
    p_contact_channel,
    p_delivery_date,
    p_payment_method,
    'Pendente',
    order_total,
    extensions.digest(new_access_token, 'sha256')
  )
  RETURNING id INTO new_order_id;

  FOR item IN SELECT value FROM jsonb_array_elements(p_items)
  LOOP
    item_product_id := (item->>'product_id')::uuid;
    item_quantity := (item->>'quantity')::integer;

    SELECT price
    INTO item_price
    FROM public.products
    WHERE id = item_product_id
      AND is_active = true;

    INSERT INTO public.order_items (
      order_id,
      product_id,
      quantity,
      price_at_purchase
    )
    VALUES (
      new_order_id,
      item_product_id,
      item_quantity,
      item_price
    );
  END LOOP;

  RETURN QUERY SELECT new_order_id, new_access_token;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_order_status(
  p_order_id uuid,
  p_access_token text
)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT jsonb_build_object(
    'id', orders.id,
    'customer_name', orders.customer_name,
    'status', orders.status,
    'payment_method', orders.payment_method,
    'total_amount', orders.total_amount,
    'delivery_date', orders.delivery_date,
    'order_items', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', order_items.id,
          'quantity', order_items.quantity,
          'price_at_purchase', order_items.price_at_purchase,
          'product_id', order_items.product_id,
          'products', jsonb_build_object('name', products.name)
        )
        ORDER BY order_items.created_at
      )
      FROM public.order_items
      JOIN public.products ON products.id = order_items.product_id
      WHERE order_items.order_id = orders.id
    ), '[]'::jsonb)
  )
  FROM public.orders
  WHERE orders.id = p_order_id
    AND length(p_access_token) = 64
    AND orders.access_token_hash = extensions.digest(p_access_token, 'sha256');
$$;

CREATE OR REPLACE FUNCTION public.cancel_order(
  p_order_id uuid,
  p_access_token text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  updated_order_id uuid;
BEGIN
  UPDATE public.orders
  SET status = 'Cancelada'
  WHERE id = p_order_id
    AND length(p_access_token) = 64
    AND access_token_hash = extensions.digest(p_access_token, 'sha256')
    AND status = 'Pendente'
    AND timezone('America/Sao_Paulo', now())
        < delivery_date::timestamp - interval '1 day'
  RETURNING id INTO updated_order_id;

  RETURN updated_order_id IS NOT NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.place_order(text, text, text, text, date, text, jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_order_status(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cancel_order(uuid, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.place_order(text, text, text, text, date, text, jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_order_status(uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_order(uuid, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.log_order_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.order_logs (order_id, old_status, new_status, changed_by)
    VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      COALESCE(auth.jwt()->>'email', 'customer-token')
    );
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.log_order_status_change() FROM PUBLIC;

DROP TRIGGER IF EXISTS trigger_log_order_status_change ON public.orders;
CREATE TRIGGER trigger_log_order_status_change
AFTER UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.log_order_status_change();
