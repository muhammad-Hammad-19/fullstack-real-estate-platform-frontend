import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// React Leaflet ke default marker icons ka bug fix karne ke liye ye zaroori hota hai
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const Map = ({ items = [] }) => {
  // Default position agar list khali ho (London)
  const defaultCenter = [51.505, -0.09];

  // Agar list mein items hain toh pehle item ki location uthayega, nahi toh default center
  
  const centerPosition =
    items.length > 0 && items[0].latitude && items[0].longitude
      ? [items[0].latitude, items[0].longitude]
      : defaultCenter;

  return (
    <MapContainer
      center={centerPosition}
      zoom={items.length > 0 ? 11 : 13}
      scrollWheelZoom={false}
      className="w-full h-full" // Tailwind classes taake map full container cover kare
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Agar items pass ho rahe hain toh unke dynamic pins show karega */}
      {items.length > 0 ? (
        items.map(
          (item) =>
            item.latitude &&
            item.longitude && (
              <Marker key={item.id} position={[item.latitude, item.longitude]}>
                <Popup>
                  <div className="flex flex-col gap-1 p-1 font-sans text-xs min-w-[120px]">
                    <b className="text-slate-800 text-sm block truncate">
                      {item.title}
                    </b>
                    <span className="text-amber-600 font-bold">
                      ${item.price}
                    </span>
                  </div>
                </Popup>
              </Marker>
            ),
        )
      ) : (
        // Agar koi item nahi hai toh sirf single default marker dikhayega
        <Marker position={defaultCenter}>
          <Popup>
            <div className="text-xs font-sans">
              A pretty CSS3 popup. <br /> Easily customizable.
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map;
