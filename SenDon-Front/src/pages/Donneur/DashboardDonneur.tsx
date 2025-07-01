import React, { useState } from 'react';
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
    (d.groupeSanguin === user?.bloodType || d.groupeSanguin === 'O-')
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

  // État pour le modal et le formulaire
  const [showModal, setShowModal] = useState(false);
  const [procheForm, setProcheForm] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    type: 'famille',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProcheForm({ ...procheForm, [e.target.name]: e.target.value });
  };

  // Liste des proches (état local)
  const [proches, setProches] = useState([
    {
      nom: 'Maman',
      prenom: 'Awa',
      telephone: '+221 77 888 9999',
      type: 'Mère',
      groupeSanguin: 'B+',
    },
    {
      nom: 'Ibrahim',
      prenom: '',
      telephone: '+221 76 555 4444',
      type: 'Frère',
      groupeSanguin: 'O+',
    },
  ]);

  // Modal de gestion des proches
  const [showGestionModal, setShowGestionModal] = useState(false);

  const handleAddProche = (e: React.FormEvent) => {
    e.preventDefault();
    // Ajoute le proche à la liste
    setProches([
      ...proches,
      {
        nom: procheForm.nom,
        prenom: procheForm.prenom,
        telephone: procheForm.telephone,
        type: procheForm.type === 'famille' ? 'Famille' : 'Ami',
        groupeSanguin: '', // À compléter si tu ajoutes ce champ au formulaire
      },
    ]);
    setShowModal(false);
    setProcheForm({ nom: '', prenom: '', telephone: '', type: 'famille' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Bonjour {user?.firstName} ! 👋
                </h1>
                <p className="text-lg opacity-90">
                  Votre prochaine donation sera possible dans 12 semaines
                </p>
                <div className="flex items-center space-x-4 mt-4">
                  <BloodTypeIndicator 
                    type={user?.bloodType || 'O+'} 
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
                <button
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  onClick={() => setShowModal(true)}
                  aria-label="Ajouter un proche"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                {proches.map((proche, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {proche.nom} {proche.prenom}
                      </h3>
                      {proche.groupeSanguin && (
                        <BloodTypeIndicator type={proche.groupeSanguin} size="sm" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {proche.type} - {proche.telephone}
                    </p>
                  </div>
                ))}
              </div>
              <button
                className="w-full mt-4 py-2 px-4 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium"
                onClick={() => setShowGestionModal(true)}
              >
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
          </div>
        </div>
      </div>

      {/* Modal d'ajout de proche */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowModal(false)}
              aria-label="Fermer"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4 text-gray-900">Ajouter un proche</h3>
            <form onSubmit={handleAddProche} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={procheForm.nom}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={procheForm.prenom}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={procheForm.telephone}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="+221 77 000 0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de proche</label>
                <select
                  name="type"
                  value={procheForm.type}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="famille">Membre de famille</option>
                  <option value="ami">Ami</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de gestion des proches */}
      {showGestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowGestionModal(false)}
              aria-label="Fermer"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-6 text-gray-900 text-center">Liste de mes proches</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Nom</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Prénom</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Téléphone</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Type</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Groupe sanguin</th>
                  </tr>
                </thead>
                <tbody>
                  {proches.map((proche, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-primary-50 transition-colors border-b border-gray-100"
                    >
                      <td className="px-4 py-2">{proche.nom}</td>
                      <td className="px-4 py-2">{proche.prenom}</td>
                      <td className="px-4 py-2">{proche.telephone}</td>
                      <td className="px-4 py-2">{proche.type}</td>
                      <td className="px-4 py-2">{proche.groupeSanguin || <span className="text-gray-400">-</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                onClick={() => setShowGestionModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}