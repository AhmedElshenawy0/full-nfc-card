import { useLocation, Outlet } from "react-router-dom";
import logo from "/images/SignUp Logo White (1).png";
import { lazy, Suspense } from "react";
import { motion } from "framer-motion";

const LazyTypewriter = lazy(() => import("typewriter-effect"));

const Layout = () => {
  const location = useLocation();
  const hideHeaderRoutes = [
    "/template",
    "/menu-template",
    "/edit-template",
    // "/edit-menu",
  ];
  const noPaddingRoutes = ["/menu", "/template"];
  return (
    <div
      className={`min-h-screen relative bg-gradient-to-br from-black to-[#3a0d4e] text-gray-200 ${
        noPaddingRoutes.includes(location.pathname) ? "" : "px-4 py-6"
      }`}
    >
      {!hideHeaderRoutes.includes(location.pathname) && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center mb-10 w-full"
        >
          <div className="p-2 bg-green-800 rounded-full shadow-md flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-10 h-10" />
          </div>
          <div className="flex items-center ml-4 space-x-2">
            <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
            <span className="w-[1px] h-6 bg-gray-300 mr-2"></span>
          </div>
          <Suspense fallback={<span>Loading...</span>}>
            <LazyTypewriter
              onInit={(typewriter) => {
                typewriter.typeString("Connect smarter").pauseFor(2000).start();
              }}
              options={{ loop: true, delay: 100 }}
            />
          </Suspense>
        </motion.div>
      )}

      <Outlet />
      {!hideHeaderRoutes.includes(location.pathname) && (
        <footer className="relative bottom-0 right-[50%] translate-x-[50%] mt-6 flex justify-center pt-6 text-sm text-gray-600">
          © 2025 SignUp. All rights reserved.
        </footer>
      )}
    </div>
  );
};

export default Layout;
