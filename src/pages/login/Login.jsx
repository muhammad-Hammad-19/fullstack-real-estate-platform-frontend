import React from "react";

const Login = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* LEFT SIDE: LOGIN FORM SECTION */}
      <div className="flex-[3] flex flex-col justify-center items-center px-10 bg-white">
        <div className="max-w-[400px] w-full">
          <h1 className="text-4xl font-bold mb-8">Welcome back</h1>

          <form className="flex flex-col gap-5">
            <input
              type="email"
              placeholder="Email"
              className="p-5 border border-gray-300 rounded-md outline-none focus:border-black transition-all"
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="p-5 border border-gray-300 rounded-md outline-none focus:border-black transition-all"
              required
            />

            <button
              type="submit"
              className="bg-[#51cdfeee] p-5 rounded-md text-white font-bold text-lg  cursor-pointer mt-2"
            >
              Login
            </button>

            <p className="text-gray-600 text-center mt-2">
              Don't you have an account?{" "}
              <a
                href="/signup"
                className="text-black font-semibold underline hover:text-gray-700"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE: IMAGE ONLY SECTION */}
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

export default Login;
