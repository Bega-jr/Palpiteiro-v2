import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Results } from './pages/Results';
import { Pricing } from './pages/Pricing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Checkout } from './pages/Checkout'; // Importando Checkout
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={
              <>
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/resultados" element={<Results />} />
                    <Route path="/vip" element={<Pricing />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/checkout" element={<Checkout />} /> {/* Nova Rota */}
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Palpiteiro V2</h3>
            <p className="text-gray-400">
              Estatística avançada para aumentar suas chances.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Ferramentas</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white">Gerador</a></li>
              <li><a href="/resultados" className="hover:text-white">Resultados</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Sobre</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Como funciona</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Palpiteiro V2. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default App;
