-- 🚨 RESET TOTAL (Attention, supprime les données existantes des tables publiques)
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.patients CASCADE;
DROP TABLE IF EXISTS public.dishes CASCADE;

-- ==========================================
-- 1. CRÉATION DES TABLES
-- ==========================================

-- Table: PROFILS (Rôles & Identité)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT CHECK (role IN ('MEDICAL', 'KITCHEN')) DEFAULT 'MEDICAL',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- Table: PATIENTS (Dossiers Médicaux)
CREATE TABLE public.patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    room TEXT NOT NULL,
    service TEXT NOT NULL,
    allergies TEXT[] DEFAULT '{}',
    dietary_restrictions TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'ADMITTED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read patients" ON public.patients FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update patients" ON public.patients FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert patients" ON public.patients FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Table: PLATS (Menu & Allergènes)
CREATE TABLE public.dishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('ENTREE', 'PLAT', 'DESSERT')),
    description TEXT,
    allergens TEXT[] DEFAULT '{}',
    nutritional_info JSONB DEFAULT '{"calories": 0}',
    image_url TEXT,
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read dishes" ON public.dishes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage dishes" ON public.dishes FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- 2. AUTOMATISATION DES RÔLES (TRIGGER)
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Logique automatique basée sur l'email pour Joela & Rasam
  IF new.email = 'rasamimananajoela@gmail.com' THEN
    INSERT INTO public.profiles (id, full_name, role) VALUES (new.id, 'Chef Rasam', 'KITCHEN');
  ELSIF new.email = 'joela.rasam@gmail.com' THEN
    INSERT INTO public.profiles (id, full_name, role) VALUES (new.id, 'Dr. Joela', 'MEDICAL');
  ELSE
    -- Par défaut, tout le monde est MEDICAL (ou selon logique métier)
    INSERT INTO public.profiles (id, full_name, role) VALUES (new.id, 'Nouvel Utilisateur', 'MEDICAL');
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Activation du Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 3. JEU DE DONNÉES (SEED DATA)
-- ==========================================

-- Patients Réels (Tests Allergies)
INSERT INTO patients (first_name, last_name, service, room, allergies, dietary_restrictions) VALUES
('Alexandre', 'Legrand', 'Cardiologie', '101', ARRAY['Gluten', 'Crustacés'], ARRAY['Sans sel']),
('Sarah', 'Connor', 'Traumatologie', '204', ARRAY['Arachides'], ARRAY['Hyperprotéiné']),
('Jean', 'Valjean', 'Gériatrie', '305', ARRAY[]::text[], ARRAY['Mixé']),
('Marie', 'Curie', 'Oncologie', '108', ARRAY['Lactose'], ARRAY['Sans sucre']);

-- Plats de la Cuisine (Tests Filtrage)
INSERT INTO dishes (name, category, allergens, nutritional_info, description) VALUES
('Spaghetti Bolognaise', 'PLAT', ARRAY['Gluten'], '{"calories": 450}', 'Pâtes fraîches sauce tomate boeuf'),
('Wok Légumes Tofu', 'PLAT', ARRAY['Soja', 'Sésame'], '{"calories": 320}', 'Sauté de légumes croquants'),
('Filet de Colin', 'PLAT', ARRAY['Poissons'], '{"calories": 210}', 'Cuit vapeur, sauce citron'),
('Omelette Nature', 'PLAT', ARRAY['Oeufs'], '{"calories": 280}', 'Omelette baveuse aux herbes'),
('Salade de Fruits', 'DESSERT', ARRAY[]::text[], '{"calories": 90}', 'Fruits de saison frais'),
('Yaourt Nature', 'DESSERT', ARRAY['Lactose'], '{"calories": 60}', 'Lait fermier local'),
('Bisque de Homard', 'ENTREE', ARRAY['Crustacés', 'Lactose'], '{"calories": 180}', 'Velouté crémeux'),
('Poulet Rôti Haricots', 'PLAT', ARRAY[]::text[], '{"calories": 350}', 'Cuisse de poulet et haricots verts');

-- ==========================================
-- 4. RÉPARATION RÉTROACTIVE (Si les comptes existent déjà)
-- ==========================================

-- Force le profil KITCHEN pour Rasam
INSERT INTO public.profiles (id, full_name, role)
SELECT id, 'Chef Rasam', 'KITCHEN' FROM auth.users WHERE email = 'rasamimananajoela@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'KITCHEN', full_name = 'Chef Rasam';

-- Force le profil MEDICAL pour Joela
INSERT INTO public.profiles (id, full_name, role)
SELECT id, 'Dr. Joela', 'MEDICAL' FROM auth.users WHERE email = 'joela.rasam@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'MEDICAL', full_name = 'Dr. Joela';
