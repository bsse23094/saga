-- ═══════════════════════════════════════════════════════════════
-- SAGA — Supabase Migration
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ═══════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════════════
-- STEP 1: Create ALL tables first (no cross-table references)
-- ══════════════════════════════════════════════════════════════

-- ─── Profiles ────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null
);

-- ─── Friendships ─────────────────────────────────────────────
create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid references public.profiles(id) on delete cascade not null,
  addressee_id uuid references public.profiles(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz default now() not null,
  unique(requester_id, addressee_id)
);

-- ─── Journal Entries ─────────────────────────────────────────
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  noise_text text,
  path_text text,
  tags text[] default '{}',
  created_at timestamptz default now() not null
);

-- ─── Habits ──────────────────────────────────────────────────
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  icon text not null default 'sprout',
  created_at timestamptz default now() not null
);

-- ─── Habit Logs ──────────────────────────────────────────────
create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid references public.habits(id) on delete cascade not null,
  date date not null,
  unique(habit_id, date)
);

-- ─── Shared Habits ───────────────────────────────────────────
create table if not exists public.shared_habits (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid references public.habits(id) on delete cascade not null,
  friendship_id uuid references public.friendships(id) on delete cascade not null,
  shared_by uuid references public.profiles(id) on delete cascade not null,
  unique(habit_id, friendship_id)
);

-- ══════════════════════════════════════════════════════════════
-- STEP 2: Enable RLS on all tables
-- ══════════════════════════════════════════════════════════════

alter table public.profiles enable row level security;
alter table public.friendships enable row level security;
alter table public.journal_entries enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.shared_habits enable row level security;

-- ══════════════════════════════════════════════════════════════
-- STEP 3: RLS Policies (all tables exist now, safe to cross-ref)
-- ══════════════════════════════════════════════════════════════

-- ─── Profiles policies ───────────────────────────────────────
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ─── Friendships policies ────────────────────────────────────
create policy "Users can view their own friendships"
  on public.friendships for select
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

create policy "Users can create friend requests"
  on public.friendships for insert
  with check (auth.uid() = requester_id);

create policy "Addressee can update friendship status"
  on public.friendships for update
  using (auth.uid() = addressee_id);

create policy "Either party can delete a friendship"
  on public.friendships for delete
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- ─── Journal Entries policies ────────────────────────────────
create policy "Users can view their own entries"
  on public.journal_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own entries"
  on public.journal_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own entries"
  on public.journal_entries for delete
  using (auth.uid() = user_id);

create policy "Users can update their own entries"
  on public.journal_entries for update
  using (auth.uid() = user_id);

create policy "Friends can view entry dates"
  on public.journal_entries for select
  using (
    exists (
      select 1 from public.friendships f
      where f.status = 'accepted'
        and (
          (f.requester_id = auth.uid() and f.addressee_id = user_id)
          or (f.addressee_id = auth.uid() and f.requester_id = user_id)
        )
    )
  );

-- ─── Habits policies ────────────────────────────────────────
create policy "Users can view their own habits"
  on public.habits for select
  using (auth.uid() = user_id);

create policy "Users can insert their own habits"
  on public.habits for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own habits"
  on public.habits for delete
  using (auth.uid() = user_id);

create policy "Users can update their own habits"
  on public.habits for update
  using (auth.uid() = user_id);

create policy "Friends can view shared habits"
  on public.habits for select
  using (
    exists (
      select 1 from public.shared_habits sh
      join public.friendships f on f.id = sh.friendship_id
      where sh.habit_id = habits.id
        and f.status = 'accepted'
        and (f.requester_id = auth.uid() or f.addressee_id = auth.uid())
    )
  );

-- ─── Habit Logs policies ────────────────────────────────────
create policy "Users can view their own habit logs"
  on public.habit_logs for select
  using (
    exists (
      select 1 from public.habits h
      where h.id = habit_id and h.user_id = auth.uid()
    )
  );

create policy "Users can insert their own habit logs"
  on public.habit_logs for insert
  with check (
    exists (
      select 1 from public.habits h
      where h.id = habit_id and h.user_id = auth.uid()
    )
  );

create policy "Users can delete their own habit logs"
  on public.habit_logs for delete
  using (
    exists (
      select 1 from public.habits h
      where h.id = habit_id and h.user_id = auth.uid()
    )
  );

create policy "Friends can view shared habit logs"
  on public.habit_logs for select
  using (
    exists (
      select 1 from public.shared_habits sh
      join public.friendships f on f.id = sh.friendship_id
      where sh.habit_id = habit_logs.habit_id
        and f.status = 'accepted'
        and (f.requester_id = auth.uid() or f.addressee_id = auth.uid())
    )
  );

-- ─── Shared Habits policies ─────────────────────────────────
create policy "Users can view shared habits for their friendships"
  on public.shared_habits for select
  using (
    exists (
      select 1 from public.friendships f
      where f.id = friendship_id
        and (f.requester_id = auth.uid() or f.addressee_id = auth.uid())
        and f.status = 'accepted'
    )
  );

create policy "Users can share their own habits"
  on public.shared_habits for insert
  with check (auth.uid() = shared_by);

create policy "Users can unshare their own habits"
  on public.shared_habits for delete
  using (auth.uid() = shared_by);

-- ══════════════════════════════════════════════════════════════
-- STEP 4: Indexes
-- ══════════════════════════════════════════════════════════════

create index if not exists idx_journal_entries_user_id on public.journal_entries(user_id);
create index if not exists idx_journal_entries_created_at on public.journal_entries(created_at desc);
create index if not exists idx_habits_user_id on public.habits(user_id);
create index if not exists idx_habit_logs_habit_id on public.habit_logs(habit_id);
create index if not exists idx_habit_logs_date on public.habit_logs(date);
create index if not exists idx_friendships_requester on public.friendships(requester_id);
create index if not exists idx_friendships_addressee on public.friendships(addressee_id);
create index if not exists idx_friendships_status on public.friendships(status);
create index if not exists idx_shared_habits_friendship on public.shared_habits(friendship_id);
create index if not exists idx_shared_habits_shared_by on public.shared_habits(shared_by);
create index if not exists idx_profiles_username on public.profiles(username);

-- ══════════════════════════════════════════════════════════════
-- STEP 5: Trigger — auto-create profile on signup
-- ══════════════════════════════════════════════════════════════

create or replace function public.handle_new_user()
returns trigger as $$
declare
  _username text;
begin
  _username := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));

  -- If username already taken, append a random suffix
  if exists (select 1 from public.profiles where username = _username) then
    _username := _username || '_' || substr(gen_random_uuid()::text, 1, 6);
  end if;

  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    _username,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ══════════════════════════════════════════════════════════════
-- STEP 6: RPC — get friend activity dates for heatmap
-- Returns aggregated habit-log dates for a friend WITHOUT
-- exposing habit details. Only works for accepted friends.
-- ══════════════════════════════════════════════════════════════

create or replace function public.get_friend_activity_dates(friend_user_id uuid)
returns table(activity_date date, activity_count bigint)
language sql
security definer
set search_path = public
as $$
  select hl.date as activity_date, count(*) as activity_count
  from public.habit_logs hl
  join public.habits h on h.id = hl.habit_id
  where h.user_id = friend_user_id
    and exists (
      select 1 from public.friendships f
      where f.status = 'accepted'
        and (
          (f.requester_id = auth.uid() and f.addressee_id = friend_user_id)
          or (f.addressee_id = auth.uid() and f.requester_id = friend_user_id)
        )
    )
  group by hl.date;
$$;
