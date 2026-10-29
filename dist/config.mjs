/**
 * Supabase connection for ARM / INSIGHT.
 * Leave empty → app runs fully offline with browser localStorage.
 *
 * After creating a project at https://supabase.com :
 * 1. Project Settings → API → copy Project URL and anon public key
 * 2. Paste them below
 * 3. Run supabase/schema.sql in the SQL Editor
 */
export const SUPABASE_URL = 'https://hkieccagbunzacwyyozy.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhraWVjY2FnYnVuemFjd3l5b3p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyNTQ4MjksImV4cCI6MjEwODgzMDgyOX0.4Gu0_Zd5qRMSN9HgE6olvYDPNk2v1cmHpGiGG1vv4Go';

/** Shared workspace id used by the class demo (one collaborative document). */
export const WORKSPACE_ID = 'default';
