import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  import.meta.env?.VITE_SUPABASE_URL || 
  import.meta.env?.NEXT_PUBLIC_SUPABASE_URL || 
  'https://bpjokrefslllioxtdxce.supabase.co';

const supabaseAnonKey = 
  import.meta.env?.VITE_SUPABASE_ANON_KEY || 
  import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwam9rcmVmc2xsbGlveHRkeGNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyNDQ2NzgsImV4cCI6MjEwNzgyMDY3OH0.CsDcc0DVZVgSSwlD-zMfbQZJOFH3ajmSPVqOMj39VGo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
