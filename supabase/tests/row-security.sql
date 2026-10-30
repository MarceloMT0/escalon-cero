-- Run against an isolated Supabase test database after applying the migration.
-- Uses synthetic users and rolls back every fixture. Not yet executed in cloud.
begin;
insert into auth.users (id) values
  ('00000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000002');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}', true);

insert into public.practice_drafts (user_id, activity_id, payload)
values ('00000000-0000-4000-8000-000000000001', 'qa-tienda',
  '{"version":1,"activityId":"qa-tienda","status":"draft","cases":[],"reports":[],"reflection":"","evidence":[]}');

do $$ begin
  if (select count(*) from public.practice_drafts) <> 1 then
    raise exception 'Owner cannot read own draft';
  end if;
end $$;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
do $$ declare affected integer; begin
  if (select count(*) from public.practice_drafts) <> 0 then
    raise exception 'Cross-user draft read';
  end if;
  update public.practice_drafts set payload = payload || '{"reflection":"spoofed"}'::jsonb
    where user_id = '00000000-0000-4000-8000-000000000001';
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Cross-user draft update'; end if;
  begin
    insert into public.practice_drafts (user_id, activity_id, payload)
    values ('00000000-0000-4000-8000-000000000001', 'spoof',
      '{"version":1,"activityId":"spoof","status":"draft","cases":[],"reports":[],"reflection":"","evidence":[]}');
    raise exception 'Spoofed owner insert unexpectedly succeeded';
  exception when insufficient_privilege then null;
  end;
end $$;
rollback;
