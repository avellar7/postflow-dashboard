
-- Tabela saved_links
CREATE TABLE public.saved_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  label text,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.saved_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own links" ON public.saved_links
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Tabela saved_ctas
CREATE TABLE public.saved_ctas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  label text,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.saved_ctas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own ctas" ON public.saved_ctas
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Colunas extras em stories
ALTER TABLE public.stories ADD COLUMN link_url text;
ALTER TABLE public.stories ADD COLUMN cta_text text;
