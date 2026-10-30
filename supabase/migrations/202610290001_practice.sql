-- A new Escalón Cero project. Apply through Supabase migrations or SQL editor.
-- The public application uses only a publishable key and the learner's JWT.
begin;

create table public.practice_drafts (
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_id text not null check (char_length(activity_id) between 1 and 80),
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, activity_id),
  constraint payload_object check (jsonb_typeof(payload) = 'object'),
  constraint payload_version check (payload ->> 'version' = '1'),
  constraint payload_activity check (payload ->> 'activityId' = activity_id),
  constraint payload_size check (octet_length(payload::text) <= 180000),
  constraint payload_status check (payload ->> 'status' in ('draft', 'submitted')),
  constraint payload_required check (payload ?& array['version', 'activityId', 'status', 'cases', 'reports', 'reflection', 'evidence']),
  constraint payload_cases check (jsonb_typeof(payload -> 'cases') = 'array'),
  constraint payload_reports check (jsonb_typeof(payload -> 'reports') = 'array'),
  constraint payload_evidence check (jsonb_typeof(payload -> 'evidence') = 'array')
);

alter table public.practice_drafts enable row level security;
revoke all on public.practice_drafts from anon, authenticated;
grant select, insert, update, delete on public.practice_drafts to authenticated;

create policy "Read own practice" on public.practice_drafts for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Insert own practice" on public.practice_drafts for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Update own practice" on public.practice_drafts for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Delete own practice" on public.practice_drafts for delete to authenticated
  using ((select auth.uid()) = user_id);

create function public.set_practice_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function public.set_practice_updated_at() from public, anon, authenticated;
create trigger practice_updated_at before update on public.practice_drafts
  for each row execute function public.set_practice_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('evidence', 'evidence', false, 2097152, array['image/png', 'image/jpeg', 'image/webp', 'application/pdf']);

create policy "Read own evidence" on storage.objects for select to authenticated
  using (bucket_id = 'evidence' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Upload own evidence" on storage.objects for insert to authenticated
  with check (bucket_id = 'evidence' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Update own evidence" on storage.objects for update to authenticated
  using (bucket_id = 'evidence' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'evidence' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Delete own evidence" on storage.objects for delete to authenticated
  using (bucket_id = 'evidence' and (storage.foldername(name))[1] = (select auth.uid())::text);

commit;
