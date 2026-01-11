import { useAuth } from './hooks/useAuth'
import { usePredictions } from './hooks/usePredictions'
import { useLeaderboard } from './hooks/useLeaderboard'
import { AuthForm } from './components/AuthForm'
import { ParallaxBackground } from './components/ParallaxBackground'
import { Header } from './components/Header'
import { PredictionForm } from './components/PredictionForm'
import { PredictionList } from './components/PredictionList'
import { Leaderboard } from './components/Leaderboard'

function App() {
  const { user, loading: authLoading, error: authError, signIn, signUp, signOut } = useAuth()
  const {
    predictions,
    profiles,
    loading: predictionsLoading,
    createPrediction,
    resolvePrediction,
  } = usePredictions(user)
  const { leaderboard } = useLeaderboard(predictions, profiles)

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ParallaxBackground />
        <div className="relative z-10 text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <ParallaxBackground />
        <AuthForm onSignIn={signIn} onSignUp={signUp} error={authError} />
      </>
    )
  }

  return (
    <>
      <ParallaxBackground />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header user={user} onSignOut={signOut} />

        <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
          {/* Prediction Form */}
          <PredictionForm onCreatePrediction={createPrediction} />

          {/* Leaderboard */}
          <Leaderboard leaderboard={leaderboard} />

          {/* Predictions List */}
          <div>
            <h2 className="text-xl font-bold mb-4">All Predictions</h2>
            <PredictionList
              predictions={predictions}
              profiles={profiles}
              currentUser={user}
              onResolve={resolvePrediction}
              loading={predictionsLoading}
            />
          </div>
        </main>
      </div>
    </>
  )
}

export default App
