import React from 'react';
import { ArrowDown, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="pt-32 pb-12 lg:pt-40 lg:pb-20 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-green-50 text-green-700 text-sm font-semibold mb-6 border border-green-100">
              <Target className="w-4 h-4" />
              Algoritmo Atualizado 2025
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
              Aumente suas chances de <span className="text-primary-600">11 a 15 pontos</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Não jogue apenas com a sorte. Utilize nossa inteligência estatística baseada em padrões, médias e ciclos para gerar jogos matematicamente equilibrados.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="#generator" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/25">
                Gerar Palpites Agora
                <ArrowDown className="ml-2 h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
