import { useState } from "react";
// import logo from "/images/SignUp Logo White (1).png";
import Typewriter from "typewriter-effect";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SelectService = () => {
  const [serviceType, setservicetype] = useState();
  const navigate = useNavigate();

  const handleNextPage = () => {
    if (!serviceType) {
      return alert("you have to choose type of service");
    }
    if (serviceType === "vCard") {
      navigate(`/select-template?service-type=${serviceType}`);
      console.log(serviceType);
    } else if (serviceType === "menu") {
      navigate(`/select-template?service-type=${serviceType}`);
      console.log(serviceType);
    } else if (serviceType === "file") {
      navigate(`/file-template?service-type=${serviceType}}`);
      console.log(serviceType);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-black to-[#3a0d4e] text-gray-200 px-4 py-6">
      {/* Header */}
      <div className="flex items-center mb-10 w-full">
        <div className="p-2 bg-green-800 rounded-full shadow-md flex items-center justify-center">
          <img
            src={`/images/SignUp Logo White (1).png`}
            alt="Logo"
            className="w-10 h-10"
          />
        </div>
        <div className="flex items-center ml-4 space-x-2">
          <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
          <span className="w-[1px] h-6 bg-gray-300"></span>
        </div>
        <div className="ml-4 text-sm text-gray-300">
          <Typewriter
            onInit={(typewriter) => {
              typewriter
                .typeString("Select your service.")
                .pauseFor(2000)
                .deleteAll()
                .typeString("Customize your experience.")
                .pauseFor(2000)
                .start();
            }}
            options={{
              loop: true,
              delay: 100,
            }}
          />
        </div>
      </div>

      {/* Input Section */}
      <div className="w-full max-w-md space-y-6">
        {/* Service Selection */}
        <div className="relative">
          <label htmlFor="service" className="block text-sm text-gray-400 mb-2">
            Choose your service
          </label>
          <div className="relative">
            <select
              name="service"
              id="service"
              className="w-full appearance-none px-4 py-2 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              defaultValue=""
              onChange={(e: any) => setservicetype(e?.target?.value)}
            >
              <option value="" disabled>
                Select a service
              </option>
              <option value="vCard">V.Card</option>
              <option value="menu">Menu</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-center w-full max-w-md mt-8"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNextPage}
          className="inline-block px-8 py-2 bg-green-900 text-gray-100 w-full font-bold rounded-full shadow-lg hover:bg-green-950 cursor-pointer transition"
        >
          Next Step
        </motion.button>
        <p className="mt-4 text-sm text-gray-400">
          Personalize your service and take control of your journey.
        </p>
      </motion.div>

      {/* Footer */}
      <footer className="mt-10 text-sm text-gray-600">
        © 2025 SignUp. All rights reserved.
      </footer>
    </div>
  );
};

export default SelectService;
