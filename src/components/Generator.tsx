import { useState, useEffect } from 'react'
import { Wand2, RefreshCw, Grid3X3, List, Lock, Save, CheckCircle, Trophy } from 'lucide-react'
import { motion,ÁN AnimatePresence } from 'framer-motion'
import { LotteryBall } from './LotteryBall'
import { TicketView } from './TicketView'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

interface Aposta {
  id: number
  numbers: number[]
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

  // Cache pro não-VIP (1 vez por dia)
  const [cacheDia, setCacheDia] = useState<string>('')

  const handleGenerate = async () => {
    setIsGenerating(true)

    try {
      const hoje = new Date().toISOString().split('T')[0]

      // Não-VIP: só gera uma vez por dia
      if (!isVip && cacheDia === hoje && apostas.length > 0) {
        toast.info('Palpites fixos do dia já exibidos! Torne-se VIP para gerar novos.')
        setIsGenerating(false)
        return
      }

      const response = await fetch(`${BACKEND_URL}/api/palpites`)
      const data = await response.json()

      if (data.apostas && data.fixos) {
        const novosJogos: Aposta[] = data.apostas.map((nums: number[], i: number) => ({
          id: i + 1,
          numbers: nums,
          stats: {
            sum: nums.reduce((a, b) => a + b, 0),
            even: nums.filter(n => n % 2 === 0).length,
            odd: nums.filter(n => n % 2 !== 0).length
          }
        }))

        setApostas(novosJogos)
        setFixos(data.fixos)
        setUltimoConcurso(data.ultimo_concurso || 'Atual')
        setDataSorteio(data.data_ultimo || hoje)
        setCacheDia(hoje)
        toast.success(isVip ? 'Novos palpites gerados!' : 'Palpites do dia carregados!')
      }
    } catch (err) {
      toast.error('Erro ao gerar palpites')
    } finally {
      setIsGenerating(false)
    }
  }

  const saveGame = async (aposta: Aposta) => {
    if (!user) {
      toast.error('Faça login para salvar')
      return
    }
    try {
      const { error } = await supabase.from('saved_games').insert({
        user_id: user.id,
        numbers: aposta.numbers,
        contest_type: 'standard',
        stats: aposta.stats
      })
      if (!error) {
        setSavedGames(prev => [...prev, aposta.id])
        toast.success('Jogo salvo!')
      }
    } catch {
      toast.error('Erro ao salvar')
    }
  }

  useEffect(() => {
    handleGenerate()
  }, [])

  return (
    <section className="py-12 bg-gradient-to-b from-purple-50 to-white" id="generator">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Gerador de Palpites Inteligentes</h2>
          <p className="text-lg text-gray-600">7 apostas baseadas em dados oficiais da Caixa</p>
        </div>

        {/* Concurso usado */}
        {ultimoConcurso && (
          <div className="max-w-md mx-auto mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5 rounded-2xl shadow-xl text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm opacity-90">Baseado no</p>
            <p className="text-2xl font-bold">Concurso {ultimoConcurso}</p>
            <p className="text-sm">{dataSorteio} • Dados oficiais Caixa</p>
          </div>
        )}

        {/* Fixos do dia */}
        {fixos.length > 0 && (
          <div className="text-center mb-10">
            <p className="text-sm text-gray-600 mb-3">Números Fixos (mais sorteados recentemente)</p>
            <div className="flex justify-center gap-4 flex-wrap">
              {fixos.map(n => (
                <div key={n} className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-extrabold shadow-lg ring-4 ring-yellow-300">
                  {n.toString().padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="flex justify-center gap-6 mb-12">
          {apostas.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-2">
              <button onClick={() => setViewMode('balls')} className={`p-3 rounded-lg ${viewMode === 'balls' ? 'bg-purple-600 text-white' : 'text-gray-600'}`}>
                <List className="w-6 h-6" />
              </button>
              <button onClick={() => setViewMode('ticket')} className={`p-3 rounded-lg ${viewMode === 'ticket' ? 'bg-purple-600 text-white' : 'text-gray-600'}`}>
                <Grid3X3 className="w-6 h-6" />
              </button>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3 ${
              isGenerating ? 'bg-gray-400' : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-7 h-7 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Wand2 className="w-7 h-7" />
                {isVip ? 'Gerar Novos Palpites' : 'Ver Palpites do Dia'}
              </>
            )}
          </button>
        </div>

        {/* Apostas */}
        <div className={viewMode === 'ticket' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-8"}>
          <AnimatePresence mode="wait">
            {apostas.map((aposta, i) => (
              <motion.div
                key={aposta.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-purple-700">
                    Aposta {i + 1} {i >= 5 && '(Modo Grok)'}
                  </h3>
                  {isVip && (
                    <button
                      onClick={() => saveGame(aposta)}
                      disabled={savedGames.includes(aposta.id)}
                      className={`p-3 rounded-full transition-all ${
                        savedGames.includes(aposta.id)
                          ? 'bg-green-100 text-green-600'
                          : 'hover:bg-gray-100 text-gray-500'
                      }`}
                    >
                      {savedGames.includes(aposta.id) ? <CheckCircle className="w-6 h-6" /> : <Save className="w-6 h-6" />}
                    </button>
                  )}
                </div>

                {viewMode === 'balls' ? (
                  <div className="flex flex-wrap gap-4 justify-center">
                    {aposta.numbers.map(num => (
                      <LotteryBall
                        key={num}
                        number={num}
                        isFixed={fixos.includes(num)}
                        className={fixos.includes(num) ? 'ring-4 ring-yellow-400 scale-110' : ''}
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

        {!isVip && apostas.length > 0 && (
          <div className="text-center mt-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-3xl">
            <Lock className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">Quer palpites novos todo dia?</h3>
            <p className="text-lg mb-6">Torne-se VIP e gere palpites ilimitados com estratégias exclusivas!</p>
            <Link to="/vip" className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-xl hover:bg-gray-100 transition">
              Virar VIP Agora
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}