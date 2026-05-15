import { useState } from "react";
import { useSearchParams } from "react-router-dom";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
  });

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    setSearchParams(query);
  };

  return (
    // Main Filter Container
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
            name="city"
            placeholder="City Location"
            onChange={handleChange}
            defaultValue={query.city}
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
            name="type"
            id="type"
            onChange={handleChange}
            defaultValue={query.type}
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
            name="property"
            id="property"
            onChange={handleChange}
            defaultValue={query.property}
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
            name="minPrice"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.minPrice}
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
            name="maxPrice"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.maxPrice}
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
            name="bedroom"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.bedroom}
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
