# Prediction Tracker

A prediction tracking app for you and your friends built with React, Vite, Tailwind CSS, and Supabase. Track predictions, mark them as correct/incorrect when they resolve, and compete on a leaderboard.

## Features

- **Email/Password Authentication** - Secure login with Supabase Auth
- **Create Predictions** - Make predictions with text and resolution dates
- **Admin Resolution** - Only admins can mark predictions as correct/incorrect
- **Real-time Updates** - See predictions resolve instantly across all users
- **Leaderboard** - Track accuracy percentages and streaks with gold/silver/bronze rankings
- **Dark Trading Interface** - Professional dark theme with parallax dot grid background
- **Locked Predictions** - No editing or deletion after creation to maintain integrity

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Setup Instructions

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create an account
2. Click "New Project"
3. Fill in your project details:
   - Name: "Prediction Tracker" (or your choice)
   - Database Password: Create a strong password (save this!)
   - Region: Choose closest to you
4. Click "Create new project" and wait for it to finish (1-2 minutes)

### 2. Set Up Database Tables

1. In your Supabase project dashboard, go to the SQL Editor
2. Click "New Query"
3. Copy and paste the following SQL to create the tables:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create predictions table
CREATE TABLE predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  text TEXT NOT NULL,
  resolution_date DATE NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  correct BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Profiles policies - everyone can read all profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Predictions policies - everyone can read all predictions
CREATE POLICY "Predictions are viewable by everyone"
  ON predictions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert predictions"
  ON predictions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update predictions"
  ON predictions FOR UPDATE
  TO authenticated
  USING (true);
```

4. Click "Run" to execute the SQL

### 3. Enable Email Authentication

1. In your Supabase dashboard, go to **Authentication** > **Providers**
2. Find **Email** in the list
3. Make sure it's **Enabled** (it should be by default)
4. Scroll down and disable "Confirm email" for easier testing (optional)
5. Click "Save"

### 4. Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy these two values:
   - **Project URL** (looks like `https://xxx.supabase.co`)
   - **anon public** key (long string under "Project API keys")

### 5. Configure Local Environment

1. In the project directory, create a `.env.local` file:

```bash
cp .env.example .env.local
```

2. Open `.env.local` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 6. Configure Admin Emails

1. Open `src/config/admins.js`
2. Replace the example emails with the emails of users who should be admins:

```javascript
export const ADMIN_EMAILS = [
  'friend1@example.com',
  'friend2@example.com',
  'friend3@example.com',
  'friend4@example.com',
]
```

### 7. Install Dependencies and Run

```bash
# Install dependencies (use --cache flag if you have npm permission issues)
npm install --cache /tmp/npm-cache

# Start development server
npm run dev
```

The app should now be running at [http://localhost:5173](http://localhost:5173)

## Usage

### Creating an Account

1. Open the app and click "Sign up"
2. Enter your email, password, and display name
3. Click "Sign Up"

### Creating Predictions

1. Fill in the "Prediction" text field
2. Select a resolution date
3. Click "Create Prediction"
4. Your prediction is now locked and visible to everyone

### Resolving Predictions (Admin Only)

1. If you're an admin, you'll see a "Resolve" button on unresolved predictions
2. Click "Resolve"
3. Choose "Correct" or "Incorrect"
4. The prediction updates instantly for all users
5. The leaderboard recalculates automatically

### Leaderboard Rankings

- **1st Place**: Gold name with crown icon
- **2nd Place**: Silver rank number
- **3rd Place**: Bronze rank number
- **Accuracy**: Calculated as (correct / resolved) × 100
- **Streak**: Consecutive correct predictions

## Project Structure

```
src/
├── config/
│   ├── supabase.js       # Supabase client initialization
│   └── admins.js         # Admin email configuration
├── hooks/
│   ├── useAuth.js        # Authentication state management
│   ├── usePredictions.js # Predictions CRUD + real-time
│   └── useLeaderboard.js # Leaderboard calculations
├── components/
│   ├── AuthForm.jsx              # Login/signup form
│   ├── ParallaxBackground.jsx    # Animated dot grid background
│   ├── Header.jsx                # App header with logout
│   ├── PredictionForm.jsx        # Create prediction form
│   ├── PredictionCard.jsx        # Individual prediction display
│   ├── PredictionList.jsx        # Grid of predictions
│   ├── Leaderboard.jsx           # Rankings display
│   └── ResolvePredictionModal.jsx # Admin resolve UI
├── utils/
│   └── leaderboard.js    # Accuracy calculation logic
├── App.jsx               # Main app component
├── main.jsx              # React entry point
└── index.css             # Global styles + Tailwind
```

## Design System

### Colors

- **Background**: `#0a0a0a` (near-black)
- **Card Background**: `#111111`
- **Borders**: `#1f1f1f`
- **Success (Correct)**: `#00C853`
- **Error (Incorrect)**: `#FF5252`
- **Gold (1st Place)**: `#FFD700`
- **Silver (2nd Place)**: `#C0C0C0`
- **Bronze (3rd Place)**: `#CD7F32`

### Typography

- **Font**: Inter (400, 500, 600, 700 weights)
- **Large Stats**: text-4xl font-bold
- **Labels**: text-sm text-gray-400

### Animations

- All transitions: 150ms or less
- No bouncing or playful effects
- Subtle hover states

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Deployment

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy

### Option 2: Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard

## Troubleshooting

### "Missing Supabase environment variables"

- Make sure `.env.local` exists with correct values
- Restart dev server after creating `.env.local`
- Variable names must start with `VITE_`

### "Permission denied" npm errors

- Use `--cache /tmp/npm-cache` flag with npm commands
- Example: `npm install --cache /tmp/npm-cache`

### Predictions not showing

- Check browser console for errors
- Verify RLS policies are set up in Supabase
- Make sure user is authenticated

### Can't resolve predictions

- Verify your email is in the `ADMIN_EMAILS` array in `src/config/admins.js`
- Emails are case-sensitive
- Restart dev server after changing admins.js

## License

MIT
