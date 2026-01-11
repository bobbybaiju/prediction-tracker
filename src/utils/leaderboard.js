export const calculateUserStats = (userId, predictions) => {
  const userPredictions = predictions.filter((p) => p.user_id === userId)
  const resolved = userPredictions.filter((p) => p.resolved)
  const correct = resolved.filter((p) => p.correct)

  const accuracy = resolved.length > 0 ? (correct.length / resolved.length) * 100 : 0

  // Calculate current streak (consecutive correct predictions)
  const sortedResolved = resolved
    .sort((a, b) => new Date(b.resolved_at) - new Date(a.resolved_at))

  let streak = 0
  for (const pred of sortedResolved) {
    if (pred.correct) {
      streak++
    } else {
      break
    }
  }

  return {
    userId,
    total: userPredictions.length,
    resolved: resolved.length,
    correct: correct.length,
    accuracy: parseFloat(accuracy.toFixed(1)),
    streak,
  }
}

export const generateLeaderboard = (predictions, profiles) => {
  const userIds = [...new Set(predictions.map((p) => p.user_id))]

  const leaderboard = userIds.map((userId) => {
    const stats = calculateUserStats(userId, predictions)
    const profile = profiles[userId]

    return {
      ...stats,
      displayName: profile?.display_name || profile?.email || 'Unknown',
      email: profile?.email,
    }
  })

  // Sort by accuracy (descending), then by correct count (descending)
  leaderboard.sort((a, b) => {
    if (b.accuracy === a.accuracy) {
      return b.correct - a.correct
    }
    return b.accuracy - a.accuracy
  })

  return leaderboard
}
