// import { Marker, Popup } from "react-leaflet";
// import { Link } from "react-router-dom";

// function Pin({ item }) {
//   return (
//     <Marker position={[item.latitude, item.longitude]}>
//       <Popup>
//         {/* Main Popup Container */}
//         <div className="flex gap-5 min-w-[200px]">
//           {/* Property Image */}
//           <img
//             src={item.images[0]}
//             alt={item.title}
//             className="w-16 h-12 object-cover rounded-md"
//           />

//           {/* Text Details Container */}
//           <div className="flex flex-col justify-between text-xs">
//             {/* Title Link */}
//             <Link
//               to={`/${item.id}`}
//               className="font-bold text-slate-800 hover:underline block truncate w-28"
//             >
//               {item.title}
//             </Link>

//             {/* Bedrooms Count */}
//             <span className="text-gray-500">{item.bedroom} bedroom</span>

//             {/* Price */}
//             <b className="text-slate-900">$ {item.price}</b>
//           </div>
//         </div>
//       </Popup>
//     </Marker>
//   );
// }

// export default Pin;
