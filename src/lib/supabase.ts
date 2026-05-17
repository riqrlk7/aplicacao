import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vzhgqksbievvfhrgqacb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6aGdxa3NiaWV2dmZocmdxYWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMTg5NTUsImV4cCI6MjA5NDU5NDk1NX0.3JvaW6SoZiCWodPaoQ5yxPJFR5rPgu-flpxTi38eUb4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
