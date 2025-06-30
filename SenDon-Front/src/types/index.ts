export type UserRole = 'donneur' | 'admin_hopital' | 'super_admin';

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: UserRole;
  telephone?: string;
  adresse?: string;
  position?: {
    latitude: number;
    longitude: number;
  };
  groupeSanguin?: GroupeSanguin;
  dateNaissance?: string;
  dateDerniereDonation?: string;
  sexe?: 'M' | 'F';
  hopitalId?: string;
  avatar?: string;
  isActive: boolean;
}

export type GroupeSanguin = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type NiveauUrgence = 'normal' | 'urgent' | 'critique';

export type StatutDemande = 'active' | 'satisfaite' | 'annulee' | 'expiree';

export interface Demande {
  id: string;
  hopitalId: string;
  hopitalNom: string;
  groupeSanguin: GroupeSanguin;
  quantite: number;
  niveauUrgence: NiveauUrgence;
  statut: StatutDemande;
  dateCreation: string;
  dateExpiration: string;
  description?: string;
  position: {
    latitude: number;
    longitude: number;
  };
  rayonRecherche: number;
  reponses: ReponseDemande[];
}

export interface ReponseDemande {
  id: string;
  demandeId: string;
  donneurId: string;
  donneurNom: string;
  donneurEmail: string;
  donneurTelephone?: string;
  dateReponse: string;
  statut: 'interesse' | 'confirme' | 'rejete';
  commentaire?: string;
}

export interface Proche {
  id: string;
  donneurId: string;
  nom: string;
  prenom: string;
  type: 'famille' | 'proche';
  groupeSanguin: GroupeSanguin;
  telephone?: string;
  adresse?: string;
  relation: string;
}

export interface Hopital {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  position: {
    latitude: number;
    longitude: number;
  };
  type: 'hopital' | 'centre_sante' | 'clinique';
  isActive: boolean;
}

export interface Statistiques {
  totalDemandes: number;
  demandesActives: number;
  totalDonneurs: number;
  donneursActifs: number;
  tauxReponse: number;
  repartitionGroupes: Record<GroupeSanguin, number>;
  demandesParMois: Array<{
    mois: string;
    total: number;
    satisfaites: number;
  }>;
}