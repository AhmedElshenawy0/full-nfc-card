import { FaRegSave } from "react-icons/fa";
import { FiMapPin, FiPhone, FiMail, FiBriefcase } from "react-icons/fi";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import tinycolor from "tinycolor2";
import { isDark } from "../../utils/colorBritness";

const SecondUiTest = ({
  formData,
  tempButtonBackground,
  tempMainBackground,
}: {
  formData: any;
  tempMainBackground: any;
  tempButtonBackground: any;
}) => {
  const [textBtnColor, setTextBtnColor] = useState("text-white");

  const mainBg = tempMainBackground || formData?.mainBackground || "#111111";
  const btnColor =
    tempButtonBackground || formData?.buttonBackground || "#ffffff";

  const isMainDark = isDark(mainBg);

  const cardBg = tinycolor(mainBg).lighten(4).toHexString();
  const innerRowBg = tinycolor(mainBg).lighten(2).toHexString();
  const iconBg = tinycolor(mainBg).lighten(8).toHexString();
  const borderColor = tinycolor(mainBg).lighten(10).toHexString();

  const textPrimary = isMainDark ? "#f0f0f0" : "#111111";
  const textSecondary = isMainDark ? "#888888" : "#666666";
  const textMuted = isMainDark ? "#555555" : "#bbbbbb";

  useEffect(() => {
    setTextBtnColor(isDark(btnColor) ? "text-white" : "text-black");
  }, [btnColor]);

  const socialLinks = [
    {
      Icon: FaFacebook,
      bg: "#1877f2",
      label: "Facebook",
      href: formData?.facebook || "#",
    },
    {
      Icon: FaTwitter,
      bg: "#1da1f2",
      label: "Twitter",
      href: formData?.twitter || "#",
    },
    {
      Icon: FaLinkedin,
      bg: "#0077b5",
      label: "LinkedIn",
      href: formData?.linkedin || "#",
    },
    {
      Icon: FaInstagram,
      bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
      label: "Instagram",
      href: formData?.instagram || "#",
    },
    {
      Icon: FaWhatsapp,
      bg: "#25d366",
      label: "WhatsApp",
      href: formData?.phone ? `https://wa.me/${formData.phone}` : "#",
    },
  ];

  return (
    <div
      style={{ background: mainBg }}
      className="w-full max-w-lg mx-auto min-h-screen overflow-hidden pb-6 relative"
    >
      {/* ── Hero: full-bleed photo with overlay ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full"
        style={{ height: 340 }}
      >
        {/* Photo */}
        <img
          src={formData?.image}
          alt="Profile"
          className="w-full h-full object-cover object-top"
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 50%, transparent 100%)",
          }}
        />

        {/* Name + badge + bio on top of photo */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          {/* Name row */}
          <div className="flex items-center gap-2 mb-1">
            <h2
              className="text-2xl font-bold leading-tight"
              style={{ color: "#ffffff" }}
            >
              {formData?.name}
            </h2>
            {/* Verified badge */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              className="flex-shrink-0"
            >
              <circle cx="11" cy="11" r="11" fill="white" />
              <circle cx="11" cy="11" r="9" fill="#1a73e8" />
              <path
                d="M7 11l3 3 5-5"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Bio */}
          {formData?.bio && (
            <p
              className="text-xs leading-relaxed"
              style={{ color: "rgba(255,255,255,0.72)" }}
            >
              {formData.bio}
            </p>
          )}
        </div>
      </motion.div>

      {/* ── Stats / Action Row ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.45 }}
        className="flex items-center px-4 py-3 gap-2"
        style={{ borderBottom: `1px solid ${borderColor}` }}
      >
        {/* Call stat */}
        <div className="flex items-center gap-2 flex-1">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: iconBg }}
          >
            <FiPhone size={14} style={{ color: textSecondary }} />
          </div>
          <div>
            <p
              className="text-sm font-bold leading-tight"
              style={{ color: textPrimary }}
            >
              Call
            </p>
            {/* <p className="text-[10px]" style={{ color: textMuted }}>
              {formData?.phone || "—"}
            </p> */}
          </div>
        </div>

        {/* Divider */}
        <div
          className="w-px self-stretch"
          style={{ background: borderColor, margin: "4px 8px" }}
        />

        {/* Add stat */}
        <div className="flex items-center gap-2 flex-1">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: iconBg }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={textSecondary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
          <div>
            <p
              className="text-sm font-bold leading-tight"
              style={{ color: textPrimary }}
            >
              Add
            </p>
            {/* <p className="text-[10px]" style={{ color: textMuted }}>
              312 contacts
            </p> */}
          </div>
        </div>

        {/* Add Contact button */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full font-semibold text-xs cursor-pointer flex-shrink-0 ${textBtnColor}`}
          style={{ background: btnColor }}
        >
          <FaRegSave size={11} />
          {formData?.select ? formData.select : "Add Contact"}
        </motion.div>
      </motion.div>

      {/* ── Info Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.45 }}
        style={{
          background: cardBg,
          border: `1px solid ${borderColor}`,
          borderRadius: 18,
        }}
        className="mx-3.5 mt-3 px-5 py-4"
      >
        <p
          className="text-[9px] tracking-[0.14em] uppercase font-semibold mb-3"
          style={{ color: textMuted }}
        >
          Info
        </p>

        <div className="flex flex-col gap-2.5">
          {/* Job */}
          {formData?.job && (
            <motion.div
              whileHover={{ x: 3 }}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl"
              style={{
                background: innerRowBg,
                border: `1px solid ${borderColor}`,
              }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: iconBg }}
              >
                <FiBriefcase size={14} style={{ color: textSecondary }} />
              </div>
              <div>
                <p className="text-[10px] mb-0.5" style={{ color: textMuted }}>
                  Job
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: textPrimary }}
                >
                  {formData.job}
                </p>
              </div>
            </motion.div>
          )}

          {/* Phone */}
          {formData?.phone && (
            <motion.a
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              href={`tel:+${formData.phone}`}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl"
              style={{
                background: innerRowBg,
                border: `1px solid ${borderColor}`,
              }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: iconBg }}
              >
                <FiPhone size={14} style={{ color: textSecondary }} />
              </div>
              <div>
                <p className="text-[10px] mb-0.5" style={{ color: textMuted }}>
                  Phone
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: textPrimary }}
                >
                  {formData.phone}
                </p>
              </div>
            </motion.a>
          )}

          {/* Email */}
          {formData?.email && (
            <motion.a
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              href={`mailto:${formData.email}`}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl"
              style={{
                background: innerRowBg,
                border: `1px solid ${borderColor}`,
              }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: iconBg }}
              >
                <FiMail size={14} style={{ color: textSecondary }} />
              </div>
              <div>
                <p className="text-[10px] mb-0.5" style={{ color: textMuted }}>
                  Email
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: textPrimary }}
                >
                  {formData.email}
                </p>
              </div>
            </motion.a>
          )}

          {/* Address */}
          <motion.a
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl"
            style={{
              background: innerRowBg,
              border: `1px solid ${borderColor}`,
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: iconBg }}
            >
              <FiMapPin size={14} style={{ color: textSecondary }} />
            </div>
            <div>
              <p className="text-[10px] mb-0.5" style={{ color: textMuted }}>
                Address
              </p>
              <p
                className="text-sm font-semibold"
                style={{ color: textPrimary }}
              >
                View on map
              </p>
            </div>
          </motion.a>
        </div>
      </motion.div>

      {/* ── About Card ── */}
      {formData?.about && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.33, duration: 0.45 }}
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: 18,
          }}
          className="mx-3.5 mt-2.5 px-5 py-4"
        >
          <p
            className="text-[9px] tracking-[0.14em] uppercase font-semibold mb-2"
            style={{ color: textMuted }}
          >
            About
          </p>
          <p
            className="text-xs leading-relaxed"
            style={{ color: textSecondary }}
          >
            {formData.about}
          </p>
        </motion.div>
      )}

      {/* ── Social Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.41, duration: 0.45 }}
        style={{
          background: cardBg,
          border: `1px solid ${borderColor}`,
          borderRadius: 18,
        }}
        className="mx-3.5 mt-2.5 px-5 py-4"
      >
        <p
          className="text-[9px] tracking-[0.14em] uppercase font-semibold mb-3"
          style={{ color: textMuted }}
        >
          Social
        </p>
        <div className="flex justify-between gap-2">
          {socialLinks.map(({ Icon, bg, label, href }, i) => (
            <motion.a
              key={i}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.92 }}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5"
            >
              {/* Circle icon */}
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white flex-shrink-0"
                style={{ background: bg }}
              >
                <Icon size={16} />
              </div>
              <span className="text-[10px]" style={{ color: textMuted }}>
                {label}
              </span>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SecondUiTest;
