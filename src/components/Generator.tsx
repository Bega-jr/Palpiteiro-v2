import { useState, useEffect } from 'react'
import { Wand2, RefreshCw, Trophy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LotteryBall } from './LotteryBall'
import { TicketView } from './TicketView'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'

interface Aposta {
  id: number
  numbers: number[]
  estrategia: string
}

interface Estatisticas {
  maisSorteados: { numero: number; vezes: number }[]
  menosSorteados: { numero: number; vezes: number }[]
  moda: number
  atrasados: number[]
  finais: { [key: number]: number }
}

export function Generator() {
  const { isVip } = useAuth()
  const [apostas, setApostas] = useState<Aposta[]>([])
  const [fixos, setFixos] = useState<number[]>([])
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [viewMode, setViewMode] = useState<'balls' | 'ticket'>('balls')

  const BACKEND_URL = 'https://palpiteiro-v2-backend.vercel.app'

  const handleGenerate = async () => {
    setIsGenerating(true)

    try {
      const [palpitesRes, estatisticasRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/palpites`),
        fetch(`${BACKEND_URL}/api/estatisticas`)
      ])

      const palpitesData = await palpitesRes.json()
      const estatisticasData = await estatisticasRes.json()

      if (palpitesData.apostas && Array.isArray(palpitesData.apostas)) {
        const estrategias = ['Quentes + Fixos', 'Frios + Balanceado', 'Equilíbrio Total', 'Final 0', 'Padrão Caixa', 'Modo Grok', 'Surpresa Máxima']
        const novosJogos = palpitesData.apostas.map((nums: number[], i: number) => ({
          id: i + 1,
          numbers: nums,
          estrategia: estrategias[i] || 'Estratégia'
        }))

        setApostas(novosJogos)
        setFixos(palpitesData.fixos || [])
        setEstatisticas(estatisticasData)
        toast.success(isVip ? 'Novos palpites gerados!' : 'Palpites do dia carregados!')
      }
    } catch {
      toast.error('Erro ao gerar palpites')
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    handleGenerate()
  }, [])

  return (
    <section className="py-16 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Gerador de Desdobramentos
          </h2>
          <p className="text-xl text-gray-700">Baseado em dados oficiais da Caixa</p>
        </div>

        {/* Botão */}
        <div className="text-center mb-16">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`px-16 py-8 rounded-3xl font-black text-3xl shadow-2xl transition-all transform hover:scale-110 flex items-center gap-6 mx-auto ${
              isGenerating ? 'bg-gray-400' : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-12 h-12 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Wand2 className="w-12 h-12" />
                {isVip ? 'Gerar Novos Palpites VIP' : 'Ver Palpites do Dia'}
              </>
            )}
          </button>
        </div>

        {/* Fixos */}
        {fixos.length > 0 && (
          <div className="text-center mb-12">
            <p className="text-2xl font-bold text-gray-800 mb-6">Números Fixos do Dia</p>
            <div className="flex justify-center gap-6 flex-wrap">
              {fixos.map(n => (
                <div key={n} className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-full flex items-center justify-center text-4xl font-black shadow-2xl ring-8 ring-yellow-300">
                  {n.toString().padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Apostas */}
        {apostas.length > 0 && (
          <>
            <div className="flex justify-center gap-8 mb-12">
              <button onClick={() => setViewMode('balls')} className={`p-4 rounded-xl ${viewMode === 'balls' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                Bolas
              </button>
              <button onClick={() => setViewMode('ticket')} className={`p-4 rounded-xl ${viewMode === 'ticket' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                Bilhete
              </button>
            </div>

            <div className={viewMode === 'ticket' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12" : "space-y-12"}>
              {apostas.map((aposta, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-10 shadow-2xl border-4 border-purple-100"
                >
                  <h3 className="text-3xl font-black text-purple-700 text-center mb-8">
                    Aposta {i + 1} — {aposta.estrategia}
                  </h3>

                  {viewMode === 'balls' ? (
                    <div className="flex flex-wrap gap-5 justify-center">
                      {aposta.numbers.map(num => {
                        const stats = estatisticas
                        const isQuente = stats?.maisSorteados.some(s => s.numero === num)
                        const isFrio = stats?.menosSorteados.some(s => s.numero === num)
                        const isAtrasado = stats?.atrasados.includes(num)
                        const isModa = stats?.moda === num
                        const finalQuente = stats && Math.max(...Object.values(stats.finais)) === stats.finais[num % 10]

                        return (
                          <LotteryBall
                            key={num}
                            number={num}
                            isQuente={isQuente}
                            isFrio={isFrio}
                            isAtrasado={isAtrasado}
                            isModa={isModa}
                            isFinalQuente={finalQuente}
                            className={fixos.includes(num) ? 'ring-8 ring-yellow-400 scale-125' : ''}
                          />
                        )
                      })}
                    </div>
                  ) : (
                    <TicketView selectedNumbers={aposta.numbers} className="w-full" />
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}