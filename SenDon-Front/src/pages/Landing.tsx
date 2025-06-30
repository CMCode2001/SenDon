import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, MapPin, Award, ArrowRight, Droplets, Shield, Zap } from 'lucide-react';
import BloodTypeIndicator from '../components/UI/BloodTypeIndicator';
import { mockStatistiques } from '../data/mockData';
import Fond2035 from '../assets/svg/fond-2035.svg';
import LogoSenDon from '../assets/img/Logo SenDon.png'; 
import FonTopLeft from '../assets/svg/fondTopLeft.svg';
import FondBottomRight from '../assets/svg/fondBottomRight.svg';

export default function Landing() {
  const bloodTypes = Object.entries(mockStatistiques.repartitionGroupes);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
        {/* Fond 2035 SVG en fond */}
        <img
          src={Fond2035}
          alt="Fond Vision 2035"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ zIndex: 0 }}
        />
       
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32" style={{ zIndex: 1 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
                Donner du sang,{' '}
                <span className="text-primary-600">c'est bâtir</span>{' '}
                un Sénégal{' '}
                <span className="text-secondary-600">solidaire</span>
              </h1>
              
              <p className="text-md text-gray-300 mb-8 leading-relaxed">
                Rejoignez la plus grande communauté de donneurs de sang du Sénégal. 
                Une plateforme intelligente qui sauve des vies en connectant donneurs et centres de santé.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  to="/inscription"
                  className="bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-all duration-200 flex items-center justify-center group shadow-lg hover:shadow-xl"
                >
                  Devenir Donneur
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/centres"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold 
                  hover:bg-white hover:text-primary-600 
                  hover:border-white transition-all duration-200 flex items-center justify-center"
                >
                  Trouver un Centre
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {mockStatistiques.totalDonneurs.toLocaleString()}
                  </div>
                  <div className="text-sm text-white"> Donneurs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-600 mb-1">
                    {mockStatistiques.totalDemandes}
                  </div>
                  <div className="text-sm text-white">Demandes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-600 mb-1">
                    {mockStatistiques.tauxReponse}%
                  </div>
                  <div className="text-sm text-white">Taux de réponse</div>
                </div>
              </div>
            </div>
            
            <div className="relative animate-slide-up">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Baromètre des Groupes Sanguins
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {bloodTypes.map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <BloodTypeIndicator type={type as any} size="sm" />
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{count}</div>
                        <div className="text-xs text-gray-500">donneurs</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-primary-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <img src={LogoSenDon} alt="Logo SenDon" className="w-8 "/>
                    <span className="font-semibold text-primary-900">
                      {mockStatistiques.demandesActives} demandes actives
                    </span>
                  </div>
                  <p className="text-sm text-primary-700">
                    Votre don peut sauver jusqu'à 3 vies
                  </p>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center animate-bounce-gentle">
                <img src={LogoSenDon} alt="Logo SenDon" className="w-6 h-8" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center animate-pulse-slow">
                <Droplets className="h-4 w-4 text-secondary-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Une Plateforme Révolutionnaire
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SenDon transforme la gestion du don de sang au Sénégal grâce à la technologie 
              et l'intelligence artificielle, aligné avec la Vision Sénégal 2035.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <MapPin className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Géolocalisation Intelligente</h3>
              <p className="text-gray-600">
                Trouvez instantanément les centres de don les plus proches et les demandes urgentes 
                dans votre zone grâce à OpenStreetMap.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <Zap className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Notifications Temps Réel</h3>
              <p className="text-gray-600">
                Recevez des alertes personnalisées selon votre groupe sanguin, 
                votre localisation et le niveau d'urgence des demandes.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <Shield className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sécurité Maximale</h3>
              <p className="text-gray-600">
                Vos données sont protégées par un chiffrement de niveau bancaire 
                et conformes aux standards internationaux de confidentialité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section
        className="py-20 relative"
        
      >
        <img
          src={Fond2035}
          alt="Fond Vision 2035"
          className="absolute inset-0 w-full h-full object-cover  pointer-events-none"
          style={{ zIndex: 0 }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ zIndex: 1 }}>
          <div className="text-white mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ensemble, Sauvons des Vies
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Chaque don compte. Rejoignez la communauté SenDon et contribuez 
              à bâtir un système de santé plus solidaire et plus efficace.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-4xl font-bold text-white mb-2">3</div>
              <div className="text-white opacity-90">Vies sauvées par don</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-4xl font-bold text-white mb-2">24h</div>
              <div className="text-white opacity-90">Réponse moyenne</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-4xl font-bold text-white mb-2">14</div>
              <div className="text-white opacity-90">Régions couvertes</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-white opacity-90">Satisfaction</div>
            </div>
          </div>
          
          <Link
            to="/inscription"
            className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl"
          >
            Rejoindre SenDon Maintenant
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Témoignages de Notre Communauté
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez l'impact réel de SenDon à travers les histoires de nos utilisateurs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="font-bold text-primary-600">AS</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Aminata Sy</div>
                  <div className="text-sm text-gray-500">Donneuse O+</div>
                </div>
              </div>
              <p className="text-gray-600">
                "Grâce à SenDon, j'ai pu aider lors d'une urgence à l'hôpital de Pikine. 
                L'application m'a alertée immédiatement et j'ai pu réagir rapidement."
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="font-bold text-secondary-600">MD</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Dr. Mamadou Diallo</div>
                  <div className="text-sm text-gray-500">Hôpital Principal</div>
                </div>
              </div>
              <p className="text-gray-600">
                "SenDon a révolutionné notre gestion des urgences. 
                Nous trouvons des donneurs compatibles en quelques minutes au lieu de plusieurs heures."
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mr-4">
                  <span className="font-bold text-accent-600">FK</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Fatou Kane</div>
                  <div className="text-sm text-gray-500">Donneuse AB-</div>
                </div>
              </div>
              <p className="text-gray-600">
                "J'adore la fonctionnalité famille qui me permet de gérer les dons 
                pour mes proches. C'est vraiment pensé pour la solidarité africaine."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}