import { createContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

/**
 * Provides auth state + methods.
 * When Supabase env vars are absent supabase=null:
 *   configured=false, user=null, loading=false immediately.
 * All auth methods are safe no-ops in that state.
 */
export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null);
  const [session, setSession]     = useState(null);
  const [loading, setLoading]     = useState(Boolean(supabase));
  const [resetMode, setResetMode] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        setResetMode(event === "PASSWORD_RECOVERY");
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    if (!supabase) return { error: { message: "Auth not configured" } };
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email, password) => {
    if (!supabase) return { error: { message: "Auth not configured" } };
    return supabase.auth.signUp({ email, password });
  };

  const resetPassword = async (email) => {
    if (!supabase) return { error: { message: "Auth not configured" } };
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
  };

  const updatePassword = async (password) => {
    if (!supabase) return { error: { message: "Auth not configured" } };
    const result = await supabase.auth.updateUser({ password });
    if (!result.error) setResetMode(false);
    return result;
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setResetMode(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        signIn,
        signUp,
        resetPassword,
        updatePassword,
        signOut,
        loading,
        configured: Boolean(supabase),
        resetMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
