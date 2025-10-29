-- Create work_sessions table
CREATE TABLE public.work_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  work_date date NOT NULL,
  location text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  hours_worked decimal(5,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  paid_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.work_sessions ENABLE ROW LEVEL SECURITY;

-- Workers can view their own sessions
CREATE POLICY "Workers can view own sessions"
  ON public.work_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Workers can insert their own sessions
CREATE POLICY "Workers can insert own sessions"
  ON public.work_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Workers can update their own sessions (for future edit feature)
CREATE POLICY "Workers can update own sessions"
  ON public.work_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Bosses can view sessions from their workers
CREATE POLICY "Bosses can view workers sessions"
  ON public.work_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid()
      AND role = 'boss'
      AND work_sessions.user_id IN (
        SELECT id FROM public.user_profiles
        WHERE company_id = auth.uid()
      )
    )
  );

-- Bosses can update sessions (to mark as paid)
CREATE POLICY "Bosses can update workers sessions"
  ON public.work_sessions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid()
      AND role = 'boss'
      AND work_sessions.user_id IN (
        SELECT id FROM public.user_profiles
        WHERE company_id = auth.uid()
      )
    )
  );

-- Create index for faster queries
CREATE INDEX idx_work_sessions_user_id ON public.work_sessions(user_id);
CREATE INDEX idx_work_sessions_work_date ON public.work_sessions(work_date);
CREATE INDEX idx_work_sessions_status ON public.work_sessions(status);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_work_session_updated
  BEFORE UPDATE ON public.work_sessions
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();