import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex flex-col items-center justify-center px-4 text-center text-white">
      <FaExclamationTriangle className="text-yellow-400 text-6xl mb-6 drop-shadow-lg" />
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-gray-400 mb-6 max-w-md">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-purple-700 hover:bg-purple-800 rounded-full text-white font-semibold shadow-md transition-all"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
