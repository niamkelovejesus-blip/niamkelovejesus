-- À exécuter UNE fois dans Supabase > SQL Editor
-- Ajoute le classement des chants par catégorie et par recueil.
alter table public.musiques add column if not exists categorie text;
alter table public.musiques add column if not exists recueil text;
create index if not exists musiques_categorie_idx on public.musiques (categorie);
