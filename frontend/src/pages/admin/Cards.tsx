import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  useDeactivateCardMutation,
  useDeleteCardMutation,
  useGetAllCardsQuery,
} from "../../store/apiSlice/CardSlice";
import Snipper from "../../components/global/Snipper";
import { Card, CustomError } from "../../types/types";
import BtnSnipper from "../../components/global/BtnSnipper";
import copy from "copy-to-clipboard";
import {
  FiLink,
  FiEye,
  FiAlertTriangle,
  FiX,
  FiCreditCard,
  FiTrash,
} from "react-icons/fi";
import { FaUnlockAlt } from "react-icons/fa";
import { createPortal } from "react-dom";
import QRWithImage from "../../components/global/QrCode";
import { TiArrowBackOutline } from "react-icons/ti";

// ─── tiny hover button ────────────────────────────────────────────────────────
interface ActionBtnProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  variant: "red" | "blue" | "green";
}

const ActionBtn = ({ onClick, icon, label, variant }: ActionBtnProps) => {
  const [hov, setHov] = useState(false);
  const map = {
    red: {
      bg: "rgba(127,29,29,0.35)",
      bgH: "rgba(127,29,29,0.55)",
      border: "rgba(239,68,68,0.25)",
      color: "rgba(252,165,165,0.9)",
    },
    blue: {
      bg: "rgba(30,58,138,0.35)",
      bgH: "rgba(30,58,138,0.55)",
      border: "rgba(96,165,250,0.25)",
      color: "rgba(147,197,253,0.9)",
    },
    green: {
      bg: "rgba(20,83,45,0.35)",
      bgH: "rgba(20,83,45,0.55)",
      border: "rgba(74,222,128,0.25)",
      color: "rgba(134,239,172,0.9)",
    },
  }[variant];

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "9px 0",
        borderRadius: 10,
        border: `0.5px solid ${map.border}`,
        background: hov ? map.bgH : map.bg,
        color: map.color,
        fontSize: 12,
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

// ─── category pill ────────────────────────────────────────────────────────────
export const Pill = ({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) => {
  const [hov, setHov] = useState(false);
  const display =
    label === "vCard" ? "Personal Card" : label === "menu" ? "Menu" : label;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "7px 12px",
        borderRadius: 99,
        border: `0.5px solid ${active ? "rgba(74,222,128,0.4)" : "rgba(255,255,255,0.08)"}`,
        background: active
          ? "rgba(20,83,45,0.45)"
          : hov
            ? "rgba(255,255,255,0.06)"
            : "rgba(255,255,255,0.03)",
        color: active ? "rgba(134,239,172,0.95)" : "rgba(255,255,255,0.45)",
        fontSize: 12,
        fontWeight: 500,
        fontFamily: "'DM Sans', sans-serif",
        cursor: "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {icon && icon}
      {display}
    </button>
  );
};

// ─── confirm modal via portal ─────────────────────────────────────────────────
interface ConfirmModalProps {
  card: Card;
  isUnassigning: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onDelete: () => void;
  onClose: () => void;
  type: string;
}

const ConfirmModal = ({
  card,
  isUnassigning,
  isDeleting,
  onConfirm,
  onDelete,
  onClose,
  type,
}: ConfirmModalProps) =>
  createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 12 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 380,
          background: "rgba(12,12,16,0.98)",
          borderRadius: 20,
          border: "0.5px solid rgba(255,255,255,0.1)",
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
        }}
      >
        {/* header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 18px 14px",
            borderBottom: "0.5px solid rgba(255,255,255,0.07)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: "rgba(127,29,29,0.3)",
                border: "0.5px solid rgba(239,68,68,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiAlertTriangle size={14} color="rgba(252,165,165,0.8)" />
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff",
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                Manage Card
              </p>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.3)",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                #{card.id}
              </p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.05)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.4)",
              cursor: "pointer",
            }}
          >
            <FiX size={13} />
          </motion.button>
        </div>

        {/* body */}
        {type === "manage" ? (
          <div style={{ padding: "18px 18px 20px" }}>
            <p
              style={{
                margin: "0 0 6px",
                fontSize: 13,
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.6,
              }}
            >
              You are about to deactivate or delete the card which is assigned
              to{" "}
              <span style={{ color: "#fff", fontWeight: 500 }}>
                {card?.client?.first_name
                  ? card?.client?.first_name
                  : card?.unique_code}{" "}
                {card.client?.last_name}{" "}
              </span>
            </p>
            <p
              style={{
                margin: "0 0 20px",
                fontSize: 12,
                color: "rgba(255,255,255,0.3)",
              }}
            >
              This action cannot be undone.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {/* row 1: deactivate + delete side by side */}
              <div style={{ display: "flex", gap: 8 }}>
                <ActionBtn
                  onClick={onConfirm}
                  variant="red"
                  icon={
                    isUnassigning ? <BtnSnipper /> : <FaUnlockAlt size={12} />
                  }
                  label={isUnassigning ? "Deactivating…" : "Deactivate"}
                />
                <ActionBtn
                  onClick={onDelete}
                  variant="red"
                  icon={isDeleting ? <BtnSnipper /> : <FiTrash size={12} />}
                  label={isDeleting ? "Deleting…" : "Delete"}
                />
              </div>

              {/* row 2: cancel full width */}
              <ActionBtn
                onClick={onClose}
                variant="green"
                icon={<FiX size={13} />}
                label="Cancel"
              />
            </div>
          </div>
        ) : type === "delete" ? (
          <div style={{ padding: "18px 18px 20px" }}>
            <p
              style={{
                margin: "0 0 6px",
                fontSize: 13,
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.6,
              }}
            >
              You are about to delete the card with id{" "}
              <span style={{ color: "#fff", fontWeight: 500 }}>{card?.id}</span>
            </p>
            <p
              style={{
                margin: "0 0 20px",
                fontSize: 12,
                color: "rgba(255,255,255,0.3)",
              }}
            >
              This action cannot be undone.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {/* row 1: deactivate + delete side by side */}
              <div style={{ display: "flex", gap: 8 }}>
                {/* <ActionBtn
                  onClick={onConfirm}
                  variant="red"
                  icon={
                    isUnassigning ? <BtnSnipper /> : <FaUnlockAlt size={12} />
                  }
                  label={isUnassigning ? "Deactivating…" : "Deactivate"}
                /> */}
                <ActionBtn
                  onClick={onDelete}
                  variant="red"
                  icon={isDeleting ? <BtnSnipper /> : <FiTrash size={12} />}
                  label={isDeleting ? "Deleting…" : "Delete"}
                />
              </div>

              {/* row 2: cancel full width */}
              <ActionBtn
                onClick={onClose}
                variant="green"
                icon={<FiX size={13} />}
                label="Cancel"
              />
            </div>
          </div>
        ) : (
          ""
        )}
      </motion.div>
    </motion.div>,
    document.body,
  );

// ─── card tile ────────────────────────────────────────────────────────────────
interface CardTileProps {
  card: Card;
  index: number;
  onDeactivate: (card: Card) => void;
  onViewService: (card: Card) => void;
  onCopyLink: (card: Card) => void;
}

const CardTile = ({
  card,
  index,
  onDeactivate,
  onViewService,
  onCopyLink,
}: CardTileProps) => {
  const isMenu = card.nfc_type === "menu";
  const hasClient = !!card.client_id;
  const hasService = !!card.sold_service?.id;

  const accentColor = isMenu
    ? "linear-gradient(90deg,#14532d,#16a34a,transparent)"
    : "linear-gradient(90deg,#581c87,#7c3aed,transparent)";

  const typeLabel =
    card.nfc_type === "vCard"
      ? "Personal Card"
      : card.nfc_type === "menu"
        ? "Menu"
        : card.nfc_type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
      style={{
        borderRadius: 18,
        overflow: "hidden",
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(12px)",
        border: "0.5px solid rgba(255,255,255,0.08)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.05) inset",
        position: "relative",
      }}
    >
      {/* accent bar */}
      <div style={{ height: 2, background: accentColor }} />

      <div style={{ padding: "16px 16px 18px" }}>
        {/* header row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isMenu
                  ? "rgba(20,83,45,0.28)"
                  : "rgba(88,28,135,0.28)",
                border: `0.5px solid ${isMenu ? "rgba(74,222,128,0.2)" : "rgba(192,132,252,0.2)"}`,
              }}
            >
              <FiCreditCard size={15} color={isMenu ? "#4ade80" : "#c084fc"} />
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {typeLabel}
              </p>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.3)",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                #{index + 1} · id {card.id}
              </p>
            </div>
          </div>

          {/* status badge */}
          <span
            style={{
              fontSize: 10,
              padding: "3px 9px",
              borderRadius: 99,
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.08em",
              background: hasClient
                ? "rgba(20,83,45,0.25)"
                : "rgba(127,29,29,0.2)",
              color: hasClient
                ? "rgba(74,222,128,0.8)"
                : "rgba(252,165,165,0.7)",
              border: `0.5px solid ${hasClient ? "rgba(74,222,128,0.2)" : "rgba(239,68,68,0.2)"}`,
            }}
          >
            {hasClient ? "Active" : "Inactive"}
          </span>
        </div>

        {/* divider */}
        <div
          style={{
            height: "0.5px",
            background: "rgba(255,255,255,0.06)",
            marginBottom: 12,
          }}
        />

        {/* owner */}
        <div style={{ marginBottom: 14 }}>
          <p
            style={{
              margin: "0 0 2px",
              fontSize: 10,
              color: "rgba(255,255,255,0.25)",
              fontFamily: "'DM Mono', monospace",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}
          >
            Owner
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: hasClient
                ? "rgba(255,255,255,0.75)"
                : "rgba(239,68,68,0.7)",
              fontStyle: hasClient ? "normal" : "italic",
            }}
          >
            {hasClient
              ? `${card.client?.first_name} ${card.client?.last_name}`
              : "Not assigned"}
          </p>
        </div>

        {/* actions */}
        <div style={{ display: "flex", gap: 8 }}>
          {hasClient && (
            <ActionBtn
              onClick={() => onDeactivate(card)}
              icon={<FaUnlockAlt size={11} />}
              label="Manage"
              variant="red"
            />
          )}

          {!hasClient && !hasService ? (
            <div className="flex flex-col w-full gap-2">
              <div className="flex gap-2">
                <ActionBtn
                  onClick={() => onCopyLink(card)}
                  icon={<FiLink size={12} />}
                  label="Copy Link"
                  variant="blue"
                />
                <div style={{ flex: 1 }}>
                  <QRWithImage
                    qrUrl={`https://signuptap.com/?unique_code=${card.unique_code}`}
                  />
                </div>
              </div>
              <ActionBtn
                onClick={() => onDeactivate(card)}
                icon={<FaUnlockAlt size={11} />}
                label="Delete"
                variant="red"
              />
            </div>
          ) : (
            <ActionBtn
              onClick={() => onViewService(card)}
              icon={<FiEye size={12} />}
              label="View"
              variant="blue"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── main ─────────────────────────────────────────────────────────────────────
const Cards = () => {
  const [shouldFetchCards, setShouldFetchCards] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data, isLoading } = useGetAllCardsQuery(undefined, {
    skip: !shouldFetchCards,
  });

  useEffect(() => {
    setShouldFetchCards(true);
  }, []);

  const categories: string[] = [
    "All",
    ...new Set(data?.cards?.map((c: Card) => c.nfc_type) as any[]),
  ];

  const sortedCards = useMemo(() => {
    if (!Array.isArray(data?.cards)) return [];
    const filtered =
      selectedCategory === "All"
        ? data.cards
        : data.cards.filter((c: Card) => c.nfc_type === selectedCategory);
    return filtered
      .slice()
      .sort(
        (a: any, b: any) =>
          Number(Boolean(b.client)) - Number(Boolean(a.client)),
      );
  }, [data?.cards, selectedCategory]);

  const [
    deactivateCard,
    { isSuccess, isError, error, isLoading: isUnassigning },
  ] = useDeactivateCardMutation();

  const handleDeactivateCard = async (card: Card) => {
    if (!card?.client_id) {
      toast.error("Card has no assigned client.");
      return;
    }
    if (isUnassigning) return;
    try {
      await deactivateCard(card.unique_code).unwrap();
      setShowModal(false);
    } catch {
      toast.error("Failed to deactivate card.");
    }
  };

  const [deleteCard, { isSuccess: isDeleteSuccess, isLoading: isDeleting }] =
    useDeleteCardMutation();

  const handleDeleteCard = async (card: Card) => {
    if (isDeleting) return;
    try {
      await deleteCard(card.unique_code).unwrap();
      setShowModal(false);
    } catch {
      toast.error("Failed to delete card.");
    }
  };

  const customError = error as CustomError;

  useEffect(() => {
    if (isError)
      toast.error(
        (customError?.data?.message as string) || "Deactivate failed.",
      );
    else if (isSuccess) toast.success("Card deactivated successfully.");
  }, [isError, isSuccess, error]);

  useEffect(() => {
    if (isDeleteSuccess) toast.success("Card deleted successfully.");
  }, [isDeleteSuccess]);

  const viewService = (card: Card) => {
    if (!card.client_id) {
      toast.error("Invalid card");
      return;
    }
    const path =
      card?.sold_service?.type === "vCard"
        ? `/template?id=${card?.sold_service.id}`
        : card?.sold_service?.type === "menu"
          ? `/menu-template?id=${card?.sold_service.id}`
          : null;
    if (path) window.open(`${window.location.origin}${path}`, "_blank");
  };

  const copyLink = (card: Card) => {
    if (!card.unique_code) {
      toast.error("Invalid card");
      return;
    }
    const success = copy(
      `${window.location.origin}?unique_code=${card.unique_code}`,
    );
    success ? toast.success("Link copied!") : toast.error("Failed to copy");
  };

  const activeCount = sortedCards.filter((c: Card) => c.client_id).length;
  const navigate = useNavigate();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "'Syne', sans-serif",
              letterSpacing: "-0.3px",
            }}
          >
            Manage Cards
          </h1>
          <p
            style={{
              margin: "3px 0 0",
              fontSize: 12,
              color: "rgba(255,255,255,0.3)",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {sortedCards.length} total · {activeCount} active
          </p>
        </div>
      </div>

      {/* ── category pills ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          gap: 8,
          alignItems: "center",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
        className="justify-between"
      >
        <div className="flex gap-2">
          {categories.map((cat) => (
            <Pill
              key={cat}
              label={cat}
              active={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            />
          ))}
        </div>
        <Pill
          label="Back"
          active={false}
          onClick={() => navigate(-1)}
          icon={<TiArrowBackOutline size={14} />}
        />
      </div>

      {/* ── grid ── */}
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "48px 0",
          }}
        >
          <Snipper />
        </div>
      ) : sortedCards.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.3)",
            padding: "48px 0",
            fontSize: 13,
          }}
        >
          No cards available.{" "}
          <Link
            to="/admin/add-card"
            style={{ color: "rgba(96,165,250,0.8)", textDecoration: "none" }}
          >
            Add one →
          </Link>
        </p>
      ) : (
        <motion.div
          layout
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 14,
          }}
        >
          <AnimatePresence>
            {sortedCards.map((card: Card, i: number) => (
              <CardTile
                key={card.id}
                card={card}
                index={i}
                onDeactivate={(c) => {
                  setSelectedCard(c);
                  setShowModal(true);
                }}
                onViewService={viewService}
                onCopyLink={copyLink}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── confirm modal ── */}
      <AnimatePresence>
        {showModal && selectedCard && (
          <ConfirmModal
            card={selectedCard}
            isUnassigning={isUnassigning}
            isDeleting={isDeleting}
            onConfirm={() => handleDeactivateCard(selectedCard)}
            onDelete={() => handleDeleteCard(selectedCard)}
            onClose={() => setShowModal(false)}
            type={selectedCard?.sold_service?.id ? "manage" : "delete"}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cards;
