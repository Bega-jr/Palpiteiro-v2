import { useState, useEffect } from 'react'
import { Trophy, DollarSign, TrendingUp, Calendar, Award, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

interface JogoSalvo {
  id: string
  numbers: number[]
  created_at: string
  concurso?: number
  acertos?: number
  premio?: number
  faixa?: string
}

export function DashboardVip() {
  const { user } = useAuth()
  const [jogos, setJogos] = useState<JogoSalvo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // PUXA TODOS OS JOGOS SALVOS DO USUÁRIO
        const { data, error } = await supabase
          .from('saved_games') // ← Certifique-se que a tabela se chama exatamente "saved_games"
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Erro Supabase:', error)
          toast.error('Erro ao carregar jogos salvos')
          setJogos([])
        } else {
          console.log('Jogos carregados:', data)
          setJogos(data || [])
        }
      } catch (err) {
        console.error('Erro inesperado:', err)
        toast.error('Erro ao conectar com o banco')
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

  if (jogos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900 text-white pt-20">
        <div className="max-w-4xl mx-auto px-4 text-center py-32">
          <Trophy className="w-40 h-40 mx-auto mb-8 text-yellow-400" />
          <h2 className="text-5xl font-black mb-8">Você ainda não salvou nenhum jogo</h2>
          <p className="text-2xl text-gray-300">
            Gere palpites e clique em "Salvar Jogo" para começar!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900 text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-6xl font-black text-center mb-16">
          Dashboard VIP — {user?.email?.split('@')[0]}
        </h1>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12">
          <h3 className="text-4xl font-black text-center mb-12">
            Seus Jogos Salvos ({jogos.length})
          </h3>

          <div className="space-y-10">
            {jogos.map((jogo, i) => (
              <div key={jogo.id} className="bg-white/20 rounded-2xl p-8 shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                  <div>
                    <p className="text-xl font-bold">
                      Jogo {i + 1} — Salvo em {new Date(jogo.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-yellow-400">
                      {jogo.acertos || 0} acertos
                    </p>
                    {jogo.acertos && jogo.acertos >= 11 && (
                      <p className="text-2xl text-green-400 mt-2">
                        {jogo.faixa || 'Prêmio'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  {jogo.numbers.map(num => (
                    <div key={num} className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-black shadow-lg">
                      {num.toString().padStart(2, '0')}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}