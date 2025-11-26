import { useState, useEffect } from 'react'
import { Wand2, RefreshCw, Grid3X3, List, Lock, Save, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LotteryBall } from './LotteryBall'
import { StatsPanel } from './StatsPanel'
import { TicketView } from './TicketView'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

interface GeneratedGame {
  id: number
  numbers: number[]
  type: 'hot' | 'cold' | 'balanced' | 'pattern_0'
  stats: {
    sum: number
    even: number
    odd: number
  }
}

export function Generator() {
  const { isVip, user } = useAuth()
  const [games, setGames] = useState<GeneratedGame[]>([])
  const [fixos, setFixos] = useState<number[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [viewMode, setViewMode] = useState<'balls' | 'ticket'>('balls')
  const [savedGames, setSavedGames] = useState<number[]>([])

  const BACKEND_URL = 'https://palpiteiro-v2-backend.onrender.com'

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGames([])

    try {
      const response = await fetch(`${BACKEND_URL}/api/palpites`)
      const data = await response.json()

      if (data.apostas && data.fixos) {
        setFixos(data.fixos)

        const novosJogos: GeneratedGame[] = data.apostas.map((aposta: number[], index: number) => ({
          id: index + 1,
          numbers: aposta,
          type: index < 5 ? 'hot' : 'balanced',
          stats: {
            sum: aposta.reduce((a, b) => a + b, 0),
            even: aposta.filter(n => n % 2 === 0).length,
            odd: aposta.filter(n => n % 2 !== 0).length
          }
        }))

        setGames(novosJogos)
      }
    } catch (err) {
      console.error('Erro ao carregar palpites:', err)
      toast.error('Erro ao gerar palpites. Tente novamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  const saveGame = async (game: GeneratedGame) => {
    if (!user) {
      toast.error('Faça login para salvar jogos')
      return
    }

    try {
      const { error } = await supabase.from('saved_games').insert({
        user_id: user.id,
        numbers: game.numbers,
        contest_type: 'standard',
        stats: game.stats
      })

      if (!error) {
        setSavedGames(prev => [...prev, game.id])
        toast.success('Jogo salvo com sucesso!')
      }
    } catch (err) {
      toast.error('Erro ao salvar jogo')
    }
  }

  // Gera automaticamente ao carregar a página
  useEffect(() => {
    handleGenerate()
  }, [])

  return (
    <section className="py-12 bg-gray-50" id="generator">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Gerador de Desdobramentos</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            7 jogos estratégicos com base em dados reais da Lotofácil (atualizados automaticamente)
          </p>
        </div>

        <StatsPanel />

        {/* Fixos do dia */}
        {fixos.length > 0 && (
          <div className="max-w-2xl mx-auto mb-8 text-center">
            <p className="text-sm text-gray-600 mb-3">Números Fixos do Dia (mais sorteados recentemente)</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {fixos.map(n => (
                <div key={n} className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  {n.toString().padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="flex flex-col items-center justify-center gap-6 mb-12">
          {games.length > 0 && (
            <div className="flex items-center bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
              <button onClick={() => setViewMode('balls')} className={`p-3 rounded-md ${viewMode === 'balls' ? 'bg-primary-100 text-primary-700' : 'text-gray-500'}`}>
                <List className="w-5 h-5" />
              </button>
              <button onClick={() => setViewMode('ticket')} className={`p-3 rounded-md ${viewMode === 'ticket' ? 'bg-primary-100 text-primary-700' : 'text-gray-500'}`}>
                <Grid3X3 className="w-5 h-5" />
              </button>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`relative overflow-hidden px-10 py-5 rounded-xl font-bold text-lg shadow-xl transition-all transform hover:scale-105 ${
              isGenerating ? 'bg-gray-400' : 'bg-gradient-to-r from-primary-600 to-purple-600 text-white'
            }`}
          >
            <span className="flex items-center gap-3">
              {isGenerating ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  Gerando com IA...
                </>
              ) : (
                <>
                  <Wand2 className="w-6 h-6" />
                  Gerar Novos Palpites
                </>
              )}
            </span>
          </button>
        </div>

        {/* Jogos */}
        <div className={viewMode === 'ticket' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
          <AnimatePresence mode="wait">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">
                    Aposta {index + 1} {index >= 5 && '(Modo Grok)'}
                  </h3>
                  {isVip && (
                    <button
                      onClick={() => saveGame(game)}
                      disabled={savedGames.includes(game.id)}
                      className={`p-2 rounded-full transition-all ${
                        savedGames.includes(game.id)
                          ? 'bg-green-100 text-green-600'
                          : 'hover:bg-gray-100 text-gray-500'
                      }`}
                    >
                      {savedGames.includes(game.id) ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                    </button>
                  )}
                </div>

                {viewMode === 'balls' ? (
                  <div className="flex flex-wrap gap-3 justify-center">
                    {game.numbers.map(num => (
                      <LotteryBall key={num} number={num} isFixed={fixos.includes(num)} />
                    ))}
                  </div>
                ) : (
                  <TicketView selectedNumbers={game.numbers} className="w-full" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}