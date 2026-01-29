INSERT INTO "public"."dishes_allergens" ("dish_id", "allergen_id") 
VALUES 
  -- Spaghetti Bolognaise (Gluten)
  ('e847745e-53e6-41af-83a6-546523307d52', 1),

  -- Wok Légumes Tofu (Soja, Graines de sésame)
  ('a2a6e738-97ef-4740-a807-8195fe19f4fa', 6),
  ('a2a6e738-97ef-4740-a807-8195fe19f4fa', 11),

  -- Filet de Colin (Poissons)
  ('b5f98f93-e3e2-4d2f-acd7-3dac5980cd01', 4),

  -- Omelette Nature (Œufs)
  ('4c459caa-336d-4bc0-86af-25b14ce2bfc8', 3),

  -- Yaourt Nature (Lait / Lactose)
  ('b262eff4-4aaf-461c-9cea-742fd390cc9d', 7),

  -- Bisque de Homard (Crustacés, Lait / Lactose)
  ('cca33abf-6aff-424b-8428-2ca7d7eb7883', 2),
  ('cca33abf-6aff-424b-8428-2ca7d7eb7883', 7),

  -- TEST-GLUTEN-PASTA (Gluten)
  ('753fbe7c-4392-4051-8004-d76090b14135', 1)
ON CONFLICT DO NOTHING;