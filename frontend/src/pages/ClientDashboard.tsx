import { useNavigate } from "react-router-dom";
import {
  useGetClientInfoQuery,
  useLogoutMutation,
} from "../store/apiSlice/AuthSlice";
import { motion } from "framer-motion";
import { SoldService } from "../types/types";
import toast from "react-hot-toast";
import Snipper from "../components/global/Snipper";
import QRShapeSelector from "../components/global/QrCode";
import { useEffect } from "react";

const ClientDashboard = () => {
  const navigate = useNavigate();

  const { data, refetch } = useGetClientInfoQuery(undefined);
  console.log(data?.user?.soldServices);
  console.log(data);

  //=> Handle click view demo
  const handleViewDemoClick = (soldServiceId: number) => {
    const soldService = data?.user?.soldServices?.find(
      (service: any) => service.id === soldServiceId
    );
    if (soldService) {
      if (soldService.type === "vCard") {
        navigate(`/template?id=${soldServiceId}`);
      } else if (soldService.type === "menu") {
        navigate(`/menu-template?id=${soldServiceId}`);
      } else {
        console.warn("Unknown service type:", soldService.type);
      }
    } else {
      console.error("Sold service not found for ID:", soldServiceId);
    }
  };

  //=> Handle click edit service
  const handleEditServiceClick = (id: number, type: string) => {
    if (type === "menu") {
      navigate(`/edit-menu?id=${id}`);
    } else if (type === "vCard") {
      navigate(`/edit-template?id=${id}`);
    }
  };

  //=> Handle click logout
  const [logout, { isError, isLoading, isSuccess: logoutIsSuccess }] =
    useLogoutMutation();
  console.log(isError);
  console.log(logoutIsSuccess);

  const handleLogout = async () => {
    try {
      const loggedoutData = await logout(undefined).unwrap();
      console.log(loggedoutData);
      if (loggedoutData?.message === "success") {
        toast.success("Logged out successfully!");
        navigate("/signin?loggedOut=true");
      }
    } catch (err) {
      toast.error("Logout failed. Try again!");
    }
  };

  useEffect(() => {
    // if (logoutIsSuccess) {
    //   toast.success("Logged out successfully!");
    //   navigate("/signin?loggedOut=true");
    // }
    if (isError) {
      toast.error("Logout failed. Try again!");
    }
  }, [logoutIsSuccess, isError, navigate]);

  useEffect(() => {
    refetch();
  }, [logoutIsSuccess]);
  return (
    <div className="flex flex-col items-center relative">
      {isLoading ? (
        <Snipper />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-[80%] max-w-5xl"
        >
          {data?.user?.soldServices.map((ele: SoldService) => (
            <motion.div
              key={ele.id}
              // whileHover={{ scale: 1.05 }}
              // whileTap={{ scale: 0.98 }}
              className="relative p-6 bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl border border-green-800 transition-all"
            >
              <h4 className="text-xl font-bold text-center text-white mb-6 capitalize tracking-wide">
                {ele?.type} Service
              </h4>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => handleViewDemoClick(ele.id)}
                  className="w-full px-6 py-3 bg-[#3a0d4e] cursor-pointer text-white text-sm font-bold rounded-xl shadow-md transition-all"
                  aria-label="View demo of this service"
                >
                  View Demo
                </button>
                <button
                  onClick={() => handleEditServiceClick(ele.id, ele.type)}
                  className="w-full px-6 py-3 bg-green-800 cursor-pointer text-white text-sm font-bold rounded-xl shadow-md transition-all"
                  aria-label="Edit this service"
                >
                  Edit Service
                </button>
                <QRShapeSelector
                  qrUrl={`${import.meta.env.VITE_CLIENT_URL}/${
                    ele?.type === "vCard"
                      ? "template"
                      : ele?.type === "menu"
                      ? "menu"
                      : ""
                  }?id=${ele?.id}`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <button
        onClick={handleLogout}
        className="px-6 py-2 my-7 cursor-pointer bg-red-700 text-gray-100 text-sm font-semibold rounded-lg shadow-lg hover:bg-red-800 transition-all"
      >
        Logout
      </button>
    </div>
  );
};

export default ClientDashboard;
