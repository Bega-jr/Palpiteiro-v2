import { useState, useEffect } from 'react'
import { Calendar, Trophy, Users, DollarSign, Loader2, MapPin } from 'lucide-react'
import { LotteryBall } from '../components/LotteryBall'
import { toast } from 'sonner'

interface Faixa {
  faixa: string
  ganhadores: number
  premio: string
  cidades?: { cidade: string; uf: string; ganhadores: number }[]
}

interface Resultado {
  ultimo_concurso: string
  data_ultimo: string
  ultimos_numeros: number[]
  ganhadores: Faixa[]
  arrecadacao: string
  estimativa_proximo: string
  acumulou: boolean
  data_referencia: string
}

export function Results() {
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [loading, setLoading] = useState(true)

  const BACKEND_URL = 'https://palpiteiro-v2-backend.vercel.app'

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true)
        const res = await fetch(`${BACKEND_URL}/api/resultados`)
        const data = await res.json()
        setResultado(data)
      } catch (err) {
        toast.error('Erro ao carregar resultados oficiais')
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [])

  if (loading) {
    return (
      <div className="pt-32 text-center">
        <Loader2 className="w-16 h-16 animate-spin mx-auto text-purple-600" />
        <p className="mt-6 text-2xl text-gray-600">Carregando resultados oficiais da Caixa...</p>
      </div>
    )
  }

  if (!resultado || resultado.erro) {
    return (
      <div className="pt-32 text-center">
        <p className="text-2xl text-red-600">
          {resultado?.erro || 'Erro ao carregar resultados. Tente novamente.'}
        </p>
      </div>
    )
  }

  const cidadesPremiadas = resultado.ganhadores[0]?.cidades || []

  return (
    <div className="pt-20 pb-24 min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
            Resultados da Lotofácil
          </h1>
          <p className="text-xl text-gray-700">
            Dados oficiais da Caixa — Atualizado em <strong>{resultado.data_referencia}</strong>
          </p>
        </div>

        {/* Concurso Atual */}
        <div className="bg-gradient-to-r from-purple-900 to-pink-800 text-white rounded-3xl shadow-2xl p-12 mb-16 text-center">
          <Trophy className="w-20 h-20 mx-auto mb-4 text-yellow-400" />
          <h2 className="text-7xl font-black mb-2">Concurso {resultado.ultimo_concurso}</h2>
          <p className="text-3xl opacity-90 flex items-center justify-center gap-3">
            <Calendar className="w-10 h-10" />
            {resultado.data_ultimo}
          </p>
          {resultado.acumulou && (
            <div className="mt-8 bg-yellow-400 text-purple-900 px-12 py-5 rounded-full inline-block text-4xl font-black animate-pulse">
              ACUMULOU!
            </div>
          )}
        </div>

        {/* Números Sorteados */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 mb-16">
          <h3 className="text-4xl font-bold text-center mb-10 text-purple-800">Números Sorteados</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {resultado.ultimos_numeros.map(num => (
              <LotteryBall key={num} number={num} className="w-24 h-24 text-4xl shadow-2xl" />
            ))}
          </div>
        </div>

        {/* Premiação Completa */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 mb-16">
          <h3 className="text-4xl font-bold text-center mb-12 text-purple-800">Premiação Completa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {resultado.ganhadores.map((faixa, i) => (
              <div key={i} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border-4 border-purple-200 shadow-xl text-center">
                <p className="text-5xl font-black text-purple-700 mb-4">{faixa.faixa}</p>
                <div className="space-y-6">
                  <div>
                    <p className="text-lg font-bold text-gray-800 flex items-center justify-center gap-3">
                      <Users className="w-7 h-7" /> Ganhadores
                    </p>
                    <p className="text-3xl font-black text-purple-800">
                      {faixa.ganhadores > 0 ? faixa.ganhadores : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800 flex items-center justify-center gap-3">
                      <DollarSign className="w-7 h-7" /> Prêmio
                    </p>
                    <p className="text-2xl font-black text-green-600">
                      {faixa.premio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cidades Premiadas (15 acertos) */}
        {cidadesPremiadas.length > 0 ? (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl shadow-2xl p-12 mb-16">
            <div className="flex items-center justify-center gap-4 mb-10">
              <MapPin className="w-14 h-14 text-orange-600" />
              <h3 className="text-5xl font-black text-orange-800">Cidades Premiadas - 15 Acertos</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cidadesPremiadas.map((cidade, i) => (
                <div key={i} className="bg-white rounded-3xl p-10 shadow-2xl border-4 border-orange-200 text-center">
                  <p className="text-4xl font-black text-orange-700 mb-4">
                    {cidade.cidade.toUpperCase()}/{cidade.uf}
                  </p>
                  <p className="text-2xl text-gray-700">
                    {cidade.ganhadores} ganhador{cidade.ganhadores > 1 ? 'es' : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-2xl p-12 mb-16 text-center">
            <Trophy className="w-20 h-20 mx-auto mb-6 text-yellow-500" />
            <h3 className="text-4xl font-black text-gray-800 mb-4">Nenhum ganhador de 15 acertos</h3>
            <p className="text-2xl text-gray-600">O prêmio acumulou para o próximo concurso!</p>
          </div>
        )}

        {/* Informações Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-10 shadow-2xl">
            <p className="text-2xl font-bold text-gray-800">Arrecadação Total</p>
            <p className="text-4xl font-black text-purple-700 mt-4">{resultado.arrecadacao}</p>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-10 shadow-2xl">
            <p className="text-2xl font-bold text-gray-800">Estimativa Próximo</p>
            <p className="text-4xl font-black text-green-600 mt-4">{resultado.estimativa_proximo}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl p-10 shadow-2xl">
            <p className="text-2xl font-bold text-gray-800">Total de Sorteios</p>
            <p className="text-4xl font-black text-blue-700 mt-4">{resultado.total_sorteios}</p>
          </div>
        </div>

        <div className="text-center text-gray-500 text-lg mt-20">
          <p>Dados oficiais da Caixa Econômica Federal</p>
          <p>Palpiteiro V2 © 2025 — O mais completo do Brasil</p>
        </div>
      </div>
    </div>
  )
}