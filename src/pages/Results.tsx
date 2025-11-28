import { useEffect, useState } from 'react';
import { Search, Calendar, MapPin, Monitor, Trophy } from 'lucide-react';
import { LotteryResult } from '../utils/mockResults';
import { toast } from 'sonner';
import { LotteryBall } from '../components/LotteryBall';

// A interface LotteryResult foi mantida, mas adaptada para a resposta do backend
// O backend retorna: ultimo_concurso, data_ultimo, ultimos_numeros, quentes, frios, total_sorteios
interface BackendResult {
  ultimo_concurso: number;
  data_ultimo: string;
  ultimos_numeros: number[];
  quentes: number[];
  frios: number[];
  total_sorteios: number;
  erro?: string;
}

export function Results() {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<BackendResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Chamada à API do backend
        const response = await fetch('/api/resultados');
        if (!response.ok) {
          throw new Error('Falha ao buscar resultados da API.');
        }
        const data: BackendResult = await response.json();
        
        // Trata o erro retornado pelo backend (ex: Histórico vazio)
        if (data.erro) {
          setError(true);
          toast.error(data.erro);
          return;
        }

        setResult(data);
      } catch (err) {
        console.error(err);
        setError(true);
        toast.error('Erro ao carregar resultados. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="pt-24 pb-12 bg-gray-50 min-h-screen flex justify-center items-center">
        <p className="text-xl text-gray-600">Carregando resultados...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="pt-24 pb-12 bg-gray-50 min-h-screen flex justify-center items-center">
        <p className="text-xl text-red-600">Erro ao carregar resultados. Tente novamente.</p>
      </div>
    );
  }

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
                  <h2 className="text-2xl font-bold">Concurso {result.ultimo_concurso}</h2>
                  <div className="flex items-center gap-2 text-purple-200 text-sm">
                    <Calendar className="w-4 h-4" />
                    {result.data_ultimo}
                  </div>
                </div>
              </div>
              
              {/* Removido: result.acumulado não existe na resposta do backend */}
              {/* {result.acumulado && (
                <div className="bg-yellow-400 text-purple-900 px-4 py-1 rounded-full font-bold text-sm animate-pulse">
                  ACUMULOU!
                </div>
              )} */}
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 text-center md:text-left">Dezenas Sorteadas</h3>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {result.ultimos_numeros.map(num => (
                  <LotteryBall key={num} number={num} className="bg-purple-50 text-purple-700 border-purple-200" />
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-100 mb-8">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3">Estatística</th>
                    <th className="px-6 py-3 text-center">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">Total de Sorteios Analisados</td>
                    <td className="px-6 py-4 text-center">
                      {result.total_sorteios}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Números Mais Quentes (Top 10)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.quentes.map(num => (
                    <LotteryBall key={num} number={num} className="bg-green-100 text-green-800 border-green-300" />
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-blue-600" />
                  Números Mais Frios (Top 10)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.frios.map(num => (
                    <LotteryBall key={num} number={num} className="bg-red-100 text-red-800 border-red-300" />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
