import { useEffect, useState } from "react";
import { useSignUpMutation } from "../../store/apiSlice/AuthSlice";
import { signUpValidation } from "../../utils/validation";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { CustomError } from "../../types/types";
import BtnSnipper from "../../components/global/BtnSnipper";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

// ─── field component ──────────────────────────────────────────────────────────
interface FieldProps {
  id: string;
  name?: string;
  label: string;
  type: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: React.ReactNode;
  rightSlot?: React.ReactNode;
  accentColor?: string;
  accentBg?: string;
}

const Field = ({
  id,
  name,
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
  rightSlot,
  accentColor = "rgba(167,139,250,0.45)",
  accentBg = "rgba(88,28,135,0.1)",
}: FieldProps) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: 11,
          color: focused ? "rgba(167,139,250,0.8)" : "rgba(255,255,255,0.3)",
          marginBottom: 6,
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
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: focused ? "rgba(167,139,250,0.6)" : "rgba(255,255,255,0.2)",
            display: "flex",
            transition: "color 0.2s",
            pointerEvents: "none",
          }}
        >
          {icon}
        </span>
        <input
          id={id}
          name={name ?? id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "10px 40px 10px 36px",
            borderRadius: 11,
            border: `0.5px solid ${focused ? accentColor : "rgba(255,255,255,0.08)"}`,
            background: focused ? accentBg : "rgba(255,255,255,0.03)",
            color: "rgba(255,255,255,0.85)",
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            outline: "none",
            transition: "border-color 0.2s, background 0.2s",
            boxSizing: "border-box",
          }}
        />
        {rightSlot && (
          <span
            style={{
              position: "absolute",
              right: 11,
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

// ─── section label ────────────────────────────────────────────────────────────
const SectionLabel = ({ children }: { children: string }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      margin: "4px 0 2px",
    }}
  >
    <div
      style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.07)" }}
    />
    <span
      style={{
        fontSize: 10,
        color: "rgba(255,255,255,0.2)",
        fontFamily: "'DM Mono', monospace",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
    <div
      style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.07)" }}
    />
  </div>
);

// ─── main ─────────────────────────────────────────────────────────────────────
const Signup = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    job: "",
    birthday: "",
    phone: "",
    city: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [btnHov, setBtnHov] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [signUp, { isLoading, error }] = useSignUpMutation();
  const navigate = useNavigate();

  const queryType = searchParams.get("type");
  const queryId = searchParams.get("cardId");
  const uniqueCode = searchParams.get("uniqueCode");

  const handleSignUpClick = async () => {
    const validation = signUpValidation.safeParse(formData);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message, { duration: 5000 });
      return;
    }
    if (formData.password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (!queryType || !queryId) {
      toast.error("No credentials provided");
      return;
    }
    try {
      const result = await signUp({
        ...formData,
        cardType: queryType,
        cardId: queryId,
      }).unwrap();
      toast.success("Registration successful! Welcome aboard!", {
        duration: 5000,
      });
      navigate(
        `/signin?type=${queryType}&cardId=${queryId}&clietId=${result?.user?.id}&uniqueCode=${uniqueCode}`,
      );
    } catch (err: any) {
      console.error("Sign up error:", err);
    }
  };

  const customError = error as CustomError;
  useEffect(() => {
    if (
      customError?.data?.message === "User is already exist. Please sign in"
    ) {
      toast.success(customError.data.message);
      navigate(
        `/signin?type=${queryType}&cardId=${queryId}&uniqueCode=${uniqueCode}`,
      );
    }
  }, [error]);

  useEffect(() => {
    if (!queryType || !queryId) {
      toast.error("No credentials.");
      navigate("/");
    }
  }, []);

  const eyeBtn = (show: boolean, toggle: () => void) => (
    <button
      onClick={toggle}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "rgba(255,255,255,0.25)",
        display: "flex",
        padding: 0,
      }}
    >
      {show ? <FiEyeOff size={14} /> : <FiEye size={14} />}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        width: "100%",
        maxWidth: 420,
        margin: "0 auto",
      }}
    >
      {/* ── identity ── */}
      <SectionLabel>Identity</SectionLabel>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field
          id="firstName"
          label="First name"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="John"
          icon={<FiUser size={14} />}
        />
        <Field
          id="lastName"
          label="Last name"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Doe"
          icon={<FiUser size={14} />}
        />
      </div>

      <Field
        id="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="you@example.com"
        icon={<FiMail size={14} />}
      />

      {/* ── security ── */}
      <SectionLabel>Security</SectionLabel>

      <Field
        id="password"
        label="Password"
        type={showPw ? "text" : "password"}
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        icon={<FiLock size={14} />}
        rightSlot={eyeBtn(showPw, () => setShowPw((p) => !p))}
      />

      <Field
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm password"
        type={showCpw ? "text" : "password"}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="••••••••"
        icon={<FiLock size={14} />}
        rightSlot={eyeBtn(showCpw, () => setShowCpw((p) => !p))}
      />

      {/* ── profile ── */}
      <SectionLabel>Profile</SectionLabel>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field
          id="phone"
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+20 …"
          icon={<FiPhone size={14} />}
        />
        <Field
          id="city"
          label="City"
          type="text"
          value={formData.city}
          onChange={handleChange}
          placeholder="Cairo"
          icon={<FiMapPin size={14} />}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field
          id="job"
          label="Job"
          type="text"
          value={formData.job}
          onChange={handleChange}
          placeholder="Designer"
          icon={<FiBriefcase size={14} />}
        />
        <Field
          id="birthday"
          label="Birthday"
          type="date"
          value={formData.birthday}
          onChange={handleChange}
          placeholder=""
          icon={<FiCalendar size={14} />}
        />
      </div>

      {/* ── submit ── */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSignUpClick}
        disabled={isLoading}
        onMouseEnter={() => setBtnHov(true)}
        onMouseLeave={() => setBtnHov(false)}
        style={{
          width: "100%",
          marginTop: 6,
          padding: "12px 0",
          borderRadius: 12,
          border: "0.5px solid rgba(74,222,128,0.3)",
          background: btnHov ? "rgba(20,83,45,0.6)" : "rgba(20,83,45,0.4)",
          color: "rgba(134,239,172,0.95)",
          fontSize: 14,
          fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif",
          cursor: isLoading ? "not-allowed" : "pointer",
          transition: "background 0.15s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading ? <BtnSnipper /> : "Create Account"}
      </motion.button>

      <p
        style={{
          margin: 0,
          textAlign: "center",
          fontSize: 13,
          color: "rgba(255,255,255,0.3)",
        }}
      >
        Already have an account?{" "}
        <Link
          to={`/signin?type=${queryType}&cardId=${queryId}&uniqueCode=${uniqueCode}`}
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

export default Signup;
