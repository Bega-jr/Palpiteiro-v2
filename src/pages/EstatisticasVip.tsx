import { useState, useEffect } from 'react'
import { Trophy, Flame, Snowflake, TrendingUp, AlertTriangle, Target } from 'lucide-react'
import { LotteryBall } from '../components/LotteryBall'
import { toast } from 'sonner'

interface Estatistica {
  numero: number
  vezes: number
}

export function EstatisticasVip() {
  const [loading, setLoading] = useState(true)
  const [dados, setDados] = useState<{
    maisSorteados: Estatistica[]
    menosSorteados: Estatistica[]
    moda: number
    atrasados: number[]
    paresMaisComuns: [number, number, number][]
    somaMedia: number
    paresImpares: { pares: number; impares: number }
    finais: { [key: number]: number }
  } | null>(null)

  const BACKEND_URL = 'https://palpiteiro-v2-backend.vercel.app'

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true)
        const res = await fetch(`${BACKEND_URL}/api/estatisticas`)
        const data = await res.json()
        setDados(data)
      } catch {
        toast.error('Erro ao carregar estatísticas')
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-6 text-2xl text-gray-600">Carregando estatísticas VIP...</p>
        </div>
      </div>
    )
  }

  if (!dados) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
        <p className="text-2xl text-red-600">Erro ao carregar estatísticas</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Estatísticas VIP
          </h1>
          <p className="text-2xl text-gray-700">Tudo que você precisa pra dominar a Lotofácil</p>
        </div>

        {/* Mais e Menos Sorteados */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl p-12 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <Flame className="w-12 h-12 text-red-600" />
              <h3 className="text-4xl font-black text-red-800">Mais Sorteados</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {dados.maisSorteados.map((item, i) => (
                <div key={item.numero} className="text-center">
                  <LotteryBall number={item.numero} className="w-20 h-20 text-4xl" />
                  <p className="text-2xl font-black text-red-700 mt-2">{item.vezes}×</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-12 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <Snowflake className="w-12 h-12 text-blue-600" />
              <h3 className="text-4xl font-black text-blue-800">Menos Sorteados</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {dados.menosSorteados.map((item, i) => (
                <div key={item.numero} className="text-center">
                  <LotteryBall number={item.numero} className="w-20 h-20 text-4xl opacity-70" />
                  <p className="text-2xl font-black text-blue-700 mt-2">{item.vezes}×</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Moda + Atrasados */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-3xl p-12 text-center shadow-2xl">
            <Trophy className="w-20 h-20 mx-auto mb-6 text-yellow-600" />
            <p className="text-2xl font-bold text-gray-800">A Moda (mais sorteado)</p>
            <LotteryBall number={dados.moda} className="w-32 h-32 text-6xl mx-auto mt-6" />
            <p className="text-5xl font-black text-yellow-700 mt-4">{dados.maisSorteados.find(d => d.numero === dados.moda)?.vezes} vezes</p>
          </div>

          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-12 shadow-2xl">
            <div className="flex items-center justify-center gap-4 mb-8">
              <AlertTriangle className="w-12 h-12 text-orange-600" />
              <h3 className="text-4xl font-black text-orange-800">Atrasados (20+ concursos)</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {dados.atrasados.map(num => (
                <LotteryBall key={num} number={num} className="w-20 h-20 text-4xl ring-8 ring-orange-400" />
              ))}
            </div>
          </div>
        </div>

        {/* Soma média e Pares/Ímpares */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-12 text-center shadow-2xl">
            <Target className="w-20 h-20 mx-auto mb-6 text-purple-600" />
            <p className="text-2xl font-bold text-gray-800">Soma Média dos Sorteios</p>
            <p className="text-7xl font-black text-purple-700 mt-6">{dados.somaMedia.toFixed(0)}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-12 text-center shadow-2xl">
            <p className="text-2xl font-bold text-gray-800 mb-8">Média Pares x Ímpares</p>
            <div className="flex justify-center gap-12">
              <div>
                <p className="text-6xl font-black text-blue-700">{dados.paresImpares.pares}</p>
                <p className="text-xl text-gray-700">Pares</p>
              </div>
              <div>
                <p className="text-6xl font-black text-cyan-700">{dados.paresImpares.impares}</p>
                <p className="text-xl text-gray-700">Ímpares</p>
              </div>
            </div>
          </div>
        </div>

        {/* Finais mais comuns */}
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <h3 className="text-4xl font-black text-center mb-10 text-purple-800">Números por Final</h3>
          <div className="grid grid-cols-5 gap-8">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(final => (
              <div key={final} className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-5xl font-black shadow-2xl mb-4">
                  {final}
                </div>
                <p className="text-3xl font-black text-purple-700">{dados.finais[final] || 0}×</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-gray-600 text-lg mt-20">
          <p>Dados oficiais da Caixa — Atualizados diariamente</p>
          <p>Palpiteiro V2 VIP © 2025</p>
        </div>
      </div>
    </div>
  )
}