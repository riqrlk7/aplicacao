import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rcjjmpkdfjrqcgjnzbik.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjamptcGtkZmpycWNnam56YmlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNTg5NjcsImV4cCI6MjA5NDYzNDk2N30.OlDzAQE9VK5vG7zMHl90QgIxUrWK-dvopCfIpmMUvWo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
