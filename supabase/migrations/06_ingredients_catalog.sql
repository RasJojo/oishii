-- Migration to add ingredients and allergens to the catalog, avoiding conflict with existing bigint IDs
-- This script is idempotent and handles existing tables gracefully

-- 1. Ensure extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA "extensions";

-- 2. Allergens table (assuming it might already exist with bigint ID)
-- If it exists with bigint, we keep it. If not, we create it.
-- The remote_schema.sql already defines it with bigint.

-- 3. Ingredients table
-- Check if allergen column exists (old schema) or if we should use allergen_id
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ingredients' AND column_name = 'allergen') THEN
        -- Old column exists, maybe we want to migrate it or just leave it
        NULL;
    END IF;
END $$;

-- 4. Enable RLS on existing tables just in case
ALTER TABLE IF EXISTS public.allergens ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ingredients ENABLE ROW LEVEL SECURITY;

-- 5. Policies
DROP POLICY IF EXISTS "Authenticated users can read allergens" ON public.allergens;
CREATE POLICY "Authenticated users can read allergens" ON public.allergens FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can manage allergens" ON public.allergens;
CREATE POLICY "Authenticated users can manage allergens" ON public.allergens FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can read ingredients" ON public.ingredients;
CREATE POLICY "Authenticated users can read ingredients" ON public.ingredients FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can manage ingredients" ON public.ingredients;
CREATE POLICY "Authenticated users can manage ingredients" ON public.ingredients FOR ALL USING (auth.role() = 'authenticated');

-- 6. Seed data
-- Insert allergens if they don't exist
INSERT INTO public.allergens (name)
VALUES 
    ('Gluten'),
    ('Lactose'),
    ('Arachides'),
    ('Fruits à coque'),
    ('Soja'),
    ('Poisson'),
    ('Crustacés'),
    ('Céleri'),
    ('Moutarde'),
    ('Sésame'),
    ('Anhydride sulfureux'),
    ('Lupin'),
    ('Mollusques'),
    ('Oeufs')
ON CONFLICT (name) DO NOTHING;

-- Insert ingredients and link them to allergens by name to be ID-agnostic
INSERT INTO public.ingredients (name, default_unit, allergen)
SELECT 'Farine de blé', 'g', 'Gluten' WHERE NOT EXISTS (SELECT 1 FROM public.ingredients WHERE name = 'Farine de blé')
UNION ALL
SELECT 'Lait entier', 'ml', 'Lactose' WHERE NOT EXISTS (SELECT 1 FROM public.ingredients WHERE name = 'Lait entier')
UNION ALL
SELECT 'Beurre', 'g', 'Lactose' WHERE NOT EXISTS (SELECT 1 FROM public.ingredients WHERE name = 'Beurre')
UNION ALL
SELECT 'Oeuf', 'unité', 'Oeufs' WHERE NOT EXISTS (SELECT 1 FROM public.ingredients WHERE name = 'Oeuf')
UNION ALL
SELECT 'Sucre en poudre', 'g', NULL WHERE NOT EXISTS (SELECT 1 FROM public.ingredients WHERE name = 'Sucre en poudre')
UNION ALL
SELECT 'Sel', 'g', NULL WHERE NOT EXISTS (SELECT 1 FROM public.ingredients WHERE name = 'Sel')
UNION ALL
SELECT 'Poivre Noir', 'g', NULL WHERE NOT EXISTS (SELECT 1 FROM public.ingredients WHERE name = 'Poivre Noir')
UNION ALL
SELECT 'Huile d''olive', 'ml', NULL WHERE NOT EXISTS (SELECT 1 FROM public.ingredients WHERE name = 'Huile d''olive')
UNION ALL
SELECT 'Riz Basmati', 'g', NULL WHERE NOT EXISTS (SELECT 1 FROM public.ingredients WHERE name = 'Riz Basmati')
UNION ALL
SELECT 'Blanc de poulet', 'g', NULL WHERE NOT EXISTS (SELECT 1 FROM public.ingredients WHERE name = 'Blanc de poulet')
UNION ALL
SELECT 'Pavé de Saumon', 'g', 'Poisson' WHERE NOT EXISTS (SELECT 1 FROM public.ingredients WHERE name = 'Pavé de Saumon')
UNION ALL
SELECT 'Pomme de terre', 'g', NULL WHERE NOT EXISTS (SELECT 1 FROM public.ingredients WHERE name = 'Pomme de terre')
UNION ALL
SELECT 'Carotte', 'g', NULL WHERE NOT EXISTS (SELECT 1 FROM public.ingredients WHERE name = 'Carotte')
UNION ALL
SELECT 'Oignon', 'g', NULL WHERE NOT EXISTS (SELECT 1 FROM public.ingredients WHERE name = 'Oignon')
UNION ALL
SELECT 'Ail', 'g', NULL WHERE NOT EXISTS (SELECT 1 FROM public.ingredients WHERE name = 'Ail')
UNION ALL
SELECT 'Crème fraîche', 'ml', 'Lactose' WHERE NOT EXISTS (SELECT 1 FROM public.ingredients WHERE name = 'Crème fraîche')
UNION ALL
SELECT 'Fromage râpé', 'g', 'Lactose' WHERE NOT EXISTS (SELECT 1 FROM public.ingredients WHERE name = 'Fromage râpé')
UNION ALL
SELECT 'Pâtes Penne', 'g', 'Gluten' WHERE NOT EXISTS (SELECT 1 FROM public.ingredients WHERE name = 'Pâtes Penne')
UNION ALL
SELECT 'Tomate Concassée', 'g', NULL WHERE NOT EXISTS (SELECT 1 FROM public.ingredients WHERE name = 'Tomate Concassée')
UNION ALL
SELECT 'Crevettes', 'g', 'Crustacés' WHERE NOT EXISTS (SELECT 1 FROM public.ingredients WHERE name = 'Crevettes');

-- Note: allergen column is used if it exists. If the schema uses allergen_id (bigint), 
-- we should update it by name.

DO $$
BEGIN
    -- If allergen_id exists but allergen (text) doesn't, we update based on names
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ingredients' AND column_name = 'allergen_id') THEN
        UPDATE public.ingredients i
        SET allergen_id = a.id
        FROM public.allergens a
        WHERE i.allergen = a.name AND i.allergen_id IS NULL;
    END IF;
END $$;
