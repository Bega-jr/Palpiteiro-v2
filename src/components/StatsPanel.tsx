import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { calculateStats } from '../utils/lotteryLogic';

export function StatsPanel() {
  const stats = calculateStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-red-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Números Quentes</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {stats.hotNumbers.slice(0, 8).map(n => (
            <span key={n} className="px-2 py-1 bg-red-50 text-red-700 text-sm font-medium rounded">
              {n}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">Maior frequência nos últimos 20 jogos</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <TrendingDown className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Números Frios</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {stats.coldNumbers.map(n => (
            <span key={n} className="px-2 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded">
              {n}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">Menor frequência ou atrasados</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Activity className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Padrões Ideais</h3>
        </div>
        <ul className="space-y-1 text-sm text-gray-600">
          <li className="flex justify-between">
            <span>Soma:</span> <span className="font-medium text-purple-700">180 - 220</span>
          </li>
          <li className="flex justify-between">
            <span>Ímpares/Pares:</span> <span className="font-medium text-purple-700">8/7 ou 7/8</span>
          </li>
          <li className="flex justify-between">
            <span>Primos:</span> <span className="font-medium text-purple-700">4 a 6 números</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
