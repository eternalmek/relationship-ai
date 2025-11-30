# BetterUs Ai

A React + Vite mobile application built with Capacitor for Android and iOS deployment.

## Package ID
`com.betterusai.app`

## Tech Stack

- **React** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Supabase** - Backend (Auth & PostgreSQL Database)
- **Capacitor** - Cross-platform native runtime
- **Recharts** - Charts library
- **Lucide React** - Icons
- **OpenAI** - AI powered coaching and analysis

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and paste your keys from Supabase Console and OpenAI:

```bash
cp .env.example .env
# fill in Supabase + OpenAI keys
```

Environment keys consumed by the app:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_OPENAI_API_KEY`

### Supabase Setup

1. Create a new project in [Supabase](https://supabase.com)
2. Run the following SQL to create the required tables:

```sql
-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  partner_name text,
  relationship_length text,
  love_language text,
  attachment_style text,
  goal text,
  partner_id uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Emotions table
create table emotions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  mood integer,
  stress integer,
  connection integer,
  appreciation integer,
  date_str text,
  day_name text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Conversations table
create table conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  text text,
  analysis jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table emotions enable row level security;
alter table conversations enable row level security;

-- Policies for profiles
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can view partner profile" on profiles for select using (auth.uid()::text = partner_id::text);

-- Policies for emotions
create policy "Users can view own emotions" on emotions for select using (auth.uid() = user_id);
create policy "Users can insert own emotions" on emotions for insert with check (auth.uid() = user_id);
create policy "Users can view partner emotions" on emotions for select using (
  auth.uid() in (select id from profiles where partner_id = emotions.user_id)
);

-- Policies for conversations
create policy "Users can view own conversations" on conversations for select using (auth.uid() = user_id);
create policy "Users can insert own conversations" on conversations for insert with check (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table emotions;
```

3. Copy your Supabase URL and anon key from Settings > API

### Development

```bash
npm run dev
```

### Build (web bundle used by Capacitor)

```bash
npm run build
```

### Deployment to Vercel

1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Add your environment variables in the Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_OPENAI_API_KEY`
3. Deploy

### Android Development

```bash
# Sync web assets to Android
npx cap sync android

# Open in Android Studio
npx cap open android
```

### iOS Development

```bash
# Sync web assets to iOS
npx cap sync ios

# Open the workspace in Xcode for signing + simulator/device builds
npx cap open ios
```

In Xcode, set your team + bundle identifier, then archive for TestFlight/App Store.

## Production Checklist

- Enable **Email/Password** auth in Supabase console (Authentication > Providers).
- Create database tables using the SQL above.
- Set up Row Level Security policies.
- Add your Supabase config values to environment variables and ensure they are bundled in CI/CD securely.
- Provide an OpenAI API key (or switch to your own backend proxy) for live AI insights.
- After running `npm run build`, always run `npx cap sync ios`/`android` before opening the native project.

## Supabase Configuration

Supabase configuration is read from environment variables in `src/supabase.js`.

## License

Private
