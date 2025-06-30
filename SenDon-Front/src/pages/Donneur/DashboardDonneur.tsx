import React from 'react';
import { MapPin, Bell, Heart, Users, Calendar, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import StatsCard from '../../components/UI/StatsCard';
import BloodTypeIndicator from '../../components/UI/BloodTypeIndicator';
import UrgencyBadge from '../../components/UI/UrgencyBadge';
import { mockDemandes } from '../../data/mockData';

export default function DashboardDonneur() {
  const { user } = useAuth();
  
  // Filter active demands compatible with user's blood type
  const demandesCompatibles = mockDemandes.filter(d => 
    d.statut === 'active' && 
    (d.groupeSanguin === user?.groupeSanguin || d.groupeSanguin === 'O-')
  );

  const mesDerniersDons = [
    {
      id: '1',
      date: '2024-01-10',
      hopital: 'Hôpital Principal de Dakar',
      type: 'Don planifié',
      statut: 'complété'
    },
    {
      id: '2',
      date: '2023-12-15',
      hopital: 'Centre de Santé Pikine',
      type: 'Urgence',
      statut: 'complété'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Bonjour {user?.prenom} ! 👋
                </h1>
                <p className="text-lg opacity-90">
                  Votre prochaine donation sera possible dans 12 semaines
                </p>
                <div className="flex items-center space-x-4 mt-4">
                  <BloodTypeIndicator 
                    type={user?.groupeSanguin || 'O+'} 
                    size="lg"
                  />
                  <div className="text-sm opacity-90">
                    <div>Dernière donation : 10 Jan 2024</div>
                    <div>Total de vies sauvées : 9 personnes</div>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Heart className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Mes Dons"
            value="3"
            icon={Heart}
            color="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Vies Sauvées"
            value="9"
            icon={Users}
            color="secondary"
          />
          <StatsCard
            title="Demandes Actives"
            value={demandesCompatibles.length}
            icon={Bell}
            color="accent"
          />
          <StatsCard
            title="Mes Proches"
            value="2"
            icon={Users}
            color="success"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Demandes Urgentes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Demandes Compatibles
                </h2>
                <span className="text-sm text-gray-500">
                  {demandesCompatibles.length} demande(s)
                </span>
              </div>
              
              <div className="space-y-4">
                {demandesCompatibles.map((demande) => (
                  <div key={demande.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{demande.hopitalNom}</h3>
                        <p className="text-sm text-gray-600">{demande.description}</p>
                      </div>
                      <UrgencyBadge niveau={demande.niveauUrgence} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <BloodTypeIndicator type={demande.groupeSanguin} size="sm" />
                        <span className="text-sm text-gray-600">
                          {demande.quantite} unité(s)
                        </span>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {demande.rayonRecherche}km
                        </div>
                      </div>
                      
                      <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                        Répondre
                      </button>
                    </div>
                  </div>
                ))}
                
                {demandesCompatibles.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune demande compatible pour le moment</p>
                  </div>
                )}
              </div>
            </div>

            {/* Historique */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Mes Derniers Dons
              </h2>
              
              <div className="space-y-4">
                {mesDerniersDons.map((don) => (
                  <div key={don.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{don.hopital}</h3>
                        <p className="text-sm text-gray-600">{don.type}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(don.date).toLocaleDateString('fr-FR')}
                        </div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Complété
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Proches */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Mes Proches
                </h2>
                <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Maman Awa</h3>
                    <BloodTypeIndicator type="B+" size="sm" />
                  </div>
                  <p className="text-sm text-gray-600">Mère - +221 77 888 9999</p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Ibrahim</h3>
                    <BloodTypeIndicator type="O+" size="sm" />
                  </div>
                  <p className="text-sm text-gray-600">Frère - +221 76 555 4444</p>
                </div>
              </div>
              
              <button className="w-full mt-4 py-2 px-4 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium">
                Gérer mes proches
              </button>
            </div>

            {/* Prochains RDV */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Prochains Rendez-vous
              </h2>
              
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun rendez-vous programmé</p>
                <button className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                  Prendre RDV
                </button>
              </div>
            </div>

            {/* Impact */}
            <div className="bg-gradient-to-br from-secondary-50 to-accent-50 rounded-2xl p-6 border border-secondary-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Votre Impact 🎯
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vies sauvées</span>
                  <span className="font-bold text-secondary-600">9 personnes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Familles aidées</span>
                  <span className="font-bold text-secondary-600">3 familles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rang communautaire</span>
                  <span className="font-bold text-accent-600">#127 / 1247</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-white bg-opacity-50 rounded-lg text-center">
                <p className="text-sm text-gray-700">
                  <strong>Prochain objectif :</strong> 5 dons pour débloquer le badge "Héros Local" 🏆
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}