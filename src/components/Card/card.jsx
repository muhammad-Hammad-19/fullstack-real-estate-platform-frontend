import { Link } from "react-router-dom";

function Card({ item }) {
  return (
    <div className="flex gap-5">
      {/* Image Container - Mobile/Medium screens par hide ho jayega jaise SCSS mein tha */}
      <Link to={`/${item.id}`} className="hidden md:block flex-[2] h-[200px]">
        <img
          src={item.images[0]}
          alt={item.title}
          className="w-full h-full object-cover rounded-xl"
        />
      </Link>

      {/* Text Container */}
      <div className="flex-[3] flex flex-col justify-between gap-[10px]">
        {/* Title & Address Section */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-slate-700 transition-all duration-400 hover:text-black hover:scale-[1.01]">
            <Link to={`/${item.id}`}>{item.title}</Link>
          </h2>

          <p className="text-sm flex items-center gap-[5px] text-gray-500">
            <img src="/pin.png" alt="pin" className="w-4 h-4" />
            <span>{item.address}</span>
          </p>
        </div>

        {/* Price */}
        <p className="text-xl font-light p-1.5 rounded bg-amber-400/30 w-max text-slate-800">
          $ {item.price}
        </p>

        {/* Bottom Section (Features & Action Icons) */}
        <div className="flex justify-between gap-[10px] items-center">
          {/* Features */}
          <div className="flex gap-5 text-sm">
            <div className="flex items-center gap-[5px] bg-slate-100 p-1.5 rounded text-slate-600">
              <img src="/bed.png" alt="bed" className="w-4 h-4" />
              <span>{item.bedroom} bedroom</span>
            </div>

            <div className="flex items-center gap-[5px] bg-slate-100 p-1.5 rounded text-slate-600">
              <img src="/bath.png" alt="bath" className="w-4 h-4" />
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>

          {/* Icons */}
          <div className="flex gap-5">
            <div className="border border-gray-400 py-0.5 px-1.5 rounded cursor-pointer flex items-center justify-center hover:bg-gray-200 transition-colors">
              <img src="/save.png" alt="save" className="w-4 h-4" />
            </div>
            <div className="border border-gray-400 py-0.5 px-1.5 rounded cursor-pointer flex items-center justify-center hover:bg-gray-200 transition-colors">
              <img src="/chat.png" alt="chat" className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
