import React from 'react';
import { Check, Crown, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Gratuito',
    price: 'R$ 0',
    period: '/mês',
    description: 'Para quem joga ocasionalmente.',
    features: [
      'Gerador de 7 palpites diários (Fixos)',
      'Acesso aos resultados',
      'Estatísticas básicas',
      'Palpite do dia',
    ],
    notIncluded: [
      'Gerar novas combinações (Ilimitado)',
      'Salvar histórico de jogos',
      'Dashboard de Investimento x Lucro',
      'Filtros avançados',
    ],
    cta: 'Começar Grátis',
    link: '/login',
    highlight: false
  },
  {
    name: 'VIP Anual',
    price: 'R$ 9,90',
    period: '/ano',
    description: 'Oferta imperdível. Pagamento único anual.',
    features: [
      'Gerador ILIMITADO (Aleatório)',
      'Dashboard ROI (Lucro x Investimento)',
      'Histórico de jogos salvos',
      'Fechamentos matemáticos',
      'Filtros avançados',
      'Suporte prioritário'
    ],
    notIncluded: [],
    cta: 'Assinar Anual',
    link: '/checkout?plan=annual',
    highlight: true
  },
  {
    name: 'VIP Mensal',
    price: 'R$ 12,00',
    period: '/mês',
    description: 'Flexibilidade para cancelar quando quiser.',
    features: [
      'Todas as vantagens do VIP',
      'Acesso completo ao sistema',
      'Cobrança mensal recorrente'
    ],
    notIncluded: [],
    cta: 'Assinar Mensal',
    link: '/checkout?plan=monthly',
    highlight: false
  }
];

export function Pricing() {
  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-purple-600 font-semibold tracking-wide uppercase text-sm">Planos e Preços</span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
            Invista na sua sorte com inteligência
          </h2>
          <p className="text-xl text-gray-600">
            Desbloqueie o gerador ilimitado e controle seus ganhos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-2 ${plan.highlight ? 'border-2 border-purple-600 shadow-purple-100 scale-105 z-10' : 'border border-gray-100'}`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                  <Crown className="w-3 h-3" />
                  Melhor Oferta
                </div>
              )}

              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-500 mt-2 text-sm">{plan.description}</p>
                
                <div className="my-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>

                <Link 
                  to={plan.link}
                  className={`block w-full py-3 rounded-xl font-bold transition-colors text-center ${
                    plan.highlight 
                      ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-500/30' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>

              <div className="px-8 pb-8">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">O que está incluso:</p>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-gray-700">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-gray-400">
                      <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
