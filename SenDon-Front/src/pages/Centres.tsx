import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Phone, Mail, Navigation, Clock, Users, Target, AlertCircle, Loader, RefreshCw } from 'lucide-react';
import InteractiveMap from '../components/Map/InteractiveMap';
import { mockHopitaux } from '../data/mockData';
import { Hopital } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface LocationState {
  loading: boolean;
  error: string | null;
  coordinates: { latitude: number; longitude: number; accuracy?: number } | null;
  attempts: number;
}

interface HopitalWithDistance extends Hopital {
  distance?: number;
}

export default function Centres() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedHopital, setSelectedHopital] = useState<Hopital | null>(null);
  const [locationState, setLocationState] = useState<LocationState>({
    loading: true,
    error: null,
    coordinates: null,
    attempts: 0
  });
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [maxDistance, setMaxDistance] = useState<number>(50); // km
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Enhanced Haversine distance calculation
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Round to 1 decimal place for precision
    return Math.round(distance * 10) / 10;
  };

  // Enhanced geolocation with multiple attempts and progressive accuracy
  const getLocation = (isRetry = false, useHighAccuracy = true) => {
    console.log(`🎯 Début géolocalisation Centres - Retry: ${isRetry}, HighAccuracy: ${useHighAccuracy}`);
    
    if (isRetry) {
      setIsRefreshing(true);
    } else {
      setLocationState(prev => ({ ...prev, loading: true, error: null }));
    }

    setLocationState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null,
      attempts: prev.attempts + 1
    }));

    if (!navigator.geolocation) {
      setLocationState(prev => ({
        ...prev,
        loading: false,
        error: 'La géolocalisation n\'est pas supportée par votre navigateur',
        coordinates: null
      }));
      setIsRefreshing(false);
      return;
    }

    // Progressive options based on attempt number
    const getOptions = (attempt: number, highAccuracy: boolean) => {
      if (highAccuracy && attempt === 1) {
        return {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 30000
        };
      } else if (attempt <= 2) {
        return {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 60000
        };
      } else {
        return {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000
        };
      }
    };

    const options = getOptions(locationState.attempts + 1, useHighAccuracy);
    console.log(`⚙️ Options géolocalisation (tentative ${locationState.attempts + 1}):`, options);

    // Use watchPosition for better accuracy
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        console.log(`📍 Position reçue (tentative ${locationState.attempts + 1}):`, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(position.timestamp).toLocaleString()
        });

        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };

        // Stop watching once we get a position
        navigator.geolocation.clearWatch(watchId);

        // Check if we should retry for better accuracy
        if (coords.accuracy && coords.accuracy > 1000 && useHighAccuracy && locationState.attempts < 2) {
          console.log(`⚠️ Précision faible (${coords.accuracy}m), nouvelle tentative...`);
          setTimeout(() => getLocation(true, false), 2000);
          return;
        }

        setLocationState(prev => ({
          ...prev,
          loading: false,
          error: null,
          coordinates: coords
        }));
        setIsRefreshing(false);
        
        console.log(`✅ Géolocalisation réussie avec précision ${coords.accuracy}m`);
      },
      (error) => {
        navigator.geolocation.clearWatch(watchId);
        console.error(`❌ Erreur géolocalisation (tentative ${locationState.attempts + 1}):`, error);
        
        let errorMessage = 'Impossible d\'obtenir votre position';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Accès à la géolocalisation refusé. Veuillez autoriser l\'accès à votre position dans les paramètres de votre navigateur.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Position indisponible. Vérifiez que votre GPS est activé et que vous avez une bonne connexion.';
            break;
          case error.TIMEOUT:
            errorMessage = `Délai d\'attente dépassé (tentative ${locationState.attempts + 1}). Vérifiez votre connexion.`;
            break;
        }

        // Auto-retry with reduced accuracy if first attempt with high accuracy failed
        if (useHighAccuracy && locationState.attempts === 0 && error.code !== error.PERMISSION_DENIED) {
          console.log('🔄 Nouvelle tentative avec précision standard...');
          setTimeout(() => getLocation(true, false), 3000);
          return;
        }
        
        setLocationState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
          coordinates: null
        }));
        setIsRefreshing(false);
      },
      options
    );

    // Safety timeout
    setTimeout(() => {
      navigator.geolocation.clearWatch(watchId);
      if (locationState.loading) {
        console.log('⏰ Timeout de sécurité atteint');
        setLocationState(prev => ({
          ...prev,
          loading: false,
          error: 'Délai d\'attente dépassé. Réessayez ou continuez sans géolocalisation.',
          coordinates: null
        }));
        setIsRefreshing(false);
      }
    }, options.timeout + 2000);
  };

  useEffect(() => {
    // Try to use user's saved position first
    if (user?.position) {
      console.log('📍 Utilisation de la position sauvegardée de l\'utilisateur');
      setLocationState({
        loading: false,
        error: null,
        coordinates: user.position,
        attempts: 0
      });
    } else {
      // Get fresh location
      setTimeout(() => {
        console.log('🚀 Démarrage géolocalisation pour page Centres');
        getLocation(false, true);
      }, 1000);
    }
  }, [user]);

  // Enhanced filtering algorithm with smart matching
  const getMatchedHopitaux = (): HopitalWithDistance[] => {
    console.log('🔍 Filtrage des hôpitaux:', {
      total: mockHopitaux.length,
      userLocation: locationState.coordinates,
      searchTerm,
      filterType,
      maxDistance
    });

    // Start with all active hospitals
    let filtered = mockHopitaux.filter(hopital => {
      const isActive = hopital.isActive;
      
      // Text search - more flexible matching
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch = searchLower === '' || 
        hopital.nom.toLowerCase().includes(searchLower) ||
        hopital.adresse.toLowerCase().includes(searchLower) ||
        hopital.type.toLowerCase().includes(searchLower) ||
        hopital.email.toLowerCase().includes(searchLower);
      
      // Type filter
      const matchesFilter = filterType === 'all' || hopital.type === filterType;
      
      return isActive && matchesSearch && matchesFilter;
    });

    console.log('✅ Après filtrage de base:', filtered.length);

    // If user location is available, add distance calculation and distance filtering
    if (locationState.coordinates) {
      filtered = filtered
        .map(hopital => {
          const distance = calculateDistance(
            locationState.coordinates!.latitude,
            locationState.coordinates!.longitude,
            hopital.position.latitude,
            hopital.position.longitude
          );
          
          return {
            ...hopital,
            distance
          };
        })
        .filter(hopital => hopital.distance! <= maxDistance)
        .sort((a, b) => a.distance! - b.distance!);
        
      console.log('✅ Après filtrage par distance et tri:', filtered.length);
      if (filtered.length > 0) {
        console.log('🏥 Hôpitaux les plus proches:', 
          filtered.slice(0, 3).map(h => ({ 
            name: h.nom, 
            distance: h.distance,
            accuracy: locationState.coordinates?.accuracy 
          }))
        );
      }
    } else {
      // If no location, just add empty distance and sort alphabetically
      filtered = filtered
        .map(hopital => ({ ...hopital, distance: undefined }))
        .sort((a, b) => a.nom.localeCompare(b.nom));
        
      console.log('📍 Pas de géolocalisation - tri alphabétique:', filtered.length);
    }

    return filtered;
  };

  const matchedHopitaux = getMatchedHopitaux();

  // Get closest hospitals (top 3)
  const closestHopitaux = matchedHopitaux
    .filter(h => h.distance !== undefined)
    .slice(0, 3);

  const getDirections = (hopital: Hopital) => {
    if (locationState.coordinates) {
      const url = `https://www.openstreetmap.org/directions?from=${locationState.coordinates.latitude},${locationState.coordinates.longitude}&to=${hopital.position.latitude},${hopital.position.longitude}`;
      window.open(url, '_blank');
    } else {
      // Fallback - just show the hospital location
      const url = `https://www.openstreetmap.org/?mlat=${hopital.position.latitude}&mlon=${hopital.position.longitude}&zoom=15`;
      window.open(url, '_blank');
    }
  };

  const getDistanceColor = (distance: number) => {
    if (distance <= 5) return 'text-green-600';
    if (distance <= 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDistanceLabel = (distance: number) => {
    if (distance <= 5) return 'Très proche';
    if (distance <= 15) return 'Proche';
    if (distance <= 30) return 'Modéré';
    return 'Éloigné';
  };

  const getEstimatedTime = (distance: number) => {
    // Estimate based on average speed in urban areas (25 km/h)
    return Math.ceil(distance * 2.4); // minutes
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Centres de Don Près de Vous
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les {mockHopitaux.length} centres de don disponibles au Sénégal. 
            Nous utilisons votre géolocalisation pour vous proposer les options les plus pratiques.
          </p>
        </div>

        {/* Enhanced Location Status */}
        <div className="mb-8">
          {locationState.loading && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center">
              <Loader className="h-5 w-5 text-blue-600 animate-spin mr-3" />
              <div>
                <div className="font-medium text-blue-900">
                  Localisation en cours... (Tentative #{locationState.attempts + 1})
                </div>
                <div className="text-sm text-blue-700">
                  Nous recherchons votre position pour vous proposer les centres les plus proches.
                  {locationState.attempts > 0 && ' Ajustement de la précision en cours...'}
                </div>
              </div>
            </div>
          )}

          {locationState.error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-red-900 mb-1">
                    Géolocalisation indisponible (Tentative #{locationState.attempts})
                  </div>
                  <div className="text-sm text-red-700 mb-3">{locationState.error}</div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => getLocation(true, true)}
                      disabled={isRefreshing}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
                    >
                      {isRefreshing ? (
                        <Loader className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Target className="h-4 w-4 mr-2" />
                      )}
                      Haute précision
                    </button>
                    <button
                      onClick={() => getLocation(true, false)}
                      disabled={isRefreshing}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center"
                    >
                      {isRefreshing ? (
                        <Loader className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Précision standard
                    </button>
                    <div className="text-sm text-red-600 flex items-center">
                      Vous pouvez toujours consulter tous les centres disponibles.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {locationState.coordinates && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center">
                <Target className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <div className="font-medium text-green-900">Position détectée avec succès</div>
                  <div className="text-sm text-green-700">
                    {matchedHopitaux.length} centre(s) trouvé(s) dans un rayon de {maxDistance} km
                    {locationState.coordinates.accuracy && (
                      <span className="ml-2">
                        • Précision: ±{Math.round(locationState.coordinates.accuracy)}m
                      </span>
                    )}
                    {user?.groupeSanguin && ` • Votre groupe sanguin: ${user.groupeSanguin}`}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {locationState.coordinates && closestHopitaux.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-600">Centre le plus proche</div>
                  <div className="text-2xl font-bold text-primary-600">
                    {closestHopitaux[0].distance?.toFixed(1)} km
                  </div>
                  <div className="text-sm text-gray-500 truncate">{closestHopitaux[0].nom}</div>
                </div>
                <MapPin className="h-8 w-8 text-primary-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-600">Centres à moins de 10km</div>
                  <div className="text-2xl font-bold text-secondary-600">
                    {matchedHopitaux.filter(h => h.distance && h.distance <= 10).length}
                  </div>
                  <div className="text-sm text-gray-500">Facilement accessibles</div>
                </div>
                <Navigation className="h-8 w-8 text-secondary-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-600">Temps estimé</div>
                  <div className="text-2xl font-bold text-accent-600">
                    {closestHopitaux[0].distance ? getEstimatedTime(closestHopitaux[0].distance) : '--'} min
                  </div>
                  <div className="text-sm text-gray-500">Vers le plus proche</div>
                </div>
                <Clock className="h-8 w-8 text-accent-600" />
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher par nom, adresse, type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              />
            </div>
            
            {/* Filters */}
            <div className="flex items-center space-x-4">
              {/* Type Filter */}
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                >
                  <option value="all">Tous les types</option>
                  <option value="hopital">Hôpitaux</option>
                  <option value="centre_sante">Centres de Santé</option>
                  <option value="clinique">Cliniques</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Distance Filter */}
              {locationState.coordinates && (
                <div className="relative">
                  <select
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(Number(e.target.value))}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  >
                    <option value={10}>Dans 10 km</option>
                    <option value={25}>Dans 25 km</option>
                    <option value={50}>Dans 50 km</option>
                    <option value={100}>Dans 100 km</option>
                    <option value={500}>Tout le Sénégal</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <Navigation className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              )}
              
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'map'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Carte
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Liste
                </button>
              </div>
            </div>
          </div>
          
          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            {matchedHopitaux.length} centre(s) trouvé(s) sur {mockHopitaux.length} disponibles
            {locationState.coordinates && ` dans un rayon de ${maxDistance} km`}
            {locationState.coordinates?.accuracy && (
              <span className="ml-2 text-xs text-gray-500">
                (précision GPS: ±{Math.round(locationState.coordinates.accuracy)}m)
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        {viewMode === 'map' ? (
          /* Map View */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <InteractiveMap
              hopitaux={matchedHopitaux}
              userLocation={locationState.coordinates || undefined}
              selectedHopital={selectedHopital?.id}
              onHopitalSelect={setSelectedHopital}
              height="600px"
            />
          </div>
        ) : (
          /* List View */
          <div className="space-y-6">
            {/* Closest Centers Highlight */}
            {locationState.coordinates && closestHopitaux.length > 0 && (
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6 border border-primary-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Target className="h-6 w-6 text-primary-600 mr-2" />
                  Centres les plus proches de vous
                  {locationState.coordinates.accuracy && (
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      (précision ±{Math.round(locationState.coordinates.accuracy)}m)
                    </span>
                  )}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {closestHopitaux.map((hopital, index) => (
                    <div key={hopital.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-primary-600">#{index + 1}</span>
                        <span className={`text-sm font-bold ${getDistanceColor(hopital.distance || 0)}`}>
                          {hopital.distance?.toFixed(1)} km
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">{hopital.nom}</h3>
                      <p className="text-sm text-gray-600 mb-2">{getDistanceLabel(hopital.distance || 0)}</p>
                      <p className="text-xs text-gray-500 mb-3">~{getEstimatedTime(hopital.distance || 0)} min</p>
                      <button
                        onClick={() => getDirections(hopital)}
                        className="w-full bg-primary-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
                      >
                        <Navigation className="h-4 w-4 mr-1" />
                        Y aller
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Centers List */}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {matchedHopitaux.map((hopital) => (
                <div key={hopital.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      {hopital.nom}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                      hopital.type === 'hopital' 
                        ? 'bg-red-100 text-red-800' 
                        : hopital.type === 'centre_sante'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {hopital.type === 'hopital' ? 'Hôpital' : 
                       hopital.type === 'centre_sante' ? 'Centre de Santé' : 'Clinique'}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{hopital.adresse}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                      <a href={`tel:${hopital.telephone}`} className="hover:text-primary-600 transition-colors">
                        {hopital.telephone}
                      </a>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                      <a href={`mailto:${hopital.email}`} className="hover:text-primary-600 transition-colors truncate">
                        {hopital.email}
                      </a>
                    </div>
                    
                    {hopital.distance && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm font-medium text-primary-600">
                          <Navigation className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{hopital.distance.toFixed(1)} km de vous</span>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          hopital.distance <= 5 ? 'bg-green-100 text-green-800' :
                          hopital.distance <= 15 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {getDistanceLabel(hopital.distance)}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm text-green-600">
                      <Clock className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span>Ouvert • 8h00 - 17h00</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => getDirections(hopital)}
                      className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Itinéraire
                    </button>
                    
                    <a
                      href={`tel:${hopital.telephone}`}
                      className="flex-1 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors flex items-center justify-center"
                    >
                      <Phone className="h-4 w-4 mr-2 text-white" />
                      Appeler
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {matchedHopitaux.length === 0 && !locationState.loading && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun centre trouvé</h3>
            <p className="text-gray-600 mb-4">
              {locationState.coordinates 
                ? `Aucun centre trouvé dans un rayon de ${maxDistance} km avec les critères actuels.`
                : 'Aucun centre ne correspond à vos critères de recherche.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {locationState.coordinates && maxDistance < 500 && (
                <button
                  onClick={() => setMaxDistance(500)}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Rechercher dans tout le Sénégal
                </button>
              )}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setMaxDistance(100);
                }}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}

        {/* Emergency Contact */}
        <div className="mt-12 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Urgence Médicale ?</h2>
          <p className="text-lg mb-6 opacity-90">
            En cas d'urgence vitale, contactez immédiatement les services d'urgence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:15"
              className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <Phone className="h-5 w-5 mr-2" />
              SAMU - 15
            </a>
            <a
              href="tel:18"
              className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <Phone className="h-5 w-5 mr-2" />
              Pompiers - 18
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}