import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import { MapPin, Phone, Mail, Navigation, Clock } from 'lucide-react';
import { Hopital } from '../../types';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different types of health centers
const createCustomIcon = (type: string) => {
  const color = type === 'hopital' ? '#dc2626' : type === 'centre_sante' ? '#16a34a' : '#ea580c';
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="${color}"/>
        <circle cx="12.5" cy="12.5" r="6" fill="white"/>
        <path d="M12.5 7v11M7 12.5h11" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

interface InteractiveMapProps {
  hopitaux: Hopital[];
  userLocation?: { latitude: number; longitude: number };
  selectedHopital?: string;
  onHopitalSelect?: (hopital: Hopital) => void;
  height?: string;
}

// Component to fit map bounds to show all markers
function FitBounds({ hopitaux, userLocation }: { hopitaux: Hopital[]; userLocation?: { latitude: number; longitude: number } }) {
  const map = useMap();

  useEffect(() => {
    if (hopitaux.length > 0) {
      const bounds = new LatLngBounds([]);
      
      // Add hospital markers to bounds
      hopitaux.forEach(hopital => {
        bounds.extend([hopital.position.latitude, hopital.position.longitude]);
      });
      
      // Add user location to bounds if available
      if (userLocation) {
        bounds.extend([userLocation.latitude, userLocation.longitude]);
      }
      
      // Fit map to bounds with padding
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, hopitaux, userLocation]);

  return null;
}

export default function InteractiveMap({ 
  hopitaux, 
  userLocation, 
  selectedHopital, 
  onHopitalSelect,
  height = "500px" 
}: InteractiveMapProps) {
  const [userPosition, setUserPosition] = useState<{ latitude: number; longitude: number } | null>(
    userLocation || null
  );

  // Get user's current location
  useEffect(() => {
    if (!userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Default to Dakar center if geolocation fails
          setUserPosition({
            latitude: 14.6928,
            longitude: -17.4467,
          });
        }
      );
    }
  }, [userLocation]);

  // Default center (Dakar)
  const defaultCenter: [number, number] = [14.6928, -17.4467];
  const mapCenter: [number, number] = userPosition 
    ? [userPosition.latitude, userPosition.longitude]
    : defaultCenter;

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getDirections = (hopital: Hopital) => {
    const url = `https://www.openstreetmap.org/directions?from=${userPosition?.latitude},${userPosition?.longitude}&to=${hopital.position.latitude},${hopital.position.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="relative">
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ height, width: '100%' }}
        className="rounded-xl shadow-lg border border-gray-200"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FitBounds hopitaux={hopitaux} userLocation={userPosition || undefined} />
        
        {/* User location marker */}
        {userPosition && (
          <Marker 
            position={[userPosition.latitude, userPosition.longitude]}
            icon={new Icon({
              iconUrl: `data:image/svg+xml;base64,${btoa(`
                <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="8" fill="#3b82f6" stroke="white" stroke-width="2"/>
                  <circle cx="10" cy="10" r="3" fill="white"/>
                </svg>
              `)}`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          >
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-blue-900 mb-1">Votre position</div>
                <div className="text-sm text-gray-600">Position actuelle</div>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Hospital markers */}
        {hopitaux.map((hopital) => {
          const distance = userPosition 
            ? calculateDistance(
                userPosition.latitude, 
                userPosition.longitude, 
                hopital.position.latitude, 
                hopital.position.longitude
              )
            : null;

          return (
            <Marker
              key={hopital.id}
              position={[hopital.position.latitude, hopital.position.longitude]}
              icon={createCustomIcon(hopital.type)}
              eventHandlers={{
                click: () => onHopitalSelect?.(hopital),
              }}
            >
              <Popup maxWidth={300}>
                <div className="p-2">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">
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
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{hopital.adresse}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <a href={`tel:${hopital.telephone}`} className="hover:text-primary-600">
                        {hopital.telephone}
                      </a>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <a href={`mailto:${hopital.email}`} className="hover:text-primary-600">
                        {hopital.email}
                      </a>
                    </div>
                    
                    {distance && (
                      <div className="flex items-center text-sm font-medium text-primary-600">
                        <Navigation className="h-4 w-4 mr-2" />
                        <span>À {distance.toFixed(1)} km de vous</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => getDirections(hopital)}
                      className="flex-1 bg-primary-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Itinéraire
                    </button>
                    
                    <a
                      href={`tel:${hopital.telephone}`}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Appeler
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-[1000]">
        <h4 className="font-semibold text-gray-900 mb-2 text-sm">Légende</h4>
        <div className="space-y-1">
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
            <span>Hôpitaux</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
            <span>Centres de Santé</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 bg-orange-600 rounded-full mr-2"></div>
            <span>Cliniques</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
            <span>Votre position</span>
          </div>
        </div>
      </div>
    </div>
  );
}