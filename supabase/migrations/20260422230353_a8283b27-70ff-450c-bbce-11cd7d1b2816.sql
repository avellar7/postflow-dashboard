ALTER TABLE public.instagram_accounts
  ADD CONSTRAINT instagram_accounts_user_id_ig_user_id_key
  UNIQUE (user_id, instagram_user_id);