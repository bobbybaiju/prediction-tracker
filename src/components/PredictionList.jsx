import { PredictionCard } from './PredictionCard'

export const PredictionList = ({
  predictions,
  profiles,
  currentUser,
  onResolve,
  loading,
}) => {
  if (loading) {
    return (
      <div className="text-center py-12 text-gray-400">
        Loading predictions...
      </div>
    )
  }

  if (predictions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg mb-2">No predictions yet</p>
        <p className="text-gray-500 text-sm">
          Create your first prediction to get started
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {predictions.map((prediction) => (
        <PredictionCard
          key={prediction.id}
          prediction={prediction}
          profile={profiles[prediction.user_id]}
          currentUser={currentUser}
          onResolve={onResolve}
        />
      ))}
    </div>
  )
}
