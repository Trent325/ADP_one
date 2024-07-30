// src/components/MapView.tsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { oceanRegions } from '../../data/oceanRegions';
import 'leaflet/dist/leaflet.css'; 

interface MapViewProps {
  regionName: string;
}

const MapView: React.FC<MapViewProps> = ({ regionName }) => {
  const region = oceanRegions.find(r => r.name === regionName);

  if (!region) {
    return <div>Region not found</div>;
  }

  return (
    <MapContainer center={[region.lat, region.lng]} zoom={region.zoom} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[region.lat, region.lng]}>
        <Popup>
          {region.name}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;
