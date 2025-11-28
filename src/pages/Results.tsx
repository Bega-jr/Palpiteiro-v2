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

  // URL DO SEU BACKEND NO VERCEL — NUNCA MAIS MUDE
  const BACKEND_URL = 'https://palpiteiro-v2-backend.vercel.app';

   useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${BACKEND_URL}/api/resultados`);

        if (!response.ok) {
          throw new Error(`Erro ${response.status}`);
        }

        const data: BackendResult = await response.json();

        if (data.erro) {
          toast.error(data.erro);
          toast.info('Clique no botão abaixo para baixar os dados oficiais da Caixa');
          return;
        }

        setResult(data);
        toast.success(`Concurso ${data.ultimo_concurso} carregado com sucesso!`);
      } catch (err) {
        console.error('Erro ao conectar:', err);
        toast.error('Não foi possível conectar ao servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchResults(); // Chama a função
  }, []);

  const openReset = () => {
    window.open(`${BACKEND_URL}/api/reset`, '_blank');
  };

  const openDebug = () => {
    window.open(`${BACKEND_URL}/api/debug`, '_blank');
  };

  // TELA DE CARREGANDO
  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-2xl text-gray-700">Carregando resultados da Caixa...</p>
      </div>
    );
  }

  // TELA DE ERRO / HISTÓRICO VAZIO
  if (!result || result.erro) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-8 px-4 text-center">
        <div>
          <p className="text-3xl font-bold text-red-600 mb-3">Dados não carregados</p>
          <p className="text-gray-600 max-w-md mx-auto">
            {result?.erro || 'Ocorreu um erro ao buscar os resultados.'}
          </p>
        </div>

        <button
          onClick={openReset}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-5 px-12 rounded-2xl shadow-2xl text-xl transition transform hover:scale-105"
        >
          Baixar Dados Oficiais da Caixa Agora
        </button>

        <p className="text-gray-500 max-w-lg">
          Clique no botão → abre uma nova aba → espere aparecer <strong>"reset_sucesso": true</strong>
          <br />
          Depois volte aqui e aperte <strong>Ctrl + F5</strong>
        </p>
      </div>
    );
  }

  // TELA PRINCIPAL — TUDO FUNCIONANDO
  return (
    <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">

        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Resultados da Lotofácil</h1>
          <button
            onClick={openDebug}
            className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium"
          >
            Debug / Validar
          </button>
        </div>

        {/* Último Concurso */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-purple-700 to-purple-900 p-10 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="bg-white/20 p-5 rounded-2xl">
                  <Trophy className="w-16 h-16 text-yellow-300" />
                </div>
                <div>
                  <h2 className="text-5xl font-bold">Concurso {result.ultimo_concurso}</h2>
                  <p className="text-2xl text-purple-100 flex items-center gap-3 mt-2">
                    <Calendar className="w-6 h-6" />
                    {result.data_ultimo}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Dezenas Sorteadas
            </h3>
            <div className="flex flex-wrap justify-center gap-5">
              {result.ultimos_numeros.map((num) => (
                <LotteryBall
                  key={num}
                  number={num}
                  className="bg-purple-100 text-purple-800 border-4 border-purple-300 text-3xl w-20 h-20 font-bold"
                />
              ))}
            </div>

            <p className="text-center text-xl text-gray-600 mt-10">
              Total de sorteios analisados:{' '}
              <span className="font-bold text-purple-700 text-2xl">{result.total_sorteios}</span>
            </p>
          </div>
        </div>

        {/* Quentes e Frios */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Quentes */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-10 rounded-3xl shadow-xl">
            <h3 className="text-3xl font-bold text-green-800 mb-8 flex items-center gap-4 justify-center">
              <MapPin className="w-10 h-10 text-green-600" />
              Números Mais Quentes
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {result.quentes.map((num) => (
                <LotteryBall
                  key={num}
                  number={num}
                  className="bg-green-200 text-green-900 border-4 border-green-500 text-2xl w-16 h-16 font-bold"
                />
              ))}
            </div>
          </div>

          {/* Frios */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-10 rounded-3xl shadow-xl">
            <h3 className="text-3xl font-bold text-red-800 mb-8 flex items-center gap-4 justify-center">
              <Monitor className="w-10 h-10 text-red-600" />
              Números Mais Frios
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {result.frios.map((num) => (
                <LotteryBall
                  key={num}
                  number={num}
                  className="bg-red-200 text-red-900 border-4 border-red-500 text-2xl w-16 h-16 font-bold"
                />
              ))}
            </div>
          </div>
        </div>

        <p className="text-center mt-16 text-gray-500">
          Dados 100% oficiais da Caixa Econômica Federal • Atualizado automaticamente
        </p>
      </div>
    </div>
  );
}