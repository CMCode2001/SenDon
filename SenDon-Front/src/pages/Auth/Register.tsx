import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, EyeOff, User, Mail, Lock, Phone, MapPin, Calendar, AlertCircle, Target, Loader, RefreshCw, CheckCircle, Navigation, Satellite, Crosshair } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { GroupeSanguin } from '../../types';
import BloodTypeIndicator from '../../components/UI/BloodTypeIndicator';
import LogoSenDon from '../../assets/img/Logo SenDon.png';
import { registerUser } from '../../api/inscription';

interface LocationState {
  loading: boolean;
  error: string | null;
  coordinates: { latitude: number; longitude: number; accuracy?: number } | null;
  address: string | null;
  attempts: number;
  lastAttemptTime: number | null;
}

interface GeolocationOptions {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
}

export default function Register() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '',
    adresse: '',
    groupeSanguin: '' as GroupeSanguin,
    dateNaissance: '',
    dateDerniereDonation: '',
    sexe: '' as 'M' | 'F',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [locationState, setLocationState] = useState<LocationState>({
    loading: false,
    error: null,
    coordinates: null,
    address: null,
    attempts: 0,
    lastAttemptTime: null
  });
  const [locationStep, setLocationStep] = useState<'pending' | 'requesting' | 'success' | 'error' | 'high-accuracy'>('pending');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const bloodTypes: GroupeSanguin[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Fonction améliorée pour obtenir l'adresse à partir des coordonnées
  const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
    try {
      console.log(`🗺️ Géocodage inverse pour: ${latitude}, ${longitude}`);
      
      // Essayer plusieurs services de géocodage pour plus de fiabilité
      const services = [
        // Service principal : Nominatim OpenStreetMap
        {
          name: 'Nominatim',
          url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=fr&countrycodes=sn`
        },
        // Service de backup
        {
          name: 'Nominatim-backup',
          url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1&accept-language=fr`
        }
      ];

      for (const service of services) {
        try {
          console.log(`🔄 Tentative avec ${service.name}...`);
          
          const response = await fetch(service.url, {
            headers: {
              'User-Agent': 'SenDon-App/1.0 (contact@sendon.sn)',
              'Accept': 'application/json',
              'Accept-Language': 'fr,en;q=0.9'
            }
          });
          
          if (!response.ok) {
            console.warn(`⚠️ ${service.name} a retourné ${response.status}`);
            continue;
          }
          
          const data = await response.json();
          console.log(`📍 Réponse de ${service.name}:`, data);
          
          if (data && data.display_name) {
            // Construire une adresse plus lisible et spécifique au Sénégal
            const address = data.address;
            let formattedAddress = '';
            
            if (address) {
              const parts = [];
              
              // Numéro et rue/route
              if (address.house_number && address.road) {
                parts.push(`${address.house_number} ${address.road}`);
              } else if (address.road) {
                parts.push(address.road);
              } else if (address.pedestrian) {
                parts.push(address.pedestrian);
              }
              
              // Quartier/Zone/Suburb
              if (address.suburb) {
                parts.push(address.suburb);
              } else if (address.neighbourhood) {
                parts.push(address.neighbourhood);
              } else if (address.quarter) {
                parts.push(address.quarter);
              }
              
              // Ville/Commune
              if (address.city) {
                parts.push(address.city);
              } else if (address.town) {
                parts.push(address.town);
              } else if (address.village) {
                parts.push(address.village);
              } else if (address.municipality) {
                parts.push(address.municipality);
              }
              
              // Région/Département
              if (address.state) {
                parts.push(address.state);
              } else if (address.region) {
                parts.push(address.region);
              } else if (address.county) {
                parts.push(address.county);
              }
              
              // Pays (toujours Sénégal normalement)
              if (address.country && address.country !== 'Sénégal') {
                parts.push(address.country);
              } else {
                parts.push('Sénégal');
              }
              
              formattedAddress = parts.filter(Boolean).join(', ');
            }
            
            const finalAddress = formattedAddress || data.display_name;
            console.log(`✅ Adresse formatée: ${finalAddress}`);
            return finalAddress;
          }
          
        } catch (serviceError) {
          console.error(`❌ Erreur avec ${service.name}:`, serviceError);
          continue;
        }
      }
      
      throw new Error('Tous les services de géocodage ont échoué');
      
    } catch (error) {
      console.error('❌ Erreur géocodage inverse complète:', error);
      throw new Error('Impossible de récupérer l\'adresse pour cette position. Veuillez saisir votre adresse manuellement.');
    }
  };

  // Fonction améliorée pour obtenir la géolocalisation avec plusieurs tentatives
  const getLocation = async (isRetry = false, useHighAccuracy = true) => {
    console.log(`🎯 Début géolocalisation - Retry: ${isRetry}, HighAccuracy: ${useHighAccuracy}`);
    
    if (isRetry) {
      setLocationStep('requesting');
    } else {
      setLocationStep(useHighAccuracy ? 'high-accuracy' : 'requesting');
    }

    setLocationState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null,
      attempts: prev.attempts + 1,
      lastAttemptTime: Date.now()
    }));

    if (!navigator.geolocation) {
      const errorMsg = 'La géolocalisation n\'est pas supportée par votre navigateur. Veuillez saisir votre adresse manuellement.';
      setLocationState(prev => ({
        ...prev,
        loading: false,
        error: errorMsg,
        coordinates: null,
        address: null
      }));
      setLocationStep('error');
      return;
    }

    // Options progressives : commencer par haute précision, puis réduire si échec
    const optionsHighAccuracy: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 30000, // 30 secondes pour haute précision
      maximumAge: 30000 // 30 secondes de cache max
    };

    const optionsStandard: GeolocationOptions = {
      enableHighAccuracy: false,
      timeout: 15000, // 15 secondes pour précision standard
      maximumAge: 60000 // 1 minute de cache
    };

    const optionsFallback: GeolocationOptions = {
      enableHighAccuracy: false,
      timeout: 10000, // 10 secondes en dernier recours
      maximumAge: 300000 // 5 minutes de cache
    };

    const options = useHighAccuracy ? optionsHighAccuracy : 
                   locationState.attempts <= 2 ? optionsStandard : optionsFallback;

    console.log(`⚙️ Options géolocalisation:`, options);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            console.log(`📍 Position reçue:`, {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: new Date(position.timestamp).toLocaleString()
            });
            
            // Arrêter le watch dès qu'on a une position acceptable
            navigator.geolocation.clearWatch(watchId);
            resolve(position);
          },
          (error) => {
            navigator.geolocation.clearWatch(watchId);
            reject(error);
          },
          options
        );

        // Timeout de sécurité
        setTimeout(() => {
          navigator.geolocation.clearWatch(watchId);
          reject(new Error('Timeout de géolocalisation'));
        }, options.timeout + 1000);
      });

      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      console.log(`✅ Position obtenue avec précision de ${coords.accuracy}m:`, coords);

      // Vérifier la précision
      if (coords.accuracy && coords.accuracy > 1000 && useHighAccuracy && locationState.attempts < 2) {
        console.log(`⚠️ Précision faible (${coords.accuracy}m), nouvelle tentative...`);
        setTimeout(() => getLocation(true, false), 2000);
        return;
      }

      // Obtenir l'adresse à partir des coordonnées
      try {
        setLocationStep('requesting');
        const address = await reverseGeocode(coords.latitude, coords.longitude);
        
        setLocationState(prev => ({
          ...prev,
          loading: false,
          error: null,
          coordinates: coords,
          address: address
        }));

        // Remplir automatiquement le champ adresse
        setFormData(prev => ({
          ...prev,
          adresse: address
        }));

        setLocationStep('success');
        console.log(`🎉 Géolocalisation réussie: ${address}`);
        
      } catch (geocodeError) {
        console.error('❌ Erreur géocodage:', geocodeError);
        
        // Même si le géocodage échoue, on garde les coordonnées
        setLocationState(prev => ({
          ...prev,
          loading: false,
          error: 'Position obtenue mais impossible de récupérer l\'adresse automatiquement. Veuillez saisir votre adresse manuellement.',
          coordinates: coords,
          address: null
        }));
        
        setLocationStep('success'); // Succès partiel
      }

    } catch (error: any) {
      console.error('❌ Erreur géolocalisation:', error);
      
      let errorMessage = 'Impossible d\'obtenir votre position';
      let canRetry = true;
      
      if (error.code) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Accès à la géolocalisation refusé. Veuillez autoriser l\'accès à votre position dans les paramètres de votre navigateur et actualiser la page.';
            canRetry = false;
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Position indisponible. Vérifiez que votre GPS est activé et que vous avez une bonne connexion.';
            break;
          case error.TIMEOUT:
            errorMessage = `Délai d\'attente dépassé (tentative ${locationState.attempts}). Vérifiez votre connexion.`;
            break;
          default:
            errorMessage = `Erreur de géolocalisation (code ${error.code}). Réessayez ou saisissez votre adresse manuellement.`;
        }
      }
      
      // Tentative automatique avec précision réduite si c'est la première fois
      if (useHighAccuracy && locationState.attempts === 1) {
        console.log('🔄 Nouvelle tentative avec précision standard...');
        setTimeout(() => getLocation(true, false), 3000);
        return;
      }
      
      setLocationState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        coordinates: null,
        address: null
      }));
      
      setLocationStep('error');
    }
  };

  // Demander la géolocalisation au chargement avec délai progressif
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('🚀 Démarrage de la géolocalisation automatique');
      getLocation(false, true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validation manuelle si besoin
  if (formData.password !== formData.confirmPassword) {
    setError("Les mots de passe ne correspondent pas.");
    return;
  }

  try {
    setIsLoading(true);
    setError("");

    const response = await registerUser(formData);
    
    console.log('Utilisateur inscrit avec succès :', response);
    // Redirection ou message de succès
    navigate("/connexion"); // ou toute autre action

  } catch (err: any) {
    console.error("Erreur lors de l'inscription :", err);
    setError(err.response?.data?.message || "Une erreur s'est produite.");
  } finally {
    setIsLoading(false);
  }
};


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getLocationStatusColor = () => {
    switch (locationStep) {
      case 'high-accuracy': return 'border-blue-300 bg-blue-100';
      case 'requesting': return 'border-blue-200 bg-blue-50';
      case 'success': return 'border-green-200 bg-green-50';
      case 'error': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getLocationStatusIcon = () => {
    switch (locationStep) {
      case 'high-accuracy': return <Satellite className="h-5 w-5 text-blue-600 animate-pulse" />;
      case 'requesting': return <Loader className="h-5 w-5 text-blue-600 animate-spin" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Target className="h-5 w-5 text-gray-600" />;
    }
  };

  const getLocationStatusText = () => {
    switch (locationStep) {
      case 'pending': return 'Préparation de la géolocalisation...';
      case 'high-accuracy': return 'Recherche de position haute précision...';
      case 'requesting': return 'Localisation en cours...';
      case 'success': return 'Position détectée avec succès !';
      case 'error': return 'Géolocalisation indisponible';
    }
  };

  const getLocationStatusDescription = () => {
    switch (locationStep) {
      case 'pending': return 'Nous allons détecter votre position pour remplir automatiquement votre adresse.';
      case 'high-accuracy': return 'Recherche de votre position exacte avec le GPS. Cela peut prendre quelques secondes...';
      case 'requesting': return 'Veuillez autoriser l\'accès à votre position quand votre navigateur vous le demande.';
      case 'success': return locationState.address ? `Adresse détectée : ${locationState.address}` : 'Position obtenue. Vous pouvez maintenant saisir votre adresse.';
      case 'error': return locationState.error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 group mb-8">
           <img src={LogoSenDon} alt="Logo SenDon" className="w-8 h-12"/>
            <div>
              <span className="text-2xl font-bold text-gray-900">Sen</span>
              <span className="text-2xl font-bold text-primary-600">Don</span>
            </div>
          </Link>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Devenez Donneur
          </h2>
          <p className="text-gray-600">
            Rejoignez la communauté SenDon et contribuez à sauver des vies
          </p>
        </div>

        {/* Enhanced Geolocation Status */}
        <div className={`rounded-2xl border-2 p-6 mb-8 transition-all duration-300 ${getLocationStatusColor()}`}>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              {getLocationStatusIcon()}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                {getLocationStatusText()}
              </h3>
              
              <div className="text-sm text-gray-700 mb-3">
                {getLocationStatusDescription()}
              </div>

              {/* Accuracy and coordinates info */}
              {locationStep === 'success' && locationState.coordinates && (
                <div className="space-y-2">
                  {locationState.coordinates.accuracy && (
                    <div className="text-xs text-gray-500">
                      Précision : ±{Math.round(locationState.coordinates.accuracy)}m
                      {locationState.coordinates.accuracy <= 50 && (
                        <span className="ml-2 text-green-600 font-medium">• Excellente précision</span>
                      )}
                      {locationState.coordinates.accuracy > 50 && locationState.coordinates.accuracy <= 200 && (
                        <span className="ml-2 text-yellow-600 font-medium">• Bonne précision</span>
                      )}
                      {locationState.coordinates.accuracy > 200 && (
                        <span className="ml-2 text-orange-600 font-medium">• Précision modérée</span>
                      )}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Coordonnées : {locationState.coordinates.latitude.toFixed(6)}, {locationState.coordinates.longitude.toFixed(6)}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              {locationStep === 'error' && (
                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={() => getLocation(true, true)}
                    disabled={locationState.loading}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {locationState.loading ? (
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Crosshair className="h-4 w-4 mr-2" />
                    )}
                    Haute précision
                  </button>
                  
                  <button
                    onClick={() => getLocation(true, false)}
                    disabled={locationState.loading}
                    className="bg-secondary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {locationState.loading ? (
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Précision standard
                  </button>
                  
                  <span className="text-sm text-gray-600 flex items-center">
                    Ou continuez sans géolocalisation
                  </span>
                </div>
              )}

              {locationStep === 'success' && (
                <div className="flex items-center text-sm text-green-700 mt-3">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Position enregistrée • Tentative #{locationState.attempts}
                  {locationState.coordinates?.accuracy && locationState.coordinates.accuracy <= 100 && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Précision optimale
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 text-red-800">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Votre prénom"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de famille *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    required
                    value={formData.nom}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Votre nom"
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse e-mail *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="+221 77 123 45 67"
                />
              </div>
            </div>

            <div>
              <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse complète *
                {locationState.coordinates && (
                  <span className="text-green-600 text-xs ml-2">
                    (Remplie automatiquement via GPS)
                  </span>
                )}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="adresse"
                  name="adresse"
                  type="text"
                  required
                  value={formData.adresse}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    locationState.coordinates 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Votre adresse complète"
                />
                {locationState.coordinates && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <Navigation className="h-5 w-5 text-green-600" />
                  </div>
                )}
              </div>
              {locationState.coordinates && (
                <p className="text-xs text-green-600 mt-1">
                  Position GPS enregistrée avec précision ±{locationState.coordinates.accuracy ? Math.round(locationState.coordinates.accuracy) : '?'}m • Vous pouvez modifier l'adresse si nécessaire
                </p>
              )}
            </div>

            {/* Medical Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="dateNaissance" className="block text-sm font-medium text-gray-700 mb-2">
                  Date de naissance
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="dateNaissance"
                    name="dateNaissance"
                    type="date"
                    value={formData.dateNaissance}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="sexe" className="block text-sm font-medium text-gray-700 mb-2">
                  Sexe
                </label>
                <select
                  id="sexe"
                  name="sexe"
                  value={formData.sexe}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                >
                  <option value="">Sélectionner</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
            </div>

            {/* Date dernière donation */}
            <div>
              <label htmlFor="dateDerniereDonation" className="block text-sm font-medium text-gray-700 mb-2">
                Date de dernière donation
                <span className="text-gray-500 text-sm ml-2">(optionnel)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Heart className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="dateDerniereDonation"
                  name="dateDerniereDonation"
                  type="date"
                  value={formData.dateDerniereDonation}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]} // Empêche les dates futures
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Cette information nous aide à calculer votre prochaine date de don possible (délai de 8 semaines entre les dons)
              </p>
            </div>

            {/* Blood Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Groupe sanguin *
              </label>
              <div className="grid grid-cols-4 gap-3">
                {bloodTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, groupeSanguin: type }))}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      formData.groupeSanguin === type
                        ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <BloodTypeIndicator type={type} size="sm" />
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-3">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                J'accepte les{' '}
                <Link to="/conditions" className="text-primary-600 hover:text-primary-500 font-medium">
                  conditions d'utilisation
                </Link>{' '}
                et la{' '}
                <Link to="/confidentialite" className="text-primary-600 hover:text-primary-500 font-medium">
                  politique de confidentialité
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Inscription en cours...
                </div>
              ) : (
                'Créer mon compte'
              )}
            </button>

            <div className="text-center">
              <span className="text-gray-600">Déjà inscrit ? </span>
              <Link to="/connexion" className="text-primary-600 hover:text-primary-500 font-medium">
                Se connecter
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}