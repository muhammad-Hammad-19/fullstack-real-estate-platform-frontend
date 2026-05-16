import { Link } from "react-router-dom";

function Card({ item }) {
  return (
    <div className="flex gap-5 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
      {/* 📸 Image Container - Dynamic route match karne ke liye path ko '/list/id' kiya */}
      <Link
        to={`/list/${item.id}`}
        className="hidden md:block flex-[2] h-[200px] overflow-hidden rounded-xl"
      >
        <img
          src={item.images[0]}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </Link>

      {/* 📄 Text Container */}
      <div className="flex-[3] flex flex-col justify-between gap-[10px]">
        {/* Title & Address Section */}
        <div className="flex flex-col gap-2">
          {/* Title - Isko bhi '/list/id' par redirect kiya */}
          <h2 className="text-xl font-semibold text-slate-700 transition-all duration-300 hover:text-black">
            <Link to={`/list/${item.id}`}>{item.title}</Link>
          </h2>

          <p className="text-sm flex items-center gap-[5px] text-gray-500">
            <img src="/pin.png" alt="pin" className="w-4 h-4" />
            <span>{item.address}</span>
          </p>
        </div>

        {/* 💰 Price */}
        <p className="text-xl font-medium p-1.5 px-3 rounded bg-amber-400/20 w-max text-amber-800">
          $ {item.price}
        </p>

        {/* ⚙️ Bottom Section (Features & Action Icons) */}
        <div className="flex justify-between gap-[10px] items-center">
          {/* Features (Bedrooms & Bathrooms) */}
          <div className="flex gap-3 text-sm">
            <div className="flex items-center gap-[5px] bg-slate-100 p-1.5 px-2.5 rounded text-slate-600">
              <img src="/bed.png" alt="bed" className="w-4 h-4" />
              <span>
                {item.bedroom} {item.bedroom > 1 ? "bedrooms" : "bedroom"}
              </span>
            </div>

            <div className="flex items-center gap-[5px] bg-slate-100 p-1.5 px-2.5 rounded text-slate-600">
              <img src="/bath.png" alt="bath" className="w-4 h-4" />
              <span>
                {item.bathroom} {item.bathroom > 1 ? "bathrooms" : "bathroom"}
              </span>
            </div>
          </div>

          {/* Action Buttons (Save & Chat) */}
          <div className="flex gap-2">
            <button
              aria-label="Save post"
              className="border border-gray-300 p-2 rounded-lg cursor-pointer flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all"
            >
              <img src="/save.png" alt="save" className="w-4 h-4" />
            </button>
            <button
              aria-label="Chat with owner"
              className="border border-gray-300 p-2 rounded-lg cursor-pointer flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all"
            >
              <img src="/chat.png" alt="chat" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
