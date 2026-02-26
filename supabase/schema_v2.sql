-- supabase/schema_v2.sql

-- 1. Modify the Orders Table Status Constraint
-- We need to drop the old constraint first.
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- The user requested to reset all previous orders for cleanliness
TRUNCATE TABLE orders CASCADE;

-- Now that old data is cleared, add the new constraint
ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN ('Pendente', 'Entregue', 'Cancelada', 'Não Recolhido(a)'));

-- Make the default block fall back to the new 'Pendente' string
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'Pendente';

-- 2. Add new columns to Orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS contact_channel text DEFAULT 'WhatsApp' CHECK (contact_channel IN ('WhatsApp', 'E-mail'));

-- 3. Add UPDATE policy so users can cancel their orders!
-- (Without this, the frontend cancel button fails silently due to RLS)
DROP POLICY IF EXISTS "Allow public update to orders" ON orders;
CREATE POLICY "Allow public update to orders" ON orders
  FOR UPDATE USING (true);

-- 4. Create Order Logs Table for Audit Tracking
CREATE TABLE IF NOT EXISTS order_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    old_status text,
    new_status text NOT NULL,
    changed_by text DEFAULT 'system' NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for order_logs
ALTER TABLE order_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read of order_logs
DROP POLICY IF EXISTS "Allow public read to order_logs" ON order_logs;
CREATE POLICY "Allow public read to order_logs" ON order_logs
    FOR SELECT USING (true);
-- Allow public insert to order_logs
DROP POLICY IF EXISTS "Allow public insert to order_logs" ON order_logs;
CREATE POLICY "Allow public insert to order_logs" ON order_logs
    FOR INSERT WITH CHECK (true);

-- 5. Create Database Trigger for Automatic Logging
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Only log if the status actually changed
    IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO order_logs (order_id, old_status, new_status, changed_by)
        VALUES (NEW.id, OLD.status, NEW.status, coalesce(current_setting('request.jwt.claims', true)::json->>'email', 'admin_ou_trigger'));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists to allow re-running
DROP TRIGGER IF EXISTS trigger_log_order_status_change ON orders;

-- Attach trigger
CREATE TRIGGER trigger_log_order_status_change
AFTER UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION log_order_status_change();

-- 6. Auto-flagging "Não Recolhido" using pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Unschedule it first in case it already exists to avoid duplicates
SELECT cron.unschedule('mark_uncollected_orders');

SELECT cron.schedule('mark_uncollected_orders', '1 0 * * 4', $$
    UPDATE orders 
    SET status = 'Não Recolhido(a)' 
    WHERE status = 'Pendente' AND delivery_date < CURRENT_DATE;
$$);

