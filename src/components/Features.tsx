import React from 'react';
import { Zap, Shield, Smartphone, Globe } from 'lucide-react';

const features = [
  {
    name: 'Alta Performance',
    description: 'Otimizado para velocidade máxima, garantindo que seus usuários tenham a melhor experiência possível.',
    icon: Zap,
  },
  {
    name: 'Segurança Avançada',
    description: 'Seus dados protegidos com criptografia de ponta a ponta e conformidade com as normas atuais.',
    icon: Shield,
  },
  {
    name: 'Totalmente Responsivo',
    description: 'Funciona perfeitamente em qualquer dispositivo, do celular ao desktop, sem perder qualidade.',
    icon: Smartphone,
  },
  {
    name: 'Escala Global',
    description: 'Infraestrutura preparada para atender usuários em qualquer lugar do mundo com baixa latência.',
    icon: Globe,
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Tudo o que você precisa
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Ferramentas poderosas desenhadas para ajudar seu negócio a crescer de forma sustentável e eficiente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.name}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
