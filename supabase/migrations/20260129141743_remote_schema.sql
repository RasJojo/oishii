
  create table "public"."ingredients" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "name" text not null,
    "default_unit" text default 'g'::text,
    "allergen" text
      );


alter table "public"."ingredients" enable row level security;

alter table "public"."dishes" add column "recipe" jsonb default '[]'::jsonb;

CREATE UNIQUE INDEX ingredients_name_key ON public.ingredients USING btree (name);

CREATE UNIQUE INDEX ingredients_pkey ON public.ingredients USING btree (id);

alter table "public"."ingredients" add constraint "ingredients_pkey" PRIMARY KEY using index "ingredients_pkey";

alter table "public"."ingredients" add constraint "ingredients_allergen_fkey" FOREIGN KEY (allergen) REFERENCES public.allergens(name) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."ingredients" validate constraint "ingredients_allergen_fkey";

alter table "public"."ingredients" add constraint "ingredients_name_key" UNIQUE using index "ingredients_name_key";

grant delete on table "public"."ingredients" to "anon";

grant insert on table "public"."ingredients" to "anon";

grant references on table "public"."ingredients" to "anon";

grant select on table "public"."ingredients" to "anon";

grant trigger on table "public"."ingredients" to "anon";

grant truncate on table "public"."ingredients" to "anon";

grant update on table "public"."ingredients" to "anon";

grant delete on table "public"."ingredients" to "authenticated";

grant insert on table "public"."ingredients" to "authenticated";

grant references on table "public"."ingredients" to "authenticated";

grant select on table "public"."ingredients" to "authenticated";

grant trigger on table "public"."ingredients" to "authenticated";

grant truncate on table "public"."ingredients" to "authenticated";

grant update on table "public"."ingredients" to "authenticated";

grant delete on table "public"."ingredients" to "service_role";

grant insert on table "public"."ingredients" to "service_role";

grant references on table "public"."ingredients" to "service_role";

grant select on table "public"."ingredients" to "service_role";

grant trigger on table "public"."ingredients" to "service_role";

grant truncate on table "public"."ingredients" to "service_role";

grant update on table "public"."ingredients" to "service_role";


  create policy "Authenticated users can manage allergens"
  on "public"."allergens"
  as permissive
  for all
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Authenticated users can read allergens"
  on "public"."allergens"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Authenticated users can manage ingredients"
  on "public"."ingredients"
  as permissive
  for all
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Authenticated users can read ingredients"
  on "public"."ingredients"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "enable update for own information"
  on "public"."profiles"
  as permissive
  for update
  to public
using ((( SELECT auth.uid() AS uid) = id));



