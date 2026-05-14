import React, { useState } from "react";

const types = ["buy", "rent"];

const SearchBar = () => {
  const [query, setQuery] = useState({
    type: "buy",
    city: "",
    minPrice: 0,
    maxPrice: 0,
  });
  
  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  return (
    <div className="w-full max-w-[900px]">
      {/* TYPES */}
      <div className="flex">
        {types.map((type, index) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={`
              px-8 py-4
              border border-[#999]
              border-b-0
              capitalize
              transition-all
              duration-300

              ${
                query.type === type
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }

              ${index === 0 ? "rounded-tl-md border-r-0" : ""}
              ${index === types.length - 1 ? "rounded-tr-md border-l-0" : ""}
            `}
          >
            {type}
          </button>
        ))}
      </div>

      {/* FORM */}
      <form
        className="
          border border-[#999]
          flex
          flex-col
          md:flex-row
          items-center
          justify-between
        "
      >
        <input
          type="text"
          placeholder="City Location"
          className="
            w-full
            md:w-[220px]
            p-5
            outline-none
            border-b
            md:border-b-0
            md:border-r
            border-[#999]
          "
        />

        <input
          type="number"
          placeholder="Min Price"
          className="
            w-full
            md:w-[200px]
            p-5
            outline-none
            border-b
            md:border-b-0
            md:border-r
            border-[#999]
          "
        />

        <input
          type="number"
          placeholder="Max Price"
          className="
            w-full
            md:w-[200px]
            p-5
            outline-none
          "
        />

        <button
          className="
            w-full
            md:w-[120px]
            bg-[#fece51]
            h-[70px]
            flex
            items-center
            justify-center
            hover:bg-yellow-400
            transition-all
            duration-300
          "
        >
          <img src="/search.png" alt="search" className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
