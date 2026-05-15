import React from "react";
import Filter from "../../components/filter/Filter"; // Agar filter component folder mein hai
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { listData } from "../../lib/dummydata"; // Dummy data directly use kiya layout testing ke liye

const ListPage = () => {
  // Aap dynamic backend loader data bhi use kar sakte hain: const data = useLoaderData();
  // Abhi ke liye hum aapki imported 'listData' list ko hi render kar rahe hain.
  const items = listData;

  return (
    // Main Container: Screen height se header minus karke full viewport layout
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] overflow-hidden bg-white w-full">
      {/* LEFT SIDE: CARDS LIST (Scrollable) */}
      <div className="flex-[3] h-full overflow-y-auto p-4 md:p-6">
        <div className="max-w-[750px] mx-auto flex flex-col gap-8 pb-10">
          {/* Optional Filter Area */}
          <Filter />

          {/* Cards Loop */}
          <div className="flex flex-col gap-6">
            {items && items.length > 0 ? (
              items.map((post) => <Card key={post.id} item={post} />)
            ) : (
              <p className="text-gray-400 italic text-center py-10">
                {" "}
                No properties found.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: MAP SYSTEM (Mobile par hidden, desktop par sticky flex) */}
      <div className="hidden md:block flex-[2] h-full bg-[#fcf5f3] relative">
        <Map items={items} />
      </div>
    </div>
  );
};

export default ListPage;
