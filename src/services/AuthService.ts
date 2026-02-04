// Authentication Service for KrishiSevak Platform
// Handles user authentication, registration, and session management

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with fallback error handling
let supabase: any = null;
let supabaseConnected = false;

try {
  // Simple fallback initialization
  supabase = null; // Temporarily disable Supabase to ensure demo mode
  supabaseConnected = false;
} catch (error) {
  console.warn('Supabase connection failed, running in demo mode:', error);
  supabaseConnected = false;
}

export interface AuthUser {
  id: string;
  email: string;
  phone?: string;
  name: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  accessToken?: string;
  error?: string;
}

class AuthService {
  private currentUser: AuthUser | null = null;
  private accessToken: string | null = null;
  private isDemoMode = !supabaseConnected; // Enable demo mode if Supabase is not connected

  // Demo users for testing
  private demoUsers = [
    {
      email: 'farmer@demo.com',
      password: 'demo123',
      id: 'demo-user-1',
      name: 'Demo Farmer',
      phone: '+91 98765 43210',
      emailVerified: true,
      createdAt: new Date().toISOString()
    },
    {
      email: 'admin@demo.com',
      password: 'admin123',
      id: 'demo-user-2',
      name: 'Admin User',
      phone: '+91 98765 43211',
      emailVerified: true,
      createdAt: new Date().toISOString()
    }
  ];

  private listeners: ((user: AuthUser | null) => void)[] = [];

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  // Sign up new user
  async signUp(data: SignUpData): Promise<AuthResponse> {
    if (this.isDemoMode) {
      // Demo mode: Create a new demo user
      const newUser: AuthUser = {
        id: `demo-user-${Date.now()}`,
        email: data.email,
        name: data.name,
        phone: data.phone,
        emailVerified: true,
        createdAt: new Date().toISOString()
      };

      this.currentUser = newUser;
      this.accessToken = 'demo-token-' + Date.now();

      this.notifyListeners(); // Notify listeners of state change

      return {
        success: true,
        user: newUser,
        accessToken: this.accessToken
      };
    }

    try {
      // First create the user via the server endpoint to auto-confirm email
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-cc69ee2d/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Sign up failed');
      }

      const result = await response.json();

      if (result.success) {
        // Now sign in the user
        return await this.signIn({ email: data.email, password: data.password });
      }

      return { success: false, error: result.error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  }

  // Sign in existing user
  async signIn(data: SignInData): Promise<AuthResponse> {
    if (this.isDemoMode || !supabaseConnected) {
      // Demo mode: Check against demo users
      const demoUser = this.demoUsers.find(user =>
        user.email === data.email && user.password === data.password
      );

      if (demoUser) {
        const authUser: AuthUser = {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          phone: demoUser.phone,
          emailVerified: demoUser.emailVerified,
          createdAt: demoUser.createdAt
        };

        this.currentUser = authUser;
        this.accessToken = 'demo-token-' + Date.now();

        this.notifyListeners();

        return {
          success: true,
          user: authUser,
          accessToken: this.accessToken
        };
      } else {
        // Auto-create user for any other credentials to allow easy testing
        const nameFromEmail = data.email.split('@')[0];
        const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

        const dynamicUser: AuthUser = {
          id: `user-${Date.now()}`,
          email: data.email,
          name: formattedName,
          phone: '',
          emailVerified: true,
          createdAt: new Date().toISOString()
        };

        this.currentUser = dynamicUser;
        this.accessToken = 'demo-token-' + Date.now();

        this.notifyListeners();

        return {
          success: true,
          user: dynamicUser,
          accessToken: this.accessToken
        };
      }
    }

    try {
      if (!supabase) {
        throw new Error('Supabase not initialized - running in demo mode');
      }

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw error;
      }

      if (authData.session && authData.user) {
        this.accessToken = authData.session.access_token;
        this.currentUser = {
          id: authData.user.id,
          email: authData.user.email!,
          phone: authData.user.user_metadata?.phone,
          name: authData.user.user_metadata?.name || 'Unknown',
          emailVerified: authData.user.email_confirmed_at != null,
          createdAt: authData.user.created_at,
        };

        // Supabase's onAuthStateChange handler (registered in constructor/init usually, 
        // but here we are registering it in onAuthStateChange method)
        // actually, the subscription handle in onAuthStateChange handles the Supabase events.
        // So we don't need to manually notify for Supabase flows if onAuthStateChange is wired up correctly via Supabase.

        return {
          success: true,
          user: this.currentUser,
          accessToken: this.accessToken,
        };
      }

      return { success: false, error: 'Authentication failed' };
    } catch (error) {
      console.error('Sign in error:', error);
      // Fallback to demo mode if Supabase fails
      console.log('Falling back to demo mode...');
      this.isDemoMode = true;
      return await this.signIn(data); // Retry in demo mode
    }
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<AuthResponse> {
    if (this.isDemoMode || !supabaseConnected) {
      return {
        success: false,
        error: 'Google sign-in not available in demo mode. Use farmer@demo.com / demo123 or admin@demo.com / admin123'
      };
    }

    try {
      if (!supabase) {
        throw new Error('Supabase not initialized');
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        throw error;
      }

      // OAuth sign-in will redirect, so we return success
      return { success: true };
    } catch (error) {
      console.error('Google sign in error:', error);
      return {
        success: false,
        error: `Google sign-in failed: ${error.message}. Please ensure Google OAuth is configured at https://supabase.com/docs/guides/auth/social-login/auth-google`
      };
    }
  }

  // Sign out
  async signOut(): Promise<{ success: boolean; error?: string }> {
    if (this.isDemoMode || !supabaseConnected) {
      // Demo mode: Just clear the current user
      this.currentUser = null;
      this.accessToken = null;
      this.notifyListeners();
      return { success: true };
    }

    try {
      if (!supabase) {
        throw new Error('Supabase not initialized');
      }

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      this.currentUser = null;
      this.accessToken = null;

      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      // Force clear session even if Supabase fails
      this.currentUser = null;
      this.accessToken = null;
      return { success: true };
    }
  }

  // Get current session
  async getCurrentSession(): Promise<AuthResponse> {
    if (this.isDemoMode || !supabaseConnected) {
      // Demo mode: Return current user if exists
      if (this.currentUser && this.accessToken) {
        return {
          success: true,
          user: this.currentUser,
          accessToken: this.accessToken
        };
      }
      return { success: false, error: 'No active session' };
    }

    try {
      if (!supabase) {
        throw new Error('Supabase not initialized');
      }

      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      if (session && session.user) {
        this.accessToken = session.access_token;
        this.currentUser = {
          id: session.user.id,
          email: session.user.email!,
          phone: session.user.user_metadata?.phone,
          name: session.user.user_metadata?.name || 'Unknown',
          emailVerified: session.user.email_confirmed_at != null,
          createdAt: session.user.created_at,
        };

        return {
          success: true,
          user: this.currentUser,
          accessToken: this.accessToken,
        };
      }

      return { success: false, error: 'No active session' };
    } catch (error) {
      console.error('Session check error:', error);
      // Fallback to demo mode
      this.isDemoMode = true;
      return { success: false, error: 'No active session - running in demo mode' };
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update password
  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Password update error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update profile
  async updateProfile(updates: { name?: string; phone?: string }): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) {
        throw error;
      }

      // Update current user data
      if (this.currentUser) {
        this.currentUser = {
          ...this.currentUser,
          ...updates,
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null && this.accessToken !== null;
  }

  // Get current user
  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  // Get access token
  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    if (this.isDemoMode || !supabaseConnected) {
      // Demo mode: Register listener manually
      this.listeners.push(callback);
      // Immediately fire with current state if available to match behavior
      if (this.currentUser) {
        callback(this.currentUser);
      }
      return () => {
        this.listeners = this.listeners.filter(l => l !== callback);
      };
    }

    try {
      if (!supabase) {
        throw new Error('Supabase not initialized');
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            this.accessToken = session.access_token;
            this.currentUser = {
              id: session.user.id,
              email: session.user.email!,
              phone: session.user.user_metadata?.phone,
              name: session.user.user_metadata?.name || 'Unknown',
              emailVerified: session.user.email_confirmed_at != null,
              createdAt: session.user.created_at,
            };
            callback(this.currentUser);
          } else if (event === 'SIGNED_OUT') {
            this.currentUser = null;
            this.accessToken = null;
            callback(null);
          }
        }
      );

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Auth state change listener error:', error);
      return () => { }; // Return no-op function
    }
  }
}

export const authService = new AuthService();