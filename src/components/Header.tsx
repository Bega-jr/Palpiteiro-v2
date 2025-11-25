import React from 'react';
import { Menu, X, Dna, Crown, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isVip, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Dna className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Palpiteiro<span className="text-primary-600">V2</span></span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={cn("transition-colors font-medium", isActive('/') ? "text-primary-600" : "text-gray-600 hover:text-primary-600")}
            >
              Gerador
            </Link>
            <Link 
              to="/resultados" 
              className={cn("transition-colors font-medium", isActive('/resultados') ? "text-primary-600" : "text-gray-600 hover:text-primary-600")}
            >
              Resultados
            </Link>
            {isVip && (
              <Link 
                to="/dashboard" 
                className={cn("transition-colors font-medium", isActive('/dashboard') ? "text-primary-600" : "text-gray-600 hover:text-primary-600")}
              >
                Meu Painel
              </Link>
            )}
            <Link 
              to="/vip" 
              className={cn("transition-colors font-medium flex items-center gap-1", isActive('/vip') ? "text-yellow-600" : "text-gray-600 hover:text-yellow-600")}
            >
              <Crown className="w-4 h-4" />
              Planos VIP
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  {isVip && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-bold border border-yellow-200">VIP</span>}
                </div>
                <button onClick={signOut} className="text-gray-500 hover:text-red-600" title="Sair">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Login</Link>
                <Link to="/vip" className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium shadow-lg shadow-primary-500/20 flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Seja VIP
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-md">Gerador</Link>
            <Link to="/resultados" className="block px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-md">Resultados</Link>
            {isVip && <Link to="/dashboard" className="block px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-md">Meu Painel</Link>}
            <Link to="/vip" className="block px-3 py-2 text-yellow-600 hover:bg-yellow-50 rounded-md font-medium">Planos VIP</Link>
            
            <div className="pt-4 flex flex-col space-y-2 border-t border-gray-100 mt-2">
              {user ? (
                 <button onClick={signOut} className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md">Sair</button>
              ) : (
                <>
                  <Link to="/login" className="w-full text-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">Login</Link>
                  <Link to="/vip" className="w-full text-center px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Seja VIP</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
