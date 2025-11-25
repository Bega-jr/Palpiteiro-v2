import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer'; // ← CORREÇÃO: import adicionado
import { Home } from './pages/Home';
import { Results } from './pages/Results';
import { Pricing } from './pages/Pricing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Checkout } from './pages/Checkout';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner'; // ← NOVO: toaster lindo

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white flex flex-col"> {/* ← CORREÇÃO: flex flex-col pro footer embaixo */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={
              <>
                <Header />
                <main className="flex-1"> {/* ← CORREÇÃO: flex-1 pra main crescer e footer grudar */}
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/resultados" element={<Results />} />
                    <Route path="/vip" element={<Pricing />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/checkout" element={<Checkout />} />
                  </Routes>
                </main>
                <Footer /> {/* ← Agora importado e com layout perfeito */}
              </>
            } />
          </Routes>
        </div>
        <Toaster 
          richColors 
          position="top-right" 
          closeButton 
          toastOptions={{
            duration: 4000,
            classNames: {
              toast: 'font-medium',
              success: 'bg-green-600 text-white',
              error: 'bg-red-600 text-white',
            }
          }}
        /> {/* ← NOVO: toaster pronto pra usar em qualquer lugar com toast.success('Msg!') */}
      </Router>
    </AuthProvider>
  );
}

export default App;