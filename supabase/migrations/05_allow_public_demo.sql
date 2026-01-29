-- Allow public (anon) access for DEMO purposes
-- Because the Patient Dashboard simulates a logged-in patient via URL/LocalStorage for now.

-- 1. Allow public read on Dishes (Menu)
CREATE POLICY "Public can read dishes" ON public.dishes FOR SELECT USING (true);

-- 2. Allow public read on Patients (To simulate finding one's folder)
-- In production, this would be strictly secured via RPC or Auth matching.
CREATE POLICY "Public can read patients" ON public.patients FOR SELECT USING (true);

-- 3. Allow public read on Profiles (for Staff Login check fallback if needed, though login uses service role usually)
-- Actually login uses Auth so it's fine.
