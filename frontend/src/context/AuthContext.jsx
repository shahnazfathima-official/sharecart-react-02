import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const formatUser = (sessionUser) => {
      if (!sessionUser) return null;
      return {
        ...sessionUser,
        ...sessionUser.user_metadata, 
        id: sessionUser.id
      };
    };

    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(formatUser(session?.user));
      setIsLoading(false);
    });

    // Listen to login/logout events real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(formatUser(session?.user));
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Secure real login
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  // Secure real signup
  const signup = async (email, password, metadata) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateUser = () => {}; // Stub for backward compatibility if components use it

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
export default AuthContext;
