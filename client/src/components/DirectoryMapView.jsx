import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Phone, Navigation } from 'lucide-react';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


const LOCALITY_COORDS = {
  'New Bus Stand': [9.5445, 78.5895],
  'Old Bus Stand': [9.5430, 78.5860],
  'Railway Feeder Road': [9.5490, 78.5880],
  'Gandhi Nagar': [9.5460, 78.5820],
  'Kattuparamakudi': [9.5520, 78.5910],
  'Five Lamp Corner': [9.5435, 78.5875],
  'Perumal Kovil Street': [9.5410, 78.5840],
  'Maninagar': [9.5385, 78.5820],
  'Hospital Road': [9.5420, 78.5905],
};

const DEFAULT_CENTER = [9.5445, 78.5895]; // Paramakudi Center

export default function DirectoryMapView({ listings, onSelectListing }) {
  return (
    <div className="w-full h-[550px] rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative z-10">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={14}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {listings.map((item) => {
          const coords = (item.lat && item.lng)
            ? [item.lat, item.lng]
            : (LOCALITY_COORDS[item.subArea] || [DEFAULT_CENTER[0] + (Math.random() - 0.5) * 0.01, DEFAULT_CENTER[1] + (Math.random() - 0.5) * 0.01]);

          const directionsUrl = (item.lat && item.lng)
            ? `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`
            : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${item.title}${item.subArea} Paramakudi`)}`;

          return (
            <Marker key={item._id} position={coords}>
              <Popup className="custom-popup">
                <div className="p-1 space-y-2 max-w-[200px]">
                  {item.photoUrl && (
                    <img src={item.photoUrl} alt={item.title} className="w-full h-20 object-cover rounded-xl" />
                  )}
                  <div>
                    <span className="text-[9px] font-bold uppercase text-indigo-600 block">{item.category}</span>
                    <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                    <p className="text-[10px] text-slate-500">{item.subArea}</p>
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    <a
                      href={`tel:${item.phone}`}
                      className="flex-1 bg-slate-900 text-amber-400 text-[10px] font-bold py-1 px-2 rounded-lg text-center flex items-center justify-center gap-1"
                    >
                      <Phone className="w-2.5 h-2.5" /> Call
                    </a>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-indigo-600 text-white text-[10px] font-bold py-1 px-2 rounded-lg text-center flex items-center justify-center gap-1"
                    >
                      <Navigation className="w-2.5 h-2.5" /> Go
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}