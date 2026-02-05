-- LabLudus Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  total_missions_completed INTEGER DEFAULT 0,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- PROGRESS TABLE (mission completion)
-- ============================================
CREATE TABLE public.progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mission_id TEXT NOT NULL,
  zone_id INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  stars INTEGER DEFAULT 0 CHECK (stars >= 0 AND stars <= 3),
  xp_earned INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 1,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, mission_id)
);

-- Enable RLS
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

-- Progress policies
CREATE POLICY "Users can view own progress" ON public.progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.progress
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- SAVED_CODE TABLE (user code snapshots)
-- ============================================
CREATE TABLE public.saved_code (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mission_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, mission_id, file_name)
);

-- Enable RLS
ALTER TABLE public.saved_code ENABLE ROW LEVEL SECURITY;

-- Saved code policies
CREATE POLICY "Users can view own code" ON public.saved_code
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own code" ON public.saved_code
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own code" ON public.saved_code
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own code" ON public.saved_code
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update profile XP and level
CREATE OR REPLACE FUNCTION public.add_xp(
  p_user_id UUID,
  p_xp INTEGER
)
RETURNS TABLE(new_xp INTEGER, new_level INTEGER, leveled_up BOOLEAN) AS $$
DECLARE
  current_xp INTEGER;
  current_level INTEGER;
  xp_for_next_level INTEGER;
  did_level_up BOOLEAN := false;
BEGIN
  -- Get current stats
  SELECT xp, level INTO current_xp, current_level
  FROM public.profiles WHERE id = p_user_id;
  
  -- Add XP
  current_xp := current_xp + p_xp;
  
  -- Check for level up (100 XP per level, increases by level)
  xp_for_next_level := current_level * 100;
  
  WHILE current_xp >= xp_for_next_level LOOP
    current_xp := current_xp - xp_for_next_level;
    current_level := current_level + 1;
    did_level_up := true;
    xp_for_next_level := current_level * 100;
  END LOOP;
  
  -- Update profile
  UPDATE public.profiles 
  SET xp = current_xp, level = current_level, updated_at = now()
  WHERE id = p_user_id;
  
  RETURN QUERY SELECT current_xp, current_level, did_level_up;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_progress_user_id ON public.progress(user_id);
CREATE INDEX idx_progress_mission_id ON public.progress(mission_id);
CREATE INDEX idx_saved_code_user_id ON public.saved_code(user_id);
CREATE INDEX idx_profiles_xp ON public.profiles(xp DESC);
