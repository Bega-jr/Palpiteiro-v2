import { useEffect, useState } from 'react';
import { Calendar, Trophy, MapPin, Monitor } from 'lucide-react';
import { toast } from 'sonner';
import { LotteryBall } from '../components/LotteryBall';

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
  const [result, setResult] = useState<BackendResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          'palpiteiro-v2-backend-production.up.railway.app'
        );

        if (!response.ok) {
          throw new Error(`Erro ${response.status}`);
        }

        const data: BackendResult = await response.json();

        if (data.erro) {
          toast.error(data.erro);
          if (data.erro.includes('vazio') || data.erro.includes('Histórico')) {
            toast.info('Clique no botão abaixo para baixar os dados oficiais da Caixa');
          }
          return;
        }

        setResult(data);
        toast.success(`Concurso ${data.ultimo_concurso} carregado com sucesso!`);
      } catch (err) {
        console.error('Erro ao buscar resultados:', err);
        toast.error('Não foi possível conectar ao servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Abre a página de debug em nova aba
  const openDebug = () => {
    window.open('palpiteiro-v2-backend-production.up.railway.app/api/debug', '_blank');
  };

  // Abre o reset em nova aba
  const openReset = () => {
    window.open('palpiteiro-v2-backend-production.up.railway.app/api/reset', '_blank');
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-2xl text-gray-700">Carregando resultados da Caixa...</p>
      </div>
    );
  }

  if (!result || result.erro) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-8 px-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600 mb-2">Dados não carregados</p>
          <p className="text-gray-600 text-center max-w-md">
            {result?.erro || 'Ocorreu um erro ao buscar os resultados.'}
          </p>
        </div>

        <button
          onClick={openReset}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-10 rounded-xl shadow-lg text-lg transition transform hover:scale-105"
        >
          Baixar Dados Oficiais da Caixa Agora
        </button>

        <p className="text-sm text-gray-500 text-center max-w-lg">
          Clique no botão acima → uma nova aba vai abrir → espere aparecer "reset_sucesso": true
          <br />
          Depois volte aqui e recarregue a página (Ctrl + F5).
        </p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Resultados da Lotofácil</h1>
          <button
            onClick={openDebug}
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Debug / Validar Dados
          </button>
        </div>

        {/* Card do último sorteio */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-purple-700 to-purple-900 p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-4 rounded-xl">
                  <Trophy className="w-12 h-12 text-yellow-300" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold">Concurso {result.ultimo_concurso}</h2>
                  <p className="text-purple-100 text-lg flex items-center gap-2 mt-1">
                    <Calendar className="w-5 h-5" />
                    {result.data_ultimo}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-center text-xl font-semibold text-gray-800 mb-6">
              Dezenas Sorteadas
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {result.ultimos_numeros.map((num) => (
                <LotteryBall
                  key={num}
                  number={num}
                  className="bg-purple-100 text-purple-800 border-2 border-purple-300 text-2xl w-16 h-16"
                />
              ))}
            </div>

            <p className="text-center text-gray-600 mt-8 text-lg">
              Total de sorteios analisados:{' '}
              <span className="font-bold text-purple-700">{result.total_sorteios}</span>
            </p>
          </div>
        </div>

        {/* Quentes e Frios */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Quentes */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-md shadow-lg">
            <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-3">
              <MapPin className="w-8 h-8 text-green-600" />
              Números Mais Quentes (Top 10)
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {result.quentes.map((num) => (
                <LotteryBall
                  key={num}
                  number={num}
                  className="bg-green-200 text-green-900 border-2 border-green-400 text-xl w-14 h-14"
                />
              ))}
            </div>
          </div>

          {/* Frios */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-red-800 mb-6 flex items-center gap-3">
              <Monitor className="w-8 h-8 text-red-600" />
              Números Mais Frios (Top 10)
            </h3>
            <div className="flex flex-wrap justify-center gap- gap-3">
              {result.frios.map((num) => (
                <LotteryBall
                  key={num}
                  number={num}
                  className="bg-red-200 text-red-900 border-2 border-red-400 text-xl w-14 h-14"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12 text-gray-500 text-sm">
          Dados 100% oficiais da Caixa • Atualizado automaticamente
        </div>
      </div>
    </div>
  );
}