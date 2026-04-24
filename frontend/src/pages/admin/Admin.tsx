import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaIdCard, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  useGetAllClientsQuery,
  useLogoutMutation,
} from "../../store/apiSlice/AuthSlice";
import { useGetAllCardsQuery } from "../../store/apiSlice/CardSlice";
import { useEffect, useState } from "react";
import { Card } from "../../types/types";
import Snipper from "../../components/global/Snipper";
import { FiLogOut } from "react-icons/fi";

import { useMotionValue, useSpring, useInView } from "framer-motion";
import { useRef } from "react";

type CountUpProps = {
  value: number;
  duration?: number;
};

export const CountUp = ({ value, duration = 1 }: CountUpProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    duration: duration * 1000,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (ref.current) {
        (ref.current as HTMLElement).textContent =
          Math.floor(latest).toLocaleString();
      }
    });
  }, [spring]);

  return <span ref={ref}>0</span>;
};
export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [
    logout,
    { isError, isSuccess: logoutIsSuccess, isLoading: isLogoutLoading },
  ] = useLogoutMutation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await logout(undefined).unwrap();
      if (response?.message === "success") {
        toast.success("Logged out successfully!");
        navigate("/");
      }
    } catch (err) {
      toast.error("Logout failed. Try again!");
    }
  };

  useEffect(() => {
    if (logoutIsSuccess) {
      toast.success("Logged out successfully!");
      navigate("/");
    }
    if (isError) toast.error("Logout failed. Try again!");
  }, [logoutIsSuccess, isError, navigate]);

  const {
    data: allCards,
    error: fetchCardsError,
    isLoading: isCardsLoading,
  } = useGetAllCardsQuery(undefined);

  const {
    data: allClients,
    error: fetchClientsError,
    isLoading: isClientsLoading,
  } = useGetAllClientsQuery(undefined);

  useEffect(() => {
    if (fetchCardsError) {
      toast.error(
        (fetchCardsError as any)?.data?.message || "Error loading cards",
      );
    }
    if (fetchClientsError) {
      if (isClientsLoading) return;
      if (
        (fetchClientsError as any)?.data?.message ===
        "Access Forbidden: Admins only"
      ) {
        navigate("/signin");
        return;
      } else {
        toast.error(
          (fetchClientsError as any)?.data?.message || "Error loading clients",
        );
      }
    }
  }, [fetchClientsError, fetchCardsError]);

  if (isCardsLoading || isClientsLoading) {
    return (
      <div className="text-center text-gray-400">
        <Snipper />
      </div>
    );
  }

  const activeCards =
    allCards?.cards?.filter((card: Card) => card?.client_id !== null).length ??
    0;
  const totalCards = allCards?.cards?.length ?? 0;
  const totalClients = allClients?.clients?.length ?? 0;

  const stats = [
    { label: "Total Cards", value: totalCards, color: "rgba(74,222,128,0.9)" },
    {
      label: "Active Cards",
      value: activeCards,
      color: "rgba(167,139,250,0.9)",
    },
    { label: "Clients", value: totalClients, color: "rgba(74,222,128,0.9)" },
  ];

  const navLinks = [
    {
      to: "/add-card",
      icon: <FaPlus size={14} />,
      label: "Add New Card",
      color: "green",
    },
    {
      to: "/cards",
      icon: <FaIdCard size={14} />,
      label: "View Cards",
      color: "green",
    },
    {
      to: "/clients",
      icon: <FaUsers size={14} />,
      label: "View Clients",
      color: "purple",
    },
  ];

  return (
    <>
      {/* ✅ bg-transparent — بياخد bg من الـ Layout */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm mx-auto bg-transparent"
      >
        {/* Header */}
        <div className="mb-6">
          <p
            className="text-[10px] tracking-[0.3em] uppercase mb-1 font-mono"
            style={{ color: "rgba(74,222,128,0.5)" }}
          >
            Control Panel
          </p>
          <h1 className="text-[22px] font-medium text-white tracking-tight">
            Admin Dashboard
          </h1>
        </div>

        {/* Divider */}
        <div
          className="w-full h-[0.5px] mb-6"
          style={{
            background:
              "linear-gradient(90deg, rgba(74,222,128,0.3), rgba(58,13,78,0.3), transparent)",
          }}
        />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded p-3 text-center relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "0.5px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(8px)",
              }}
            >
              {/* glow blob */}
              <div
                style={{
                  position: "absolute",
                  top: -10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: stat.color,
                  opacity: 0.08,
                  filter: "blur(14px)",
                  pointerEvents: "none",
                }}
              />

              {/* top accent line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "20%",
                  right: "20%",
                  height: 1,
                  borderRadius: 99,
                  background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
                  opacity: 0.5,
                }}
              />

              <p
                className="text-[22px] font-semibold mb-0.5 relative"
                style={{
                  color: stat.color,
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: "-0.5px",
                }}
              >
                <CountUp value={stat.value} duration={0.8} />
              </p>
              <p
                className="text-[9px] uppercase tracking-widest relative"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Nav Links */}
        <div className="flex flex-col gap-2 mb-3">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.to}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
            >
              <Link
                to={link.to}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all duration-150 group"
                style={{
                  background:
                    link.color === "green"
                      ? "rgba(20,83,45,0.25)"
                      : "rgba(58,13,78,0.3)",
                  border:
                    link.color === "green"
                      ? "0.5px solid rgba(74,222,128,0.15)"
                      : "0.5px solid rgba(167,139,250,0.15)",
                  color:
                    link.color === "green"
                      ? "rgba(134,239,172,0.85)"
                      : "rgba(216,180,254,0.85)",
                  backdropFilter: "blur(8px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    link.color === "green"
                      ? "rgba(20,83,45,0.45)"
                      : "rgba(58,13,78,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    link.color === "green"
                      ? "rgba(20,83,45,0.25)"
                      : "rgba(58,13,78,0.3)";
                }}
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      link.color === "green"
                        ? "rgba(20,83,45,0.4)"
                        : "rgba(58,13,78,0.5)",
                  }}
                >
                  {link.icon}
                </span>
                {link.label}
                <span className="ml-auto opacity-30 text-[10px]">→</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all duration-150"
          style={{
            background: "rgba(127,29,29,0.2)",
            border: "0.5px solid rgba(239,68,68,0.15)",
            color: "rgba(252,165,165,0.8)",
            backdropFilter: "blur(8px)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(127,29,29,0.35)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(127,29,29,0.2)")
          }
        >
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(127,29,29,0.35)" }}
          >
            <FaSignOutAlt size={13} />
          </span>
          Log Out
        </motion.button>
      </motion.div>

      {/* Logout Confirm Modal
    t
      */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(6px)",
            }}
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 8 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[88%] max-w-sm rounded-2xl p-6"
              style={{
                background: "rgba(15,5,20,0.85)",
                border: "0.5px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              {/* Modal header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(127,29,29,0.3)",
                    border: "0.5px solid rgba(239,68,68,0.2)",
                  }}
                >
                  <FaSignOutAlt size={13} className="text-red-400" />
                </div>
                <h2 className="text-[15px] font-medium text-white">
                  Confirm Logout
                </h2>
              </div>

              <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">
                Are you sure you want to logout from the admin panel?
              </p>

              <div
                className="w-full h-[0.5px] mb-4"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "0.5px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.6)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.09)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.05)")
                  }
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2.5  items-center rounded-xl text-[13px] font-medium transition-all duration-150"
                  style={{
                    background: "rgba(127,29,29,0.35)",
                    border: "0.5px solid rgba(239,68,68,0.25)",
                    color: "rgba(252,165,165,0.9)",
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: "'DM Sans', sans-serif",
                    // cursor: isLoading ? "not-allowed" : "pointer",
                    transition: "background 0.15s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    opacity: isLogoutLoading ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(127,29,29,0.55)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "rgba(127,29,29,0.35)")
                  }
                >
                  {isLogoutLoading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <FiLogOut size={13} />
                      </motion.span>
                      Signing out…
                    </>
                  ) : (
                    <>
                      <FiLogOut size={13} />
                      <span> Sign out</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
