import React from 'react';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import LogoSenDon from '../../assets/img/Logo SenDon.png'; // Adjust the path as necessary
import Fond2035 from '../../assets/svg/fond-2035.svg';

export default function Footer() {
  return (
    <footer className=" text-white relative overflow-hidden">
      {/* Fond 2035 SVG en fond */}
      <img
        src={Fond2035}
        alt="Fond Vision 2035"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ zIndex: 1 }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Mission */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4 ">
              <div className="relative">
              <img src={LogoSenDon} alt="Logo SenDon" className="w-8 h-12"/>
              </div>
                <span className="text-xl font-bold">
                  Sen</span>
                <span className="text-xl font-bold text-primary-500">
                  Don
                </span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Donner du sang, c'est bâtir un Sénégal solidaire. 
              Plateforme intelligente de gestion du don de sang au service de la santé publique sénégalaise.
            </p>
            <p className="text-sm text-gray-400">
              Aligné avec la Vision Sénégal 2035 pour une digitalisation inclusive de la santé.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Comment donner
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Centres de don
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Compatibilité sanguine
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300 text-sm">contact@sendon.sn</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300 text-sm">+221 33 123 45 67</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300 text-sm">Dakar, Sénégal</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-3 mt-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 SenDon. Tous droits réservés. Ministère de la Santé et de l'Action Sociale du Sénégal.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                Conditions d'utilisation
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}