# Project Memory

## Core
Dark mode SaaS app. Primary blue, bg near-black. Glass cards + grid-bg.
Lovable Cloud backend (Supabase). RLS on all tables. user_roles separate table.
Portuguese UI. Never change approved visual/layout. Font-mono for labels.
Theme system: blue/red/gray/purple/gold via data-theme + CSS vars.

## Memories
- [Auth system](mem://features/auth) — Real Supabase auth with profiles + user_roles. has_role() SECURITY DEFINER.
- [Database schema](mem://features/schema) — 11 tables: profiles, user_roles, instagram_accounts, library_folders, media_items, saved_captions, queue_items, loops, stories, warmup_accounts, funnels. Storage bucket: media (private, RLS by user_id path).
- [Data hooks](mem://features/hooks) — useAccounts, useFolders, useCaptions, useQueueItems, useLoops, useStories, useWarmupAccounts, useFunnels, useMediaUpload, useMediaItems
- [PostarPage refactor](mem://features/postar) — Refactored into components: UploadSection, CaptionsSection, ScheduleSection, AdvancedSection, QueuePreviewSection. Real upload, library modal, queue creation.
- [Legitimate processing](mem://constraints/processing) — No anti-detection/evasion features. "Anti-detecção IA" renamed to "Padronização inteligente". Processing = metadata removal, normalization, compatibility.
