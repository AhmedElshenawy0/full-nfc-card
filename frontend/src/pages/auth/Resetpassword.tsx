import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import BtnSnipper from "../../components/global/BtnSnipper";
import { useResetPasswordMutation } from "../../store/apiSlice/AuthSlice";

export const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    try {
      await resetPassword({ token, password }).unwrap();
      toast.success("Password reset successfully!");
      navigate("/signin");
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 42px 11px 38px",
    borderRadius: 12,
    border: "0.5px solid rgba(167,139,250,0.45)",
    background: "rgba(88,28,135,0.1)",
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
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
        <h2 style={{ color: "#fff", marginBottom: 8 }}>Reset Password</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
          Enter your new password below
        </p>
      </div>

      {/* New Password */}
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
          <FiLock size={15} />
        </span>
        <input
          type={showPw ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          style={inputStyle}
        />
        <span
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            color: "rgba(255,255,255,0.3)",
            display: "flex",
          }}
          onClick={() => setShowPw((p) => !p)}
        >
          {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
        </span>
      </div>

      {/* Confirm Password */}
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
          <FiLock size={15} />
        </span>
        <input
          type={showPw ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          style={inputStyle}
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
        {isLoading ? <BtnSnipper /> : "Reset Password"}
      </motion.button>
    </motion.div>
  );
};
