-- ==============================================================================
-- 1. TABLE ALLERGÈNES (Référentiel dynamique avec ID)
-- ==============================================================================
-- On drop si elle existe pour être sûr de la structure (Attention aux données existantes si prod !)
-- Si vous avez déjà la table, assurez-vous qu'elle a un 'id' et un 'name'.

CREATE TABLE IF NOT EXISTS public.allergens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE
);

ALTER TABLE public.allergens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read allergens" ON public.allergens FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage allergens" ON public.allergens FOR ALL USING (auth.role() = 'authenticated');

-- Insertion des allergènes de base
INSERT INTO public.allergens (name) VALUES 
('Gluten'), ('Lactose'), ('Arachides'), ('Fruits à coque'), ('Soja'), 
('Crustacés'), ('Poissons'), ('Œufs'), ('Moutarde'), ('Sésame'), 
('Céleri'), ('Sulfites'), ('Lupin'), ('Mollusques')
ON CONFLICT (name) DO NOTHING;


-- ==============================================================================
-- 2. TABLE INGRÉDIENTS (Avec liaison par ID)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    default_unit TEXT DEFAULT 'g',
    allergen_id UUID REFERENCES public.allergens(id) ON UPDATE CASCADE ON DELETE SET NULL
);

ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read ingredients" ON public.ingredients FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage ingredients" ON public.ingredients FOR ALL USING (auth.role() = 'authenticated');

-- ==============================================================================
-- 3. SEED DATA (Avec jointure intelligente pour récupérer les IDs)
-- ==============================================================================

DO $$
DECLARE
    -- Déclaration des variables pour stocker les IDs des allergènes
    v_gluten UUID; v_lactose UUID; v_arachides UUID; v_fruits_coque UUID; v_soja UUID;
    v_crustaces UUID; v_poissons UUID; v_oeufs UUID; v_moutarde UUID; v_sesame UUID;
    v_celeri UUID; v_sulfites UUID; v_lupin UUID; v_mollusques UUID;
BEGIN
    -- Récupération des IDs
    SELECT id INTO v_gluten FROM public.allergens WHERE name = 'Gluten';
    SELECT id INTO v_lactose FROM public.allergens WHERE name = 'Lactose';
    SELECT id INTO v_arachides FROM public.allergens WHERE name = 'Arachides';
    SELECT id INTO v_fruits_coque FROM public.allergens WHERE name = 'Fruits à coque';
    SELECT id INTO v_soja FROM public.allergens WHERE name = 'Soja';
    SELECT id INTO v_crustaces FROM public.allergens WHERE name = 'Crustacés';
    SELECT id INTO v_poissons FROM public.allergens WHERE name = 'Poissons';
    SELECT id INTO v_oeufs FROM public.allergens WHERE name = 'Œufs';
    SELECT id INTO v_moutarde FROM public.allergens WHERE name = 'Moutarde';
    SELECT id INTO v_sesame FROM public.allergens WHERE name = 'Sésame';
    SELECT id INTO v_celeri FROM public.allergens WHERE name = 'Céleri';
    SELECT id INTO v_sulfites FROM public.allergens WHERE name = 'Sulfites';
    SELECT id INTO v_lupin FROM public.allergens WHERE name = 'Lupin';
    SELECT id INTO v_mollusques FROM public.allergens WHERE name = 'Mollusques';

    -- Insertion des ingrédients
    INSERT INTO public.ingredients (name, allergen_id, default_unit) VALUES
    -- LACTOSE
    ('Beurre', v_lactose, 'g'),
    ('Crème fraîche', v_lactose, 'ml'),
    ('Lait entier', v_lactose, 'ml'),
    ('Yaourt nature', v_lactose, 'pièce'),
    ('Mozzarella', v_lactose, 'g'),
    ('Emmental', v_lactose, 'g'),
    
    -- GLUTEN
    ('Farine de blé', v_gluten, 'g'),
    ('Pâtes', v_gluten, 'g'),
    ('Pain', v_gluten, 'g'),
    ('Semoule', v_gluten, 'g'),
    
    -- OEUFS
    ('Oeuf entier', v_oeufs, 'pièce'),
    ('Mayonnaise', v_oeufs, 'g'),
    
    -- POISSONS
    ('Saumon', v_poissons, 'g'),
    ('Thon', v_poissons, 'g'),
    
    -- CRUSTACÉS
    ('Crevettes', v_crustaces, 'g'),
    
    -- ARACHIDES
    ('Cacahuètes', v_arachides, 'g'),
    
    -- FRUITS A COQUE
    ('Noix', v_fruits_coque, 'g'),
    ('Amandes', v_fruits_coque, 'g'),
    
    -- SAFE (NULL)
    ('Riz', NULL, 'g'),
    ('Pommes de terre', NULL, 'g'),
    ('Tomates', NULL, 'g'),
    ('Poulet', NULL, 'g'),
    ('Boeuf', NULL, 'g'),
    ('Carottes', NULL, 'g'),
    ('Pomme', NULL, 'pièce')
    
    ON CONFLICT (name) DO UPDATE SET allergen_id = EXCLUDED.allergen_id;
END $$;
