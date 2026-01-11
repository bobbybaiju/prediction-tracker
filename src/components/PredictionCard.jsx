import { format } from 'date-fns'
import { Calendar, Check, X } from 'lucide-react'
import { isAdmin } from '../config/admins'
import { useState } from 'react'
import { ResolvePredictionModal } from './ResolvePredictionModal'

export const PredictionCard = ({ prediction, profile, currentUser, onResolve }) => {
  const [showModal, setShowModal] = useState(false)
  const userIsAdmin = isAdmin(currentUser?.email)

  const getStatusColor = () => {
    if (!prediction.resolved) return 'border-dark-border'
    return prediction.correct ? 'border-success/30' : 'border-error/30'
  }

  const getStatusBadge = () => {
    if (!prediction.resolved) {
      return (
        <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400">
          Unresolved
        </span>
      )
    }
    return prediction.correct ? (
      <span className="text-xs px-2 py-1 rounded bg-success/20 text-success flex items-center gap-1">
        <Check className="w-3 h-3" />
        Correct
      </span>
    ) : (
      <span className="text-xs px-2 py-1 rounded bg-error/20 text-error flex items-center gap-1">
        <X className="w-3 h-3" />
        Incorrect
      </span>
    )
  }

  const handleResolve = async (correct) => {
    const { error } = await onResolve(prediction.id, correct)
    if (!error) {
      setShowModal(false)
    }
  }

  return (
    <>
      <div
        className={`bg-dark-card border ${getStatusColor()} rounded-lg p-6 transition-fast hover:border-gray-700`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <p className="text-sm text-gray-400 mb-1">
              {profile?.display_name || profile?.email || 'Unknown User'}
            </p>
            <p className="text-white leading-relaxed">{prediction.text}</p>
          </div>
          {getStatusBadge()}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-border">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>
              Resolves: {format(new Date(prediction.resolution_date), 'MMM d, yyyy')}
            </span>
          </div>

          {!prediction.resolved && userIsAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="text-sm px-3 py-1.5 bg-white text-black font-medium rounded transition-fast hover:bg-gray-200"
            >
              Resolve
            </button>
          )}
        </div>

        {prediction.resolved && prediction.resolved_at && (
          <div className="mt-2 text-xs text-gray-500">
            Resolved: {format(new Date(prediction.resolved_at), 'MMM d, yyyy')}
          </div>
        )}
      </div>

      {showModal && (
        <ResolvePredictionModal
          prediction={prediction}
          onResolve={handleResolve}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
