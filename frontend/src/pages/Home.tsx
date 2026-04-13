import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useVerifyCardQuery } from "../store/apiSlice/CardSlice";
import {
  useSignInMutation,
  useCheckUserRoleMutation,
  useGetClientInfoQuery,
} from "../store/apiSlice/AuthSlice";
import { signInValidation } from "../utils/validation";
import toast from "react-hot-toast";
import { CustomError } from "../types/types";
import Snipper from "../components/global/Snipper";
import BtnSnipper from "../components/global/BtnSnipper";
import copy from "copy-to-clipboard";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCopy,
  FiCheck,
  FiArrowRight,
  FiZap,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiMessageCircle,
  FiLogIn,
  FiChevronLeft,
} from "react-icons/fi";
import GoogleLoginButton from "../components/auth/GoogleBtn";

// ─── WhatsApp ─────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = "201002255129";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello! 👋 I'm interested in getting an NFC card. Could you please provide me with more details about the available options, pricing, and how to place an order? Thank you!",
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

// ─── Field ────────────────────────────────────────────────────────────────────
interface FieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  rightSlot?: React.ReactNode;
}

const Field = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
  rightSlot,
}: FieldProps) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: 12,
          color: "rgba(167,139,250,0.8)",
          marginBottom: 7,
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          transition: "color 0.2s",
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: 13,
            top: "50%",
            transform: "translateY(-50%)",
            color: "rgba(167,139,250,0.7)",
            display: "flex",
            transition: "color 0.2s",
            pointerEvents: "none",
          }}
        >
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "11px 42px 11px 38px",
            borderRadius: 12,
            border: `0.5px solid rgba(167,139,250,0.45)`,
            background: "rgba(88,28,135,0.1)",

            color: "rgba(255,255,255,0.85)",
            fontSize: 14,
            fontFamily: "'DM Sans', sans-serif",
            outline: "none",
            transition: "border-color 0.2s, background 0.2s",
            boxSizing: "border-box",
          }}
          autoComplete="off"
        />
        {rightSlot && (
          <span
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {rightSlot}
          </span>
        )}
      </div>
    </div>
  );
};

const Divider = ({ label = "or" }: { label?: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <div
      style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.08)" }}
    />
    <span
      style={{
        fontSize: 11,
        color: "rgba(255,255,255,0.2)",
        fontFamily: "'DM Mono', monospace",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
    <div
      style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.08)" }}
    />
  </div>
);

// ─── Choice card (used in the initial popup) ──────────────────────────────────
const ChoiceCard = ({
  icon,
  title,
  description,
  onClick,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  accent: "purple" | "green";
}) => {
  const [hov, setHov] = useState(false);
  const colors = {
    purple: {
      border: hov ? "rgba(167,139,250,0.4)" : "rgba(167,139,250,0.15)",
      bg: hov ? "rgba(88,28,135,0.25)" : "rgba(88,28,135,0.1)",
      icon: "rgba(192,132,252,0.85)",
      title: "rgba(255,255,255,0.9)",
    },
    green: {
      border: hov ? "rgba(37,211,102,0.4)" : "rgba(37,211,102,0.15)",
      bg: hov ? "rgba(18,140,60,0.2)" : "rgba(18,140,60,0.08)",
      icon: "rgba(37,211,102,0.85)",
      title: "rgba(255,255,255,0.9)",
    },
  }[accent];

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        width: "100%",
        padding: "16px 18px",
        borderRadius: 14,
        border: `0.5px solid ${colors.border}`,
        background: colors.bg,
        cursor: "pointer",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: 14,
        transition: "background 0.2s, border-color 0.2s",
      }}
    >
      <span style={{ color: colors.icon, display: "flex", flexShrink: 0 }}>
        {icon}
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: colors.title,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.35)",
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.5,
          }}
        >
          {description}
        </span>
      </div>
      <FiArrowRight
        size={14}
        style={{
          marginLeft: "auto",
          color: "rgba(255,255,255,0.2)",
          flexShrink: 0,
        }}
      />
    </motion.button>
  );
};

// ─── main ─────────────────────────────────────────────────────────────────────
type View = "choice" | "login";

const RootLayout = () => {
  const [searchParams] = useSearchParams();
  const unique_code = searchParams.get("unique_code");
  const navigate = useNavigate();

  // ── NFC scan state ──
  const [showConfirmBtn, setShowConfirmBtn] = useState(false);
  const [copied, setCopied] = useState(false);
  const [btnHov, setBtnHov] = useState(false);

  // ── Manual visit state ──
  const [view, setView] = useState<View>("choice");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loginBtnHov, setLoginBtnHov] = useState(false);

  // ── Queries & mutations ──
  const {
    isError,
    error,
    isLoading,
    data: verifyCard,
  } = useVerifyCardQuery(unique_code, { skip: !unique_code });

  const { data: clientInfo, isSuccess: clientInfoSuccess } =
    useGetClientInfoQuery(undefined, { skip: !!unique_code });

  const [signIn, { isLoading: signInLoading }] = useSignInMutation();
  const [checkUserRole] = useCheckUserRoleMutation();

  // ── Already logged in → redirect ──
  useEffect(() => {
    if (unique_code || !clientInfoSuccess || !clientInfo?.user) return;
    if (clientInfo.user.role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/client-dashboard");
    }
  }, [clientInfo, clientInfoSuccess, unique_code, navigate]);

  // ── NFC scan response routing ──
  useEffect(() => {
    if (!verifyCard) return;
    if (verifyCard.message === "Go to signup") {
      setShowConfirmBtn(true);
    } else if (verifyCard.message === "success") {
      // toast.success(`Welcome, ${verifyCard.name}`);
      if (verifyCard.cardType === "vCard") {
        navigate(`/template/?id=${verifyCard.cardId}`);
      } else if (verifyCard.cardType === "menu") {
        navigate(`/menu-template/?id=${verifyCard.cardId}`);
      }
    }
  }, [verifyCard, navigate]);

  // ── NFC scan API errors ──
  useEffect(() => {
    if (!isError) return;
    const customError = error as CustomError;
    if (customError?.data?.message) toast.error(customError.data.message);
    if (customError?.status === 401) {
      // navigate(
      //   `/signin?type=${customError.data?.type}&cardId=${customError.data?.cardId}&uniqueCode=${customError.data?.uniqueCode}`,
      // );
    }
  }, [isError, error, navigate]);

  // ── NFC handlers ──
  const handleVerifyClick = () => {
    if (!unique_code || verifyCard?.message !== "Go to signup") return;
    navigate(
      `/signup?type=${verifyCard.type}&cardId=${verifyCard.cardId}&uniqueCode=${verifyCard.uniqueCode}`,
    );
  };

  const handleCopy = () => {
    if (!unique_code) {
      toast.error("Invalid card");
      return;
    }
    const success = copy(unique_code);
    if (success) {
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy");
    }
  };

  // ── Dashboard login handler ──
  const handleLoginClick = async () => {
    const validation = signInValidation.safeParse({ email, password });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message, { duration: 5000 });
      return;
    }
    try {
      const roleRes = await checkUserRole(email).unwrap();
      const isAdmin = roleRes?.client?.role === "admin";
      const result = await signIn({
        email,
        password,
        cardType: undefined,
        cardId: undefined,
      }).unwrap();
      toast.success(result.message, { duration: 5000 });
      if (isAdmin || result?.user?.role === "admin") {
        navigate("/admin-dashboard");
        return;
      }
      navigate("/client-dashboard");
    } catch (err: any) {
      toast.error(err?.data?.message || "An error occurred", {
        duration: 5000,
      });
    }
  };
  const [requestName, setRequestName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [nameBtnHov, setNameBtnHov] = useState(false);
  // ── NFC loading ──
  if (unique_code && isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          minHeight: 200,
        }}
      >
        <Snipper />
      </div>
    );
  }

  // ── NFC scan UI ──
  if (unique_code) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          width: "100%",
        }}
      >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ width: "100%", maxWidth: 420 }}
          >
            <p
              style={{
                margin: "0 0 8px",
                fontSize: 11,
                color: "rgba(255,255,255,0.3)",
                fontFamily: "'DM Mono', monospace",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Your card code
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: 12,
                border: "0.5px solid rgba(167,139,250,0.2)",
                background: "rgba(88,28,135,0.1)",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  flex: 1,
                  padding: "11px 14px",
                  fontSize: 13,
                  fontFamily: "'DM Mono', monospace",
                  color: "rgba(255,255,255,0.6)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  cursor: "default",
                }}
              >
                {unique_code}
              </span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "11px 16px",
                  background: copied
                    ? "rgba(20,83,45,0.5)"
                    : "rgba(88,28,135,0.35)",
                  border: "none",
                  borderLeft: `0.5px solid ${copied ? "rgba(74,222,128,0.2)" : "rgba(167,139,250,0.2)"}`,
                  color: copied
                    ? "rgba(134,239,172,0.9)"
                    : "rgba(192,132,252,0.85)",
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: "pointer",
                  transition: "background 0.2s, color 0.2s",
                  flexShrink: 0,
                }}
              >
                {copied ? <FiCheck size={13} /> : <FiCopy size={13} />}
                {copied ? "Copied" : "Copy"}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          style={{
            width: "100%",
            maxWidth: 420,
            borderRadius: 16,
            overflow: "hidden",
            border: "0.5px solid rgba(167,139,250,0.2)",
            background: "rgba(88,28,135,0.1)",
          }}
        >
          <video
            controls
            // autoPlay
            muted
            // loop
            playsInline
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              borderRadius: 16,
            }}
          >
            <source src="/herovideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            width: "100%",
            maxWidth: 420,
          }}
        >
          <AnimatePresence>
            {showConfirmBtn && (
              <motion.button
                key="cta"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleVerifyClick}
                onMouseEnter={() => setBtnHov(true)}
                onMouseLeave={() => setBtnHov(false)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "13px 0",
                  borderRadius: 14,
                  border: "0.5px solid rgba(74,222,128,0.35)",
                  background: btnHov
                    ? "rgba(20,83,45,0.6)"
                    : "rgba(20,83,45,0.4)",
                  color: "rgba(134,239,172,0.95)",
                  fontSize: 14,
                  fontWeight: 500,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
              >
                <FiZap size={14} />
                Let's Get Started
                <FiArrowRight size={14} />
              </motion.button>
            )}
          </AnimatePresence>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "rgba(255,255,255,0.25)",
              textAlign: "center",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Activate your world with our innovative card solution
          </p>
        </motion.div>
      </motion.div>
    );
  }

  // ── Manual visit UI ──
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: "100%", maxWidth: 420, margin: "0 auto" }}
    >
      <AnimatePresence mode="wait">
        {/* ── Choice view ── */}
        {view === "choice" && (
          <motion.div
            key="choice"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            {/* header */}
            <div style={{ marginBottom: 8, textAlign: "center" }}>
              <h2
                style={{
                  margin: "0 0 6px",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "'Syne', sans-serif",
                  letterSpacing: "-0.3px",
                }}
              >
                Welcome to Signup
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.5,
                }}
              >
                Sign in to manage your NFC card or request a new one to get
                started.
              </p>
            </div>

            <ChoiceCard
              accent="purple"
              icon={<FiLogIn size={18} />}
              title="Sign In"
              description="Access your dashboard and manage your card"
              onClick={() => setView("login")}
            />

            {/* Request NFC Card card */}
            <motion.div
              style={{
                borderRadius: 14,
                border: "0.5px solid rgba(37,211,102,0.15)",
                background: "rgba(18,140,60,0.08)",
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
            >
              {/* top row — always visible */}
              <button
                onClick={() => setShowNameInput((p) => !p)}
                style={{
                  width: "100%",
                  padding: "16px 18px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <span
                  style={{
                    color: "rgba(37,211,102,0.85)",
                    display: "flex",
                    flexShrink: 0,
                  }}
                >
                  <FiMessageCircle size={18} />
                </span>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 3 }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.9)",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Request an NFC Card
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.35)",
                      fontFamily: "'DM Sans', sans-serif",
                      lineHeight: 1.5,
                    }}
                  >
                    Don't have a card yet? Get in touch with us
                  </span>
                </div>
                <motion.span
                  animate={{ rotate: showNameInput ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    marginLeft: "auto",
                    color: "rgba(255,255,255,0.2)",
                    display: "flex",
                    flexShrink: 0,
                  }}
                >
                  <FiArrowRight size={14} />
                </motion.span>
              </button>

              {/* expandable name input */}
              <AnimatePresence>
                {showNameInput && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      style={{
                        padding: "0 18px 16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        borderTop: "0.5px solid rgba(37,211,102,0.1)",
                        paddingTop: 14,
                      }}
                    >
                      <div style={{ position: "relative" }}>
                        <input
                          type="text"
                          value={requestName}
                          onChange={(e) => setRequestName(e.target.value)}
                          placeholder="Your name"
                          autoFocus
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: 10,
                            border: "0.5px solid rgba(37,211,102,0.25)",
                            background: "rgba(18,140,60,0.1)",
                            color: "rgba(255,255,255,0.85)",
                            fontSize: 14,
                            fontFamily: "'DM Sans', sans-serif",
                            outline: "none",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onMouseEnter={() => setNameBtnHov(true)}
                        onMouseLeave={() => setNameBtnHov(false)}
                        onClick={() => {
                          const name = requestName.trim();
                          const message = encodeURIComponent(
                            `Hello! My name is ${name || "there"}. I'm interested in getting an NFC card. Could you please provide me with more details about the available options, pricing, and how to place an order? Thank you!`,
                          );
                          window.open(
                            `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
                            "_blank",
                          );
                        }}
                        style={{
                          width: "100%",
                          padding: "10px 0",
                          borderRadius: 10,
                          border: `0.5px solid ${nameBtnHov ? "rgba(37,211,102,0.5)" : "rgba(37,211,102,0.25)"}`,
                          background: nameBtnHov
                            ? "rgba(18,140,60,0.25)"
                            : "rgba(18,140,60,0.15)",
                          color: "rgba(37,211,102,0.9)",
                          fontSize: 14,
                          fontWeight: 500,
                          fontFamily: "'DM Sans', sans-serif",
                          cursor: "pointer",
                          transition: "background 0.15s, border-color 0.15s",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                        }}
                      >
                        <FiMessageCircle size={14} />
                        Send on WhatsApp
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}

        {/* ── Login view ── */}
        {view === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            {/* back button */}
            <button
              onClick={() => setView("choice")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(255,255,255,0.3)",
                fontSize: 13,
                fontFamily: "'DM Sans', sans-serif",
                padding: 0,
                width: "fit-content",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.6)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.3)")
              }
            >
              <FiChevronLeft size={15} />
              Back
            </button>

            {/* fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                icon={<FiMail size={15} />}
              />
              <Field
                id="password"
                label="Password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                icon={<FiLock size={15} />}
                rightSlot={
                  <button
                    onClick={() => setShowPw((p) => !p)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "rgba(255,255,255,0.3)",
                      display: "flex",
                      padding: 0,
                    }}
                  >
                    {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                }
              />
            </div>

            {/* sign in button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleLoginClick}
              onMouseEnter={() => setLoginBtnHov(true)}
              onMouseLeave={() => setLoginBtnHov(false)}
              style={{
                width: "100%",
                padding: "12px 0",
                borderRadius: 12,
                border: "0.5px solid rgba(74,222,128,0.3)",
                background: loginBtnHov
                  ? "rgba(20,83,45,0.6)"
                  : "rgba(20,83,45,0.4)",
                color: "rgba(134,239,172,0.95)",
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer",
                transition: "background 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {signInLoading ? <BtnSnipper /> : "Sign In"}
            </motion.button>

            <Divider />

            <GoogleLoginButton type={null} cardId={null} uniqueCode={null} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RootLayout;
