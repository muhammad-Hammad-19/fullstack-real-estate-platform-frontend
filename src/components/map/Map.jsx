import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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
  // Karachi exact center points
  const karachiCenter = [24.8607, 67.0011];

  // Agar items hain aur unme latitude-longitude hai tabhi unpe center kare, warna Karachi par hi rahe
  const centerPosition =
    items.length > 0 && items[0]?.latitude && items[0]?.longitude
      ? [items[0].latitude, items[0].longitude]
      : karachiCenter;

  return (
    <MapContainer
      center={centerPosition}
      zoom={items.length > 0 ? 11 : 12}
      scrollWheelZoom={true} // Mouse scroll se zoom bhee hoga aur mouse click dragging bhee smoothly chalegi
      dragging={true}        // Mouse se pakar kar map ghumane ke liye strict true
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
        url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=en"
      />

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
        <Marker position={karachiCenter}>
          <Popup>
            <div className="text-xs font-sans font-semibold">
              Karachi, Pakistan
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map;