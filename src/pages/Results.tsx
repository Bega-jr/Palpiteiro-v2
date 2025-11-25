import { useState } from 'react';
import { Search, Calendar, MapPin, Monitor, Trophy } from 'lucide-react';
import { MOCK_LATEST_RESULT } from '../utils/mockResults';
import { LotteryBall } from '../components/LotteryBall';

export function Results() {
  const [searchTerm, setSearchTerm] = useState('');
  const result = MOCK_LATEST_RESULT;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resultados da Lotofácil</h1>
            <p className="text-gray-600 mt-1">Confira os números sorteados e a premiação detalhada.</p>
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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="bg-purple-900 p-6 text-white">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Trophy className="w-8 h-8 text-yellow-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Concurso {result.concurso}</h2>
                  <div className="flex items-center gap-2 text-purple-200 text-sm">
                    <Calendar className="w-4 h-4" />
                    {result.data}
                  </div>
                </div>
              </div>
              
              {result.acumulado && (
                <div className="bg-yellow-400 text-purple-900 px-4 py-1 rounded-full font-bold text-sm animate-pulse">
                  ACUMULOU!
                </div>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 text-center md:text-left">Dezenas Sorteadas</h3>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {result.dezenas.map(num => (
                  <LotteryBall key={num} number={num} className="bg-purple-50 text-purple-700 border-purple-200" />
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-100 mb-8">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3">Faixa</th>
                    <th className="px-6 py-3 text-center">Ganhadores</th>
                    <th className="px-6 py-3 text-right">Prêmio (R$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.premiacao.map((tier) => (
                    <tr key={tier.acertos} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-medium text-gray-900">{tier.acertos} Acertos</td>
                      <td className="px-6 py-4 text-center">
                        {tier.ganhadores > 0 ? tier.ganhadores : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-green-600">
                        {formatCurrency(tier.premio)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Ganhadores por Região (15 acertos)
                </h3>
                {result.ganhadoresPorLocal.length > 0 ? (
                  <ul className="space-y-3">
                    {result.ganhadoresPorLocal.map((local, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                        <span className="font-medium text-gray-700">{local.cidade} / {local.uf}</span>
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">
                          {local.ganhadores} aposta(s)
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">Nenhum ganhador nesta faixa.</p>
                )}
              </div>

              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-blue-600" />
                  Apostas Digitais
                </h3>
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                  <span className="text-gray-600">Canal Eletrônico</span>
                  <span className="font-bold text-gray-900">
                    {result.ganhadoresCanalEletronico === 0 ? 'Nenhuma aposta vencedora' : `${result.ganhadoresCanalEletronico} ganhadores`}
                  </span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Arrecadação Total</span>
                    <span className="font-bold text-gray-900">{formatCurrency(result.arrecadacaoTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-gray-600">Próximo Prêmio (Estimado)</span>
                    <span className="font-bold text-purple-600">{formatCurrency(result.proximoPremio)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
