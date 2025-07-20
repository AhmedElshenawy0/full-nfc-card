import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaIdCard, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  useGetAllClientsQuery,
  useLogoutMutation,
} from "../../store/apiSlice/AuthSlice";
import { useGetAllCardsQuery } from "../../store/apiSlice/CardSlice";
import { useEffect, useState } from "react";
import { Card } from "../../types/types";
import Snipper from "../../components/global/Snipper";

export const AdminDashboard = () => {
  const navigate = useNavigate();

  const [logout, { isError, isSuccess: logoutIsSuccess }] = useLogoutMutation();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await logout(undefined).unwrap();
      console.log("Logout response:", response);

      if (response?.message === "success") {
        toast.success("Logged out successfully!");
        navigate("/signin?loggedOut=true");
      }
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed. Try again!");
    }
  };

  //=> Handle logout response
  useEffect(() => {
    if (logoutIsSuccess) {
      toast.success("Logged out successfully!");
      navigate("/signin?loggedOut=true");
      console.log("logout true");
    }
    if (isError) {
      toast.error("Logout failed. Try again!");
      console.log("logout true");
    }
  }, [logoutIsSuccess, isError, navigate]);

  //=> Get all cards
  const {
    data: allCards,
    error: fetchCardsError,
    isLoading: isCardsLoading,
  } = useGetAllCardsQuery(undefined);

  //=> Get all clients
  const {
    data: allClients,
    error: fetchClientsError,
    isLoading: isClientsLoading,
  } = useGetAllClientsQuery(undefined);

  //=> Handle fetch clients and cards errors
  useEffect(() => {
    if (fetchCardsError) {
      toast.error(
        (fetchCardsError as any)?.data?.message || "Error loading cards"
      );
    }
    if (fetchClientsError) {
      if (isClientsLoading) return;
      if (
        (fetchClientsError as any)?.data?.message ===
        "Access Forbidden: Admins only"
      ) {
        navigate("/signin");
        console.log("access forbidden");

        // toast.error(
        //   (fetchClientsError as any)?.data?.message || "Error loading clients"
        // );
        return;
      } else {
        toast.error(
          (fetchClientsError as any)?.data?.message || "Error loading clients"
        );
      }
      return;
    }
  }, [fetchClientsError, fetchCardsError]);

  //=> Handle loading fetch cards and clients
  if (isCardsLoading || isClientsLoading) {
    return (
      <div className="text-center text-gray-400">
        <Snipper />
      </div>
    );
  }

  // if (!allCards || !allClients) {
  //   return (
  //     <div className="text-center text-red-400 mt-12">
  //       Failed to load dashboard data. Please try again later.
  //     </div>
  //   );
  // }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-gray-100 w-full max-w-xl mx-auto p-6 rounded-2xl shadow-xl bg-gradient-to-br from-gray-900 to-black border border-green-800 transition-all"
    >
      <h1 className="text-[28px] font-bold mb-4 tracking-wide text-mint-100">
        Admin Dashboard
      </h1>
      <hr className="w-full border-mint-600 mb-6 " />

      <div className="flex justify-between w-full mb-6">
        <div className="flex-1 text-center">
          <p className="text-lg font-bold text-mint-300">
            {allCards?.cards?.length}
          </p>
          <p className="text-sm text-mint-100/70">Cards</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-lg font-bold text-mint-300">
            {
              allCards?.cards?.filter((card: Card) => card?.client_id !== null)
                .length
            }
          </p>
          <p className="text-sm text-mint-100/70">Active Cards</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-lg font-bold text-mint-300">
            {allClients?.clients?.length}
          </p>
          <p className="text-sm text-mint-100/70">Clients</p>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <Link
          to="/add-card"
          className="flex items-center gap-3 p-4 bg-green-800 hover:bg-green-950 transition rounded-xl shadow text-mint-100"
        >
          <FaPlus className="text-xl text-[#6ee7b7]" />
          <span className="font-medium">Add New Card</span>
        </Link>

        <Link
          to="/cards"
          className="flex items-center gap-3 p-4 bg-green-800 hover:bg-green-950 transition rounded-xl shadow text-mint-100"
        >
          <FaIdCard className="text-xl text-[#6ee7b7]" />
          <span className="font-medium">View Cards</span>
        </Link>

        <Link
          to="/clients"
          className="flex items-center gap-3 p-4 bg-green-800 hover:bg-green-950 transition rounded-xl shadow text-mint-100"
        >
          <FaUsers className="text-xl text-[#6ee7b7]" />
          <span className="font-medium">View Clients</span>
        </Link>

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-3 p-4 bg-red-900 border border-red-950 transition rounded-xl shadow text-mint-100"
        >
          <FaSignOutAlt className="text-xl text-white" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-white text-black rounded-xl shadow-lg p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
