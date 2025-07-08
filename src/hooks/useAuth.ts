import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'teacher' | 'student' | 'hr' | 'finance';
  avatar_url?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          setTimeout(async () => {
            try {
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (error) {
                console.error('Error fetching profile:', error);
              } else {
                setProfile(profileData);
              }
            } catch (error) {
              console.error('Error in profile fetch:', error);
            }
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch user profile for initial session
        setTimeout(async () => {
          try {
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (error) {
              console.error('Error fetching profile:', error);
            } else {
              setProfile(profileData);
            }
          } catch (error) {
            console.error('Error in profile fetch:', error);
          }
          setLoading(false);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive"
      });
      return { error: { message } };
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<UserProfile> = {}) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: userData.full_name,
            role: userData.role || 'student'
          }
        }
      });
      
      if (error) {
        toast({
          title: "Erreur d'inscription",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      toast({
        title: "Inscription réussie",
        description: "Vérifiez votre email pour confirmer votre compte"
      });
      
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive"
      });
      return { error: { message } };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Erreur de déconnexion",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      setUser(null);
      setSession(null);
      setProfile(null);
      
      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive"
      });
      return { error: { message } };
    }
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

  return {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    hasRole,
    canAccess,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
    isTeacher: profile?.role === 'teacher',
    isStudent: profile?.role === 'student',
    isHR: profile?.role === 'hr',
    isFinance: profile?.role === 'finance'
  };
}