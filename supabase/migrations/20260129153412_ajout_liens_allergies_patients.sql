create type "public"."plat" as enum ('ENTREE', 'PLAT', 'DESSERT');

alter table "public"."patients_allergens" add constraint "patients_allergens_patient_id_fkey" FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE not valid;

alter table "public"."patients_allergens" validate constraint "patients_allergens_patient_id_fkey";


