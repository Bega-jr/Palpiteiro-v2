import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, QrCode, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Checkout() {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const planDetails = plan === 'annual' 
    ? { name: 'VIP Anual', price: 'R$ 9,90', period: '/ano' }
    : { name: 'VIP Mensal', price: 'R$ 12,00', period: '/mês' };

  const handlePaymentSimulation = () => {
    // AQUI ENTRARIA A INTEGRAÇÃO REAL (Stripe, Mercado Pago)
    // Para o MVP, simulamos um sucesso após 2 segundos
    setStep(2);
    setTimeout(() => {
      setStep(3);
    }, 2000);
  };

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {step === 3 ? (
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center animate-fade-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pagamento Confirmado!</h2>
            <p className="text-gray-600 mb-8">
              Parabéns! Sua conta agora é VIP. Aproveite os palpites ilimitados.
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors"
            >
              Ir para meu Painel
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Resumo do Pedido */}
            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Resumo do Pedido</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">{planDetails.name}</span>
                  <span className="font-bold">{planDetails.price}</span>
                </div>
                <div className="border-t border-gray-100 my-4 pt-4">
                  <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{planDetails.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">{planDetails.period}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded-lg mt-4">
                  <ShieldCheck className="w-4 h-4" />
                  Ambiente Seguro
                </div>
              </div>
            </div>

            {/* Área de Pagamento */}
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Finalizar Assinatura</h2>
                
                {!user ? (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                    <p className="text-yellow-800 text-sm">
                      Você precisa estar logado para assinar. <button onClick={() => navigate('/login')} className="font-bold underline">Fazer Login</button>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-4 border border-primary-200 bg-primary-50 rounded-lg flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-primary-900">Conta conectada:</p>
                        <p className="text-sm text-primary-700">{user.email}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">Forma de Pagamento</label>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          className="flex flex-col items-center justify-center p-4 border-2 border-primary-600 bg-primary-50 rounded-xl cursor-pointer transition-all"
                        >
                          <QrCode className="w-8 h-8 text-primary-600 mb-2" />
                          <span className="font-bold text-primary-700">PIX</span>
                          <span className="text-xs text-primary-600">Aprovação Imediata</span>
                        </button>

                        <button 
                          className="flex flex-col items-center justify-center p-4 border border-gray-200 hover:border-gray-300 rounded-xl cursor-pointer transition-all opacity-50"
                          title="Em breve"
                        >
                          <CreditCard className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="font-bold text-gray-500">Cartão</span>
                          <span className="text-xs text-gray-400">Em breve</span>
                        </button>
                      </div>
                    </div>

                    {step === 2 ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Processando pagamento...</p>
                      </div>
                    ) : (
                      <button
                        onClick={handlePaymentSimulation}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                      >
                        Pagar com PIX
                      </button>
                    )}
                    
                    <p className="text-xs text-center text-gray-400 mt-4">
                      Ao assinar, você concorda com nossos termos de serviço.
                      Este é um ambiente de demonstração.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
