import { useState, useEffect } from 'react'
import { Trophy, DollarSign, TrendingUp, Award, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface JogoSalvo {
  id: string
  numbers: number[]
  created_at: string
  concurso?: number
  acertos?: number
  premio?: number
}

export function DashboardVip() {
  const { user } = useAuth()
  const [jogos, setJogos] = useState<JogoSalvo[]>([])
  const [loading, setLoading] = useState(true)
  const [lucroTotal, setLucroTotal] = useState(0)
  const [acertosCount, setAcertosCount] = useState({ 11: 0, 12: 0, 13: 0, 14: 0, 15: 0 })

  const BACKEND_URL = 'https://palpiteiro-v2-backend.vercel.app'

  useEffect(() => {
    async function carregar() {
      if (!user) return

      try {
        // Pega jogos salvos do usuário
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

        // Pega último resultado oficial
        const res = await fetch(`${BACKEND_URL}/api/resultados`)
        const ultimoResultado = await res.json()
        const sorteioAtual = ultimoResultado.ultimos_numeros

        let lucro = 0
        const contagem = { 11: 0, 12: 0, 13: 0, 14: 0, 15: 0 }

        const jogosAtualizados = data.map(jogo => {
          const acertos = jogo.numbers.filter((n: number) => sorteioAtual.includes(n)).length
          let premio = 0

          if (acertos === 15) premio = ultimoResultado.ganhadores.find((f: any) => f.faixa === "15 acertos")?.premio || 0
          else if (acertos === 14) premio = ultimoResultado.ganhadores.find((f: any) => f.faixa === "14 acertos")?.premio || 0
          else if (acertos === 13) premio = ultimoResultado.ganhadores.find((f: any) => f.faixa === "13 acertos")?.premio || 0
          else if (acertos === 12) premio = ultimoResultado.ganhadores.find((f: any) => f.faixa === "12 acertos")?.premio || 0
          else if (acertos === 11) premio = ultimoResultado.ganhadores.find((f: any) => f.faixa === "11 acertos")?.premio || 0

          lucro += premio - 3 // custo da aposta

          if (acertos >= 11) contagem[acertos]++

          return { ...jogo, acertos, premio }
        })

        setJogos(jogosAtualizados)
        setLucroTotal(lucro)
        setAcertosCount(contagem)
      } catch (err) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900 text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-6xl font-black text-center mb-12">
          Dashboard VIP — {user?.email?.split('@')[0]}
        </h1>

        {/* Lucro Real */}
        <div className="text-center mb-16">
          <DollarSign className="w-24 h-24 mx-auto mb-6 text-green-400" />
          <p className="text-4xl font-bold mb-4">Lucro Real</p>
          <p className={`text-8xl font-black ${lucroTotal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            R$ {lucroTotal.toFixed(2)}
          </p>
        </div>

        {/* Acertos por faixa */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-20">
          {[11, 12, 13, 14, 15].map(faixa => (
            <div key={faixa} className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 text-center">
              <p className="text-6xl font-black">{acertosCount[faixa]}×</p>
              <p className="text-2xl mt-4">{faixa} acertos</p>
            </div>
          ))}
        </div>

        {/* Jogos salvos */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12">
          <h3 className="text-4xl font-black text-center mb-10">Seus Jogos Salvos</h3>
          {jogos.length === 0 ? (
            <p className="text-center text-2xl text-gray-300">Você ainda não salvou nenhum jogo</p>
          ) : (
            <div className="space-y-8">
              {jogos.slice(0, 10).map(jogo => (
                <div key={jogo.id} className="bg-white/20 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-lg">Salvo em {new Date(jogo.created_at).toLocaleDateString('pt-BR')}</p>
                    {jogo.acertos !== undefined && (
                      <p className="text-3xl font-black">
                        {jogo.acertos} acertos → R$ {jogo.premio?.toFixed(2) || '0,00'}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {jogo.numbers.map(num => (
                      <div key={num} className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center font-bold">
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