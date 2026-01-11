import { Crown, TrendingUp, Share2 } from 'lucide-react'
import { useState } from 'react'
import { ShareCardModal } from './ShareCardModal'

export const Leaderboard = ({ leaderboard }) => {
  const [shareData, setShareData] = useState(null)
  if (leaderboard.length === 0) {
    return (
      <div className="bg-dark-card border border-dark-border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
        <p className="text-gray-400 text-sm text-center py-8">
          No data available yet
        </p>
      </div>
    )
  }

  const getRankStyle = (rank) => {
    if (rank === 1) return 'text-gold'
    if (rank === 2) return 'text-silver'
    if (rank === 3) return 'text-bronze'
    return 'text-gray-400'
  }

  const getNameStyle = (rank) => {
    if (rank === 1) return 'text-gold font-bold'
    return 'text-white'
  }

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5" />
        <h2 className="text-xl font-bold">Leaderboard</h2>
      </div>

      <div className="space-y-3">
        {leaderboard.map((user, index) => {
          const rank = index + 1

          return (
            <div
              key={user.userId}
              className="flex items-center gap-4 p-4 bg-dark-bg border border-dark-border rounded transition-fast hover:border-gray-700"
            >
              {/* Rank */}
              <div
                className={`text-2xl font-bold w-8 text-center ${getRankStyle(rank)}`}
              >
                {rank}
              </div>

              {/* Name */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${getNameStyle(rank)}`}>
                    {user.displayName}
                  </span>
                  {rank === 1 && <Crown className="w-4 h-4 text-gold" />}
                </div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>

              {/* Stats */}
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {user.resolved > 0 ? `${user.accuracy}%` : '—'}
                </div>
                <div className="text-xs text-gray-400">
                  {user.correct}/{user.resolved} correct
                </div>
              </div>

              {/* Streak */}
              {user.streak > 0 && (
                <div className="text-right min-w-[60px]">
                  <div className="text-sm font-medium text-success">
                    {user.streak} 🔥
                  </div>
                  <div className="text-xs text-gray-500">streak</div>
                </div>
              )}

              {/* Share Button */}
              <button
                onClick={() => setShareData({
                  displayName: user.displayName,
                  rank,
                  accuracy: user.accuracy,
                  correct: user.correct,
                  resolved: user.resolved,
                  streak: user.streak,
                })}
                className="p-2 hover:bg-dark-border rounded transition-fast"
                title="Share stats"
              >
                <Share2 className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          )
        })}
      </div>

      {shareData && (
        <ShareCardModal
          type="stats"
          data={shareData}
          onClose={() => setShareData(null)}
        />
      )}
    </div>
  )
}
