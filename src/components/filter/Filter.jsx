import { useState } from "react";
import { useSearchParams } from "react-router-dom";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Har ek input field ke liye alag aur simple state
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [property, setProperty] = useState(searchParams.get("property") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [bedroom, setBedroom] = useState(searchParams.get("bedroom") || "");

  // Search button click hone par saari states ko URL me set karne wala function
  const handleFilter = () => {
    setSearchParams({
      city,
      type,
      property,
      minPrice,
      maxPrice,
      bedroom,
    });
  };
  
  return (
    <div className="flex flex-col gap-[10px] w-full">
      {/* Title */}
      <h1 className="font-light text-2xl text-slate-700">
        Search results for{" "}
        <b className="font-semibold text-black">
          {searchParams.get("city") || "Anywhere"}
        </b>
      </h1>

      {/* Top Section (Location Input) */}
      <div className="w-full">
        <div className="flex flex-col gap-[2px] w-full">
          <label
            htmlFor="city"
            className="text-[10px] uppercase tracking-wider text-gray-500 font-medium"
          >
            Location
          </label>
          <input
            type="text"
            id="city"
            placeholder="City Location"
            value={city}
            onChange={(e) => setCity(e.target.value)} // Seedhe state update
            className="w-full p-[10px] border border-[#e0e0e0] rounded-[5px] text-sm focus:outline-amber-400"
          />
        </div>
      </div>

      {/* Bottom Section (Dropdowns and Smaller Inputs) */}
      <div className="flex justify-between items-end flex-wrap gap-4 md:gap-[20px]">
        {/* Type Select */}
        <div className="flex flex-col gap-[2px] flex-1 min-w-[100px]">
          <label
            htmlFor="type"
            className="text-[10px] uppercase tracking-wider text-gray-500 font-medium"
          >
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)} // Seedhe state update
            className="w-full p-[10px] border border-[#e0e0e0] rounded-[5px] text-sm bg-white focus:outline-amber-400"
          >
            <option value="">any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>

        {/* Property Select */}
        <div className="flex flex-col gap-[2px] flex-1 min-w-[100px]">
          <label
            htmlFor="property"
            className="text-[10px] uppercase tracking-wider text-gray-500 font-medium"
          >
            Property
          </label>
          <select
            id="property"
            value={property}
            onChange={(e) => setProperty(e.target.value)} // Seedhe state update
            className="w-full p-[10px] border border-[#e0e0e0] rounded-[5px] text-sm bg-white focus:outline-amber-400"
          >
            <option value="">any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
        </div>

        {/* Min Price Input */}
        <div className="flex flex-col gap-[2px] flex-1 min-w-[100px]">
          <label
            htmlFor="minPrice"
            className="text-[10px] uppercase tracking-wider text-gray-500 font-medium"
          >
            Min Price
          </label>
          <input
            type="number"
            id="minPrice"
            placeholder="any"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)} // Seedhe state update
            className="w-full p-[10px] border border-[#e0e0e0] rounded-[5px] text-sm focus:outline-amber-400"
          />
        </div>

        {/* Max Price Input */}
        <div className="flex flex-col gap-[2px] flex-1 min-w-[100px]">
          <label
            htmlFor="maxPrice"
            className="text-[10px] uppercase tracking-wider text-gray-500 font-medium"
          >
            Max Price
          </label>
          <input
            type="text"
            id="maxPrice"
            placeholder="any"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)} // Seedhe state update
            className="w-full p-[10px] border border-[#e0e0e0] rounded-[5px] text-sm focus:outline-amber-400"
          />
        </div>

        {/* Bedroom Input */}
        <div className="flex flex-col gap-[2px] flex-1 min-w-[100px]">
          <label
            htmlFor="bedroom"
            className="text-[10px] uppercase tracking-wider text-gray-500 font-medium"
          >
            Bedroom
          </label>
          <input
            type="text"
            id="bedroom"
            placeholder="any"
            value={bedroom}
            onChange={(e) => setBedroom(e.target.value)} // Seedhe state update
            className="w-full p-[10px] border border-[#e0e0e0] rounded-[5px] text-sm focus:outline-amber-400"
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleFilter}
          className="w-[100px] h-[42px] p-[10px] border-none cursor-pointer bg-[#fece51] hover:bg-yellow-400 transition-colors rounded-[5px] flex items-center justify-center shadow-sm"
        >
          <img src="/search.png" alt="search" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default Filter;
