import { useNavigate } from "react-router-dom";
import {
  useGetClientInfoQuery,
  useLogoutMutation,
} from "../store/apiSlice/AuthSlice";
import { motion, AnimatePresence } from "framer-motion";
import { SoldService } from "../types/types";
import toast from "react-hot-toast";
import Snipper from "../components/global/Snipper";
import QRShapeSelector from "../components/global/QrCode";
import { useEffect, useState } from "react";
import { MdNfc } from "react-icons/md";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { FiEdit2, FiEye, FiLogOut, FiGrid, FiZap } from "react-icons/fi";

// ─── tiny pill badge ──────────────────────────────────────────────────────────
const Badge = ({ type }: { type: string }) => {
  const isMenu = type === "menu";
  return (
    <span
      style={{
        fontSize: 10,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        fontFamily: "'DM Mono', monospace",
        padding: "3px 10px",
        borderRadius: 99,
        background: isMenu ? "rgba(20,83,45,0.22)" : "rgba(88,28,135,0.22)",
        color: isMenu ? "#4ade80" : "#c084fc",
        border: `0.5px solid ${isMenu ? "rgba(74,222,128,0.25)" : "rgba(192,132,252,0.25)"}`,
      }}
    >
      {isMenu ? "menu" : "vCard"}
    </span>
  );
};

// ─── icon wrapper ─────────────────────────────────────────────────────────────
const ServiceIcon = ({ type }: { type: string }) => {
  const isMenu = type === "menu";
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        background: isMenu ? "rgba(20,83,45,0.28)" : "rgba(88,28,135,0.28)",
        border: `0.5px solid ${isMenu ? "rgba(74,222,128,0.2)" : "rgba(192,132,252,0.2)"}`,
      }}
    >
      {isMenu ? (
        <HiOutlineMenuAlt2 size={15} color="#4ade80" />
      ) : (
        <MdNfc size={15} color="#c084fc" />
      )}
    </div>
  );
};

// ─── action button ────────────────────────────────────────────────────────────
interface ActionBtnProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  variant: "purple" | "green";
}

const ActionBtn = ({ onClick, icon, label, variant }: ActionBtnProps) => {
  const [hovered, setHovered] = useState(false);
  const isPurple = variant === "purple";

  const base = isPurple
    ? {
        bg: "rgba(88,28,135,0.22)",
        bgHover: "rgba(88,28,135,0.4)",
        border: "rgba(192,132,252,0.2)",
        color: "rgba(216,180,254,0.9)",
      }
    : {
        bg: "rgba(20,83,45,0.22)",
        bgHover: "rgba(20,83,45,0.4)",
        border: "rgba(74,222,128,0.2)",
        color: "rgba(134,239,172,0.9)",
      };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        padding: "9px 16px",
        borderRadius: 12,
        border: `0.5px solid ${base.border}`,
        background: hovered ? base.bgHover : base.bg,
        color: base.color,
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "'DM Sans', sans-serif",
        cursor: "pointer",
        transition: "background 0.15s",
      }}
    >
      {icon}
      {label}
    </motion.button>
  );
};

// ─── service card ─────────────────────────────────────────────────────────────
interface ServiceCardProps {
  ele: SoldService;
  index: number;
  onView: (id: number) => void;
  onEdit: (id: number, type: string) => void;
}

const ServiceCard = ({ ele, index, onView, onEdit }: ServiceCardProps) => {
  const isMenu = ele.type === "menu";
  const accentColor = isMenu
    ? "linear-gradient(90deg,#14532d,#16a34a,transparent)"
    : "linear-gradient(90deg,#581c87,#7c3aed,transparent)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.07,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      style={{
        borderRadius: 18,
        overflow: "hidden",
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(14px)",
        border: "0.5px solid rgba(255,255,255,0.09)",
        boxShadow: "0 1px 0 0 rgba(255,255,255,0.06) inset",
        position: "relative",
      }}
    >
      {/* top accent bar */}
      <div style={{ height: 2, background: accentColor }} />

      {/* subtle glow spot */}
      <div
        style={{
          position: "absolute",
          top: -40,
          left: "50%",
          transform: "translateX(-50%)",
          width: 120,
          height: 80,
          borderRadius: "50%",
          background: isMenu
            ? "rgba(74,222,128,0.06)"
            : "rgba(167,139,250,0.07)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ padding: "18px 18px 20px" }}>
        {/* header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
            marginBottom: 18,
          }}
        >
          <ServiceIcon type={ele.type} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 500,
                color: "#fff",
                textTransform: "capitalize",
                lineHeight: 1.2,
              }}
            >
              {ele.type} service
            </p>
            <p
              style={{
                margin: "3px 0 0",
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              #{ele.id}
            </p>
          </div>

          <Badge type={ele.type} />
        </div>

        {/* divider */}
        <div
          style={{
            height: "0.5px",
            background: "rgba(255,255,255,0.07)",
            marginBottom: 16,
          }}
        />

        {/* action buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <ActionBtn
            onClick={() => onView(ele.id)}
            icon={<FiEye size={13} />}
            label="View Demo"
            variant="purple"
          />
          <ActionBtn
            onClick={() => onEdit(ele.id, ele.type)}
            icon={<FiEdit2 size={13} />}
            label="Edit Service"
            variant="green"
          />
        </div>

        {/* QR section */}
        <div
          style={{
            borderRadius: 12,
            padding: "12px",
            background: "rgba(255,255,255,0.03)",
            border: "0.5px solid rgba(255,255,255,0.07)",
          }}
          className="overflow-scroll"
        >
          <p
            style={{
              margin: "0 0 10px",
              fontSize: 11,
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            QR Code
          </p>
          <QRShapeSelector
            qrUrl={`${import.meta.env.VITE_CLIENT_URL}/${
              ele.type === "vCard"
                ? "template"
                : ele.type === "menu"
                  ? "menu"
                  : ""
            }?id=${ele.id}`}
          />
        </div>
      </div>
    </motion.div>
  );
};

// ─── empty state ──────────────────────────────────────────────────────────────
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "64px 24px",
      textAlign: "center",
      gap: 12,
    }}
  >
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: 16,
        background: "rgba(255,255,255,0.05)",
        border: "0.5px solid rgba(255,255,255,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 4,
      }}
    >
      <FiZap size={22} color="rgba(255,255,255,0.3)" />
    </div>
    <p
      style={{
        margin: 0,
        fontSize: 15,
        fontWeight: 500,
        color: "rgba(255,255,255,0.6)",
      }}
    >
      No services yet
    </p>
    <p
      style={{
        margin: 0,
        fontSize: 13,
        color: "rgba(255,255,255,0.3)",
        maxWidth: 240,
      }}
    >
      Your purchased services will appear here.
    </p>
  </motion.div>
);

// ─── main dashboard ───────────────────────────────────────────────────────────
const ClientDashboard = () => {
  const navigate = useNavigate();
  const { data, refetch } = useGetClientInfoQuery(undefined);
  const [logoutHovered, setLogoutHovered] = useState(false);

  const [logout, { isError, isLoading, isSuccess: logoutIsSuccess }] =
    useLogoutMutation();

  const handleViewDemoClick = (soldServiceId: number) => {
    const soldService = data?.user?.soldServices?.find(
      (service: SoldService) => service.id === soldServiceId,
    );
    if (!soldService) return;
    if (soldService.type === "vCard") navigate(`/template?id=${soldServiceId}`);
    else if (soldService.type === "menu")
      navigate(`/menu-template?id=${soldServiceId}`);
  };

  const handleEditServiceClick = (id: number, type: string) => {
    if (type === "menu") navigate(`/edit-menu?id=${id}`);
    else if (type === "vCard") navigate(`/edit-template?id=${id}`);
  };

  const handleLogout = async () => {
    try {
      const res = await logout(undefined).unwrap();
      if (res?.message === "success") {
        toast.success("Logged out successfully!");
        navigate("/signin?loggedOut=true");
      }
    } catch {
      toast.error("Logout failed. Try again!");
    }
  };

  useEffect(() => {
    if (isError) toast.error("Logout failed. Try again!");
  }, [logoutIsSuccess, isError]);

  useEffect(() => {
    refetch();
  }, [logoutIsSuccess]);

  const services: SoldService[] = data?.user?.soldServices ?? [];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        background: "transparent",
      }}
    >
      {isLoading ? (
        <Snipper />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{ width: "100%", maxWidth: 960 }}
        >
          {/* ── page header ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 28,
              paddingBottom: 20,
              borderBottom: "0.5px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <FiGrid size={16} color="rgba(255,255,255,0.4)" />
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#fff",
                    fontFamily: "'Syne', sans-serif",
                    letterSpacing: "-0.3px",
                  }}
                >
                  My Services
                </h1>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: "rgba(255,255,255,0.3)",
                    marginTop: 1,
                  }}
                >
                  {services.length} active{" "}
                  {services.length === 1 ? "service" : "services"}
                </p>
              </div>
            </div>

            {/* logout */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleLogout}
              onMouseEnter={() => setLogoutHovered(true)}
              onMouseLeave={() => setLogoutHovered(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 16px",
                borderRadius: 10,
                border: "0.5px solid rgba(239,68,68,0.2)",
                background: logoutHovered
                  ? "rgba(127,29,29,0.35)"
                  : "rgba(127,29,29,0.15)",
                color: "rgba(252,165,165,0.85)",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
            >
              <FiLogOut size={13} />
              Logout
            </motion.button>
          </div>

          {/* ── grid ── */}
          <AnimatePresence>
            {services.length === 0 ? (
              <EmptyState />
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 16,
                }}
              >
                {services.map((ele, i) => (
                  <ServiceCard
                    key={ele.id}
                    ele={ele}
                    index={i}
                    onView={handleViewDemoClick}
                    onEdit={handleEditServiceClick}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default ClientDashboard;
