import { useState, useEffect } from 'react'
import { Trophy, DollarSign, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

interface JogoSalvo {
  id: string
  numbers: number[]
  created_at: string
  acertos?: number
  premio?: string
  faixa?: string
}

export function DashboardVip() {
  const { user } = useAuth()
  const [jogos, setJogos] = useState<JogoSalvo[]>([])
  const [loading, setLoading] = useState(true)
  const [lucroTotal, setLucroTotal] = useState<number>(0) // ← AQUI ERA O PROBLEMA!
  const [sorteioAtual, setSorteioAtual] = useState<number[]>([])

  const BACKEND_URL = 'https://palpiteiro-v2-backend.vercel.app'

  useEffect(() => {
    async function carregar() {
      if (!user) return

      try {
        setLoading(true)

        // 1. Pega jogos salvos
        const { data: jogosDb } = await supabase
          .from('saved_games')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (!jogosDb || jogosDb.length === 0) {
          setJogos([])
          setLucroTotal(0)
          setLoading(false)
          return
        }

        // 2. Pega último resultado
        const res = await fetch(`${BACKEND_URL}/api/resultados`)
        const resultado = await res.json()
        const numerosSorteados = resultado.ultimos_numeros || []

        setSorteioAtual(numerosSorteados)

        // 3. Confere cada jogo
        let totalGanho = 0
        const jogosConferidos = jogosDb.map(jogo => {
          const acertos = jogo.numbers.filter((n: number) => numerosSorteados.includes(n)).length

          let premio = 'R$0,00'
          let faixa = 'Sem prêmio'

          if (acertos >= 11) {
            const faixaInfo = resultado.ganhadores.find((f: any) => {
              return f.faixa === `${acertos} acertos`
            })
            premio = faixaInfo?.premio || 'R$0,00'
            faixa = faixaInfo?.faixa || 'Prêmio fixo'
            const valor = Number(
            (premio || "0").replace(/[^\d,]/g, "").replace(",", ".")
            )

            totalGanho += isNaN(valor) ? 0 : valor

            }

          return { ...jogo, acertos, premio, faixa }
        })

        setJogos(jogosConferidos)
        setLucroTotal(totalGanho - jogosDb.length * 3) // R$3 por aposta
      } catch (err) {
        console.error(err)
        toast.error('Erro ao carregar dashboard')
        setLucroTotal(0)
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900 text-white pt-20 text-center">
        <p className="text-3xl">Carregando seu Dashboard VIP...</p>
      </div>
    )
  }

  if (jogos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900 text-white pt-20 text-center">
        <Trophy className="w-32 h-32 mx-auto mb-8 text-yellow-400" />
        <h2 className="text-5xl font-black mb-8">Você ainda não salvou nenhum jogo</h2>
        <p className="text-2xl">Gere palpites e clique em "Salvar Jogo"</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900 text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-6xl font-black text-center mb-12">Dashboard VIP</h1>

        {/* LUCRO TOTAL */}
        <div className="text-center mb-16">
          <DollarSign className="w-24 h-24 mx-auto mb-6 text-green-400" />
          <p className="text-4xl font-bold">Lucro Real</p>
          <p className={`text-8xl font-black mt-6 ${lucroTotal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          R$ {Number(lucroTotal || 0).toFixed(2)}
          </p>

        </div>

        {/* LISTA DE JOGOS */}
        <div className="space-y-8">
          {jogos.map((jogo, i) => (
            <div key={jogo.id} className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <p className="text-2xl font-bold">Jogo {i + 1}</p>
                  <p className="text-lg opacity-80">
                    Salvo em {new Date(jogo.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-6xl font-black">{jogo.acertos || 0} acertos</p>
                  <p className="text-3xl font-bold text-yellow-400">{jogo.faixa || 'Sem prêmio'}</p>
                  <p className="text-4xl font-black text-green-400">{jogo.premio || 'R$0,00'}</p>
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                  {jogo.numbers.map(num => (
                    <div
                      key={num}
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black transition-all ${
                        sorteioAtual.includes(num)
                          ? 'bg-green-500 text-white ring-4 ring-green-300 scale-110'
                          : 'bg-white/30 text-white'
                      }`}
                    >
                      {num.toString().padStart(2, '0')}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}