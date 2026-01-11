import { LogOut } from 'lucide-react'
import { isAdmin } from '../config/admins'

export const Header = ({ user, onSignOut }) => {
  const userIsAdmin = isAdmin(user?.email)

  return (
    <header className="relative z-10 border-b border-dark-border bg-dark-bg/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Prediction Tracker</h1>
          {userIsAdmin && (
            <span className="text-xs text-gold font-medium">ADMIN</span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">{user?.email}</p>
          </div>
          <button
            onClick={onSignOut}
            className="p-2 hover:bg-dark-card rounded transition-fast"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
