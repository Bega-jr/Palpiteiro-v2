import React, { useEffect, useState } from 'react';
import { Calendar, Star, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateDailyGame, GeneratedGame } from '../utils/lotteryLogic';
import { TicketView } from './TicketView';

export function DailyTip() {
  const [dailyGame, setDailyGame] = useState<GeneratedGame | null>(null);

  useEffect(() => {
    const game = generateDailyGame();
    setDailyGame(game);
  }, []);

  if (!dailyGame) return null;

  const dateStr = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <section className="py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-1 shadow-2xl overflow-hidden"
      >
        <div className="bg-white/10 backdrop-blur-sm p-6 sm:p-8 rounded-xl h-full">
          <div className="flex flex-col md:flex-row items-center gap-8">
            
            <div className="flex-1 text-center md:text-left text-white">
              <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-semibold mb-4 border border-yellow-400/30">
                <Star className="w-4 h-4 fill-yellow-300" />
                Palpite do Dia
              </div>
              
              <h2 className="text-3xl font-bold mb-2">Sua Aposta Otimizada</h2>
              <p className="text-purple-200 mb-6 capitalize flex items-center justify-center md:justify-start gap-2">
                <Calendar className="w-4 h-4" />
                {dateStr}
              </p>
              
              <div className="space-y-3 text-sm text-purple-100 bg-black/20 p-4 rounded-lg backdrop-blur-md">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>Soma Total</span>
                  <span className="font-bold text-white">{dailyGame.stats.sum}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>Pares / Ímpares</span>
                  <span className="font-bold text-white">{dailyGame.stats.even} / {dailyGame.stats.odd}</span>
                </div>
                <div className="flex justify-between">
                  <span>Primos</span>
                  <span className="font-bold text-white">{dailyGame.stats.prime}</span>
                </div>
              </div>

              <button className="mt-6 w-full md:w-auto flex items-center justify-center gap-2 bg-white text-purple-900 px-6 py-3 rounded-lg font-bold hover:bg-purple-50 transition-colors">
                <Share2 className="w-4 h-4" />
                Compartilhar Palpite
              </button>
            </div>

            <div className="flex-shrink-0">
              <TicketView selectedNumbers={dailyGame.numbers} className="shadow-2xl border-none bg-white/95" />
            </div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}
