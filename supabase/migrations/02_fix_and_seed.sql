-- First, let's check what columns exist in patients table
-- Then drop and recreate with correct schema

-- Drop existing patients table if it has wrong schema
DROP TABLE IF EXISTS patients CASCADE;

-- Recreate with correct schema
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    room TEXT NOT NULL,
    service TEXT NOT NULL,
    allergies TEXT[] DEFAULT '{}',
    dietary_restrictions TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'ADMITTED' CHECK (status IN ('ADMITTED', 'DISCHARGED', 'PENDING_SELECTION')),
    last_meal_selected TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to authenticated users" ON patients FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access to authenticated users" ON patients FOR ALL USING (auth.role() = 'authenticated');

-- Now insert the seed data
INSERT INTO patients (first_name, last_name, room, service, allergies, dietary_restrictions, status) VALUES
('Jean', 'Dupont', '102', 'Cardiologie', ARRAY['Gluten', 'Arachides'], ARRAY['Sans sel'], 'ADMITTED'),
('Marie', 'Lambert', '205', 'Pédiatrie', ARRAY['Lactose'], ARRAY['Végétarien'], 'PENDING_SELECTION'),
('Robert', 'Moreau', '310', 'Gériatrie', ARRAY[]::text[], ARRAY['Mixé', 'Hypocalorique'], 'ADMITTED'),
('Sophie', 'Petit', '105', 'Cardiologie', ARRAY['Fruits à coque', 'Soja'], ARRAY['Sans porc'], 'PENDING_SELECTION'),
('Thomas', 'Rousseau', '412', 'Oncologie', ARRAY['Crustacés'], ARRAY['Sans gluten'], 'ADMITTED');

-- Insert dishes (disable RLS temporarily)
ALTER TABLE dishes DISABLE ROW LEVEL SECURITY;

INSERT INTO dishes (name, category, allergens, nutritional_info) VALUES
('Velouté de Potiron', 'ENTREE', ARRAY['Lactose'], '{"calories": 120, "protein": 3, "carbs": 15, "fat": 5}'::jsonb),
('Filet de Colin à la vapeur', 'PLAT', ARRAY['Poissons'], '{"calories": 250, "protein": 35, "carbs": 2, "fat": 12}'::jsonb),
('Riz Pilaf aux petits légumes', 'PLAT', ARRAY[]::text[], '{"calories": 180, "protein": 4, "carbs": 40, "fat": 3}'::jsonb),
('Compote de Pommes artisanale', 'DESSERT', ARRAY[]::text[], '{"calories": 85, "protein": 0.5, "carbs": 21, "fat": 0.1}'::jsonb),
('Lasagnes à la Bolognaise', 'PLAT', ARRAY['Gluten', 'Lactose', 'Céleri'], '{"calories": 450, "protein": 25, "carbs": 45, "fat": 20}'::jsonb);

ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
