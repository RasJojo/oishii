
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Patients Table
CREATE TABLE IF NOT EXISTS patients (
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

-- 2. Create Dishes Table
CREATE TABLE IF NOT EXISTS dishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('ENTREE', 'PLAT', 'DESSERT')),
    allergens TEXT[] DEFAULT '{}',
    nutritional_info JSONB DEFAULT '{"calories": 0, "protein": 0, "carbs": 0, "fat": 0}',
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Daily Menu / Planning Table
-- Using a simple structure mapping a day + meal_type to a list of dish_ids could work,
-- but a relational junction table is better.

CREATE TABLE IF NOT EXISTS meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day TEXT NOT NULL, -- e.g. "Lundi", "2024-01-01"
    meal_type TEXT NOT NULL CHECK (meal_type IN ('Petit Déjeuner', 'Déjeuner', 'Dîner')),
    name TEXT, -- Optional, e.g. "Menu Hiver"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meal_dishes (
    meal_id UUID REFERENCES meals(id) ON DELETE CASCADE,
    dish_id UUID REFERENCES dishes(id) ON DELETE CASCADE,
    PRIMARY KEY (meal_id, dish_id)
);

-- 4. Create Staff / Users Table (Optional, usually handled by auth.users but good for roles)
-- We can link to auth.users if needed, or just use metadata.
-- For now, let's assume roles are stored in auth.users user_metadata.

-- 5. Row Level Security (RLS) Policies
-- Enable RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_dishes ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users (Staff & Patients)
CREATE POLICY "Allow read access to authenticated users" ON patients FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access to authenticated users" ON dishes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access to authenticated users" ON meals FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access to authenticated users" ON meal_dishes FOR SELECT USING (auth.role() = 'authenticated');

-- Allow write access to Kitchen/Medical Staff (simplified: all auth for now, refine later)
CREATE POLICY "Allow write access to authenticated users" ON patients FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access to authenticated users" ON dishes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access to authenticated users" ON meals FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow write access to authenticated users" ON meal_dishes FOR ALL USING (auth.role() = 'authenticated');

-- Insert Initial Mock Data
-- (This part would ideally be a separate seed script, but functional here for quick setup)
