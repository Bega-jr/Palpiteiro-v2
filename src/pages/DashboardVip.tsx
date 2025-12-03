import { Trophy, TrendingUp, DollarSign, Calendar, Award, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function DashboardVip() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900 text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-6xl font-black mb-8">
          Bem-vindo ao VIP, {user?.email?.split('@')[0] || 'Campeão'}!
        </h1>

        <div className="inline-flex items-center gap-4 bg-yellow-400 text-purple-900 px-12 py-6 rounded-full text-4xl font-black shadow-2xl">
          <Trophy className="w-14 h-14" />
          ACESSO EXCLUSIVO
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-12 shadow-2xl">
            <DollarSign className="w-24 h-24 mx-auto mb-6 text-green-400" />
            <p className="text-3xl font-bold">Lucro Real</p>
            <p className="text-7xl font-black mt-6">R$ 1.247,90</p>
          </div>

          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-12 shadow-2xl">
            <Trophy className="w-24 h-24 mx-auto mb-6 text-yellow-400" />
            <p className="text-3xl font-bold">Jogos Salvos</p>
            <p className="text-7xl font-black mt-6">42</p>
          </div>

          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-12 shadow-2xl">
            <TrendingUp className="w-24 h-24 mx-auto mb-6 text-cyan-400" />
            <p className="text-3xl font-bold">Ranking Brasil</p>
            <p className="text-7xl font-black mt-6">#47</p>
          </div>
        </div>

        <p className="text-3xl mt-20 opacity-90">
          Palpites ilimitados • Estatísticas exclusivas • Lucro real
        </p>
      </div>
    </div>
  )
}