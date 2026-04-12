import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  useGetClientInfoQuery,
  useSignInMutation,
  useCheckUserRoleMutation,
} from "../../store/apiSlice/AuthSlice";
import { signInValidation } from "../../utils/validation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import GoogleLoginButton from "../../components/auth/GoogleBtn";
import BtnSnipper from "../../components/global/BtnSnipper";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

// ─── styled input with icon ───────────────────────────────────────────────────
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
          color: focused ? "rgba(167,139,250,0.8)" : "rgba(255,255,255,0.35)",
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
            color: focused ? "rgba(167,139,250,0.7)" : "rgba(255,255,255,0.25)",
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
            border: `0.5px solid ${focused ? "rgba(167,139,250,0.45)" : "rgba(255,255,255,0.09)"}`,
            background: focused
              ? "rgba(88,28,135,0.1)"
              : "rgba(255,255,255,0.04)",
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

// ─── divider ──────────────────────────────────────────────────────────────────
const Divider = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <div
      style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.08)" }}
    />
    <span
      style={{
        fontSize: 11,
        color: "rgba(255,255,255,0.2)",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      or
    </span>
    <div
      style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.08)" }}
    />
  </div>
);

// ─── main ─────────────────────────────────────────────────────────────────────
export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [btnHov, setBtnHov] = useState(false);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryError = searchParams.get("error");
  const queryType = searchParams.get("type");
  const uniqueCode = searchParams.get("uniqueCode");
  const cardId = searchParams.get("cardId") as string;
  const isAuth = searchParams.get("auth") === "true";
  const gCardId = searchParams.get("gCardId") as string;
  const gType = searchParams.get("gCardType") as any;
  const gUniqueCode = searchParams.get("gUniqueCode") as any;

  const {
    data,
    isSuccess,
    refetch: refetchUserInfo,
  } = useGetClientInfoQuery(undefined);

  console.log(data);

  useEffect(() => {
    if (queryError) {
      toast.error(decodeURIComponent(queryError), { duration: 5000 });
      searchParams.delete("error");
      setSearchParams(searchParams, { replace: true });
    }
    if (!isSuccess || !data?.user) return;
    if (data?.user?.role === "admin") {
      navigate("/admin-dashboard");
      return;
    }
    if (isAuth) {
      console.log("isAuth triggered");
      console.log("isSuccess:", isSuccess);
      console.log("data:", data);
      const userCard = (data.user.soldServices ?? []).find(
        (e: any) => e?.card_id === gCardId,
      );
      if (!userCard?.id) {
        const base = gType === "file" ? "/file-template" : "/select-template";
        navigate(`${base}?service-type=${gType}&uniqueCode=${gUniqueCode}`);
      } else {
        navigate("/client-dashboard");
      }
    }
  }, [queryError, gCardId, gType, isAuth, data?.user, isSuccess, gUniqueCode]);

  const [signIn, { isLoading }] = useSignInMutation();
  const [checkUserRole] = useCheckUserRoleMutation();

  const handleSignInClick = async () => {
    const validation = signInValidation.safeParse({ email, password });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message, { duration: 5000 });
      return;
    }

    try {
      const res = await checkUserRole(email).unwrap();
      if (res?.client?.role !== "admin" && (!queryType || !cardId)) {
        toast.error("There are no credentials for your card.", {
          duration: 5000,
        });
        return;
      }
      const result = await signIn({
        email,
        password,
        cardType: queryType,
        cardId,
      }).unwrap();
      toast.success(result.message, { duration: 5000 });
      await refetchUserInfo();
      const userCard = result?.user?.soldServices?.find(
        (e: any) => e?.card_id === cardId,
      );
      if (result?.user?.role === "admin") {
        navigate("/admin-dashboard");
        return;
      }
      if (result?.user?.email) {
        if (!userCard?.id) {
          const base =
            queryType === "file" ? "/file-template" : "/select-template";
          navigate(
            `${base}?service-type=${queryType}&uniqueCode=${uniqueCode}`,
          );
        } else {
          navigate("/client-dashboard");
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "An error occurred", {
        duration: 5000,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        width: "100%",
        maxWidth: 420,
        margin: "0 auto",
      }}
    >
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

      {/* submit */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSignInClick}
        onMouseEnter={() => setBtnHov(true)}
        onMouseLeave={() => setBtnHov(false)}
        style={{
          width: "100%",
          padding: "12px 0",
          borderRadius: 12,
          border: "0.5px solid rgba(74,222,128,0.3)",
          background: btnHov ? "rgba(20,83,45,0.6)" : "rgba(20,83,45,0.4)",
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
        {isLoading ? <BtnSnipper /> : "Sign In"}
      </motion.button>

      {/* link */}
      <p
        style={{
          margin: 0,
          textAlign: "center",
          fontSize: 13,
          color: "rgba(255,255,255,0.3)",
        }}
      >
        Don't have an account?{" "}
        <Link
          to="/signup"
          style={{
            color: "rgba(167,139,250,0.8)",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Sign up
        </Link>
      </p>

      <Divider />

      {/* google */}
      <GoogleLoginButton
        type={queryType}
        cardId={cardId}
        uniqueCode={uniqueCode}
      />
    </motion.div>
  );
};
