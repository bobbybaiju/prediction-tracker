import { useMemo } from 'react'
import { generateLeaderboard } from '../utils/leaderboard'

export const useLeaderboard = (predictions, profiles) => {
  const leaderboard = useMemo(() => {
    return generateLeaderboard(predictions, profiles)
  }, [predictions, profiles])

  return { leaderboard }
}
