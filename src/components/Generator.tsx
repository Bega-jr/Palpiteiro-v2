import { Wand2, RefreshCw, Grid3X3, List, Lock, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateSmartGames, GeneratedGame } from '../utils/lotteryLogic';
import { LotteryBall } from './LotteryBall';
import { StatsPanel } from './StatsPanel';
import { TicketView } from './TicketView';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function Generator() {
  const { isVip, user } = useAuth();
  const [games, setGames] = useState<GeneratedGame[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<'standard' | 'final_0'>('standard');
  const [viewMode, setViewMode] = useState<'balls' | 'ticket'>('balls');
  const [savedGames, setSavedGames] = useState<number[]>([]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGames([]);
    
    setTimeout(() => {
      const newGames = generateSmartGames(mode, isVip);
      setGames(newGames);
      setIsGenerating(false);
    }, 1500);
  };

  const saveGame = async (game: GeneratedGame) => {
    if (!user) return;
    
    try {
      const { error } = await supabase.from('saved_games').insert({
        user_id: user.id,
        numbers: game.numbers,
        contest_type: mode,
        stats: game.stats
      });

      if (!error) {
        setSavedGames(prev => [...prev, game.id]);
      }
    } catch (err) {
      console.error('Erro ao salvar', err);
    }
  };

  return (
    <section className="py-12 bg-gray-50" id="generator">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Gerador de Desdobramentos</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Gere 7 jogos estratégicos utilizando nossa engine estatística.
          </p>
        </div>

        <StatsPanel />

        {!isVip && (
          <div className="max-w-2xl mx-auto mb-8 bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start gap-3">
            <Lock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-bold">Modo Gratuito Ativo</p>
              <p>Você está vendo os <strong>palpites fixos do dia</strong>. Para gerar novas combinações ilimitadas e salvar seus jogos, <Link to="/vip" className="underline font-bold hover:text-yellow-900">torne-se VIP</Link>.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-6 mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
              <button
                onClick={() => setMode('standard')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'standard' 
                    ? 'bg-primary-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Concurso Padrão
              </button>
              <button
                onClick={() => setMode('final_0')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  mode === 'final_0' 
                    ? 'bg-purple-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Final 0
              </button>
            </div>

            {games.length > 0 && (
              <div className="flex items-center bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                <button
                  onClick={() => setViewMode('balls')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'balls' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
                  title="Visualização em Bolas"
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('ticket')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'ticket' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
                  title="Visualização em Volante"
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`
              relative overflow-hidden px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 w-full sm:w-auto
              ${isGenerating 
                ? 'bg-gray-400 cursor-not-allowed' 
                : mode === 'final_0' ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/30' : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/30'
              }
            `}
          >
            <span className="flex items-center justify-center gap-2">
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  {games.length > 0 && !isVip ? "Recarregar Palpites Fixos" : "Gerar 7 Palpites"}
                </>
              )}
            </span>
          </button>
        </div>

        <div className={viewMode === 'ticket' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "grid grid-cols-1 gap-4"}>
          <AnimatePresence mode="wait">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all ${viewMode === 'ticket' ? 'flex flex-col items-center' : ''}`}
              >
                <div className={`flex ${viewMode === 'ticket' ? 'flex-col text-center' : 'flex-row justify-between'} items-center gap-4 mb-4 w-full`}>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 bg-gray-900 text-white rounded-full font-bold text-sm">
                      {game.id}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {game.type === 'hot' && 'Estratégia: Quentes'}
                        {game.type === 'cold' && 'Estratégia: Zebras'}
                        {game.type === 'balanced' && 'Estratégia: Equilíbrio'}
                        {game.type === 'pattern_0' && 'Estratégia: Final 0'}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {viewMode === 'balls' && (
                      <div className="hidden md:flex gap-4 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg mr-2">
                        <span title="Soma">Soma: <strong>{game.stats.sum}</strong></span>
                        <span title="Pares/Ímpares">P/I: <strong>{game.stats.even}/{game.stats.odd}</strong></span>
                      </div>
                    )}
                    
                    {isVip && (
                      <button 
                        onClick={() => saveGame(game)}
                        disabled={savedGames.includes(game.id)}
                        className={`p-2 rounded-full transition-colors ${savedGames.includes(game.id) ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 text-gray-400'}`}
                        title="Salvar Jogo"
                      >
                        {savedGames.includes(game.id) ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>

                {viewMode === 'balls' ? (
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {game.numbers.map((num) => (
                      <LotteryBall key={num} number={num} />
                    ))}
                  </div>
                ) : (
                  <TicketView selectedNumbers={game.numbers} className="w-full max-w-[240px] border-gray-200" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
