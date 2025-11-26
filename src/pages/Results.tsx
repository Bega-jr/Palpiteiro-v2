import { useState, useEffect } from 'react'
import { Search, Calendar, MapPin, Monitor, Trophy, Loader2 } from 'lucide-react'
import { LotteryBall } from '../components/LotteryBall'
import { toast } from 'sonner'

interface Resultado {
  ultimo_concurso: string
  data_ultimo: string
  ultimos_numeros: number[]
  quentes: number[]
  frios: number[]
  total_sorteios: number
}

export function Results() {
  const [searchTerm, setSearchTerm] = useState('')
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [loading, setLoading] = useState(true)

  const BACKEND_URL = 'https://palpiteiro-v2-backend.onrender.com'

  useEffect(() => {
    async function carregarResultados() {
      try {
        setLoading(true)
        const response = await fetch(`${BACKEND_URL}/api/resultados`)
        const data = await response.json()

        if (data.ultimo_concurso) {
          setResultado(data)
        } else {
          toast.error('Erro ao carregar resultados')
        }
      } catch (err) {
        console.error('Erro:', err)
        toast.error('Falha na conexão com o servidor de resultados')
      } finally {
        setLoading(false)
      }
    }

    carregarResultados()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (loading) {
    return (
      <div className="pt-32 text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary-600" />
        <p className="mt-4 text-xl text-gray-600">Carregando resultados oficiais...</p>
      </div>
    )
  }

  if (!resultado) {
    return (
      <div className="pt-32 text-center">
        <p className="text-xl text-red-600">Erro ao carregar resultados. Tente novamente.</p>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resultados da Lotofácil</h1>
            <p className="text-gray-600 mt-1">Dados oficiais atualizados automaticamente</p>
          </div>
          
          <div className="relative w-full md:w-64">
            <input
              type="number"
              placeholder="Buscar concurso..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-900 to-purple-700 p-8 text-white">
            <div className="flex flex-wrap justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Trophy className="w-10 h-10 text-yellow-300" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold">Concurso {resultado.ultimo_concurso}</h2>
                  <div className="flex items-center gap-2 text-purple-200 text-lg mt-1">
                    <Calendar className="w-5 h-5" />
                    {resultado.data_ultimo}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm opacity-90">Total de sorteios no histórico</p>
                <p className="text-3xl font-bold">{resultado.total_sorteios}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-10">
              <h3 className="text-lg font-bold text-gray-800 mb-6 text-center md:text-left">
                Dezenas Sorteadas
              </h3>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {resultado.ultimos_numeros.map(num => (
                  <LotteryBall 
                    key={num} 
                    number={num} 
                    className="bg-purple-100 text-purple-700 border-purple-300 shadow-md scale-110" 
                  />
                ))}
              </div>
            </div>

            {/* Estatísticas Quentes/Frios */}
            <div className="grid md:grid-cols-2 gap-10 mt-12">
              <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-2xl border border-red-100">
                <h3 className="text-2xl font-bold text-red-700 mb-6 flex items-center gap-3">
                  Números Mais Quentes (fogo)
                </h3>
                <div className="flex flex-wrap gap-4 justify-center">
                  {resultado.quentes.map(num => (
                    <div key={num} className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg ring-4 ring-red-200">
                      {num.toString().padStart(2, '0')}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
                <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-3">
                  Números Mais Frios (gelo)
                </h3>
                <div className="flex flex-wrap gap-4 justify-center">
                  {resultado.frios.map(num => (
                    <div key={num} className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg ring-4 ring-blue-200">
                      {num.toString().padStart(2, '0')}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 text-center text-sm text-gray-500">
              <p>Dados atualizados automaticamente • Fonte: MazuSoft + Caixa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}