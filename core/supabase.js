import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://zsgigvswnwudlpanpodl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzZ2lndnN3bnd1ZGxwYW5wb2RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjUxNTgsImV4cCI6MjA5MTMwMTE1OH0.cW0m3EyXXNcYHwPxCoBazYPbAuwCZgHdGarBMqEAM6k';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: { schema: 'sap_mm' }
});
