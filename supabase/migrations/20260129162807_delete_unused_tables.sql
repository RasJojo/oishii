create type "public"."profile_roles" as enum ('KITCHEN', 'MEDICAL');

drop policy "Allow read access to authenticated users" on "public"."meal_dishes";

drop policy "Allow write access to authenticated users" on "public"."meal_dishes";

drop policy "Allow read access to authenticated users" on "public"."meals";

drop policy "Allow write access to authenticated users" on "public"."meals";

revoke delete on table "public"."meal_dishes" from "anon";

revoke insert on table "public"."meal_dishes" from "anon";

revoke references on table "public"."meal_dishes" from "anon";

revoke select on table "public"."meal_dishes" from "anon";

revoke trigger on table "public"."meal_dishes" from "anon";

revoke truncate on table "public"."meal_dishes" from "anon";

revoke update on table "public"."meal_dishes" from "anon";

revoke delete on table "public"."meal_dishes" from "authenticated";

revoke insert on table "public"."meal_dishes" from "authenticated";

revoke references on table "public"."meal_dishes" from "authenticated";

revoke select on table "public"."meal_dishes" from "authenticated";

revoke trigger on table "public"."meal_dishes" from "authenticated";

revoke truncate on table "public"."meal_dishes" from "authenticated";

revoke update on table "public"."meal_dishes" from "authenticated";

revoke delete on table "public"."meal_dishes" from "service_role";

revoke insert on table "public"."meal_dishes" from "service_role";

revoke references on table "public"."meal_dishes" from "service_role";

revoke select on table "public"."meal_dishes" from "service_role";

revoke trigger on table "public"."meal_dishes" from "service_role";

revoke truncate on table "public"."meal_dishes" from "service_role";

revoke update on table "public"."meal_dishes" from "service_role";

revoke delete on table "public"."meals" from "anon";

revoke insert on table "public"."meals" from "anon";

revoke references on table "public"."meals" from "anon";

revoke select on table "public"."meals" from "anon";

revoke trigger on table "public"."meals" from "anon";

revoke truncate on table "public"."meals" from "anon";

revoke update on table "public"."meals" from "anon";

revoke delete on table "public"."meals" from "authenticated";

revoke insert on table "public"."meals" from "authenticated";

revoke references on table "public"."meals" from "authenticated";

revoke select on table "public"."meals" from "authenticated";

revoke trigger on table "public"."meals" from "authenticated";

revoke truncate on table "public"."meals" from "authenticated";

revoke update on table "public"."meals" from "authenticated";

revoke delete on table "public"."meals" from "service_role";

revoke insert on table "public"."meals" from "service_role";

revoke references on table "public"."meals" from "service_role";

revoke select on table "public"."meals" from "service_role";

revoke trigger on table "public"."meals" from "service_role";

revoke truncate on table "public"."meals" from "service_role";

revoke update on table "public"."meals" from "service_role";

alter table "public"."meal_dishes" drop constraint "meal_dishes_meal_id_fkey";

alter table "public"."meals" drop constraint "meals_meal_type_check";

alter table "public"."profiles" drop constraint "profiles_role_check";

alter table "public"."meal_dishes" drop constraint "meal_dishes_pkey";

alter table "public"."meals" drop constraint "meals_pkey";

drop index if exists "public"."meal_dishes_pkey";

drop index if exists "public"."meals_pkey";

drop table "public"."meal_dishes";

drop table "public"."meals";

alter table "public"."profiles" add column "role_deprecated" text default 'MEDICAL'::text;

alter table "public"."profiles" alter column "role" drop default;

alter table "public"."profiles" alter column "role" set not null;

alter table "public"."profiles" alter column "role" set data type public.profile_roles using "role"::public.profile_roles;

alter table "public"."profiles" add constraint "profiles_role_check" CHECK ((role_deprecated = ANY (ARRAY['MEDICAL'::text, 'KITCHEN'::text]))) not valid;

alter table "public"."profiles" validate constraint "profiles_role_check";


