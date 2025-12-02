import { useState } from 'react'
import { Wand2, RefreshCw, Grid3X3, List, Save, CheckCircle, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import { LotteryBall } from './LotteryBall'
import { TicketView } from './TicketView'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'

interface Aposta {
  id: number
  numbers: number[]
  estrategia: string
}

export function Generator() {
  const { isVip } = useAuth()
  const [apostas, setApostas] = useState<Aposta[]>([])
  const [fixos, setFixos] = useState<number[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [viewMode, setViewMode] = useState<'balls' | 'ticket'>('balls')

  const BACKEND_URL = 'https://palpiteiro-v2-backend.vercel.app'

  const handleGenerate = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/palpites`)
      const data = await response.json()

      if (data.apostas && data.fixos) {
        const estrategias = ['Quentes + Fixos', 'Balanceado', 'Frios', 'Final 0', 'Padrão', 'Modo Grok', 'Surpresa']
        const novosJogos = data.apostas.map((nums: number[], i: number) => ({
          id: i + 1,
          numbers: nums,
          estrategia: estrategias[i] || 'Estratégia'
        }))

        setApostas(novosJogos)
        setFixos(data.fixos)
        toast.success(isVip ? 'Novos palpites gerados!' : 'Palpites do dia carregados!')
      }
    } catch {
      toast.error('Erro ao gerar palpites')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section className="py-16 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Gerador de Palpites Inteligentes
          </h2>
          <p className="text-xl text-gray-700">Baseado em dados oficiais da Caixa</p>
        </div>

        {/* Tabela de credibilidade — SÓ PRA NÃO-VIP */}
        {!isVip && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl shadow-2xl p-10 mb-16 text-center">
            <Trophy className="w-20 h-20 mx-auto mb-6 text-yellow-500" />
            <h3 className="text-4xl font-black text-orange-800 mb-8">
              Nosso palpite fixo já acertou:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <p className="text-5xl font-black text-purple-700">325×</p>
                <p className="text-xl font-bold text-gray-800 mt-2">11 acertos</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <p className="text-5xl font-black text-purple-700">200×</p>
                <p className="text-xl font-bold text-gray-800 mt-2">12 acertos</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <p className="text-5xl font-black text-green-600">87×</p>
                <p className="text-xl font-bold text-gray-800 mt-2">13 acertos</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <p className="text-5xl font-black text-green-600">12×</p>
                <p className="text-xl font-bold text-gray-800 mt-2">14 acertos</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <p className="text-5xl font-black text-yellow-500">3×</p>
                <p className="text-xl font-bold text-gray-800 mt-2">15 acertos</p>
              </div>
            </div>
            <p className="text-2xl text-gray-800 mt-10 font-bold">
              Isso é só o grátis... imagina o VIP!
            </p>
          </div>
        )}

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

        {/* Apostas */}
        {apostas.length > 0 && (
          <>
            <div className="flex justify-center gap-8 mb-12">
              <button onClick={() => setViewMode('balls')} className={`p-4 rounded-xl ${viewMode === 'balls' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                <List className="w-8 h-8" />
              </button>
              <button onClick={() => setViewMode('ticket')} className={`p-4 rounded-xl ${viewMode === 'ticket' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                <Grid3X3 className="w-8 h-8" />
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
                      {aposta.numbers.map(num => (
                        <LotteryBall
                          key={num}
                          number={num}
                          isFixed={fixos.includes(num)}
                          className={fixos.includes(num) ? 'ring-8 ring-yellow-400 scale-125' : ''}
                        />
                      ))}
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