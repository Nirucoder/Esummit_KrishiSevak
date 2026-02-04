// Authentication Service for KrishiSevak Platform
// Handles user authentication, registration, and session management

import { supabase, isSupabaseConfigured, getProjectId } from '../lib/supabaseClient';

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
  private isDemoMode: boolean;
  private listeners: ((user: AuthUser | null) => void)[] = [];

  // Demo users for testing when Supabase is not configured
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

  constructor() {
    // Enable demo mode only if Supabase is not configured
    this.isDemoMode = !isSupabaseConfigured();

    if (this.isDemoMode) {
      console.log('🌾 KrishiSevak running in demo mode (Supabase not configured)');
    } else {
      console.log('🌾 KrishiSevak connected to Supabase');
      // Initialize session from storage
      this.initializeSession();
    }
  }

  private async initializeSession() {
    if (!supabase) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        this.accessToken = session.access_token;
        this.currentUser = this.mapSupabaseUser(session.user);
        this.notifyListeners();
      }
    } catch (error) {
      console.warn('Failed to restore session:', error);
    }
  }

  private mapSupabaseUser(user: any): AuthUser {
    return {
      id: user.id,
      email: user.email || '',
      phone: user.user_metadata?.phone || user.phone,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      emailVerified: user.email_confirmed_at != null,
      createdAt: user.created_at,
    };
  }

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
      this.notifyListeners();

      return {
        success: true,
        user: newUser,
        accessToken: this.accessToken
      };
    }

    try {
      if (!supabase) {
        throw new Error('Supabase not initialized');
      }

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (authData.user) {
        // Check if email confirmation is required
        if (!authData.session) {
          return {
            success: true,
            error: 'Please check your email to confirm your account.',
          };
        }

        this.accessToken = authData.session.access_token;
        this.currentUser = this.mapSupabaseUser(authData.user);
        this.notifyListeners();

        return {
          success: true,
          user: this.currentUser,
          accessToken: this.accessToken,
        };
      }

      return { success: false, error: 'Sign up failed' };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  }

  // Sign in existing user
  async signIn(data: SignInData): Promise<AuthResponse> {
    if (this.isDemoMode) {
      // Demo mode: Check against demo users or auto-create
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
        // Auto-create user for easy testing in demo mode
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
        throw new Error('Supabase not initialized');
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
        this.currentUser = this.mapSupabaseUser(authData.user);
        this.notifyListeners();

        return {
          success: true,
          user: this.currentUser,
          accessToken: this.accessToken,
        };
      }

      return { success: false, error: 'Authentication failed' };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<AuthResponse> {
    if (this.isDemoMode) {
      return {
        success: false,
        error: 'Google sign-in not available in demo mode. Use farmer@demo.com / demo123'
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
    } catch (error: any) {
      console.error('Google sign in error:', error);
      return {
        success: false,
        error: `Google sign-in failed: ${error.message}`
      };
    }
  }

  // Sign out
  async signOut(): Promise<{ success: boolean; error?: string }> {
    if (this.isDemoMode) {
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
      this.notifyListeners();

      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Force clear session even if Supabase fails
      this.currentUser = null;
      this.accessToken = null;
      this.notifyListeners();
      return { success: true };
    }
  }

  // Get current session
  async getCurrentSession(): Promise<AuthResponse> {
    if (this.isDemoMode) {
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
        this.currentUser = this.mapSupabaseUser(session.user);

        return {
          success: true,
          user: this.currentUser,
          accessToken: this.accessToken,
        };
      }

      return { success: false, error: 'No active session' };
    } catch (error: any) {
      console.error('Session check error:', error);
      return { success: false, error: error.message };
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    if (this.isDemoMode) {
      return { success: false, error: 'Password reset not available in demo mode' };
    }

    try {
      if (!supabase) {
        throw new Error('Supabase not initialized');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update password
  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    if (this.isDemoMode) {
      return { success: false, error: 'Password update not available in demo mode' };
    }

    try {
      if (!supabase) {
        throw new Error('Supabase not initialized');
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error: any) {
      console.error('Password update error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update profile
  async updateProfile(updates: { name?: string; phone?: string }): Promise<{ success: boolean; error?: string }> {
    if (this.isDemoMode) {
      if (this.currentUser) {
        this.currentUser = { ...this.currentUser, ...updates };
        this.notifyListeners();
      }
      return { success: true };
    }

    try {
      if (!supabase) {
        throw new Error('Supabase not initialized');
      }

      const { error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) {
        throw error;
      }

      if (this.currentUser) {
        this.currentUser = { ...this.currentUser, ...updates };
        this.notifyListeners();
      }

      return { success: true };
    } catch (error: any) {
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

  // Check if running in demo mode
  isInDemoMode(): boolean {
    return this.isDemoMode;
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    // Always register local listener
    this.listeners.push(callback);

    // If user already exists, fire callback immediately
    if (this.currentUser) {
      callback(this.currentUser);
    }

    // If Supabase is configured, also listen to Supabase auth events
    if (!this.isDemoMode && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            this.accessToken = session.access_token;
            this.currentUser = this.mapSupabaseUser(session.user);
            callback(this.currentUser);
          } else if (event === 'SIGNED_OUT') {
            this.currentUser = null;
            this.accessToken = null;
            callback(null);
          } else if (event === 'TOKEN_REFRESHED' && session) {
            this.accessToken = session.access_token;
          }
        }
      );

      return () => {
        this.listeners = this.listeners.filter(l => l !== callback);
        subscription.unsubscribe();
      };
    }

    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }
}

export const authService = new AuthService();