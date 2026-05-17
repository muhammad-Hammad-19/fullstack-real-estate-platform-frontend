import { useState } from "react";
import { Link } from "react-router-dom";
import { cityUppercase } from "../../utilis";

function SearchBar() {
  // Har cheez ke liye alag aur simple state
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
          onClick={() => setType("buy")} // Seedhe type ko "buy" kar do
          className={`px-6 py-3 font-medium rounded-t-md ${
            type === "buy"
              ? "bg-black text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setType("rent")} // Seedhe type ko "rent" kar do
          className={`px-6 py-3 font-medium rounded-t-md ${
            type === "rent"
              ? "bg-black text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          Rent
        </button>
      </div>
      
      {/* 2. SEARCH FORM */}
      <form className="flex flex-col sm:flex-row border border-slate-200 rounded-b-md sm:rounded-tr-md overflow-hidden bg-white shadow-sm">
        {/* City Input */}
        <input
          type="text"
          placeholder="City Location"
          value={city}
          onChange={(e) => {
            let cityName = cityUppercase(e.target.value);
            setCity(cityName); // State update karne ke liye
          }} // Ek line mein data save
          className="flex-1 p-4 border-b sm:border-b-0 sm:border-r border-slate-100 text-sm focus:outline-none"
        />

        {/* Min Price Input */}
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)} // Ek line mein data save
          className="flex-1 p-4 border-b sm:border-b-0 sm:border-r border-slate-100 text-sm focus:outline-none"
        />

        {/* Max Price Input */}
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)} // Ek line mein data save
          className="flex-1 p-4 text-sm focus:outline-none"
        />

        <Link
          to={`/list?type=${type}&city=${city}&minPrice=${minPrice}&maxPrice=${maxPrice}`}
          className="bg-[#fece51] hover:bg-yellow-400 flex items-center justify-center p-4 sm:px-6"
        >
          <img src="/search.png" alt="search" className="w-5 h-5" />
        </Link>
      </form>
    </div>
  );
}

export default SearchBar;
