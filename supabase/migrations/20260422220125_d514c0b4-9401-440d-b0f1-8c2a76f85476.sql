-- Create health_settings table
CREATE TABLE public.health_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  publish_cap integer NOT NULL DEFAULT 3,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.health_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own health settings" ON public.health_settings
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Add error_type column to queue_items
ALTER TABLE public.queue_items ADD COLUMN IF NOT EXISTS error_type text;