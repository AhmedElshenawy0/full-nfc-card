import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiMail } from "react-icons/fi";
import BtnSnipper from "../../components/global/BtnSnipper";
import { useForgotPasswordMutation } from "../../store/apiSlice/AuthSlice";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      await forgotPassword({ email }).unwrap();
      setSent(true);
      toast.success("Reset link sent if email exists!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        width: "100%",
        maxWidth: 420,
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h2 style={{ color: "#fff", marginBottom: 8 }}>Forgot Password</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
          Enter your email and we'll send you a reset link
        </p>
      </div>

      {sent ? (
        <div
          style={{
            background: "rgba(20,83,45,0.3)",
            border: "0.5px solid rgba(74,222,128,0.3)",
            borderRadius: 12,
            padding: "16px",
            textAlign: "center",
            color: "rgba(134,239,172,0.95)",
            fontSize: 14,
          }}
        >
          ✅ Check your email for the reset link!
        </div>
      ) : (
        <>
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 13,
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(167,139,250,0.7)",
                display: "flex",
                pointerEvents: "none",
              }}
            >
              <FiMail size={15} />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "11px 42px 11px 38px",
                borderRadius: 12,
                border: "0.5px solid rgba(167,139,250,0.45)",
                background: "rgba(88,28,135,0.1)",
                color: "rgba(255,255,255,0.85)",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: 12,
              border: "0.5px solid rgba(74,222,128,0.3)",
              background: "rgba(20,83,45,0.4)",
              color: "rgba(134,239,172,0.95)",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isLoading ? <BtnSnipper /> : "Send Reset Link"}
          </motion.button>
        </>
      )}

      <p
        style={{
          textAlign: "center",
          fontSize: 13,
          color: "rgba(255,255,255,0.3)",
        }}
      >
        Remember your password?{" "}
        <Link
          to="/signin"
          style={{
            color: "rgba(167,139,250,0.8)",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
};
