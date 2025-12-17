import { useState } from 'react'
import { Wand2, RefreshCw, Trophy, Save, CheckCircle, List, Grid3X3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LotteryBall } from './LotteryBall'
import { TicketView } from './TicketView'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

// Aposta agora reflete a estrutura do backend
interface Aposta {
  id: number
  numbers: number[]
  estrategia: string
}

interface PalpitesResponse {
  gerado_em: string
  fixos: number[]
  apostas: number[][]
  erro?: string // Adicionado para tratar erros do backend
}

// Exportação padrão para corrigir o erro de build anterior
export default function Generator() {
  const { isVip, user } = useAuth()
  const [apostas, setApostas] = useState<Aposta[]>([])
  const [fixos, setFixos] = useState<number[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [viewMode, setViewMode] = useState<'balls' | 'ticket'>('balls')
  const [savedGames, setSavedGames] = useState<number[]>([])

  // URL do backend (ajustar conforme o deploy final)
  const BACKEND_URL = 'https://palpiteiro-v2-backend.vercel.app' 

  const handleGenerate = async ( ) => {
    setIsGenerating(true)

    try {
      // O novo endpoint é /api/palpites
      const response = await fetch(`${BACKEND_URL}/api/palpites`)
      const data: PalpitesResponse = await response.json()

      if (data.apostas && data.fixos) {
        // O backend não retorna a estratégia, então vamos usar uma lista genérica
        // O backend gera 5 com fixos e 2 aleatórias, então ajustamos as estratégias
        const estrategias = [
          'Estratégia 1 (Fixos)', 
          'Estratégia 2 (Fixos)', 
          'Estratégia 3 (Fixos)', 
          'Estratégia 4 (Fixos)', 
          'Estratégia 5 (Fixos)', 
          'Estratégia 6 (Aleatória)', 
          'Estratégia 7 (Aleatória)'
        ]
        
        const novosJogos: Aposta[] = data.apostas.map((nums: number[], i: number) => ({
          id: i + 1,
          numbers: nums,
          estrategia: estrategias[i] || 'Estratégia Padrão'
        }))

        setApostas(novosJogos)
        setFixos(data.fixos)
        toast.success('Palpites gerados com sucesso!')
      } else if (data.erro) {
        toast.error(`Erro do Backend: ${data.erro}`)
      } else {
        toast.error('Resposta da API inválida.')
      }
    } catch (e) {
      console.error(e)
      toast.error('Erro ao conectar com o servidor de palpites.')
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
        contest_type: 'standard'
      })

      if (!error) {
        setSavedGames(prev => [...prev, aposta.id])
        toast.success('Jogo salvo com sucesso!')
      } else {
        toast.error('Erro ao salvar jogo')
      }
    } catch {
      toast.error('Erro ao salvar jogo')
    }
  }

  return (
    <section className="py-16 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Gerador de Desdobramentos
          </h2>
          <p className="text-xl text-gray-700">Baseado em dados oficiais da Caixa</p>
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
                Gerando...
              </>
            ) : (
              <>
                <Wand2 className="w-12 h-12" />
                Gerar 7 Palpites
              </>
            )}
          </button>
        </div>

        {/* Apostas */}
        {apostas.length > 0 && (
          <>
            {/* Botões de visualização */}
            <div className="flex justify-center gap-8 mb-12">
              <button
                onClick={() => setViewMode('balls')}
                className={`px-10 py-4 rounded-xl font-bold text-xl transition-all flex items-center gap-2 ${viewMode === 'balls' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <List className="w-6 h-6" /> Bolas
              </button>
              <button
                onClick={() => setViewMode('ticket')}
                className={`px-10 py-4 rounded-xl font-bold text-xl transition-all flex items-center gap-2 ${viewMode === 'ticket' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <Grid3X3 className="w-6 h-6" /> Bilhete
              </button>
            </div>

            {/* Lista de apostas */}
            <div className={viewMode === 'ticket' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12" : "space-y-12"}>
              {apostas.map((aposta, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-3xl p-10 shadow-2xl border-4 border-purple-100 hover:border-purple-400 transition-all"
                >
                  {/* Título + Botão Salvar */}
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-3xl font-black text-purple-700">
                      Aposta {i + 1} — {aposta.estrategia}
                    </h3>

                    {/* BOTÃO SALVAR — GIGANTE E VISÍVEL */}
                    <button
                      onClick={() => saveGame(aposta)}
                      disabled={savedGames.includes(aposta.id)}
                      className={`px-10 py-5 rounded-full font-black text-2xl shadow-2xl transition-all flex items-center gap-4 ${
                        savedGames.includes(aposta.id)
                          ? 'bg-green-500 text-white'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-110'
                      }`}
                    >
                      {savedGames.includes(aposta.id) ? (
                        <>
                          <CheckCircle className="w-10 h-10" />
                          Salvo!
                        </>
                      ) : (
                        <>
                          <Save className="w-10 h-10" />
                          Salvar Jogo
                        </>
                      )}
                    </button>
                  </div>

                  {/* Visualização */}
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
