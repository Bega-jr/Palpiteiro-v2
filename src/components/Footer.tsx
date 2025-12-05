import { Link, useNavigate } from 'react-router-dom'
import { Home, Trophy, TrendingUp, BarChart3, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

export function Footer() {
  const { user, isVip } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Logout realizado com sucesso!')
      navigate('/')
    } catch (error) {
      toast.error('Erro ao fazer logout')
    }
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900 text-white shadow-2xl z-50 border-t-4 border-yellow-400">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="grid grid-cols-5 gap-4 text-center">
          {/* PALPITES */}
          <Link to="/" className="flex flex-col items-center gap-2 hover:scale-110 transition-all">
            <div className="bg-white/20 p-4 rounded-full">
              <Home className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold">Palpites</span>
          </Link>

          {/* RESULTADOS */}
          <Link to="/resultados" className="flex flex-col items-center gap-2 hover:scale-110 transition-all">
            <div className="bg-white/20 p-4 rounded-full">
              <Trophy className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold">Resultados</span>
          </Link>

          {/* DASHBOARD VIP */}
          {isVip ? (
            <Link to="/dashboard-vip" className="flex flex-col items-center gap-2 hover:scale-110 transition-all">
              <div className="bg-yellow-500 p-4 rounded-full shadow-lg">
                <TrendingUp className="w-8 h-8 text-purple-900" />
              </div>
              <span className="text-xs font-bold text-yellow-400">Dashboard</span>
            </Link>
          ) : (
            <Link to="/vip" className="flex flex-col items-center gap-2 hover:scale-110 transition-all">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full shadow-lg animate-pulse">
                <TrendingUp className="w-8 h-8 text-purple-900" />
              </div>
              <span className="text-xs font-bold text-yellow-400">Virar VIP</span>
            </Link>
          )}

          {/* ESTATÍSTICAS VIP */}
          {isVip && (
            <Link to="/estatisticas-vip" className="flex flex-col items-center gap-2 hover:scale-110 transition-all">
              <div className="bg-white/20 p-4 rounded-full">
                <BarChart3 className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold">Estatísticas</span>
            </Link>
          )}

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-2 hover:scale-110 transition-all text-red-400"
          >
            <div className="bg-red-600/30 p-4 rounded-full">
              <LogOut className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold">Sair</span>
          </button>
        </div>
      </div>
    </footer>
  )
}