import { Demande, Hopital, Statistiques, GroupeSanguin } from '../types';

export const mockHopitaux: Hopital[] = [
  // Dakar Region
  {
    id: 'hopital-1',
    nom: 'Hôpital Principal de Dakar',
    adresse: 'Avenue Pasteur, Plateau, Dakar',
    telephone: '+221338234567',
    email: 'contact@hopital-dakar.sn',
    position: { latitude: 14.6928, longitude: -17.4467 },
    type: 'hopital',
    isActive: true,
  },
  {
    id: 'hopital-2',
    nom: 'Hôpital Aristide Le Dantec',
    adresse: 'Avenue Pasteur, Dakar',
    telephone: '+221338219090',
    email: 'ledantec@sante.gouv.sn',
    position: { latitude: 14.6892, longitude: -17.4516 },
    type: 'hopital',
    isActive: true,
  },
  {
    id: 'hopital-3',
    nom: 'Hôpital Fann',
    adresse: 'Fann Résidence, Dakar',
    telephone: '+221338695050',
    email: 'hopital.fann@sante.gouv.sn',
    position: { latitude: 14.6937, longitude: -17.4441 },
    type: 'hopital',
    isActive: true,
  },
  {
    id: 'centre-1',
    nom: 'Centre de Santé Pikine',
    adresse: 'Pikine, Guédiawaye',
    telephone: '+221338765432',
    email: 'contact@cs-pikine.sn',
    position: { latitude: 14.7549, longitude: -17.3925 },
    type: 'centre_sante',
    isActive: true,
  },
  {
    id: 'centre-2',
    nom: 'Centre de Santé Parcelles Assainies',
    adresse: 'Parcelles Assainies, Dakar',
    telephone: '+221338456789',
    email: 'cs.parcelles@sante.gouv.sn',
    position: { latitude: 14.7614, longitude: -17.4186 },
    type: 'centre_sante',
    isActive: true,
  },
  {
    id: 'centre-3',
    nom: 'Centre de Santé Ouakam',
    adresse: 'Ouakam, Dakar',
    telephone: '+221338567890',
    email: 'cs.ouakam@sante.gouv.sn',
    position: { latitude: 14.7167, longitude: -17.4897 },
    type: 'centre_sante',
    isActive: true,
  },
  {
    id: 'clinique-1',
    nom: 'Clinique Pasteur',
    adresse: 'Rue Pasteur, Dakar',
    telephone: '+221338901234',
    email: 'contact@clinique-pasteur.sn',
    position: { latitude: 14.6889, longitude: -17.4467 },
    type: 'clinique',
    isActive: true,
  },
  {
    id: 'clinique-2',
    nom: 'Clinique de la Madeleine',
    adresse: 'Madeleine, Dakar',
    telephone: '+221338123456',
    email: 'madeleine@clinique.sn',
    position: { latitude: 14.6756, longitude: -17.4372 },
    type: 'clinique',
    isActive: true,
  },
  
  // Thiès Region
  {
    id: 'hopital-thies',
    nom: 'Hôpital Régional de Thiès',
    adresse: 'Avenue Léopold Sédar Senghor, Thiès',
    telephone: '+221339876543',
    email: 'contact@hopital-thies.sn',
    position: { latitude: 14.7886, longitude: -16.9246 },
    type: 'hopital',
    isActive: true,
  },
  {
    id: 'centre-thies',
    nom: 'Centre de Santé Thiès Nord',
    adresse: 'Quartier Nord, Thiès',
    telephone: '+221339654321',
    email: 'cs.thies.nord@sante.gouv.sn',
    position: { latitude: 14.7956, longitude: -16.9189 },
    type: 'centre_sante',
    isActive: true,
  },
  
  // Saint-Louis Region
  {
    id: 'hopital-stlouis',
    nom: 'Hôpital Régional de Saint-Louis',
    adresse: 'Avenue Jean Mermoz, Saint-Louis',
    telephone: '+221339112233',
    email: 'hopital.stlouis@sante.gouv.sn',
    position: { latitude: 16.0469, longitude: -16.4897 },
    type: 'hopital',
    isActive: true,
  },
  {
    id: 'centre-stlouis',
    nom: 'Centre de Santé Sor',
    adresse: 'Sor, Saint-Louis',
    telephone: '+221339445566',
    email: 'cs.sor@sante.gouv.sn',
    position: { latitude: 16.0389, longitude: -16.4756 },
    type: 'centre_sante',
    isActive: true,
  },
  
  // Kaolack Region
  {
    id: 'hopital-kaolack',
    nom: 'Hôpital Régional El Hadj Ibrahima Niass',
    adresse: 'Avenue Valdiodio Ndiaye, Kaolack',
    telephone: '+221339778899',
    email: 'hopital.kaolack@sante.gouv.sn',
    position: { latitude: 14.1372, longitude: -16.0728 },
    type: 'hopital',
    isActive: true,
  },
  
  // Ziguinchor Region
  {
    id: 'hopital-ziguinchor',
    nom: 'Hôpital Régional de Ziguinchor',
    adresse: 'Quartier Kandé, Ziguinchor',
    telephone: '+221339334455',
    email: 'hopital.ziguinchor@sante.gouv.sn',
    position: { latitude: 12.5681, longitude: -16.2719 },
    type: 'hopital',
    isActive: true,
  },
  
  // Diourbel Region
  {
    id: 'hopital-diourbel',
    nom: 'Hôpital Régional Ndamatou',
    adresse: 'Avenue Cheikh Ahmadou Bamba, Diourbel',
    telephone: '+221339556677',
    email: 'hopital.diourbel@sante.gouv.sn',
    position: { latitude: 14.6594, longitude: -16.2297 },
    type: 'hopital',
    isActive: true,
  },
  
  // Louga Region
  {
    id: 'hopital-louga',
    nom: 'Hôpital Régional de Louga',
    adresse: 'Route de Dakar, Louga',
    telephone: '+221339667788',
    email: 'hopital.louga@sante.gouv.sn',
    position: { latitude: 15.6181, longitude: -16.2267 },
    type: 'hopital',
    isActive: true,
  },
  
  // Fatick Region
  {
    id: 'hopital-fatick',
    nom: 'Hôpital Régional de Fatick',
    adresse: 'Centre-ville, Fatick',
    telephone: '+221339889900',
    email: 'hopital.fatick@sante.gouv.sn',
    position: { latitude: 14.3347, longitude: -16.4069 },
    type: 'hopital',
    isActive: true,
  },
  
  // Kolda Region
  {
    id: 'hopital-kolda',
    nom: 'Hôpital Régional de Kolda',
    adresse: 'Quartier Saré Kémo, Kolda',
    telephone: '+221339990011',
    email: 'hopital.kolda@sante.gouv.sn',
    position: { latitude: 12.8939, longitude: -14.9497 },
    type: 'hopital',
    isActive: true,
  },
  
  // Tambacounda Region
  {
    id: 'hopital-tambacounda',
    nom: 'Hôpital Régional de Tambacounda',
    adresse: 'Avenue Demba Diop, Tambacounda',
    telephone: '+221339001122',
    email: 'hopital.tambacounda@sante.gouv.sn',
    position: { latitude: 13.7706, longitude: -13.6681 },
    type: 'hopital',
    isActive: true,
  },
  
  // Matam Region
  {
    id: 'hopital-matam',
    nom: 'Hôpital Régional de Matam',
    adresse: 'Centre-ville, Matam',
    telephone: '+221339112244',
    email: 'hopital.matam@sante.gouv.sn',
    position: { latitude: 15.6558, longitude: -13.2553 },
    type: 'hopital',
    isActive: true,
  },
  
  // Kaffrine Region
  {
    id: 'hopital-kaffrine',
    nom: 'Hôpital Régional de Kaffrine',
    adresse: 'Route de Kaolack, Kaffrine',
    telephone: '+221339223344',
    email: 'hopital.kaffrine@sante.gouv.sn',
    position: { latitude: 14.1058, longitude: -15.5506 },
    type: 'hopital',
    isActive: true,
  },
  
  // Kédougou Region
  {
    id: 'hopital-kedougou',
    nom: 'Hôpital Régional de Kédougou',
    adresse: 'Quartier Dalaba, Kédougou',
    telephone: '+221339334466',
    email: 'hopital.kedougou@sante.gouv.sn',
    position: { latitude: 12.5569, longitude: -12.1756 },
    type: 'hopital',
    isActive: true,
  },
  
  // Sédhiou Region
  {
    id: 'hopital-sedhiou',
    nom: 'Hôpital Régional de Sédhiou',
    adresse: 'Centre-ville, Sédhiou',
    telephone: '+221339445577',
    email: 'hopital.sedhiou@sante.gouv.sn',
    position: { latitude: 12.7081, longitude: -15.5569 },
    type: 'hopital',
    isActive: true,
  },
  
  // Additional Centers in Dakar suburbs
  {
    id: 'centre-rufisque',
    nom: 'Centre de Santé de Rufisque',
    adresse: 'Centre-ville, Rufisque',
    telephone: '+221338556677',
    email: 'cs.rufisque@sante.gouv.sn',
    position: { latitude: 14.7167, longitude: -17.2667 },
    type: 'centre_sante',
    isActive: true,
  },
  {
    id: 'centre-bargny',
    nom: 'Centre de Santé de Bargny',
    adresse: 'Bargny, Rufisque',
    telephone: '+221338667788',
    email: 'cs.bargny@sante.gouv.sn',
    position: { latitude: 14.6889, longitude: -17.1833 },
    type: 'centre_sante',
    isActive: true,
  },
  {
    id: 'centre-keur-massar',
    nom: 'Centre de Santé Keur Massar',
    adresse: 'Keur Massar, Dakar',
    telephone: '+221338778899',
    email: 'cs.keurmassar@sante.gouv.sn',
    position: { latitude: 14.7833, longitude: -17.3167 },
    type: 'centre_sante',
    isActive: true,
  },
  {
    id: 'clinique-almadies',
    nom: 'Clinique des Almadies',
    adresse: 'Les Almadies, Dakar',
    telephone: '+221338889900',
    email: 'contact@clinique-almadies.sn',
    position: { latitude: 14.7444, longitude: -17.5333 },
    type: 'clinique',
    isActive: true,
  },
];

export const mockDemandes: Demande[] = [
  {
    id: 'demande-1',
    hopitalId: 'hopital-1',
    hopitalNom: 'Hôpital Principal de Dakar',
    groupeSanguin: 'O-',
    quantite: 3,
    niveauUrgence: 'critique',
    statut: 'active',
    dateCreation: '2024-01-15T10:30:00Z',
    dateExpiration: '2024-01-20T10:30:00Z',
    description: 'Urgence chirurgicale - patient en état critique',
    position: { latitude: 14.6928, longitude: -17.4467 },
    rayonRecherche: 15,
    reponses: [
      {
        id: 'reponse-1',
        demandeId: 'demande-1',
        donneurId: '2',
        donneurNom: 'Fatou Sarr',
        donneurEmail: 'fatou.sarr@gmail.com',
        donneurTelephone: '+221776543210',
        dateReponse: '2024-01-15T11:00:00Z',
        statut: 'interesse',
        commentaire: 'Disponible immédiatement',
      },
    ],
  },
  {
    id: 'demande-2',
    hopitalId: 'centre-1',
    hopitalNom: 'Centre de Santé Pikine',
    groupeSanguin: 'A+',
    quantite: 2,
    niveauUrgence: 'urgent',
    statut: 'active',
    dateCreation: '2024-01-14T14:15:00Z',
    dateExpiration: '2024-01-18T14:15:00Z',
    description: 'Transfusion programmée',
    position: { latitude: 14.7549, longitude: -17.3925 },
    rayonRecherche: 20,
    reponses: [],
  },
  {
    id: 'demande-3',
    hopitalId: 'hopital-1',
    hopitalNom: 'Hôpital Principal de Dakar',
    groupeSanguin: 'B+',
    quantite: 1,
    niveauUrgence: 'normal',
    statut: 'satisfaite',
    dateCreation: '2024-01-10T09:00:00Z',
    dateExpiration: '2024-01-15T09:00:00Z',
    description: 'Stock préventif',
    position: { latitude: 14.6928, longitude: -17.4467 },
    rayonRecherche: 10,
    reponses: [],
  },
  {
    id: 'demande-4',
    hopitalId: 'hopital-thies',
    hopitalNom: 'Hôpital Régional de Thiès',
    groupeSanguin: 'AB+',
    quantite: 2,
    niveauUrgence: 'urgent',
    statut: 'active',
    dateCreation: '2024-01-16T08:00:00Z',
    dateExpiration: '2024-01-21T08:00:00Z',
    description: 'Intervention chirurgicale programmée',
    position: { latitude: 14.7886, longitude: -16.9246 },
    rayonRecherche: 25,
    reponses: [],
  },
  {
    id: 'demande-5',
    hopitalId: 'clinique-1',
    hopitalNom: 'Clinique Pasteur',
    groupeSanguin: 'O+',
    quantite: 4,
    niveauUrgence: 'critique',
    statut: 'active',
    dateCreation: '2024-01-16T12:30:00Z',
    dateExpiration: '2024-01-18T12:30:00Z',
    description: 'Accident de la route - urgence vitale',
    position: { latitude: 14.6889, longitude: -17.4467 },
    rayonRecherche: 30,
    reponses: [],
  },
];

export const groupesSanguins: GroupeSanguin[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const compatibiliteGroupes: Record<GroupeSanguin, GroupeSanguin[]> = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'],
};

export const mockStatistiques: Statistiques = {
  totalDemandes: 156,
  demandesActives: 23,
  totalDonneurs: 1247,
  donneursActifs: 892,
  tauxReponse: 68.5,
  repartitionGroupes: {
    'O+': 320,
    'A+': 298,
    'B+': 187,
    'AB+': 89,
    'O-': 156,
    'A-': 134,
    'B-': 98,
    'AB-': 45,
  },
  demandesParMois: [
    { mois: 'Jan', total: 45, satisfaites: 32 },
    { mois: 'Feb', total: 38, satisfaites: 28 },
    { mois: 'Mar', total: 52, satisfaites: 39 },
    { mois: 'Avr', total: 41, satisfaites: 35 },
    { mois: 'Mai', total: 48, satisfaites: 33 },
    { mois: 'Jun', total: 55, satisfaites: 42 },
  ],
};