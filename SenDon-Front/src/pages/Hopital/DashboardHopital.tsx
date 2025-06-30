import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, MapPin, Clock, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import StatsCard from '../../components/UI/StatsCard';
import BloodTypeIndicator from '../../components/UI/BloodTypeIndicator';
import UrgencyBadge from '../../components/UI/UrgencyBadge';
import { mockDemandes } from '../../data/mockData';

export default function DashboardHopital() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter demands for this hospital
  const mesDemandes = mockDemandes.filter(d => d.hopitalId === user?.hopitalId);
  const demandesActives = mesDemandes.filter(d => d.statut === 'active');
  const totalReponses = mesDemandes.reduce((acc, d) => acc + d.reponses.length, 0);

  const filteredDemandes = mesDemandes.filter(demande => {
    const matchesSearch = demande.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demande.groupeSanguin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || demande.statut === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard Hôpital
            </h1>
            <p className="text-gray-600">
              Bienvenue {user?.prenom} - Gestion des demandes de sang
            </p>
          </div>
          
          <button className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center space-x-2 shadow-lg hover:shadow-xl mt-4 md:mt-0">
            <Plus className="h-5 w-5" />
            <span>Nouvelle Demande</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Demandes Actives"
            value={demandesActives.length}
            icon={Clock}
            color="primary"
          />
          <StatsCard
            title="Total Demandes"
            value={mesDemandes.length}
            icon={Search}
            color="secondary"
          />
          <StatsCard
            title="Réponses Reçues"
            value={totalReponses}
            icon={Users}
            color="accent"
          />
          <StatsCard
            title="Taux de Réponse"
            value="68%"
            icon={Eye}
            color="success"
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher par groupe sanguin, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actives</option>
                  <option value="satisfaite">Satisfaites</option>
                  <option value="annulee">Annulées</option>
                  <option value="expiree">Expirées</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demands Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Mes Demandes de Sang
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Demande
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Groupe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Urgence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Réponses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDemandes.map((demande) => (
                  <tr key={demande.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {demande.description}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          Rayon {demande.rayonRecherche}km
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(demande.dateCreation).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <BloodTypeIndicator type={demande.groupeSanguin} size="sm" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <UrgencyBadge niveau={demande.niveauUrgence} size="sm" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {demande.quantite} unité(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {demande.reponses.length}
                        </span>
                        {demande.reponses.length > 0 && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Nouvelles
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        demande.statut === 'active' ? 'bg-green-100 text-green-800' :
                        demande.statut === 'satisfaite' ? 'bg-blue-100 text-blue-800' :
                        demande.statut === 'annulee' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {demande.statut === 'active' ? 'Active' :
                         demande.statut === 'satisfaite' ? 'Satisfaite' :
                         demande.statut === 'annulee' ? 'Annulée' : 'Expirée'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button className="text-primary-600 hover:text-primary-900 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredDemandes.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune demande trouvée</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Demandes Urgentes</h3>
              <span className="text-2xl font-bold text-red-600">
                {demandesActives.filter(d => d.niveauUrgence === 'critique').length}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Demandes critiques nécessitant une attention immédiate
            </p>
            <button className="w-full bg-red-50 text-red-700 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors font-medium">
              Voir les urgences
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Réponses Récentes</h3>
              <span className="text-2xl font-bold text-primary-600">
                {totalReponses}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Nouvelles réponses de donneurs à traiter
            </p>
            <button className="w-full bg-primary-50 text-primary-700 py-2 px-4 rounded-lg hover:bg-primary-100 transition-colors font-medium">
              Gérer les réponses
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Carte Interactive</h3>
              <MapPin className="h-6 w-6 text-secondary-600" />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Visualiser les donneurs et centres à proximité
            </p>
            <button className="w-full bg-secondary-50 text-secondary-700 py-2 px-4 rounded-lg hover:bg-secondary-100 transition-colors font-medium">
              Ouvrir la carte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}