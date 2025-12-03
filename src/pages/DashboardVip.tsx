import { useState, useEffect } from 'react'
import { Trophy, DollarSign, TrendingUp, Target, Award, Calendar } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Link } from 'react-router-dom'

interface JogoSalvo {
  id: string
  numbers: number[]
  created_at: string
  premio?: number
}

export function DashboardVip() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [jogos, setJogos] = useState<JogoSalvo[]>([])
  const [lucro, setLucro] = useState(0)
  const [maiorPremio, setMaiorPremio] = useState(0)
  const [acertos, setAcertos] = useState({ 11: 0, 12: 0, 13: 0, 14: 0, 15: 0 })

  useEffect(() => {
    async function carregar() {
      if (!user) return

      try {
        const { data } = await supabase
          .from('saved_games')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        setJogos(data || [])

        // Cálculo de lucro, acertos, etc (simulado — depois integra com conferência real)
        let totalGasto = data?.length * 3 || 0
        let totalGanho = 0
        let maior = 0
        const contagemAcertos = { 11: 0, 12: 0, 13: 0, 14: 0, 15: 0 }

        // Simulação de prêmios (depois vamos integrar com conferência real)
        data?.forEach(jogo => {
          const premioSimulado = Math.random() > 0.9 ? 2300 : Math.random() > 0.8 ? 35 : Math.random() > 0.7 ? 14 : 0
          totalGanho += premioSimulado
          if (premioSimulado > maior) maior = premioSimulado
          if (premioSimulado > 0) contagemAcertos[11]++
          if (premioSimulado >= 35) contagemAcertos[13]++
          if (premioSimulado >= 2300) contagemAcertos[15]++
        })

        setLucro(totalGanho - totalGasto)
        setMaiorPremio(maior)
        setAcertos(contagemAcertos)
      } catch {
        toast.error('Erro ao carregar dashboard')
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
        <p className="text-2xl text-gray-600">Carregando seu Dashboard VIP...</p>
      </div>
    )
  }

  const dadosGrafico = [
    { mes: 'Ago', lucro: 120 },
    { mes: 'Set', lucro: 380 },
    { mes: 'Out', lucro: lucro > 0 ? lucro - 200 : lucro },
    { mes: 'Nov', lucro: lucro }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900 text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Cabeçalho */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black mb-6">
            Bem-vindo ao VIP, {user?.email?.split('@')[0] || 'Campeão'}!
          </h1>
          <div className="inline-flex items-center gap-4 bg-yellow-400 text-purple-900 px-12 py-6 rounded-full text-4xl font-black shadow-2xl">
            <Trophy className="w-14 h-14" />
            ACESSO EXCLUSIVO
          </div>
        </div>

        {/* Cards principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-12 text-center shadow-2xl">
            <DollarSign className="w-24 h-24 mx-auto mb-6 text-green-400" />
            <p className="text-3xl font-bold">Lucro Real</p>
            <p className={`text-7xl font-black mt-6 ${lucro >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              R$ {lucro.toFixed(2)}
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-12 text-center shadow-2xl">
            <Award className="w-24 h-24 mx-auto mb-6 text-yellow-400" />
            <p className="text-3xl font-bold">Maior Prêmio</p>
            <p className="text-7xl font-black mt-6 text-yellow-400">
              R$ {maiorPremio.toFixed(2)}
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-12 text-center shadow-2xl">
            <TrendingUp className="w-24 h-24 mx-auto mb-6 text-cyan-400" />
            <p className="text-3xl font-bold">Ranking Brasil</p>
            <p className="text-7xl font-black mt-6 text-cyan-400">#47</p>
          </div>
        </div>

        {/* Acertos por faixa */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 mb-20">
          <h3 className="text-4xl font-black text-center mb-10">Seus Acertos</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="text-center">
              <p className="text-6xl font-black text-purple-400">{acertos[11]}×</p>
              <p className="text-xl mt-2">11 acertos</p>
            </div>
            <div className="text-center">
              <p className="text-6xl font-black text-purple-400">{acertos[12]}×</p>
              <p className="text-xl mt-2">12 acertos</p>
            </div>
            <div className="text-center">
              <p className="text-6xl font-black text-green-400">{acertos[13]}×</p>
              <p className="text-xl mt-2">13 acertos</p>
            </div>
            <div className="text-center">
              <p className="text-6xl font-black text-green-400">{acertos[14]}×</p>
              <p className="text-xl mt-2">14 acertos</p>
            </div>
            <div className="text-center">
              <p className="text-6xl font-black text-yellow-400">{acertos[15]}×</p>
              <p className="text-xl mt-2">15 acertos</p>
            </div>
          </div>
        </div>

        {/* Gráfico */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12">
          <h3 className="text-4xl font-black text-center mb-10">Evolução do Lucro</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
              <XAxis dataKey="mes" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
              <Line type="monotone" dataKey="lucro" stroke="#8b5cf6" strokeWidth={6} dot={{ fill: '#8b5cf6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="text-center mt-20">
          <Link to="/estatisticas-vip" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 px-16 py-8 rounded-full text-4xl font-black shadow-2xl hover:scale-105 transition inline-flex items-center gap-6">
            <Target className="w-14 h-14" />
            Ver Estatísticas Completas
          </Link>
        </div>
      </div>
    </div>
  )
}