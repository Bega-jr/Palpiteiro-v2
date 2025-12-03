import { useState, useEffect } from 'react'
import { Trophy, DollarSign, Calendar, CheckCircle } from 'lucide-react'
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

  const BACKEND_URL = 'https://palpiteiro-v2-backend.vercel.app'

  useEffect(() => {
    async function carregar() {
      if (!user) return

      try {
        // Pega jogos salvos
        const { data } = await supabase
          .from('saved_games')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (!data || data.length === 0) {
          setJogos([])
          setLoading(false)
          return
        }

        // Pega todos os resultados oficiais
        const res = await fetch(`${BACKEND_URL}/api/resultados`)
        const resultados = await res.json()

        // Mapeia por concurso
        const mapaResultados: { [concurso: string]: number[] } = {}
        resultados.forEach((r: any) => {
          mapaResultados[r.ultimo_concurso] = r.ultimos_numeros
        })

        // Confere cada jogo com o concurso correto (ou o mais próximo)
        const jogosConferidos = data.map(jogo => {
          const dataJogo = new Date(jogo.created_at)
          let melhorConcurso = null
          let acertos = 0

          // Procura o concurso mais próximo (depois da data do jogo)
          for (const conc of Object.keys(mapaResultados)) {
            const concurso = parseInt(conc)
            if (concurso >= 3500) { // evita concursos antigos
              melhorConcurso = concurso
              acertos = jogo.numbers.filter((n: number) => mapaResultados[conc].includes(n)).length
              break
            }
          }

          const faixa = acertos === 15 ? '15 acertos' :
                        acertos === 14 ? '14 acertos' :
                        acertos === 13 ? '13 acertos' :
                        acertos === 12 ? '12 acertos' :
                        acertos === 11 ? '11 acertos' : 'Menos de 11'

          return {
            ...jogo,
            concurso: melhorConcurso || 'Pendente',
            acertos,
            faixa,
            premio: acertos >= 11 ? 'R$ XX,XX' : 'R$ 0,00'
          }
        })

        setJogos(jogosConferidos)
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-600">Carregando seu Dashboard VIP...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900 text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-6xl font-black text-center mb-16">
          Dashboard VIP
        </h1>

        {/* Lista de jogos conferidos */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10">
          <h3 className="text-4xl font-black text-center mb-10">Seus Jogos Salvos</h3>

          {jogos.length === 0 ? (
            <p className="text-center text-2xl text-gray-300">Você ainda não salvou nenhum jogo</p>
          ) : (
            <div className="space-y-8">
              {jogos.map(jogo => (
                <div key={jogo.id} className="bg-white/20 rounded-2xl p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                      <p className="text-xl font-bold">Salvo em {new Date(jogo.created_at).toLocaleDateString('pt-BR')}</p>
                      {jogo.concurso !== 'Pendente' && (
                        <p className="text-lg text-gray-300">Conferido com o concurso {jogo.concurso}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-black">
                        {jogo.acertos} acertos
                      </p>
                      <p className="text-2xl text-green-400">{jogo.faixa}</p>
                      <p className="text-xl text-yellow-400">{jogo.premio}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {jogo.numbers.map(num => (
                      <div key={num} className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-black">
                        {num.toString().padStart(2, '0')}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}