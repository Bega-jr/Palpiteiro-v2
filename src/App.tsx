import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Results } from './pages/Results'
import { Pricing } from './pages/Pricing'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { DashboardVip } from './pages/DashboardVip'
import { EstatisticasVip } from './pages/EstatisticasVip'
import { Checkout } from './pages/Checkout'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Toaster } from 'sonner'

function PrivateVipRoute({ children }: { children: React.ReactNode }) {
  const { isVip, loading } = useAuth()
  if (loading) return <div className="pt-32 text-center text-2xl">Carregando...</div>
  return isVip ? <>{children}</> : <Navigate to="/vip" />
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="pt-32 text-center text-2xl">Carregando...</div>
  return user ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col">
          <Routes>
            {/* Rotas sem layout (login, checkout) */}
            <Route path="/login" element={<Login />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* Todas as outras rotas com Header + Footer */}
            <Route
              path="/*"
              element={
                <>
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/resultados" element={<Results />} />
                      <Route path="/vip" element={<Pricing />} />
                      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                      <Route path="/dashboard-vip" element={<PrivateVipRoute><DashboardVip /></PrivateVipRoute>} />
                      <Route path="/estatisticas-vip" element={<PrivateVipRoute><EstatisticasVip /></PrivateVipRoute>} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              }
            />
          </Routes>
          <Toaster position="top-center" richColors />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App