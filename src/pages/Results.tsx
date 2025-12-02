import { useState, useEffect } from 'react'
import { Calendar, Trophy, DollarSign, Loader2, MapPin, AlertCircle } from 'lucide-react'
import { LotteryBall } from '../components/LotteryBall'
import { Link } from 'react-router-dom'
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
  acumulado_especial?: string
  observacao?: string
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!resultado || resultado.erro) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-red-600">Erro ao carregar. Tente novamente.</p>
      </div>
    )
  }

  const isAcumulou = resultado.acumulou
  const cidades = resultado.cidades_premiadas || []

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Concurso e Data */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            Concurso {resultado.ultimo_concurso}
          </h1>
          <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
            <Calendar className="w-6 h-6" />
            {resultado.data_ultimo}
          </p>
        </div>

        {/* Números Sorteados */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h3 className="text-xl font-bold text-center mb-6 text-gray-800">Números Sorteados</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {resultado.ultimos_numeros.map(num => (
              <LotteryBall key={num} number={num} className="w-16 h-16 text-2xl" />
            ))}
          </div>
        </div>

        {/* ACUMULOU! ou Estimativa */}
        {isAcumulou ? (
          <div className="bg-red-100 border-2 border-red-300 rounded-2xl p-8 mb-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <div className="bg-red-600 text-white px-12 py-6 rounded-full text-4xl font-black shadow-2xl">
              ACUMULOU!
            </div>
            <p className="text-3xl font-bold text-red-700 mt-6">
              {resultado.estimativa_proximo}
            </p>
          </div>
        ) : (
          <div className="bg-green-100 border-2 border-green-300 rounded-2xl p-8 mb-12 text-center">
            <p className="text-3xl font-bold text-green-800 mb-4">Próximo Prêmio</p>
            <p className="text-4xl font-black text-green-700">
              {resultado.estimativa_proximo}
            </p>
          </div>
        )}

        {/* Tabela de Premiação */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-xl font-bold text-center mb-6 text-gray-800">Premiação por Faixa</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="px-6 py-4 text-lg font-bold text-gray-700">Faixa</th>
                <th className="px-6 py-4 text-lg font-bold text-center text-gray-700">Ganhadores</th>
                <th className="px-6 py-4 text-lg font-bold text-right text-gray-700">Prêmio</th>
              </tr>
            </thead>
            <tbody>
              {resultado.ganhadores.map((faixa, i) => (
                <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-lg font-semibold text-gray-900">
                    {faixa.faixa}
                  </td>
                  <td className="px-6 py-4 text-lg font-semibold text-center text-gray-900">
                    {faixa.ganhadores > 0 ? faixa.ganhadores.toLocaleString('pt-BR') : '-'}
                  </td>
                  <td className="px-6 py-4 text-lg font-semibold text-right text-green-700">
                    {faixa.premio}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cidades Premiadas */}
        {cidades.length > 0 && (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl shadow-2xl p-12 mb-16">
            <div className="flex items-center justify-center gap-4 mb-10">
              <MapPin className="w-14 h-14 text-orange-600" />
              <h3 className="text-4xl font-black text-orange-800">Cidades Premiadas - 15 Acertos</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cidades.map((cidade, i) => (
                <div key={i} className="bg-white rounded-3xl p-10 shadow-2xl border-4 border-orange-200 text-center">
                  <p className="text-3xl font-black text-orange-700 mb-4">
                    {cidade.cidade.toUpperCase()}/{cidade.uf}
                  </p>
                  <p className="text-xl text-gray-700">
                    {cidade.ganhadores} ganhador{cidade.ganhadores > 1 ? 'es' : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informações Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
          <div className="bg-gray-100 rounded-2xl p-8">
            <p className="text-lg font-bold text-gray-700">Arrecadação Total</p>
            <p className="text-3xl font-black text-gray-900 mt-4">{resultado.arrecadacao}</p>
          </div>
          <div className="bg-gray-100 rounded-2xl p-8">
            <p className="text-lg font-bold text-gray-700">Estimativa Próximo</p>
            <p className="text-3xl font-black text-green-600 mt-4">{resultado.estimativa_proximo}</p>
          </div>
        </div>

        {/* Acumulado Especial / Observação */}
        {(resultado.acumulado_especial && resultado.acumulado_especial !== 'R$0,00') || resultado.observacao ? (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-8 mt-12 text-center">
            <p className="text-2xl font-bold text-yellow-800">
              {resultado.observacao || `Acumulado Especial: ${resultado.acumulado_especial}`}
            </p>
          </div>
        ) : null}

        <div className="text-center text-gray-600 text-base mt-20">
          <p>Dados oficiais da Caixa Econômica Federal</p>
          <p>Palpiteiro V2 © 2025</p>
        </div>
      </div>
    </div>
  )
}