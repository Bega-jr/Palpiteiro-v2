import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { TicketView } from '../components/TicketView'
import { TrendingUp, DollarSign, Calendar, CheckCircle, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

interface SavedGame {
  id: number
  created_at: string
  numbers: number[]
  played: boolean
  prize_amount: number
}

export function Dashboard() {
  const { user, isVip } = useAuth()
  const [games, setGames] = useState<SavedGame[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchGames()
  }, [user])

  async function fetchGames() {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('saved_games')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) console.error('Erro ao carregar jogos:', error)
      else setGames(data || [])
    } catch (err) {
      console.error('Erro inesperado:', err)
    } finally {
      setLoading(false)
    }
  }

  const togglePlayed = async (id: number, current: boolean) => {
    await supabase.from('saved_games').update({ played: !current }).eq('id', id)
    fetchGames()
  }

  const updatePrize = async (id: number, amount: string) => {
    const val = parseFloat(amount)
    if (isNaN(val)) return
    await supabase.from('saved_games').update({ prize_amount: val }).eq('id', id)
    fetchGames()
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
          <p className="text-gray-600">Carregando seu painel...</p>
        </div>
      </div>
    )
  }

  if (!isVip) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Área VIP</h2>
        <p className="text-lg mb-8">Faça upgrade para ver seu histórico completo</p>
        <Link to="/vip" className="bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-700">
          Ver Planos VIP
        </Link>
      </div>
    )
  }

  const invested = games.filter(g => g.played).length * 3
  const won = games.reduce((a, g) => a + (g.prize_amount || 0), 0)
  const profit = won - invested

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Meu Painel VIP</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-blue-600" />
              <span>Total Investido</span>
            </div>
            <p className="text-3xl font-bold">R$ {invested.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <span>Total Ganho</span>
            </div>
            <p className="text-3xl font-bold text-green-600">R$ {won.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-purple-600" />
              <span>Lucro</span>
            </div>
            <p className={`text-3xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {profit.toFixed(2)}
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Seus Jogos</h2>
        {games.length === 0 ? (
          <p className="text-center py-12 text-gray-500">Nenhum jogo salvo ainda</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map(game => (
              <div key={game.id} className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>{new Date(game.created_at).toLocaleDateString('pt-BR')}</span>
                  <button
                    onClick={() => togglePlayed(game.id, game.played)}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${game.played ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}
                  >
                    {game.played ? 'Apostado' : 'Salvo'}
                  </button>
                </div>
                <TicketView selectedNumbers={game.numbers} />
                {game.played && (
                  <input
                    type="number"
                    placeholder="Prêmio (R$)"
                    defaultValue={game.prize_amount || ''}
                    onBlur={(e) => updatePrize(game.id, e.target.value)}
                    className="mt-4 w-full px-3 py-2 border rounded-lg text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}