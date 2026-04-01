// ─────────────────────────────────────────────────────────────
// SETUP REQUIRED — replace the two values below:
//
//  1. Go to https://supabase.com and create a free project
//  2. In your project: Settings → API
//  3. Copy "Project URL" → SUPABASE_URL
//  4. Copy "anon / public" key → SUPABASE_ANON_KEY
//
// The anon key is safe to expose in frontend code when Row Level
// Security (RLS) is enabled on your tables (see SQL setup below).
// ─────────────────────────────────────────────────────────────

const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─────────────────────────────────────────────────────────────
// DATABASE SETUP — run this SQL in your Supabase SQL Editor
// (Project → SQL Editor → New query → paste → Run)
// ─────────────────────────────────────────────────────────────
//
// -- Profiles (auto-created on signup)
// create table profiles (
//   id uuid references auth.users on delete cascade primary key,
//   full_name text,
//   email text,
//   created_at timestamptz default now()
// );
//
// -- Contact form submissions
// create table form_submissions (
//   id uuid default gen_random_uuid() primary key,
//   user_id uuid references auth.users on delete cascade,
//   first_name text,
//   last_name text,
//   email text,
//   topic text,
//   message text,
//   created_at timestamptz default now()
// );
//
// -- Assembly sessions
// create table assembly_sessions (
//   id uuid default gen_random_uuid() primary key,
//   title text not null,
//   date date not null,
//   location text,
//   description text,
//   capacity int default 50
// );
//
// -- User registrations for sessions
// create table session_registrations (
//   id uuid default gen_random_uuid() primary key,
//   user_id uuid references auth.users on delete cascade,
//   session_id uuid references assembly_sessions on delete cascade,
//   created_at timestamptz default now(),
//   unique(user_id, session_id)
// );
//
// -- Enable Row Level Security
// alter table profiles enable row level security;
// alter table form_submissions enable row level security;
// alter table assembly_sessions enable row level security;
// alter table session_registrations enable row level security;
//
// -- Profiles policies
// create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
// create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
// create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
//
// -- Form submissions policies
// create policy "Users can read own submissions" on form_submissions for select using (auth.uid() = user_id);
// create policy "Authenticated users can submit" on form_submissions for insert with check (auth.uid() = user_id);
//
// -- Assembly sessions (public read)
// create policy "Anyone can view sessions" on assembly_sessions for select using (true);
//
// -- Session registrations policies
// create policy "Users can view own registrations" on session_registrations for select using (auth.uid() = user_id);
// create policy "Users can register" on session_registrations for insert with check (auth.uid() = user_id);
// create policy "Users can unregister" on session_registrations for delete using (auth.uid() = user_id);
//
// -- Auto-create profile on signup
// create or replace function handle_new_user()
// returns trigger as $$
// begin
//   insert into public.profiles (id, full_name, email)
//   values (new.id, new.raw_user_meta_data->>'full_name', new.email);
//   return new;
// end;
// $$ language plpgsql security definer;
//
// create trigger on_auth_user_created
//   after insert on auth.users
//   for each row execute procedure handle_new_user();
//
// -- Seed assembly sessions
// insert into assembly_sessions (title, date, location, description) values
//   ('Session 1: Introduction & Expert Learning', '2026-06-06', 'Hartford Convention Center, Hartford CT', 'Opening session where participants meet and hear from leading experts in municipal finance and property tax policy.'),
//   ('Session 2: Deep Dive — Local Services Funding', '2026-06-20', 'University of Connecticut, Storrs CT', 'Focused learning on how local public services are currently funded and the trade-offs involved.'),
//   ('Session 3: Small Group Deliberation I', '2026-07-11', 'Yale University, New Haven CT', 'Facilitated small-group discussions to surface priorities and areas of agreement.'),
//   ('Session 4: Small Group Deliberation II', '2026-07-25', 'Quinnipiac University, Hamden CT', 'Continued deliberation and development of initial recommendations.'),
//   ('Session 5: Drafting Recommendations', '2026-08-08', 'Hartford Convention Center, Hartford CT', 'Participants work together to draft concrete policy recommendations.'),
//   ('Session 6: Final Review & Vote', '2026-08-22', 'State Capitol, Hartford CT', 'Final session to review, refine, and formally adopt the Citizens'' Assembly recommendations.');
