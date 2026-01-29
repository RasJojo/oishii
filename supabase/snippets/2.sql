INSERT INTO "public"."patients_allergens" ("patient_id", "allergen_id") 
VALUES 
  -- Patient Alexandre Legrand (Gluten, Crustacés)
  ('1a29c549-ca8b-4a2e-b7eb-a06a775be84e', 1),
  ('1a29c549-ca8b-4a2e-b7eb-a06a775be84e', 2),

  -- Patient Sarah Connor (Arachides)
  ('1ae57162-bb15-41fc-ad21-44920d27f0bf', 5),

  -- Patient Marie Curie (Lactose / Lait)
  ('59319958-ea8d-4ae8-b72d-d716d9fa953e', 7),

  -- Patient ALEX TESTER (Gluten)
  ('9934e1ba-f7fe-474e-87f4-ba2a1ce30781', 1)
ON CONFLICT DO NOTHING;