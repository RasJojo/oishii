SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict w7YuYJllH7Xw2YlTf5bhTJ8HsvdqerpNWiByv1Fg8dddrOjaPgr2bDBa5Z0CZ2m

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '6c16b33d-135d-4200-8066-e2616aeabd91', 'authenticated', 'authenticated', 'chefprototest@gmail.com', '$2a$10$65EyZCgPga6Fw2EDykMBhOHCtXs8KtXW6ZALAbptfHbB/tvoMkLZy', '2026-01-29 13:54:46.076463+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-01-29 13:57:11.514977+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-01-29 13:54:46.046314+00', '2026-01-29 13:57:11.523743+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '96027b2e-786c-4225-8a77-f4813a7cc92c', 'authenticated', 'authenticated', 'joela.rasam@gmail.com', '$2a$06$2SGgfOVPD5ii7WU4Ays7ruRcRqYjdDFRDMZ2KB5vXCms8VVpJjd32', '2026-01-29 13:31:08.096612+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-01-29 14:50:35.419683+00', '{"provider": "email", "providers": ["email"]}', '{"role": "MEDICAL", "full_name": "Dr. Joela"}', NULL, '2026-01-29 13:31:08.096612+00', '2026-01-29 14:50:35.437736+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'ad461546-005a-4c3d-b8ca-dd6ab3286bfc', 'authenticated', 'authenticated', 'rasamimananajoela@gmail.com', '$2a$06$L27/EzMPonUJ5kKJMPgUveJLY2gbI2f7qAYA1pQyYfGXAZmUPAjAG', '2026-01-29 13:31:08.096612+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-01-29 14:52:07.755943+00', '{"provider": "email", "providers": ["email"]}', '{"role": "KITCHEN", "full_name": "Chef Rasam"}', NULL, '2026-01-29 13:31:08.096612+00', '2026-01-29 14:52:07.759153+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('6c16b33d-135d-4200-8066-e2616aeabd91', '6c16b33d-135d-4200-8066-e2616aeabd91', '{"sub": "6c16b33d-135d-4200-8066-e2616aeabd91", "email": "chefprototest@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-01-29 13:54:46.068315+00', '2026-01-29 13:54:46.068383+00', '2026-01-29 13:54:46.068383+00', '2398b3bc-d334-4847-921d-52f872eaba31');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('c7f7c82b-1166-467c-8043-7d602738318e', 'ad461546-005a-4c3d-b8ca-dd6ab3286bfc', '2026-01-29 13:33:05.022699+00', '2026-01-29 13:33:05.022699+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '89.30.29.99', NULL, NULL, NULL, NULL, NULL),
	('fc062a16-6063-477f-ae29-e8e68c2f5459', 'ad461546-005a-4c3d-b8ca-dd6ab3286bfc', '2026-01-29 13:35:07.832997+00', '2026-01-29 13:35:07.832997+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '89.30.29.99', NULL, NULL, NULL, NULL, NULL),
	('808baaeb-2fc7-49d5-bc82-afcad88cc942', '6c16b33d-135d-4200-8066-e2616aeabd91', '2026-01-29 13:55:04.397556+00', '2026-01-29 13:55:04.397556+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '89.30.29.99', NULL, NULL, NULL, NULL, NULL),
	('0031d2bc-1a54-4f08-b00c-65403d5706f8', '6c16b33d-135d-4200-8066-e2616aeabd91', '2026-01-29 13:57:11.515093+00', '2026-01-29 13:57:11.515093+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', '89.30.29.99', NULL, NULL, NULL, NULL, NULL),
	('94407c2c-aa3a-4766-aa6d-efb5b3fe96fe', '96027b2e-786c-4225-8a77-f4813a7cc92c', '2026-01-29 13:36:49.652278+00', '2026-01-29 14:34:49.892639+00', NULL, 'aal1', NULL, '2026-01-29 14:34:49.892527', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '89.30.29.99', NULL, NULL, NULL, NULL, NULL),
	('a8b1b780-118a-437d-9d6b-de07ebb4fa58', 'ad461546-005a-4c3d-b8ca-dd6ab3286bfc', '2026-01-29 14:46:47.324817+00', '2026-01-29 14:46:47.324817+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '89.30.29.99', NULL, NULL, NULL, NULL, NULL),
	('30fe1f91-ffd1-417b-9d98-f0937ba80338', '96027b2e-786c-4225-8a77-f4813a7cc92c', '2026-01-29 14:50:35.42047+00', '2026-01-29 14:50:35.42047+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '89.30.29.99', NULL, NULL, NULL, NULL, NULL),
	('55d8566a-b1c9-4a44-b7bc-698932d378ad', 'ad461546-005a-4c3d-b8ca-dd6ab3286bfc', '2026-01-29 14:52:07.756041+00', '2026-01-29 14:52:07.756041+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', '89.30.29.99', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('c7f7c82b-1166-467c-8043-7d602738318e', '2026-01-29 13:33:05.061554+00', '2026-01-29 13:33:05.061554+00', 'password', '89ad0160-1ca6-4bb4-8dc2-e64033907d71'),
	('fc062a16-6063-477f-ae29-e8e68c2f5459', '2026-01-29 13:35:07.837381+00', '2026-01-29 13:35:07.837381+00', 'password', 'b06b7945-6dfc-41fa-9b7d-fb43a1201065'),
	('94407c2c-aa3a-4766-aa6d-efb5b3fe96fe', '2026-01-29 13:36:49.655868+00', '2026-01-29 13:36:49.655868+00', 'password', '913705d3-e7a7-49e2-8129-54c0e01f5839'),
	('808baaeb-2fc7-49d5-bc82-afcad88cc942', '2026-01-29 13:55:04.473074+00', '2026-01-29 13:55:04.473074+00', 'password', 'ca2d6f2f-1bc8-41a7-8238-ca90b27f073d'),
	('0031d2bc-1a54-4f08-b00c-65403d5706f8', '2026-01-29 13:57:11.527546+00', '2026-01-29 13:57:11.527546+00', 'password', '12a128b8-62b4-4474-b459-d4da246b3b7a'),
	('a8b1b780-118a-437d-9d6b-de07ebb4fa58', '2026-01-29 14:46:47.368092+00', '2026-01-29 14:46:47.368092+00', 'password', '477374dc-e741-4cbd-8680-b31017d88228'),
	('30fe1f91-ffd1-417b-9d98-f0937ba80338', '2026-01-29 14:50:35.440015+00', '2026-01-29 14:50:35.440015+00', 'password', 'd2126371-3ec0-4265-a62f-9d8487f72bcb'),
	('55d8566a-b1c9-4a44-b7bc-698932d378ad', '2026-01-29 14:52:07.759802+00', '2026-01-29 14:52:07.759802+00', 'password', '43233789-7fda-4f43-9c6e-fc0fbbf21202');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 6, 'eqvsjml2lrpb', 'ad461546-005a-4c3d-b8ca-dd6ab3286bfc', false, '2026-01-29 13:33:05.044303+00', '2026-01-29 13:33:05.044303+00', NULL, 'c7f7c82b-1166-467c-8043-7d602738318e'),
	('00000000-0000-0000-0000-000000000000', 7, 'mc2rohupekvi', 'ad461546-005a-4c3d-b8ca-dd6ab3286bfc', false, '2026-01-29 13:35:07.83542+00', '2026-01-29 13:35:07.83542+00', NULL, 'fc062a16-6063-477f-ae29-e8e68c2f5459'),
	('00000000-0000-0000-0000-000000000000', 9, 'xpalonvg57ht', '6c16b33d-135d-4200-8066-e2616aeabd91', false, '2026-01-29 13:55:04.440281+00', '2026-01-29 13:55:04.440281+00', NULL, '808baaeb-2fc7-49d5-bc82-afcad88cc942'),
	('00000000-0000-0000-0000-000000000000', 10, '6gglo3wd3cuz', '6c16b33d-135d-4200-8066-e2616aeabd91', false, '2026-01-29 13:57:11.520262+00', '2026-01-29 13:57:11.520262+00', NULL, '0031d2bc-1a54-4f08-b00c-65403d5706f8'),
	('00000000-0000-0000-0000-000000000000', 8, 'vaxd2dym74v2', '96027b2e-786c-4225-8a77-f4813a7cc92c', true, '2026-01-29 13:36:49.653784+00', '2026-01-29 14:34:49.86585+00', NULL, '94407c2c-aa3a-4766-aa6d-efb5b3fe96fe'),
	('00000000-0000-0000-0000-000000000000', 11, '5mitnzjyjfgp', '96027b2e-786c-4225-8a77-f4813a7cc92c', false, '2026-01-29 14:34:49.875495+00', '2026-01-29 14:34:49.875495+00', 'vaxd2dym74v2', '94407c2c-aa3a-4766-aa6d-efb5b3fe96fe'),
	('00000000-0000-0000-0000-000000000000', 12, 'ewqnkpgczsw2', 'ad461546-005a-4c3d-b8ca-dd6ab3286bfc', false, '2026-01-29 14:46:47.351764+00', '2026-01-29 14:46:47.351764+00', NULL, 'a8b1b780-118a-437d-9d6b-de07ebb4fa58'),
	('00000000-0000-0000-0000-000000000000', 13, 'iofip2a2qjy3', '96027b2e-786c-4225-8a77-f4813a7cc92c', false, '2026-01-29 14:50:35.430956+00', '2026-01-29 14:50:35.430956+00', NULL, '30fe1f91-ffd1-417b-9d98-f0937ba80338'),
	('00000000-0000-0000-0000-000000000000', 14, 'j2r44b4mqgmj', 'ad461546-005a-4c3d-b8ca-dd6ab3286bfc', false, '2026-01-29 14:52:07.757688+00', '2026-01-29 14:52:07.757688+00', NULL, '55d8566a-b1c9-4a44-b7bc-698932d378ad');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: allergens; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."allergens" ("id", "created_at", "name") VALUES
	(21, '2026-01-29 14:35:08.918496+00', 'Lait (Lactose)'),
	(22, '2026-01-29 14:35:08.918496+00', 'Fruits à coques'),
	(25, '2026-01-29 14:35:08.918496+00', 'Graines de sésame'),
	(1, '2026-01-29 14:09:03.582703+00', 'Gluten'),
	(2, '2026-01-29 14:09:03.582703+00', 'Lactose'),
	(3, '2026-01-29 14:09:03.582703+00', 'Arachides'),
	(4, '2026-01-29 14:09:03.582703+00', 'Fruits à coque'),
	(5, '2026-01-29 14:09:03.582703+00', 'Soja'),
	(6, '2026-01-29 14:09:03.582703+00', 'Crustacés'),
	(7, '2026-01-29 14:09:03.582703+00', 'Poissons'),
	(8, '2026-01-29 14:09:03.582703+00', 'Œufs'),
	(9, '2026-01-29 14:09:03.582703+00', 'Moutarde'),
	(10, '2026-01-29 14:09:03.582703+00', 'Sésame'),
	(11, '2026-01-29 14:09:03.582703+00', 'Céleri'),
	(12, '2026-01-29 14:09:03.582703+00', 'Sulfites'),
	(13, '2026-01-29 14:09:03.582703+00', 'Lupin'),
	(14, '2026-01-29 14:09:03.582703+00', 'Mollusques');


--
-- Data for Name: dishes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."dishes" ("id", "name", "category", "description", "allergens", "nutritional_info", "image_url", "available", "created_at", "recipe") VALUES
	('e847745e-53e6-41af-83a6-546523307d52', 'Spaghetti Bolognaise', 'PLAT', 'Pâtes fraîches sauce tomate boeuf', '{Gluten}', '{"calories": 450}', NULL, true, '2026-01-29 13:15:58.022069+00', '[]'),
	('a2a6e738-97ef-4740-a807-8195fe19f4fa', 'Wok Légumes Tofu', 'PLAT', 'Sauté de légumes croquants', '{Soja,Sésame}', '{"calories": 320}', NULL, true, '2026-01-29 13:15:58.022069+00', '[]'),
	('b5f98f93-e3e2-4d2f-acd7-3dac5980cd01', 'Filet de Colin', 'PLAT', 'Cuit vapeur, sauce citron', '{Poissons}', '{"calories": 210}', NULL, true, '2026-01-29 13:15:58.022069+00', '[]'),
	('4c459caa-336d-4bc0-86af-25b14ce2bfc8', 'Omelette Nature', 'PLAT', 'Omelette baveuse aux herbes', '{Oeufs}', '{"calories": 280}', NULL, true, '2026-01-29 13:15:58.022069+00', '[]'),
	('ffb51f9f-db2d-4f48-9dbe-027ae4e1238c', 'Salade de Fruits', 'DESSERT', 'Fruits de saison frais', '{}', '{"calories": 90}', NULL, true, '2026-01-29 13:15:58.022069+00', '[]'),
	('b262eff4-4aaf-461c-9cea-742fd390cc9d', 'Yaourt Nature', 'DESSERT', 'Lait fermier local', '{Lactose}', '{"calories": 60}', NULL, true, '2026-01-29 13:15:58.022069+00', '[]'),
	('cca33abf-6aff-424b-8428-2ca7d7eb7883', 'Bisque de Homard', 'ENTREE', 'Velouté crémeux', '{Crustacés,Lactose}', '{"calories": 180}', NULL, true, '2026-01-29 13:15:58.022069+00', '[]'),
	('edcb11dc-d2bb-474a-a227-6203852f1c9a', 'Poulet Rôti Haricots', 'PLAT', 'Cuisse de poulet et haricots verts', '{}', '{"calories": 350}', NULL, true, '2026-01-29 13:15:58.022069+00', '[]'),
	('753fbe7c-4392-4051-8004-d76090b14135', 'TEST-GLUTEN-PASTA', 'PLAT', NULL, '{Gluten}', '{"fat": 0, "carbs": 0, "protein": 0, "calories": 0}', NULL, true, '2026-01-29 13:34:31.282373+00', '[]'),
	('4f128c49-ec44-404b-a671-53ccd6154714', '', 'PLAT', NULL, '{}', '{"fat": 0, "carbs": 0, "protein": 0, "calories": 0}', NULL, true, '2026-01-29 14:52:33.862341+00', '[]');


--
-- Data for Name: dishes_allergens; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."dishes_allergens" ("id", "created_at", "dish_id", "allergen_id") VALUES
	(1, '2026-01-29 14:52:03.939019+00', 'e847745e-53e6-41af-83a6-546523307d52', 1),
	(2, '2026-01-29 14:52:03.939019+00', 'a2a6e738-97ef-4740-a807-8195fe19f4fa', 6),
	(3, '2026-01-29 14:52:03.939019+00', 'a2a6e738-97ef-4740-a807-8195fe19f4fa', 11),
	(4, '2026-01-29 14:52:03.939019+00', 'b5f98f93-e3e2-4d2f-acd7-3dac5980cd01', 4),
	(5, '2026-01-29 14:52:03.939019+00', '4c459caa-336d-4bc0-86af-25b14ce2bfc8', 3),
	(6, '2026-01-29 14:52:03.939019+00', 'b262eff4-4aaf-461c-9cea-742fd390cc9d', 7),
	(7, '2026-01-29 14:52:03.939019+00', 'cca33abf-6aff-424b-8428-2ca7d7eb7883', 2),
	(8, '2026-01-29 14:52:03.939019+00', 'cca33abf-6aff-424b-8428-2ca7d7eb7883', 7),
	(9, '2026-01-29 14:52:03.939019+00', '753fbe7c-4392-4051-8004-d76090b14135', 1);


--
-- Data for Name: ingredients; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."ingredients" ("id", "name", "default_unit", "allergen") VALUES
	('31734451-df2a-4828-8b90-d8e2adcb1e74', 'Beurre', 'g', 'Lactose'),
	('e1bf145d-07e9-49e3-9175-7942e251469d', 'Beurre demi-sel', 'g', 'Lactose'),
	('113e20e2-cf42-4aa7-93f5-30bdf4684c06', 'Crème fraîche', 'ml', 'Lactose'),
	('2264b31f-2153-491a-b2f0-31ba568aef1a', 'Crème liquide', 'ml', 'Lactose'),
	('657c0ab2-9f3f-4765-8037-0f94e2522e06', 'Lait entier', 'ml', 'Lactose'),
	('8c0e3a1b-d419-40e1-9805-73e21652ae1e', 'Lait demi-écrémé', 'ml', 'Lactose'),
	('c5ff8433-fb55-4c97-9c25-bec5ec12d998', 'Lait écrémé', 'ml', 'Lactose'),
	('139a4beb-5f87-4081-80ab-a06d23b8d104', 'Yaourt nature', 'pièce', 'Lactose'),
	('da9ee203-9edf-4333-b2ef-f5fe35441cee', 'Fromage blanc', 'g', 'Lactose'),
	('c71ade21-0c18-480a-80ea-71b2eeb1e124', 'Mozzarella', 'g', 'Lactose'),
	('3bf36ee6-e144-4bb9-a5e5-763609f0d463', 'Emmental', 'g', 'Lactose'),
	('c2ea7d7f-b7e5-438d-9dba-4d4fc458df49', 'Parmesan', 'g', 'Lactose'),
	('8586cb89-a0fb-4f7e-b69d-115b49b4661a', 'Comté', 'g', 'Lactose'),
	('2f423839-4a04-497f-bafb-af3227a72671', 'Chèvre frais', 'g', 'Lactose'),
	('fb0322af-8dda-480d-a101-84d7bc6420f0', 'Roquefort', 'g', 'Lactose'),
	('0d00c402-2956-465b-ac94-1e97defda805', 'Béchamel', 'ml', 'Lactose'),
	('68e30054-cb0a-4331-9876-724b569edcaa', 'Farine de blé', 'g', 'Gluten'),
	('c43c56e8-f6f3-455d-bf38-7fc3ba91d2e9', 'Pain', 'g', 'Gluten'),
	('ab28a4e1-654d-4ea0-906b-e90b45c91784', 'Pain de mie', 'tranche', 'Gluten'),
	('99fcbda2-828a-48e0-8e69-48124cbd8663', 'Pâtes (type standard)', 'g', 'Gluten'),
	('e06e64c9-8b6a-4c6d-94cc-d591a1913773', 'Spaghetti', 'g', 'Gluten'),
	('b6ab708e-3eea-433d-a601-ccebf0718bbf', 'Coquillettes', 'g', 'Gluten'),
	('cf8e7fe8-350a-4189-bec1-563951c38ce6', 'Pâtes à lasagnes', 'g', 'Gluten'),
	('96151b84-8efa-4fa9-beb7-8118516ff5f2', 'Semoule de blé', 'g', 'Gluten'),
	('8d9c6271-0629-4baa-9024-15074ffe20f9', 'Boulgour', 'g', 'Gluten'),
	('915c79bd-f0fe-4114-9812-2a6b388cd130', 'Pâte feuilletée', 'g', 'Gluten'),
	('ce2ed4e2-23fd-4ea3-bac8-63a46dd06b14', 'Pâte brisée', 'g', 'Gluten'),
	('5ab879d4-8399-47a7-bc5a-942a62fa0d97', 'Chapelure', 'g', 'Gluten'),
	('1bde2652-d967-4582-8883-0e33e133f7e2', 'Croûtons', 'g', 'Gluten'),
	('c5589121-1a21-45ed-8a60-620c88abb85d', 'Biscuits', 'pièce', 'Gluten'),
	('ce1d1e2b-3e86-47c4-b006-884b5269320b', 'Riz blanc', 'g', NULL),
	('a5aaaadc-31af-44a0-a10c-6494b10078d9', 'Riz basmati', 'g', NULL),
	('33bc3574-b741-4a78-89df-abe71b1360a5', 'Riz complet', 'g', NULL),
	('143528c4-e954-40a7-be75-411e9d6a26d9', 'Pommes de terre', 'g', NULL),
	('6f331f91-fd13-4b5b-b172-7ffb547835c1', 'Patate douce', 'g', NULL),
	('18fcfda0-04e8-444a-8cf5-4c52b7a369a9', 'Quinoa', 'g', NULL),
	('03e2d1d4-3f03-498d-96ee-6de1ea611524', 'Sarrasin', 'g', NULL),
	('5122314c-00ff-4ffc-a79e-24c1fd1c9dc2', 'Maïs', 'g', NULL),
	('512595c4-5e91-4e65-9ec6-68c939743814', 'Polenta', 'g', NULL),
	('a28b336d-70f2-4882-828d-f383eb608cee', 'Lentilles', 'g', NULL),
	('eccf62be-bb8b-4810-b168-34d38d6394e2', 'Pois chiches', 'g', NULL),
	('297e96bf-ef53-460b-8e2a-b94d2e0eb245', 'Haricots rouges', 'g', NULL),
	('148ab7b4-a5d4-4951-8326-1b7d30fd2df2', 'Oeuf entier', 'pièce', 'Œufs'),
	('6b3422c7-4f54-4a28-a5de-f954f7824325', 'Jaune d''oeuf', 'pièce', 'Œufs'),
	('2c17bf0a-e313-4d05-94c7-fc93a364c7f1', 'Blanc d''oeuf', 'pièce', 'Œufs'),
	('2788c0a3-a481-4501-9e64-156f81be06e2', 'Mayonnaise', 'g', 'Œufs'),
	('b144fa08-6360-4425-bcd6-371aeff75998', 'Saumon', 'g', 'Poissons'),
	('b89236d3-8399-42cc-92d8-ee6ac600d71a', 'Cabillaud', 'g', 'Poissons'),
	('00fc8f38-1e6f-41fe-81f0-5197041e36aa', 'Colin', 'g', 'Poissons'),
	('f09b1bf4-604b-4555-94ea-e8a80122ba4e', 'Thon (conserve)', 'g', 'Poissons'),
	('86bd9bbd-4196-48ca-9f38-a28d1499fcd5', 'Merlu', 'g', 'Poissons'),
	('3962f661-3eff-4d17-87ee-499133c9565f', 'Sole', 'g', 'Poissons'),
	('b993cfe8-aed8-4544-872b-469f8a0617d7', 'Crevettes', 'g', 'Crustacés'),
	('75e13374-3597-41f4-ba71-cff94e2b5610', 'Gambas', 'g', 'Crustacés'),
	('2a490b7d-ddb6-4c57-bdf6-ae87a355dca1', 'Crabe', 'g', 'Crustacés'),
	('c4dcca7d-2e0e-4009-8d08-72f8da39aba7', 'Moules', 'g', 'Mollusques'),
	('3fc35b14-6c45-4877-b304-4a6629f21e9c', 'Poulet', 'g', NULL),
	('27d80139-d4c4-45ee-ae06-98863ec0ec3b', 'Dinde', 'g', NULL),
	('b8c6ab66-16d2-45f9-a873-72ba8b04e1b0', 'Boeuf haché', 'g', NULL),
	('728cd78b-85e5-4a19-a643-d14b664cc2ef', 'Steak haché', 'pièce', NULL),
	('17821929-b5ec-46a9-b019-11aceacd8788', 'Rôti de boeuf', 'g', NULL),
	('feb42122-0e30-491a-ab7c-3a8d3bcef49e', 'Veau', 'g', NULL),
	('3be72aaa-1391-497d-8b92-e6be7f92aad6', 'Porc', 'g', NULL),
	('9d48f1c2-928a-4347-8dd8-2ecf750c2979', 'Jambon blanc', 'tranche', NULL),
	('9e556040-637c-41fb-9f46-62504795f659', 'Lardons', 'g', NULL),
	('6986f647-859f-46d4-aa2f-60f65f6c8165', 'Carottes', 'g', NULL),
	('41461423-0f0b-491d-90ec-41c783548ce9', 'Oignon', 'g', NULL),
	('30d4bd0a-8669-4f93-a7a1-3f7bdf568569', 'Ail', 'gousse', NULL),
	('8576571c-dfbd-4543-a8bc-a22a479b2d7b', 'Courgettes', 'g', NULL),
	('51a08307-742b-4fcd-88e1-46cd59aab42c', 'Aubergines', 'g', NULL),
	('bc76031f-4d73-47ab-bc93-cf26a49554cf', 'Tomates', 'g', NULL),
	('80b374e1-bdcc-4ae0-aa29-8f13950a3781', 'Poivrons', 'g', NULL),
	('08145186-3703-4a30-b74b-c419a6e7888b', 'Poireaux', 'g', NULL),
	('a5c12d20-8889-4956-9ed2-0ff7063b1a02', 'Épinards', 'g', NULL),
	('36030226-7306-439e-b773-1f7abf7d13b3', 'Chou-fleur', 'g', NULL),
	('fa7a2d92-ef25-4a10-8ea4-3de2d1db471e', 'Brocoli', 'g', NULL),
	('659a5158-121d-4254-955a-92cbfea9c9ca', 'Haricots verts', 'g', NULL),
	('b2b0c573-ee13-4c0e-ad6e-ea03a8ef22e3', 'Petits pois', 'g', NULL),
	('c9939c9e-2db5-4ae8-b404-4ba0f66d1fa8', 'Champignons', 'g', NULL),
	('0b1a997e-49ed-45ae-8eeb-2d16d06b3c0a', 'Salade verte', 'g', NULL),
	('e4c100b2-2d6a-4bd9-8a4e-f90e2d8857dc', 'Concombre', 'g', NULL),
	('a10fdc79-404a-4020-84e8-219da73882b0', 'Radis', 'g', NULL),
	('b5602567-8b2d-431d-bc10-8b0cc67a06da', 'Potiron', 'g', NULL),
	('e086205d-548c-4aec-8ec0-a1805eb90a90', 'Céleri branche', 'g', 'Céleri'),
	('d6754c19-1edd-4cab-b555-062401116e66', 'Céleri rave', 'g', 'Céleri'),
	('39dd9510-5284-49f1-9e55-f860cb9c5013', 'Pomme', 'pièce', NULL),
	('25810bd0-a25c-4c72-af3c-b2d358b144c4', 'Poire', 'pièce', NULL),
	('8dc16f5e-8cf4-45d5-b042-aa05ecce0ac5', 'Banane', 'pièce', NULL),
	('af8dad05-ea96-452e-a6e3-c05973b2902e', 'Orange', 'pièce', NULL),
	('0973a85a-c544-4b7b-bedf-0f1135f660d0', 'Citron', 'pièce', NULL),
	('4d97c0ee-2a45-4cd8-a0b2-8992826b011e', 'Fraise', 'g', NULL),
	('8a0b2246-c5cd-4861-b21b-a19c129ee38e', 'Framboise', 'g', NULL),
	('170b117c-4ddb-47e7-af5e-307eef876a90', 'Abricot', 'g', NULL),
	('b6ed9805-52c9-4117-8582-50b5d54dca2c', 'Pêche', 'pièce', NULL),
	('56e98e4a-bf36-40c5-bf84-49b361165106', 'Kiwi', 'pièce', NULL),
	('07a03a04-3a3b-4567-a90c-ef58766f2f49', 'Amandes', 'g', 'Fruits à coque'),
	('f03e235e-82b2-4547-ba37-709453c0c686', 'Noix', 'g', 'Fruits à coque'),
	('687c2df3-75a2-47e0-bad5-6401eab8ba53', 'Noisettes', 'g', 'Fruits à coque'),
	('42d520f7-c502-4012-a6e2-bff06e15e12a', 'Pistaches', 'g', 'Fruits à coque'),
	('eadf50f1-2f47-4ede-8f8d-6bc7639e0fe0', 'Poudre d''amande', 'g', 'Fruits à coque'),
	('b517da85-4ce5-49cf-b014-60f11a08d805', 'Cacahuètes', 'g', 'Arachides'),
	('df77aa3d-4d97-4b97-89ed-fd44cac7949c', 'Beurre de cacahuète', 'g', 'Arachides'),
	('551b6197-8d6b-4589-ab31-091549ad2ad0', 'Huile d''arachide', 'ml', 'Arachides'),
	('6389db4e-7226-4e29-9793-c2fb1a680489', 'Soja', 'g', 'Soja'),
	('bb6ea9b5-c664-4e2c-88a3-2276ddfca539', 'Tofu', 'g', 'Soja'),
	('3bdabfef-65fb-4c16-9388-bf358ed80e97', 'Sauce soja', 'ml', 'Soja'),
	('c0a67869-1b1b-4bb5-b6e2-6a7dd5ab279e', 'Lait de soja', 'ml', 'Soja'),
	('511f57be-5434-4102-9bbd-43eb683f1665', 'Moutarde', 'g', 'Moutarde'),
	('ad7fedf1-1f43-48eb-bb26-716b4d43a9fe', 'Graines de sésame', 'g', 'Sésame'),
	('7e81e0de-b2ae-4ab2-b8b3-e76cf7183849', 'Huile de sésame', 'ml', 'Sésame'),
	('d86a34b1-a1fe-46b2-a30b-dbf2191105d3', 'Huile d''olive', 'ml', NULL),
	('4e58d496-6a30-4c96-909f-41759df1a446', 'Huile de colza', 'ml', NULL),
	('56609afd-b549-4019-9cfe-0d89b575719a', 'Vin rouge', 'ml', 'Sulfites'),
	('2b1e3838-ff2a-4b61-bb25-853ec3688b51', 'Vin blanc', 'ml', 'Sulfites'),
	('77d09cde-dae1-4065-816a-2df02be1009c', 'Vinaigre balsamique', 'ml', 'Sulfites'),
	('510a3cc2-40c0-4a83-b01e-2f77a94e934d', 'Raisins secs', 'g', 'Sulfites'),
	('e1443350-f2a0-49eb-9604-2ccc7950ac14', 'Farine de lupin', 'g', 'Lupin');


--
-- Data for Name: meals; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: meal_dishes; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."patients" ("id", "first_name", "last_name", "room", "service", "allergies", "dietary_restrictions", "status", "created_at") VALUES
	('1a29c549-ca8b-4a2e-b7eb-a06a775be84e', 'Alexandre', 'Legrand', '101', 'Cardiologie', '{Gluten,Crustacés}', '{"Sans sel"}', 'ADMITTED', '2026-01-29 13:15:58.022069+00'),
	('1ae57162-bb15-41fc-ad21-44920d27f0bf', 'Sarah', 'Connor', '204', 'Traumatologie', '{Arachides}', '{Hyperprotéiné}', 'ADMITTED', '2026-01-29 13:15:58.022069+00'),
	('2978e359-4490-4268-8053-1f811675608b', 'Jean', 'Valjean', '305', 'Gériatrie', '{}', '{Mixé}', 'ADMITTED', '2026-01-29 13:15:58.022069+00'),
	('59319958-ea8d-4ae8-b72d-d716d9fa953e', 'Marie', 'Curie', '108', 'Oncologie', '{Lactose}', '{"Sans sucre"}', 'ADMITTED', '2026-01-29 13:15:58.022069+00'),
	('9934e1ba-f7fe-474e-87f4-ba2a1ce30781', 'ALEX', 'TESTER', '101', 'Cardiologie', '{Gluten}', '{}', 'ADMITTED', '2026-01-29 13:37:44.737992+00'),
	('cdb8f4e7-10b8-4fb4-b1ca-7f133d5e4ab5', 'Jean', 'TESTEUR', '101', 'Cardiologie', '{Gluten}', '{}', 'ADMITTED', '2026-01-29 14:51:40.437861+00');


--
-- Data for Name: patients_allergens; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."patients_allergens" ("id", "created_at", "patient_id", "allergen_id") VALUES
	(1, '2026-01-29 14:37:56.472516+00', '1a29c549-ca8b-4a2e-b7eb-a06a775be84e', 1),
	(2, '2026-01-29 14:37:56.472516+00', '1a29c549-ca8b-4a2e-b7eb-a06a775be84e', 2),
	(3, '2026-01-29 14:37:56.472516+00', '1ae57162-bb15-41fc-ad21-44920d27f0bf', 5),
	(4, '2026-01-29 14:37:56.472516+00', '59319958-ea8d-4ae8-b72d-d716d9fa953e', 7),
	(5, '2026-01-29 14:37:56.472516+00', '9934e1ba-f7fe-474e-87f4-ba2a1ce30781', 1);


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "full_name", "role", "created_at") VALUES
	('ad461546-005a-4c3d-b8ca-dd6ab3286bfc', 'Chef Rasam', 'KITCHEN', '2026-01-29 13:31:08.096612+00'),
	('96027b2e-786c-4225-8a77-f4813a7cc92c', 'Dr. Joela', 'MEDICAL', '2026-01-29 13:31:08.096612+00'),
	('6c16b33d-135d-4200-8066-e2616aeabd91', 'chef test', 'MEDICAL', '2026-01-29 13:54:46.04597+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 14, true);


--
-- Name: allergens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."allergens_id_seq"', 42, true);


--
-- Name: dishes_allergens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."dishes_allergens_id_seq"', 9, true);


--
-- Name: patients_allergens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."patients_allergens_id_seq"', 5, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict w7YuYJllH7Xw2YlTf5bhTJ8HsvdqerpNWiByv1Fg8dddrOjaPgr2bDBa5Z0CZ2m

RESET ALL;
