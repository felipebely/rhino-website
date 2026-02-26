-- supabase/schema.sql

-- 1. Create the Products Table
CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric(10, 2) NOT NULL,
  type text NOT NULL CHECK (type IN ('baked_good', 'frozen', 'retail_future')),
  is_active boolean DEFAULT true,
  image_url text, -- optional for now
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the Orders Table
CREATE TABLE orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  delivery_date date NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('PIX', 'Pagamento na Entrega')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'baked', 'delivered', 'cancelled')),
  total_amount numeric(10, 2) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create the Order Items Junction Table
CREATE TABLE order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE RESTRICT NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price_at_purchase numeric(10, 2) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert some dummy data for initial testing
INSERT INTO products (name, description, price, type, is_active) VALUES
('Focaccia Tradicional', 'Azeite extra virgem, sal marinho e alecrim', 35.00, 'baked_good', true),
('Focaccia Tomate Seco', 'Tomate seco, manjericão e azeite', 42.00, 'baked_good', true),
('Pizza Margherita (Congelada)', 'Molho de tomate pelati, mozzarella, manjericão', 48.00, 'frozen', true),
('Pizza Calabresa (Congelada)', 'Calabresa artesanal, cebola roxa, oregano', 50.00, 'frozen', true);

-- Enable RLS (Row Level Security) - Basic setup for anon access just for insertion/reading
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access to active products
CREATE POLICY "Allow public read access to active products" ON products
  FOR SELECT USING (is_active = true);

-- Allow anonymous insert to orders
CREATE POLICY "Allow public insert to orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Allow anonymous read to orders (ideally you'd restrict this normally, but fine for simple MVP)
CREATE POLICY "Allow public read to orders" ON orders
  FOR SELECT USING (true);

-- Allow anonymous insert to order_items
CREATE POLICY "Allow public insert to order_items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Allow anonymous read to order_items
CREATE POLICY "Allow public read to order_items" ON order_items
  FOR SELECT USING (true);
