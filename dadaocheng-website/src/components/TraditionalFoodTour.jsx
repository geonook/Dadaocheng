
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const TraditionalFoodTour = () => {
  const tourStops = [
    {
      position: [25.0568, 121.5119], // Approx. Lat/Lon
      name: '波麗路西餐廳',
      description: '台灣現存最古老的西餐廳，充滿懷舊氛圍。',
    },
    {
      position: [25.0544, 121.5103],
      name: '民樂旗魚米粉湯',
      description: '大稻埕的經典早餐選擇，湯頭鮮美。',
    },
    {
      position: [25.0549, 121.5105],
      name: '林合發油飯店',
      description: '百年老店，油飯是許多人彌月或節慶的首選。',
    },
    {
      position: [25.0574, 121.5106],
      name: '永樂米苔目',
      description: '口感Q彈的米苔目，搭配甜鹹醬汁，風味獨特。',
    },
    {
      position: [25.0596, 121.5092],
      name: '老阿伯魷魚羹',
      description: '料多實在的魷魚羹，湯頭鮮甜，是必嚐的美味。',
    },
    {
        position: [25.0572, 121.5139],
        name: '大橋頭筒仔米糕',
        description: '肥瘦適中的滷肉搭配Q彈的糯米，是許多人心中的第一名米糕。',
    }
  ];

  const positions = tourStops.map(stop => stop.position);

  return (
    <div className="map-container" style={{ height: '80vh', width: '100%' }}>
      <h2 className="text-2xl font-bold text-center my-4">大稻埕傳統小吃路線</h2>
      <MapContainer center={[25.056, 121.511]} zoom={16} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {
          tourStops.map((stop, index) => (
            <Marker key={index} position={stop.position}>
              <Popup>
                <b>{stop.name}</b><br />
                {stop.description}
              </Popup>
            </Marker>
          ))
        }
        <Polyline pathOptions={{ color: 'blue' }} positions={positions} />
      </MapContainer>
    </div>
  );
};

export default TraditionalFoodTour;
