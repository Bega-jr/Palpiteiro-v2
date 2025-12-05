import { CheckCircle, XCircle, QrCode, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export function Vip() {
  const [copiado, setCopiado] = useState(false)

  const pixKey = "seu.pix@exemplo.com"  // ← COLOCA SEU PIX AQUI
  const valor = "9,90"

  const copiarPix = () => {
    navigator.clipboard.writeText(pixKey)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900 text-white pt-20">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-6xl font-black mb-8">VIRE VIP AGORA</h1>
        
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-12 shadow-2xl mb-12">
          <h2 className="text-5xl font-black mb-8">R$ 9,90/mês</h2>
          
          <div className="space-y-6 text-2xl mb-12">
            <p className="flex items-center justify-center gap-4">
              <CheckCircle className="w-10 h-10 text-green-400" />
              Palpites VIP ultra acertivos
            </p>
            <p className="flex items-center justify-center gap-4">
              <CheckCircle className="w-10 h-10 text-green-400" />
              Dashboard com lucro real
            </p>
            <p className="flex items-center justify-center gap-4">
              <CheckCircle className="w-10 h-10 text-green-400" />
              Jogos salvos e conferidos automaticamente
            </p>
            <p className="flex items-center justify-center gap-4">
              <CheckCircle className="w-10 h-10 text-green-400" />
              Estatísticas exclusivas
            </p>
          </div>

          <div className="bg-white rounded-3xl p-12 shadow-2xl">
            <QrCode className="w-64 h-64 mx-auto mb-8 text-black" />
            
            <p className="text-3xl font-black text-black mb-6">
              Escaneie ou copie o Pix
            </p>

            <div className="bg-gray-100 rounded-2xl p-6 mb-8">
              <p className="text-2xl font-mono text-black break-all">
                {pixKey}
              </p>
            </div>

            <button
              onClick={copiarPix}
              className="bg-gradient-to-r from-purple-600 to-pink-600 px-16 py-8 rounded-full text-3xl font-black shadow-2xl hover:scale-105 transition flex items-center gap-4 mx-auto"
            >
              {copiado ? (
                <>
                  <Check className="w-12 h-12" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-10 h-10" />
                  Copiar Chave Pix
                </>
              )}
            </button>

            <p className="text-black text-xl mt-8">
              Após o pagamento, seu acesso VIP é liberado automaticamente em até 5 minutos!
            </p>
          </div>
        </div>

        <p className="text-2xl opacity-80">
          Qualquer dúvida: contato@palpiteirov2.com
        </p>
      </div>
    </div>
  )
}