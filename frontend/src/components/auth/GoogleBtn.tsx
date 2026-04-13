import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

const GoogleLoginButton = ({ cardId, type, uniqueCode }: any) => {
  const [hov, setHov] = useState(false);

  const handleLogin = () => {
    // Dashboard login — no card context needed
    if (!cardId || !type) {
      window.open(`/api/auth/google`, "_self");
      return;
    }
    // NFC card flow — pass card params
    window.open(
      `/api/auth/google?cardType=${type}&cardId=${cardId}&uniqueCode=${uniqueCode}`,
      "_self",
    );
  };

  return (
    <button
      onClick={handleLogin}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        padding: "11px 0",
        borderRadius: 12,
        border: `0.5px solid ${hov ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)"}`,
        background: hov ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
        color: "rgba(255,255,255,0.7)",
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
      <FcGoogle size={16} />
      Continue with Google
    </button>
  );
};

export default GoogleLoginButton;
