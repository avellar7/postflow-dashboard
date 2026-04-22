ALTER TABLE public.instagram_accounts
  ADD COLUMN IF NOT EXISTS instagram_user_id text,
  ADD COLUMN IF NOT EXISTS access_token text,
  ADD COLUMN IF NOT EXISTS token_type text,
  ADD COLUMN IF NOT EXISTS permissions jsonb,
  ADD COLUMN IF NOT EXISTS connected_at timestamp with time zone;

CREATE UNIQUE INDEX IF NOT EXISTS instagram_accounts_user_ig_unique
  ON public.instagram_accounts (user_id, instagram_user_id)
  WHERE instagram_user_id IS NOT NULL;