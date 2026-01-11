import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'

export const usePredictions = (user) => {
  const [predictions, setPredictions] = useState([])
  const [profiles, setProfiles] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return

    fetchPredictions()
    fetchProfiles()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('predictions_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'predictions' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPredictions((prev) => [payload.new, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setPredictions((prev) =>
              prev.map((p) => (p.id === payload.new.id ? payload.new : p))
            )
          } else if (payload.eventType === 'DELETE') {
            setPredictions((prev) => prev.filter((p) => p.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const fetchPredictions = async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('predictions')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setPredictions(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchProfiles = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')

      if (fetchError) throw fetchError

      const profilesMap = {}
      data?.forEach((profile) => {
        profilesMap[profile.id] = profile
      })
      setProfiles(profilesMap)
    } catch (err) {
      console.error('Error fetching profiles:', err)
    }
  }

  const createPrediction = async (text, resolutionDate) => {
    try {
      setError(null)
      const { data, error: insertError } = await supabase
        .from('predictions')
        .insert([
          {
            user_id: user.id,
            text,
            resolution_date: resolutionDate,
            resolved: false,
            correct: null,
          },
        ])
        .select()

      if (insertError) throw insertError

      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err.message }
    }
  }

  const resolvePrediction = async (predictionId, correct) => {
    try {
      setError(null)
      const { data, error: updateError } = await supabase
        .from('predictions')
        .update({
          resolved: true,
          correct,
          resolved_at: new Date().toISOString(),
        })
        .eq('id', predictionId)
        .select()

      if (updateError) throw updateError

      return { data, error: null }
    } catch (err) {
      setError(err.message)
      return { data: null, error: err.message }
    }
  }

  return {
    predictions,
    profiles,
    loading,
    error,
    createPrediction,
    resolvePrediction,
    refetch: fetchPredictions,
  }
}
