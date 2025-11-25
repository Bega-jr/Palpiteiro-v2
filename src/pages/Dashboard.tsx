import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { TicketView } from '../components/TicketView';
import { TrendingUp, DollarSign, Calendar, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SavedGame {
  id: number;
  created_at: string;
  numbers: number[];
  played: boolean;
  prize_amount: number;
}

export function Dashboard() {
  const { user, isVip } = useAuth();
  const [games, setGames] = useState<SavedGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchGames();
  }, [user]);

  async function fetchGames() {
    try {
      const { data, error } = await supabase
        .from('saved_games')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (data) setGames(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function togglePlayed(id: number, currentStatus: boolean) {
    const { error } = await supabase
      .from('saved_games')
      .update({ played: !currentStatus })
      .eq('id', id);
    
    if (!error) fetchGames();
  }

  async function updatePrize(id: number, amount: string) {
    const val = parseFloat(amount);
    if (isNaN(val)) return;

    const { error } = await supabase
      .from('saved_games')
      .update({ prize_amount: val })
      .eq('id', id);
    
    if (!error) fetchGames();
  }

  if (!isVip) {
    return (
      <div className="pt-32 pb-20 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Área Exclusiva VIP</h2>
        <p className="mb-6">Faça upgrade para acessar seu painel de investimentos.</p>
        <Link to="/vip" className="bg-purple-600 text-white px-6 py-2 rounded-lg">Ver Planos</Link>
      </div>
    );
  }

  const totalInvested = games.filter(g => g.played).length * 3.00;
  const totalWon = games.reduce((acc, curr) => acc + (curr.prize_amount || 0), 0);
  const profit = totalWon - totalInvested;

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Painel de Apostas</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg"><DollarSign className="w-5 h-5 text-blue-600" /></div>
              <span className="text-gray-600 font-medium">Total Investido</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">R$ {totalInvested.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-1">Considerando R$ 3,00 por aposta</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 rounded-lg"><TrendingUp className="w-5 h-5 text-green-600" /></div>
              <span className="text-gray-600 font-medium">Total Ganho</span>
            </div>
            <p className="text-2xl font-bold text-green-600">R$ {totalWon.toFixed(2)}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-50 rounded-lg"><CheckCircle className="w-5 h-5 text-purple-600" /></div>
              <span className="text-gray-600 font-medium">Lucro/Prejuízo</span>
            </div>
            <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              R$ {profit.toFixed(2)}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-6">Histórico de Jogos Salvos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map(game => (
            <div key={game.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(game.created_at).toLocaleDateString()}</span>
                <button 
                  onClick={() => togglePlayed(game.id, game.played)}
                  className={`px-3 py-1 rounded-full text-xs font-bold ${game.played ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                >
                  {game.played ? 'Apostado' : 'Não Apostado'}
                </button>
              </div>
              
              <TicketView selectedNumbers={game.numbers} className="mb-4 scale-90 origin-top" />
              
              {game.played && (
                <div className="mt-2 pt-3 border-t border-gray-100">
                  <label className="text-xs text-gray-500 block mb-1">Prêmio Recebido (R$)</label>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    defaultValue={game.prize_amount}
                    onBlur={(e) => updatePrize(game.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
