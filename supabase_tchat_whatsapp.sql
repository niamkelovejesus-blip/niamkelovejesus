-- Niamké Love Jésus — tchat « comme WhatsApp » (v27)
-- À coller dans Supabase > SQL Editor > Run. Peut être exécuté plusieurs fois sans danger.

-- 1) Coche ✓✓ « lu » : date de lecture du message
alter table public.messages add column if not exists read_at timestamptz;

-- 2) Le destinataire peut marquer SES messages reçus comme lus (et rien d'autre)
drop policy if exists nlj_messages_mark_read on public.messages;
create policy nlj_messages_mark_read on public.messages
  for update to authenticated
  using (receiver_id = auth.uid())
  with check (receiver_id = auth.uid());

create or replace function public.nlj_messages_only_read_at() returns trigger
language plpgsql as $$
begin
  if new.body is distinct from old.body
     or new.sender_id is distinct from old.sender_id
     or new.receiver_id is distinct from old.receiver_id
     or new.created_at is distinct from old.created_at then
    raise exception 'nlj_read_only_field';
  end if;
  if old.read_at is not null then new.read_at := old.read_at; end if;  -- la date de lecture ne change plus
  return new;
end $$;
drop trigger if exists nlj_messages_only_read_at on public.messages;
create trigger nlj_messages_only_read_at before update on public.messages
  for each row execute function public.nlj_messages_only_read_at();

-- 3) Suppression de ses propres messages (texte et vocaux)
drop policy if exists nlj_messages_delete_own on public.messages;
create policy nlj_messages_delete_own on public.messages
  for delete to authenticated
  using (sender_id = auth.uid());

-- 4) Suppression du fichier audio d'un vocal : réservé au dossier de son propriétaire
--    (les fichiers sont rangés dans voice/<id du membre>/...)
drop policy if exists nlj_voice_delete_own on storage.objects;
create policy nlj_voice_delete_own on storage.objects
  for delete to authenticated
  using (bucket_id = 'voice' and (storage.foldername(name))[1] = auth.uid()::text);

-- 5) Temps réel : s'assurer que la table messages est diffusée (INSERT / UPDATE / DELETE)
do $$ begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null; when undefined_object then null; end $$;
