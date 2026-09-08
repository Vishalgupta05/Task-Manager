import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold">
          T
        </div>
        <span className="font-semibold text-slate-800 text-lg">Task Manager</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500">
          Hi, <span className="font-medium text-slate-700">{user?.username}</span>
        </span>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-lg px-3 py-1.5 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
