import { useState, useEffect } from 'react'
import { Calendar, Trophy, DollarSign, MapPin, AlertCircle } from 'lucide-react'
import { LotteryBall } from '../components/LotteryBall'
import { toast } from 'sonner'

export function Results() {
  const [resultado, setResultado] = useState<any>(null)
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
        toast.error('Erro ao carregar resultados')
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-6 text-xl text-gray-600">Carregando resultados...</p>
        </div>
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
  const cidades = resultado.ganhadores[0]?.cidades || []

  return (
    <div className="min-h-screen bg-white pt-20 pb-32 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Concurso + Data */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-black text-purple-900 mb-4">
            Concurso {resultado.ultimo_concurso}
          </h1>
          <p className="text-2xl text-gray-600 flex items-center justify-center gap-3">
            <Calendar className="w-8 h-8" />
            {resultado.data_ultimo}
          </p>
        </div>

        {/* Números Sorteados */}
        <div className="flex flex-wrap justify-center gap-6 mb-20">
          {resultado.ultimos_numeros.map((num: number) => (
            <LotteryBall key={num} number={num} className="w-20 h-20 md:w-28 md:h-28 text-4xl md:text-5xl" />
          ))}
        </div>

        {/* ACUMULOU! ou PRÊMIO ESTIMADO */}
        <div className="text-center mb-20">
          {isAcumulou ? (
            <div className="inline-block">
              <div className="bg-red-600 text-white px-16 py-8 rounded-full text-5xl md:text-7xl font-black animate-pulse shadow-2xl">
                ACUMULOU!
              </div>
              <p className="text-4xl md:text-6xl font-black text-red-600 mt-8">
                {resultado.estimativa_proximo}
              </p>
              <p className="text-2xl text-gray-700 mt-4">Próximo concurso</p>
            </div>
          ) : (
            <div>
              <p className="text-4xl md:text-6xl font-black text-green-600">
                {resultado.estimativa_proximo}
              </p>
              <p className="text-2xl text-gray-700 mt-4">Estimativa próximo concurso</p>
            </div>
          )}
        </div>

        {/* Tabela Premiação */}
        <div className="bg-gray-50 rounded-3xl p-10 mb-20">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-4 border-purple-200">
                <th className="pb-6 text-2xl font-bold text-purple-800">Faixa</th>
                <th className="pb-6 text-2xl font-bold text-center text-purple-800">Ganhadores</th>
                <th className="pb-6 text-2xl font-bold text-right text-purple-800">Prêmio</th>
              </tr>
            </thead>
            <tbody>
              {resultado.ganhadores.map((faixa: any, i: number) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-6 text-2xl font-black text-purple-700">{faixa.faixa}</td>
                  <td className="py-6 text-2xl font-bold text-center text-gray-800">
                    {faixa.ganhadores > 0 ? faixa.ganhadores.toLocaleString('pt-BR') : '-'}
                  </td>
                  <td className="py-6 text-2xl font-bold text-right text-green-600">
                    {faixa.premio}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cidades Premiadas */}
        {cidades.length > 0 && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <MapPin className="w-12 h-12 text-orange-600" />
              <h3 className="text-4xl font-black text-orange-800">Cidades Premiadas (15 acertos)</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {cidades.map((c: any, i: number) => (
                <div key={i} className="bg-orange-50 rounded-2xl p-8 border-4 border-orange-300 text-center">
                  <p className="text-3xl font-black text-orange-700">
                    {c.cidade.toUpperCase()}/{c.uf}
                  </p>
                  <p className="text-xl text-gray-700 mt-3">
                    {c.ganhadores} ganhador{c.ganhadores > 1 ? 'es' : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rodapé */}
        <div className="text-center text-gray-500 text-lg mt-32">
          <p>Dados oficiais da Caixa Econômica Federal</p>
          <p>Palpiteiro V2 © 2025</p>
        </div>
      </div>
    </div>
  )
}