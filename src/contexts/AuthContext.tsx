
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'teacher' | 'student' | 'hr' | 'finance';
  avatar_url?: string;
  phone?: string;
  department_id?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData?: { full_name?: string; role?: string }) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (updates: any) => Promise<{ error: any }>;
  hasRole: (role: string | string[]) => boolean;
  canAccess: (requiredRole: 'admin' | 'teacher' | 'student' | 'hr' | 'finance') => boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  isHR: boolean;
  isFinance: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Don't await here to avoid blocking
          fetchProfile(session.user.id).finally(() => {
            if (isMounted) setLoading(false);
          });
        } else {
          setProfile(null);
          setLoading(false);
        }

        // Handle auth events - only show toasts for user-initiated actions
        if (event === 'SIGNED_OUT') {
          toast({
            title: "Déconnexion",
            description: "À bientôt !",
          });
        } else if (event === 'PASSWORD_RECOVERY') {
          toast({
            title: "Email de récupération envoyé",
            description: "Vérifiez votre boîte mail",
          });
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!isMounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    // Timeout fallback to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 3000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    return { error };
  };

  const signUp = async (email: string, password: string, userData: { full_name?: string; role?: string } = {}) => {
    setLoading(true);
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: userData.full_name || '',
          role: userData.role || 'student'
        }
      }
    });
    setLoading(false);
    return { error };
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setProfile(null);
    setLoading(false);
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    return { error };
  };

  const updateProfile = async (updates: any) => {
    if (!user) return { error: new Error('No user logged in') };
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
    
    if (!error) {
      await fetchProfile(user.id);
    }
    
    return { error };
  };

  const hasRole = (role: string | string[]) => {
    if (!profile) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(profile.role);
  };

  const canAccess = (requiredRole: 'admin' | 'teacher' | 'student' | 'hr' | 'finance') => {
    if (!profile) return false;
    
    const roleHierarchy = {
      admin: ['admin'],
      hr: ['admin', 'hr'],
      finance: ['admin', 'finance'],
      teacher: ['admin', 'teacher'],
      student: ['admin', 'teacher', 'student']
    };
    
    return roleHierarchy[requiredRole].includes(profile.role);
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    hasRole,
    canAccess,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
    isTeacher: profile?.role === 'teacher',
    isStudent: profile?.role === 'student',
    isHR: profile?.role === 'hr',
    isFinance: profile?.role === 'finance'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
