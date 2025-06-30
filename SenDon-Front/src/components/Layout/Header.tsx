import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {  Menu, User, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LogoSenDon from '../../assets/img/Logo SenDon.png'; // Adjust the path as necessary

interface HeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

export default function Header({  }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'donneur':
        return '/donneur';
      case 'admin_hopital':
        return '/hopital';
      case 'super_admin':
        return '/admin';
      default:
        return '/';
    }
  };

  return (
    <header className="bg-black shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo à gauche */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <img src={LogoSenDon} alt="Logo SenDon" className="w-8 h-12"/>
              </div>
              <div>
                <span className="text-xl font-bold text-white">Sen</span>
                <span className="text-xl font-bold text-primary-600">Don</span>
              </div>
            </Link>
          </div>

          {/* Menu hamburger mobile à droite */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-md text-gray-200 hover:text-primary-600 hover:bg-gray-800 transition"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-7 w-7" />
            </button>
          </div>

          {/* Actions utilisateur desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <button className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>
                <div className="flex items-center space-x-3">
                  <Link
                    to={getDashboardLink()}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-600" />
                    </div>
                    <span className="font-medium hidden md:block">
                      {user.prenom} {user.nom}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Se déconnecter"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/connexion"
                  className="text-primary-600 bg-white rounded-full px-4 py-2 hover:text-green-600 font-medium transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  className="bg-primary-600 text-white px-4 py-2 rounded-full hover:bg-primary-700 transition-colors font-medium"
                >
                  Devenir Donneur
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu mobile coulissant */}
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-40 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
      >
        <nav
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-end p-4">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-600 hover:text-primary-600"
              aria-label="Fermer le menu"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="6" y1="6" x2="18" y2="18"/>
                <line x1="6" y1="18" x2="18" y2="6"/>
              </svg>
            </button>
          </div>
          <div className="flex flex-col items-center mt-10 space-y-6">
            <Link
              to="/connexion"
              className="w-4/5 text-primary-600 bg-white border border-primary-600 rounded-full px-4 py-2 text-center font-medium hover:bg-primary-50 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Connexion
            </Link>
            <Link
              to="/inscription"
              className="w-4/5 bg-primary-600 text-white px-4 py-2 rounded-full text-center font-medium hover:bg-primary-700 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Devenir Donneur
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}