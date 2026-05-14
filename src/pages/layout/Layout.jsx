import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

function Layout() {
  return (
    <div
      className="
        h-screen
        max-w-[1366px]
        mx-auto
        px-5
        flex
        flex-col

        lg:max-w-[1280px]
        md:max-w-[768px]
        sm:max-w-[640px]
      "
    >
      {/* NAVBAR */}
      <div className="h-[100px]">
        <Navbar />
      </div>

      {/* CONTENT */}
      <div className="h-[calc(100vh-100px)]">
        <Outlet />
      </div>
    </div>
  );
}

export { Layout };
