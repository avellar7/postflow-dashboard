-- Create private media storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', false);

-- RLS: users can view own files
CREATE POLICY "Users can view own media files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- RLS: users can upload own files
CREATE POLICY "Users can upload own media files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- RLS: users can update own files
CREATE POLICY "Users can update own media files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- RLS: users can delete own files
CREATE POLICY "Users can delete own media files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add columns to media_items
ALTER TABLE public.media_items
ADD COLUMN IF NOT EXISTS file_size bigint,
ADD COLUMN IF NOT EXISTS mime_type text,
ADD COLUMN IF NOT EXISTS duration_seconds numeric,
ADD COLUMN IF NOT EXISTS processing_status text NOT NULL DEFAULT 'raw',
ADD COLUMN IF NOT EXISTS processing_log jsonb NOT NULL DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS processed_file_path text,
ADD COLUMN IF NOT EXISTS original_file_path text;

-- Add columns to queue_items
ALTER TABLE public.queue_items
ADD COLUMN IF NOT EXISTS processing_options jsonb NOT NULL DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS output_media_id uuid REFERENCES public.media_items(id),
ADD COLUMN IF NOT EXISTS error_message text;