import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Trophy, TrendingUp, BarChart3 } from 'lucide-react'

export function Header() {
  const { user, isVip } = useAuth()

  return (
    <header className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            Palpiteiro V2
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-lg font-medium text-gray-700 hover:text-purple-600 transition">
              Palpites
            </Link>
            <Link to="/resultados" className="text-lg font-medium text-gray-700 hover:text-purple-600 transition">
              Resultados
            </Link>
            
            {isVip ? (
              <>
                <Link to="/dashboard-vip" className="text-lg font-medium text-gray-700 hover:text-purple-600 transition flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Dashboard VIP
                </Link>
                <Link to="/estatisticas-vip" className="text-lg font-bold text-purple-600 hover:text-purple-800 transition flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
                  <BarChart3 className="w-6 h-6" />
                  Estatísticas VIP
                </Link>
              </>
            ) : (
              <Link to="/vip" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:scale-105 transition">
                Virar VIP
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Olá, {user.email?.split('@')[0]}</span>
                <button onClick={() => supabase.auth.signOut()} className="text-gray-600 hover:text-red-600">
                  Sair
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-lg font-medium text-gray-700 hover:text-purple-600 transition">
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}