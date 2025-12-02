import { useState } from 'react'
import { Wand2, RefreshCw, Grid3X3, List, Save, CheckCircle, Trophy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LotteryBall } from './LotteryBall'
import { TicketView } from './TicketView'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

interface Aposta {
  id: number
  numbers: number[]
  estrategia: string
  stats: { sum: number; even: number; odd: number }
}

export function Generator() {
  const { isVip, user } = useAuth()
  const [apostas, setApostas] = useState<Aposta[]>([])
  const [fixos, setFixos] = useState<number[]>([])
  const [ultimoConcurso, setUltimoConcurso] = useState<string>('')
  const [dataSorteio, setDataSorteio] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [viewMode, setViewMode] = useState<'balls' | 'ticket'>('balls')
  const [savedGames, setSavedGames] = useState<number[]>([])

  const BACKEND_URL = 'https://palpiteiro-v2-backend.vercel.app'

  const handleGenerate = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/palpites`)
      const data = await response.json()

      if (data.apostas && Array.isArray(data.apostas)) {
        const estrategias = ['Quentes + Fixos', 'Frios + Balanceado', 'Equilíbrio Total', 'Final 0', 'Padrão Caixa', 'Modo Grok', 'Surpresa Máxima']
        const novosJogos: Aposta[] = data.apostas.map((nums: number[], i: number) => ({
          id: i + 1,
          numbers: nums,
          estrategia: estrategias[i] || 'Estratégia',
          stats: {
            sum: nums.reduce((a, b) => a + b, 0),
            even: nums.filter(n => n % 2 === 0).length,
            odd: nums.filter(n => n % 2 !== 0).length
          }
        }))

        setApostas(novosJogos)
        setFixos(data.fixos || [])
        setUltimoConcurso(data.ultimo_concurso || 'Atual')
        setDataSorteio(data.data_ultimo || new Date().toLocaleDateString('pt-BR'))
        toast.success('7 palpites gerados com sucesso!')
      } else {
        toast.error('Erro ao gerar palpites')
      }
    } catch (err) {
      toast.error('Erro ao conectar com o servidor')
    } finally {
      setIsGenerating(false)
    }
  }

  const saveGame = async (aposta: Aposta) => {
    if (!user) return toast.error('Faça login para salvar')
    try {
      const { error } = await supabase.from('saved_games').insert({
        user_id: user.id,
        numbers: aposta.numbers,
        contest_type: 'standard',
        stats: aposta.stats
      })
      if (!error) {
        setSavedGames(prev => [...prev, aposta.id])
        toast.success('Jogo salvo com sucesso!')
      }
    } catch {
      toast.error('Erro ao salvar jogo')
    }
  }

  return (
    <section className="py-16 bg-gradient-to-b from-purple-50 to-white" id="generator">
      <div className="max-w-7xl mx-auto px-4">
        {/* Título + Data do concurso */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Gerador de Desdobramentos
          </h2>
          {ultimoConcurso && (
            <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-xl font-bold shadow-2xl">
              <Trophy className="inline w-8 h-8 mr-3" />
              Baseado no Concurso {ultimoConcurso} — {dataSorteio}
            </div>
          )}
        </div>

        {/* Fixos */}
        {fixos.length > 0 && (
          <div className="text-center mb-12">
            <p className="text-2xl font-bold text-gray-800 mb-6">Números Fixos (mais sorteados)</p>
            <div className="flex justify-center gap-6 flex-wrap">
              {fixos.map(n => (
                <div key={n} className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-full flex items-center justify-center text-4xl font-black shadow-2xl ring-8 ring-yellow-300">
                  {n.toString().padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botão Gerar */}
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
                Gerando com IA...
              </>
            ) : (
              <>
                <Wand2 className="w-12 h-12" />
                Gerar 7 Palpites Inteligentes
              </>
            )}
          </button>
        </div>

        {/* Apostas */}
        {apostas.length > 0 && (
          <>
            <div className="flex justify-center gap-8 mb-12">
              <div className="bg-white rounded-2xl shadow-xl p-3">
                <button onClick={() => setViewMode('balls')} className={`p-4 rounded-xl ${viewMode === 'balls' ? 'bg-purple-600 text-white' : 'text-gray-600'}`}>
                  <List className="w-8 h-8" />
                </button>
                <button onClick={() => setViewMode('ticket')} className={`p-4 rounded-xl ${viewMode === 'ticket' ? 'bg-purple-600 text-white' : 'text-gray-600'}`}>
                  <Grid3X3 className="w-8 h-8" />
                </button>
              </div>
            </div>

            <div className={viewMode === 'ticket' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12" : "space-y-12"}>
              <AnimatePresence mode="wait">
                {apostas.map((aposta, i) => (
                  <motion.div
                    key={aposta.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-3xl p-10 shadow-2xl border-4 border-purple-100 hover:border-purple-400 transition-all"
                  >
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-3xl font-black text-purple-700">
                        Aposta {i + 1} — {aposta.estrategia}
                      </h3>
                      {isVip && (
                        <button
                          onClick={() => saveGame(aposta)}
                          disabled={savedGames.includes(aposta.id)}
                          className={`p-4 rounded-full transition-all ${
                            savedGames.includes(aposta.id)
                              ? 'bg-green-100 text-green-600'
                              : 'hover:bg-gray-100 text-gray-500'
                          }`}
                        >
                          {savedGames.includes(aposta.id) ? <CheckCircle className="w-8 h-8" /> : <Save className="w-8 h-8" />}
                        </button>
                      )}
                    </div>

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
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </section>
  )
}