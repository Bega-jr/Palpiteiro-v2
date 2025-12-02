import { useState, useEffect } from 'react'
import { Calendar, Trophy, DollarSign, TrendingUp, MapPin, AlertCircle } from 'lucide-react'
import { LotteryBall } from '../components/LotteryBall'
import { toast } from 'sonner'

interface Faixa {
  faixa: string
  ganhadores: number
  premio: string
}

interface CidadePremiada {
  cidade: string
  uf: string
  ganhadores: number
}

interface Resultado {
  ultimo_concurso: string
  data_ultimo: string
  ultimos_numeros: number[]
  ganhadores: Faixa[]
  arrecadacao: string
  estimativa_proximo: string
  acumulou: boolean
  cidades_premiadas: CidadePremiada[]
  is_especial: boolean
  tipo_especial?: string
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
      } catch {
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
        <div className="inline-block">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="mt-6 text-2xl text-gray-600">Carregando resultados oficiais...</p>
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

  const isAcumulou = resultado.acumulou
  const isEspecial = resultado.is_especial

  return (
    <div className="pt-16 pb-24 min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-5xl mx-auto px-4">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
            Resultados da Lotofácil
          </h1>
          <p className="text-lg text-gray-600">
            Dados oficiais da Caixa — Atualizado em <strong>{resultado.data_referencia}</strong>
          </p>
        </div>

        {/* Destaque do Concurso */}
        <div className={`rounded-3xl shadow-2xl p-12 mb-16 text-center text-white ${isAcumulou ? 'bg-gradient-to-r from-red-600 to-pink-700' : 'bg-gradient-to-r from-purple-900 to-pink-800'}`}>
          <Trophy className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 text-yellow-400" />
          <h2 className="text-6xl md:text-8xl font-black mb-4">
            Concurso {resultado.ultimo_concurso}
          </h2>
          <p className="text-2xl md:text-3xl opacity-90 flex items-center justify-center gap-4">
            <Calendar className="w-10 h-10" />
            {resultado.data_ultimo}
          </p>

          {/* ACUMULOU! */}
          {isAcumulou && (
            <div className="mt-10">
              <div className="inline-block bg-yellow-400 text-red-700 px-16 py-8 rounded-full text-5xl md:text-7xl font-black animate-pulse shadow-2xl">
                ACUMULOU!
              </div>
            </div>
          )}

          {/* CONCURSO ESPECIAL */}
          {isEspecial && (
            <div className="mt-8">
              <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 px-16 py-8 rounded-full text-4xl md:text-6xl font-black shadow-2xl">
                {resultado.tipo_especial || 'CONCURSO ESPECIAL'}
              </div>
            </div>
          )}
        </div>

        {/* Números Sorteados */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 mb-16">
          <h3 className="text-4xl font-bold text-center mb-10 text-purple-800">Números Sorteados</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {resultado.ultimos_numeros.map(num => (
              <LotteryBall key={num} number={num} className="w-20 h-20 md:w-24 md:h-24 text-3xl md:text-4xl shadow-2xl" />
            ))}
          </div>
        </div>

        {/* Próximo Prêmio Estimado */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl shadow-2xl p-12 mb-16 text-center">
          <TrendingUp className="w-20 h-20 mx-auto mb-6" />
          <p className="text-3xl font-bold mb-4">Estimativa para o próximo concurso</p>
          <p className="text-7xl md:text-8xl font-black">
            {resultado.estimativa_proximo}
          </p>
        </div>

        {/* Premiação Completa */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 mb-16">
          <h3 className="text-4xl font-bold text-center mb-12 text-purple-800">Premiação Completa</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <th className="px-8 py-6 text-xl font-bold rounded-tl-2xl">Faixa</th>
                  <th className="px-8 py-6 text-xl font-bold text-center">Ganhadores</th>
                  <th className="px-8 py-6 text-xl font-bold text-right rounded-tr-2xl">Prêmio</th>
                </tr>
              </thead>
              <tbody>
                {resultado.ganhadores.map((faixa, i) => (
                  <tr key={i} className="border-b-4 border-gray-100 hover:bg-purple-50 transition">
                    <td className="px-8 py-6 text-2xl font-black text-purple-700">
                      {faixa.faixa}
                    </td>
                    <td className="px-8 py-6 text-2xl font-bold text-center text-gray-800">
                      {faixa.ganhadores > 0 ? faixa.ganhadores.toLocaleString('pt-BR') : '-'}
                    </td>
                    <td className="px-8 py-6 text-2xl font-bold text-right text-green-600">
                      {faixa.premio}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cidades Premiadas (15 acertos) */}
        {resultado.cidades_premiadas && resultado.cidades_premiadas.length > 0 ? (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl shadow-2xl p-12">
            <div className="flex items-center justify-center gap-6 mb-10">
              <MapPin className="w-16 h-16 text-orange-600" />
              <h3 className="text-5xl font-black text-orange-800">Cidades Premiadas - 15 Acertos</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resultado.cidades_premiadas.map((cidade, i) => (
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
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-2xl p-16 text-center mb-16">
            <Trophy className="w-24 h-24 mx-auto mb-8 text-yellow-500" />
            <h3 className="text-5xl font-black text-gray-800 mb-6">Nenhum ganhador de 15 acertos</h3>
            <p className="text-3xl text-gray-600">O prêmio acumulou para o próximo concurso!</p>
          </div>
        )}

        {/* Informações Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-center">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-10 shadow-2xl">
            <p className="text-2xl font-bold text-gray-800">Arrecadação Total</p>
            <p className="text-4xl font-black text-purple-700 mt-4">{resultado.arrecadacao}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl p-10 shadow-2xl">
            <p className="text-2xl font-bold text-gray-800">Total de Sorteios</p>
            <p className="text-4xl font-black text-blue-700 mt-4">{resultado.total_sorteios}</p>
          </div>
        </div>

        <div className="text-center text-gray-500 text-base mt-20">
          <p>Dados oficiais da Caixa Econômica Federal</p>
          <p>Palpiteiro V2 © 2025 — O mais completo do Brasil</p>
        </div>
      </div>
    </div>
  )
}