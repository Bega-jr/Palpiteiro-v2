import { useState, useEffect } from 'react'
import { Trophy, TrendingUp, DollarSign, Calendar, Loader2, CheckSquare } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

interface JogoSalvo {
  id: string
  numbers: number[]
  created_at: string
}

export function Dashboard() {
  const { user, isVip } = useAuth()
  const [jogos, setJogos] = useState<JogoSalvo[]>([])
  const [loading, setLoading] = useState(true)
  const [conferindo, setConferindo] = useState(false)
  const [resultadoConferencia, setResultadoConferencia] = useState<any>(null)

  const BACKEND_URL = 'https://palpiteiro-v2-backend.vercel.app'

  useEffect(() => {
    if (!user || !isVip) {
      setLoading(false)
      return
    }

    async function carregar() {
      try {
        const { data: jogosDb } = await supabase
          .from('saved_games')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        setJogos(jogosDb || [])
      } catch {
        toast.error('Erro ao carregar jogos salvos')
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [user, isVip])

  const conferirJogo = async (concurso: number, jogo: number[]) => {
    setConferindo(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/conferir-jogo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concurso, meu_jogo: jogo })
      })
      const data = await res.json()
      setResultadoConferencia(data)
      toast.success(`Você acertou ${data.acertos} números! Faixa: ${data.faixa}`)
    } catch {
      toast.error('Erro ao conferir jogo')
    } finally {
      setConferindo(false)
    }
  }

  if (!isVip) {
    return (
      <div className="pt-32 text-center">
        <h2 className="text-4xl font-bold mb-6">Área Exclusiva VIP</h2>
        <p className="text-xl mb-8 text-gray-600">Faça upgrade para ver seu desempenho real</p>
        <Link to="/vip" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-6 rounded-full text-2xl font-bold shadow-2xl hover:scale-105 transition">
          Virar VIP Agora
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="pt-32 text-center">
        <Loader2 className="w-16 h-16 animate-spin text-purple-600" />
        <p className="mt-6 text-2xl text-gray-600">Carregando seu Dashboard VIP...</p>
      </div>
    )
  }

  return (
    <div className="pt-20 pb-16 bg-gradient-to-b from-purple-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-black text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Dashboard VIP
        </h1>

        {/* Seus jogos salvos */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-16">
          <h3 className="text-3xl font-bold mb-8 text-purple-800">Seus Jogos Salvos</h3>
          {jogos.length === 0 ? (
            <p className="text-center text-gray-600">Você ainda não salvou nenhum jogo</p>
          ) : (
            <div className="space-y-8">
              {jogos.map((jogo) => (
                <div key={jogo.id} className="bg-gray-50 rounded-2xl p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-lg font-medium text-gray-700">
                      Salvo em {new Date(jogo.created_at).toLocaleDateString('pt-BR')}
                    </p>
                    <button
                      onClick={() => conferirJogo(3551, jogo.numbers)}
                      disabled={conferindo}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition flex items-center gap-2"
                    >
                      <CheckSquare className="w-5 h-5" />
                      Conferir Acertos
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {jogo.numbers.map(num => (
                      <div key={num} className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        {num.toString().padStart(2, '0')}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resultado da conferência */}
        {resultadoConferencia && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl shadow-2xl p-12 text-center mb-16">
            <Trophy className="w-20 h-20 mx-auto mb-6 text-yellow-500" />
            <h3 className="text-4xl font-black text-green-800 mb-4">
              Você acertou {resultadoConferencia.acertos} números!
            </h3>
            <p className="text-3xl font-bold text-green-700 mb-6">
              Faixa: {resultadoConferencia.faixa}
            </p>
            <p className="text-2xl text-gray-800">
              Prêmio estimado: <strong className="text-green-600">{resultadoConferencia.premio}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}