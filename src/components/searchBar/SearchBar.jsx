import { useState } from "react";
import { Link } from "react-router-dom";
import { cityUppercase } from "../../utilis";

function SearchBar() {
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  return (
    <div className="w-full max-w-[640px]">
      {/* 1. BUY / RENT TABS */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setType("buy")}
          className={`px-5 py-2.5 sm:px-6 sm:py-3 font-medium text-sm sm:text-base rounded-t-md transition-colors ${
            type === "buy"
              ? "bg-black text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setType("rent")}
          className={`px-5 py-2.5 sm:px-6 sm:py-3 font-medium text-sm sm:text-base rounded-t-md transition-colors ${
            type === "rent"
              ? "bg-black text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Rent
        </button>
      </div>
      
      {/* 2. SEARCH FORM */}
      <form className="flex flex-col sm:flex-row border border-slate-200 rounded-b-md rounded-tr-md sm:rounded-tr-md overflow-hidden bg-white shadow-sm">
        
        {/* City Input */}
        <input
          type="text"
          placeholder="City Location"
          value={city}
          onChange={(e) => {
            let cityName = cityUppercase(e.target.value);
            setCity(cityName);
          }}
          className="w-full sm:flex-1 p-3.5 sm:p-4 border-b sm:border-b-0 sm:border-r border-slate-100 text-sm focus:outline-none placeholder:text-slate-400"
        />

        {/* Min Price Input */}
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-full sm:flex-1 p-3.5 sm:p-4 border-b sm:border-b-0 sm:border-r border-slate-100 text-sm focus:outline-none placeholder:text-slate-400"
        />

        {/* Max Price Input */}
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full sm:flex-1 p-3.5 sm:p-4 border-b sm:border-b-0 text-sm focus:outline-none placeholder:text-slate-400"
        />

        {/* Search Action Button */}
        <Link
          to={`/list?type=${type}&city=${city}&minPrice=${minPrice}&maxPrice=${maxPrice}`}
          className="bg-[#fece51] hover:bg-yellow-400 flex items-center justify-center p-4 sm:px-6 transition-colors active:scale-95 sm:active:scale-100 shrink-0"
        >
          <img src="/search.png" alt="search" className="w-5 h-5 object-contain" />
        </Link>

      </form>
    </div>
  );
}

export default SearchBar;