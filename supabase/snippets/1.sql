INSERT INTO "public"."allergens" ("name") 
VALUES 
  ('Gluten'),
  ('Crustacés'),
  ('Œufs'),
  ('Poissons'),
  ('Arachides'),
  ('Soja'),
  ('Lait (Lactose)'),
  ('Fruits à coques'),
  ('Céleri'),
  ('Moutarde'),
  ('Graines de sésame'),
  ('Sulfites'),
  ('Lupin'),
  ('Mollusques')
ON CONFLICT (name) DO NOTHING;