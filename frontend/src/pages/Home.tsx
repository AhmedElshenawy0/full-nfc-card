import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useVerifyCardQuery } from "../store/apiSlice/CardSlice";
import toast from "react-hot-toast";
import { CustomError } from "../types/types";
import Snipper from "../components/global/Snipper";
import copy from "copy-to-clipboard";
import { motion, AnimatePresence } from "framer-motion";
import { FiCopy, FiCheck, FiArrowRight, FiZap } from "react-icons/fi";

const RootLayout = () => {
  const [searchParams] = useSearchParams();
  const unique_code = searchParams.get("unique_code");
  const navigate = useNavigate();
  const [showConfirmBtn, setShowConfirmBtn] = useState(false);
  const [copied, setCopied] = useState(false);
  const [btnHov, setBtnHov] = useState(false);

  const {
    isError,
    error,
    isLoading,
    data: verifyCard,
  } = useVerifyCardQuery(unique_code, {
    skip: !unique_code,
  });

  const handleVerifyClick = () => {
    if (!unique_code) {
      toast.error("No card identifier provided");
      return;
    }
    if (verifyCard?.message === "Go to signup") {
      navigate(
        `/signup?type=${verifyCard?.type}&cardId=${verifyCard?.cardId}&uniqueCode=${verifyCard?.uniqueCode}`,
      );
    }
  };

  useEffect(() => {
    if (verifyCard?.message === "Go to signup") {
      setShowConfirmBtn(true);
    } else if (verifyCard?.message === "success") {
      toast.success(`Welcome, ${verifyCard?.name}`);
      navigate("/client-dashboard");
    }
  }, [verifyCard, navigate]);

  useEffect(() => {
    const customError = error as CustomError;
    if (isError && customError?.data?.message) {
      toast.error(customError.data.message);
      if (customError?.status === 401) {
        navigate(
          `/signin?type=${customError?.data?.type}&cardId=${customError?.data?.cardId}&uniqueCode=${customError?.data?.uniqueCode}`,
        );
      }
    }
  }, [isError, error]);

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
      {/* ── unique code strip ── */}
      <AnimatePresence>
        {unique_code && (
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
        )}
      </AnimatePresence>

      {/* ── video ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          width: "100%",
          maxWidth: 480,
          borderRadius: 16,
          overflow: "hidden",
          border: "0.5px solid rgba(255,255,255,0.08)",
          background: "rgba(0,0,0,0.3)",
        }}
      >
        <iframe
          src="https://www.youtube.com/embed/Bovaj3UYDGA"
          style={{ width: "100%", display: "block" }}
          height={200}
          title="Getting Started"
          allowFullScreen
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </motion.div>

      {/* ── CTA ── */}
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
              {isLoading ? (
                <Snipper />
              ) : (
                <>
                  <FiZap size={14} />
                  Let's Get Started
                  <FiArrowRight size={14} />
                </>
              )}
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
};

export default RootLayout;
