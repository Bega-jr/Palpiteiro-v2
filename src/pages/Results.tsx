import { useEffect, useState } from "react";
import { Search, Calendar, Trophy, MapPin, Monitor } from "lucide-react";
import { toast } from "sonner";
import { LotteryBall } from "../components/LotteryBall";

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
        const response = await fetch("/api/resultados");
        if (!response.ok) throw new Error("Erro na API");

        const data: BackendResult = await response.json();

        if (data.erro) {
          toast.error(data.erro);
          return;
        }

        setResult(data);
      } catch (err) {
        toast.error("Não foi possível carregar os resultados.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Carregando resultados...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-red-600">Erro ao carregar os resultados.</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Resultados da Lotofácil</h1>
          <p className="text-gray-600 mt-2">Últimos números sorteados e estatísticas completas</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-700 to-purple-900 p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Trophy className="w-10 h-10 text-yellow-300" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Concurso {result.ultimo_concurso}</h2>
                  <div className="flex items-center gap-2 text-purple-100 mt-1">
                    <Calendar className="w-5 h-5" />
                    {result.data_ultimo}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-6 text-center">
              Dezenas Sorteadas
            </h3>
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {result.ultimos_numeros.map((num) => (
                <LotteryBall
                  key={num}
                  number={num}
                  className="bg-purple-100 text-purple-800 border-purple-300"
                />
              ))}
            </div>

            <div className="text-center text-sm text-gray-600 mb-8">
              Total de sorteios analisados: <span className="font-bold">{result.total_sorteios}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-green-600" />
                  Números Mais Quentes (Top 10)
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {result.quentes.map((num) => (
                    <LotteryBall
                      key={num}
                      number={num}
                      className="bg-green-100 text-green-800 border-green-300"
                    />
                  ))}
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-3">
                  <Monitor className="w-6 h-6 text-red-600" />
                  Números Mais Frios (Top 10)
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {result.frios.map((num) => (
                    <LotteryBall
                      key={num}
                      number={num}
                      className="bg-red-100 text-red-800 border-red-300"
                    />
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