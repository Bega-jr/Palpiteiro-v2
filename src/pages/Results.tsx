import { useEffect, useState } from 'react';
import { Search, Calendar, Trophy, MapPin, Monitor } from 'lucide-react';
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
  const [debugMode, setDebugMode] = useState(false); // Para você testar

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // MUDE AQUI: URL do seu backend (ex: https://seu-app.onrender.com)
        const API_BASE = 'https://palpiteiro-ia-backend-docker.onrender.com'; // Ou o URL real
        const response = await fetch(`${API_BASE}/api/resultados`);
        if (!response.ok) throw new Error('Falha na API');
        
        const data: BackendResult = await response.json();
        if (data.erro) {
          toast.error(data.erro);
          // Se erro de histórico vazio, sugere reset
          if (data.erro.includes('vazio')) {
            toast.info('Execute /api/reset no backend para popular dados reais.');
          }
          return;
        }
        setResult(data);
        toast.success(`Último sorteio carregado: Concurso ${data.ultimo_concurso}`);
      } catch (err) {
        toast.error('Erro ao conectar com o backend. Verifique se está online.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const toggleDebug = () => {
    setDebugMode(!debugMode);
    window.open(`${window.location.origin.replace('netlify.app', 'seu-backend.com')}/api/debug`, '_blank');
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Carregando último sorteio...</p>
      </div>
    );
  }

  if (!result || result.erro) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-xl text-red-600 mb-4">Erro: {result?.erro || 'Falha no carregamento'}</p>
        <button 
          onClick={() => window.location.href = '/api/reset'} // Ajuste para backend
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Resetar e Popular Dados Reais
        </button>
        <p className="text-sm text-gray-500 mt-2">Depois, recarregue a página.</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Resultados Lotofácil</h1>
          <button 
            onClick={toggleDebug}
            className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
          >
            Debug/Validar
          </button>
        </div>

        {/* ÚLTIMO SORTEIO - PRIORIDADE 1 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="bg-purple-600 text-white p-4 rounded-t-xl">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Concurso {result.ultimo_concurso} - {result.data_ultimo}
            </h2>
          </div>
          <div className="p-6">
            <h3 className="text-center font-semibold mb-4">Números Sorteados</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {result.ultimos_numeros.map(num => (
                <LotteryBall key={num} number={num} className="bg-purple-100 text-purple-800" />
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              Total de sorteios no histórico: {result.total_sorteios}
            </p>
          </div>
        </div>

        {/* ESTATÍSTICAS - SÓ MOSTRA SE TUDO OK */}
        {debugMode ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-xl">
              <h3 className="font-bold mb-2">Quentes (Top 10)</h3>
              <div className="flex flex-wrap gap-2">
                {result.quentes.map(num => (
                  <LotteryBall key={num} number={num} className="bg-green-100 text-green-800" />
                ))}
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-xl">
              <h3 className="font-bold mb-2">Frios (Top 10)</h3>
              <div className="flex flex-wrap gap-2">
                {result.frios.map(num => (
                  <LotteryBall key={num} number={num} className="bg-red-100 text-red-800" />
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}