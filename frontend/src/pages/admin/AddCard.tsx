import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCreateCardMutation } from "../../store/apiSlice/CardSlice";
import { FaArrowLeft } from "react-icons/fa";
import { MdNfc } from "react-icons/md";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { PiMedalLight } from "react-icons/pi";
import { BsCreditCard2Front } from "react-icons/bs";
import BtnSnipper from "../../components/global/BtnSnipper";
import { CustomError } from "../../types/types";
import { motion } from "framer-motion";

const CARD_TYPES = [
  {
    value: "vCard",
    label: "V-Card",
    desc: "Personal / business profile",
    icon: <MdNfc size={20} />,
    color: "purple",
  },
  {
    value: "menu",
    label: "Menu",
    desc: "Restaurant or product menu",
    icon: <HiOutlineMenuAlt2 size={20} />,
    color: "green",
  },
];

const CARD_SHAPES = [
  {
    value: "medal",
    label: "Medal",
    desc: "Round shaped NFC tag",
    icon: <PiMedalLight size={22} />,
  },
  {
    value: "card",
    label: "Card",
    desc: "Standard card format",
    icon: <BsCreditCard2Front size={22} />,
  },
];

const colorStyles = {
  purple: {
    bg: "rgba(58,13,78,0.3)",
    bgHover: "rgba(58,13,78,0.5)",
    bgSelected: "rgba(58,13,78,0.55)",
    border: "rgba(167,139,250,0.2)",
    borderSelected: "rgba(167,139,250,0.5)",
    text: "rgba(216,180,254,0.9)",
    iconBg: "rgba(58,13,78,0.5)",
  },
  green: {
    bg: "rgba(20,83,45,0.25)",
    bgHover: "rgba(20,83,45,0.45)",
    bgSelected: "rgba(20,83,45,0.5)",
    border: "rgba(74,222,128,0.2)",
    borderSelected: "rgba(74,222,128,0.5)",
    text: "rgba(134,239,172,0.9)",
    iconBg: "rgba(20,83,45,0.5)",
  },
};

const AddCard = () => {
  const navigate = useNavigate();
  const [nfc_type, setNfc_type] = useState("");
  const [nfc_shap, setNfc_shap] = useState("");

  const [createCard, { isLoading, isSuccess, isError, error }] =
    useCreateCardMutation();

  const handleCreateCard = async () => {
    if (!nfc_type || !nfc_shap) {
      toast.error("Please select both card type and shape.");
      return;
    }
    try {
      await createCard({ nfc_shap, nfc_type });
    } catch (error) {
      console.log(error);
    }
  };

  const customError = error as CustomError;

  useEffect(() => {
    if (isError && !isSuccess && customError?.data?.message) {
      toast.dismiss();
      toast.error(customError.data.message);
    }
    if (isSuccess) {
      toast.success("Card added successfully!");
      setNfc_shap("");
      setNfc_type("");
    }
  }, [isError, error, isSuccess]);

  const canSubmit = nfc_type && nfc_shap;

  return (
    // ✅ bg-transparent — بياخد bg من الـ Layout
    <div className="flex flex-col items-center bg-transparent w-full">
      {/* Back button */}
      <div className="w-full max-w-sm mb-6 flex items-center justify-between">
        {/* <button
          onClick={() => navigate("/admin-dashboard")}
          className="flex items-center gap-2 text-[13px] transition-all duration-150"
          style={{ color: "rgba(255,255,255,0.35)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.7)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.35)")
          }
        >
          <FaArrowLeft size={11} />
          Back
        </button> */}

        {/* Step indicator */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((step) => {
            const done =
              (step === 1 && !!nfc_type) ||
              (step === 2 && !!nfc_shap) ||
              (step === 3 && canSubmit);
            const active =
              (step === 1 && !nfc_type) ||
              (step === 2 && !!nfc_type && !nfc_shap) ||
              (step === 3 && !!nfc_type && !!nfc_shap);
            return (
              <div
                key={step}
                className="rounded-full transition-all duration-300"
                style={{
                  width: active ? "16px" : "6px",
                  height: "6px",
                  background: done
                    ? "rgba(74,222,128,0.8)"
                    : active
                      ? "rgba(255,255,255,0.5)"
                      : "rgba(255,255,255,0.12)",
                }}
              />
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        {/* Header */}
        <div className="mb-7">
          <p
            className="text-[10px] tracking-[0.3em] uppercase mb-1 font-mono"
            style={{ color: "rgba(74,222,128,0.5)" }}
          >
            New NFC Card
          </p>
          <h1 className="text-[20px] font-medium text-white">Add Card</h1>
        </div>

        {/* ── Step 1: Card Type ── */}
        <div className="mb-6">
          <label
            className="block text-[11px] tracking-widest uppercase mb-3 font-mono"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            01 — Choose Card Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CARD_TYPES.map((type) => {
              const c = colorStyles[type.color as keyof typeof colorStyles];
              const selected = nfc_type === type.value;
              return (
                <button
                  key={type.value}
                  onClick={() => setNfc_type(type.value)}
                  className="flex flex-col items-start gap-2.5 p-4 rounded-xl text-left transition-all duration-150 active:scale-[0.97]"
                  style={{
                    background: selected ? c.bgSelected : c.bg,
                    border: `0.5px solid ${selected ? c.borderSelected : c.border}`,
                    backdropFilter: "blur(8px)",
                    boxShadow: selected ? `0 0 16px ${c.border}` : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!selected) e.currentTarget.style.background = c.bgHover;
                  }}
                  onMouseLeave={(e) => {
                    if (!selected) e.currentTarget.style.background = c.bg;
                  }}
                >
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: c.iconBg, color: c.text }}
                  >
                    {type.icon}
                  </span>
                  <div>
                    <p className="text-[13px] font-medium text-white leading-none mb-1">
                      {type.label}
                    </p>
                    <p
                      className="text-[11px]"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      {type.desc}
                    </p>
                  </div>
                  {/* Selected indicator */}
                  {selected && (
                    <div
                      className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full"
                      style={{
                        background: c.text,
                        boxShadow: `0 0 6px ${c.text}`,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Step 2: Card Shape ── */}
        <div className="mb-7">
          <label
            className="block text-[11px] tracking-widest uppercase mb-3 font-mono"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            02 — Choose Card Shape
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CARD_SHAPES.map((shape) => {
              const selected = nfc_shap === shape.value;
              return (
                <button
                  key={shape.value}
                  onClick={() => setNfc_shap(shape.value)}
                  className="flex flex-col items-start gap-2.5 p-4 rounded-xl text-left transition-all duration-150 active:scale-[0.97]"
                  style={{
                    background: selected
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(255,255,255,0.03)",
                    border: selected
                      ? "0.5px solid rgba(255,255,255,0.25)"
                      : "0.5px solid rgba(255,255,255,0.07)",
                    backdropFilter: "blur(8px)",
                    boxShadow: selected
                      ? "0 0 14px rgba(255,255,255,0.05)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!selected)
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    if (!selected)
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.03)";
                  }}
                >
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      color: selected
                        ? "rgba(255,255,255,0.9)"
                        : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {shape.icon}
                  </span>
                  <div>
                    <p className="text-[13px] font-medium text-white leading-none mb-1">
                      {shape.label}
                    </p>
                    <p
                      className="text-[11px]"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      {shape.desc}
                    </p>
                  </div>
                  {selected && (
                    <div
                      className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full"
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        boxShadow: "0 0 6px rgba(255,255,255,0.5)",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div
          className="w-full h-[0.5px] mb-6"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
          }}
        />

        {/* ── Submit ── */}
        {/* ✅ كان: bg-green-800 solid
            ✅ بقى: شفاف مع border — يكشف layout bg
            disabled state واضح لما مفيش selection */}
        <button
          onClick={handleCreateCard}
          disabled={isLoading || !canSubmit}
          className="w-full py-3.5 rounded-xl text-[14px] font-medium transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2"
          style={{
            background: canSubmit
              ? "rgba(20,83,45,0.45)"
              : "rgba(255,255,255,0.04)",
            border: canSubmit
              ? "0.5px solid rgba(74,222,128,0.35)"
              : "0.5px solid rgba(255,255,255,0.07)",
            color: canSubmit
              ? "rgba(134,239,172,0.95)"
              : "rgba(255,255,255,0.2)",
            cursor: canSubmit ? "pointer" : "not-allowed",
            backdropFilter: "blur(8px)",
          }}
          onMouseEnter={(e) => {
            if (canSubmit)
              e.currentTarget.style.background = "rgba(20,83,45,0.65)";
          }}
          onMouseLeave={(e) => {
            if (canSubmit)
              e.currentTarget.style.background = "rgba(20,83,45,0.45)";
          }}
        >
          {isLoading ? <BtnSnipper /> : "Add Card"}
        </button>
      </motion.div>
    </div>
  );
};

export default AddCard;
