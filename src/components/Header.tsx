import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // ← Integra com AuthContext
import { LogOut, User } from 'lucide-react'; // Icons bonitos

export function Header() {
  const { user, signOut } = useAuth(); // ← Puxa user do context

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Palpiteiro V2
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">Home</Link>
            <Link to="/resultados" className="text-gray-700 hover:text-primary-600 transition-colors">Resultados</Link>
            <Link to="/vip" className="text-gray-700 hover:text-primary-600 transition-colors">VIP</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">Dashboard</Link>
                <button onClick={signOut} className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                  <LogOut size={18} /> <span>Sair</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors">Login</Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
