import React from "react";
import SearchBar from "../../components/searchBar/SearchBar";

const HomePage = () => {
  return (
    <div
      className="
        flex
        flex-col
        md:flex-row
        h-screen
        max-w-[1400px]
        mx-auto
      "
    >
      {/* LEFT CONTENT SECTION */}
      <div
        className="
          flex-[3]
          flex
          items-center
          px-6
          md:px-10
          lg:px-16
          pt-[100px]
          md:pt-0
        "
      >
        <div
          className="
            flex
            flex-col
            justify-center
            gap-8
            w-full
          "
        >
          {/* TITLE & DESCRIPTION */}
          <div className="flex flex-col gap-4">
            <h1
              className="
                text-[36px]
                md:text-[42px]
                xl:text-[54px]
                font-bold
                leading-[1.1]
                max-w-[600px]
              "
            >
              Find Real Estate & Get Your Dream Place
            </h1>

            <p
              className="
                text-gray-600
                leading-7
                text-base
                max-w-[550px]
              "
            >
              Discover modern spaces designed for the way you live today.
              Whether you're searching for a cozy apartment, a family home,
              or your next investment.
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="z-10 w-full max-w-[700px]">
            <SearchBar />
          </div>

          {/* STATS SECTION */}
          <div
            className="
              grid
              grid-cols-2
              sm:flex
              items-center
              justify-between
              max-w-[600px]
              gap-6
              md:gap-0
              pb-10
              md:pb-0
            "
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold italic">16+</h1>
              <h2 className="text-sm md:text-base text-gray-500 font-light">
                Years of Experience
              </h2>
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold italic">200</h1>
              <h2 className="text-sm md:text-base text-gray-500 font-light">
                Awards Gained
              </h2>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h1 className="text-2xl md:text-3xl font-bold italic">2000+</h1>
              <h2 className="text-sm md:text-base text-gray-500 font-light">
                Property Ready
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT IMAGE SECTION */}
      <div
        className="
          hidden
          md:block
          flex-[2]
          bg-[#fcf5f3]
          relative
          overflow-hidden
          -mt-[100px]
          h-[calc(100vh+100px)]
        "
      >
        <img
          src="/bg.png"
          alt="hero"
          className="
            absolute
            top-0
            right-[-15%]
            h-full
            max-w-none
            object-cover
            scale-110
          "
        />
      </div>
    </div>
  );
};

export default HomePage;