import { useState, useEffect } from 'react'
import { Calendar, Trophy, DollarSign, Loader2 } from 'lucide-react'
import { LotteryBall } from '../components/LotteryBall'
import { toast } from 'sonner'

interface Faixa {
  faixa: string
  ganhadores: number
  premio: string
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
        <p className="text-2xl text-red-600">
          {resultado?.erro || 'Erro ao carregar resultados. Tente novamente.'}
        </p>
      </div>
    )
  }

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
        {resultado.acumulou ? (
          <div className="bg-red-100 border-2 border-red-300 rounded-2xl p-8 mb-12 text-center">
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

        {/* Arrecadação */}
        <div className="text-center">
          <p className="text-lg text-gray-600">
            Arrecadação Total: <strong>{resultado.arrecadacao}</strong>
          </p>
        </div>

        <div className="text-center text-gray-500 text-base mt-20">
          <p>Dados oficiais da Caixa Econômica Federal</p>
          <p>Palpiteiro V2 © 2025</p>
        </div>
      </div>
    </div>
  )
}