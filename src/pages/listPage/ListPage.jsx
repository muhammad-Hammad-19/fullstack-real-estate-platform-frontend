import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { listData } from "../../lib/dummydata";

const ListPage = () => {
  const [searchParams] = useSearchParams();

  // URL ki values nikalna
  const cityQuery = searchParams.get("city")?.toLowerCase() || "";
  const typeQuery = searchParams.get("type") || "";
  const propertyQuery = searchParams.get("property") || "";
  const minPriceQuery = Number(searchParams.get("minPrice")) || 0;
  const maxPriceQuery = Number(searchParams.get("maxPrice")) || Infinity;
  const bedroomQuery = searchParams.get("bedroom") || "";

  // 🔍 DEBUGGING LOGS: Console me check karne ke liye ki URL se kya aa raha hai
  console.log("--- CURRENT FILTERS IN URL ---");
  console.log({
    cityQuery,
    typeQuery,
    propertyQuery,
    minPriceQuery,
    maxPriceQuery,
    bedroomQuery,
  });;
  
 const filteredItems = useMemo(() => {
  return listData.filter((post) => {
    // 1. Post ka address nikal kar small letters (lowercase) me kiya
    const postAddress = post.address ? String(post.address).toLowerCase() : "";
    
    // 2. Check kiya ke kya input me likhi hui city/address post ke address me maujood hai?

    const matchCity = cityQuery
      ? postAddress.includes(cityQuery.toLowerCase())
      : true;

    // Sirf city match return karega
    return matchCity;

  });
}, [listData, cityQuery]); // Dependency array me bhi baaki fuzool cheezein hata dein
  // 🔍 DEBUGGING LOG: Kitne items bache filter hone ke baad
  console.log("Filtered Items Count:", filteredItems.length);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] overflow-hidden bg-white w-full">
      {/* LEFT SIDE: CARDS LIST */}
      <div className="flex-[3] h-full overflow-y-auto p-4 md:p-6">
        <div className="max-w-[750px] mx-auto flex flex-col gap-8 pb-10">
          <Filter />

          <div className="flex flex-col gap-6">
            {filteredItems && filteredItems.length > 0 ? (
              filteredItems.map((post) => <Card key={post.id} item={post} />)
            ) : (
              <p className="text-gray-400 italic text-center py-10 bg-slate-50 rounded-lg border-2 border-dashed">
                No properties match your filter criteria.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: MAP SYSTEM */}
      <div className="hidden md:block flex-[2] h-full bg-[#fcf5f3] relative">
        <Map items={filteredItems} />
      </div>
    </div>
  );
};

export default ListPage;
