import { useState } from 'react'

export const AuthForm = ({ onSignIn, onSignUp, error }) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (isSignUp) {
      await onSignUp(email, password, displayName)
    } else {
      await onSignIn(email, password)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Prediction Tracker</h1>
          <p className="text-gray-400 text-sm">
            {isSignUp ? 'Create your account' : 'Sign in to continue'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-dark-card border border-dark-border rounded-lg p-6 space-y-4"
        >
          {isSignUp && (
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded px-4 py-2.5 text-white transition-fast focus:outline-none focus:border-gray-600"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-dark-bg border border-dark-border rounded px-4 py-2.5 text-white transition-fast focus:outline-none focus:border-gray-600"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-dark-bg border border-dark-border rounded px-4 py-2.5 text-white transition-fast focus:outline-none focus:border-gray-600"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 rounded px-4 py-2.5 text-sm text-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-medium rounded px-4 py-2.5 transition-fast hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-gray-400 hover:text-white transition-fast"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
