// Centralized Supabase client for KrishiSevak
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client only if credentials are available
export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
    return supabase !== null;
};

// Get project ID for constructing URLs
export const getProjectId = (): string => {
    return import.meta.env.VITE_SUPABASE_PROJECT_ID || '';
};

// Get Supabase URL
export const getSupabaseUrl = (): string => {
    return import.meta.env.VITE_SUPABASE_URL || '';
};
