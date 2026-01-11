import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, displayName) => {
    try {
      setError(null)
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError

      // Create profile after signup
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              display_name: displayName || email.split('@')[0],
            },
          ])

        if (profileError) throw profileError
      }

      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err.message }
    }
  }

  const signIn = async (email, password) => {
    try {
      setError(null)
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err.message }
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
    } catch (err) {
      setError(err.message)
    }
  }

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
  }
}
