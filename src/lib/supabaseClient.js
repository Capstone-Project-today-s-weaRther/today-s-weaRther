import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://zdjjhsxodfbupqsmxfrt.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_EDXF4F1sMPYrQghSw0xi5A_T50czMJ3';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);