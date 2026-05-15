import { FaRegSave } from "react-icons/fa";
import {
  FiMapPin,
  FiPhone,
  FiBriefcase,
  FiChevronRight,
  FiExternalLink,
} from "react-icons/fi";
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
import { handleSaveContact } from "../../utils/contactFile";
import { capitalizeFirstWord } from "./ThirdUI";

const SecondUI = ({ data }: { data: any }) => {
  const encodedAddress = encodeURIComponent(data?.address || "");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  const [textBtnColor, setTextBtnColor] = useState("text-white");

  const mainBg = "#1a1a1a";
  const btnColor = data?.buttonBackground || "#f0f0f0";

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

  // Original field names from SecondUI, filtered to only show links that exist
  const socialLinks = [
    {
      Icon: FaFacebook,
      bg: "#1877f2",
      label: "Facebook",
      link: data?.facebook_link,
    },
    {
      Icon: FaTwitter,
      bg: "#1da1f2",
      label: "Twitter",
      link: data?.twitter_link,
    },
    {
      Icon: FaLinkedin,
      bg: "#0077b5",
      label: "LinkedIn",
      link: data?.linkedin_link,
    },
    {
      Icon: FaInstagram,
      bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
      label: "Instagram",
      link: data?.instgram_link,
    },
    {
      Icon: FaWhatsapp,
      bg: "#25d366",
      label: "WhatsApp",
      link: data?.phone ? `https://wa.me/${data.phone}` : null,
    },
  ].filter((s) => !!s.link);

  return (
    <div
      style={{ background: mainBg }}
      className="w-full max-w-[500px] mx-auto min-h-screen overflow-hidden pb-6 relative"
    >
      {/* ── Hero: full-bleed photo with gradient overlay ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full"
        style={{ height: 400 }}
      >
        <img
          src={data?.image}
          alt="Profile"
          className="w-full h-full object-cover object-top"
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 55%, transparent 100%)",
          }}
        />

        {/* Name + verified badge + bio overlaid on photo */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <div className="flex items-center gap-2 mb-1">
            <h2
              className="text-2xl font-bold leading-tight"
              style={{ color: "#ffffff" }}
            >
              {capitalizeFirstWord(data?.name)}
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

          {data?.bio && (
            <p
              className="text-xs leading-relaxed"
              style={{ color: "rgba(255,255,255,0.72)" }}
            >
              {capitalizeFirstWord(data.bio)}
            </p>
          )}
        </div>
      </motion.div>

      {/* ── Stats / Action Row ── */}
      {/* ── Action Row ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.45 }}
        className="flex items-center px-3.5 py-3 gap-2.5"
        style={{ borderBottom: `1px solid ${borderColor}` }}
      >
        {/* Call */}
        <motion.a
          href={`tel:+${data?.phone}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2.5 flex-1 px-3.5 py-3 rounded-2xl relative overflow-hidden"
          style={{ background: cardBg, border: `1px solid ${borderColor}` }}
        >
          {/* Live pulse dot */}
          <span
            className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full"
            style={{
              background: "#4caf80",
              boxShadow: "0 0 0 3px rgba(76,175,128,0.2)",
              animation: "pulse 2s infinite",
            }}
          />

          {/* Icon with ring */}
          <div className="relative flex-shrink-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: iconBg }}
            >
              <FiPhone size={15} style={{ color: "#4caf80" }} />
            </div>
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: `1.5px solid ${borderColor}`,
                inset: "-2px",
                borderRadius: "50%",
                position: "absolute",
              }}
            />
          </div>

          <div>
            <p
              className="text-sm font-semibold leading-tight"
              style={{ color: textPrimary }}
            >
              Call
            </p>
            <p className="text-[10px]" style={{ color: textMuted }}>
              {data?.phone || "—"}
            </p>
          </div>
        </motion.a>

        {/* Save Contact */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSaveContact(data)}
          className="flex flex-col items-center justify-center gap-1.5 flex-1 py-3.5 rounded-2xl relative overflow-hidden cursor-pointer"
          style={{ background: btnColor }}
        >
          {/* Decorative circle */}
          <div
            className="absolute top-0 right-0 w-14 h-14 rounded-full"
            style={{
              background: "rgba(255,255,255,0.08)",
              transform: "translate(25%, -25%)",
            }}
          />

          <div className="flex items-center gap-1.5 relative z-10">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={textBtnColor}
            >
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            <span
              className={`text-[12px] font-bold leading-tight ${textBtnColor}`}
            >
              Save Contact
            </span>
          </div>

          <span
            className="text-[9px] relative z-10"
            style={{
              color: isDark(btnColor)
                ? "rgba(255,255,255,0.45)"
                : "rgba(0,0,0,0.4)",
            }}
          >
            Add to phonebook
          </span>
        </motion.button>
      </motion.div>

      {/* ── Info Card ── */}
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
        className="mx-3.5 mt-3 px-4 py-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <p
            className="text-[9px] tracking-[0.14em] uppercase font-bold"
            style={{ color: textMuted }}
          >
            Info
          </p>
          <span
            className="text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-full"
            style={{
              background: innerRowBg,
              border: `1px solid ${borderColor}`,
              color: textMuted,
            }}
          >
            {[data?.job, data?.phone, data?.address].filter(Boolean).length}{" "}
            fields
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {/* Job */}
          {data?.job && (
            <div
              className="flex items-center gap-3 px-3 py-3 rounded-[13px]"
              style={{
                background: innerRowBg,
                border: `1px solid ${borderColor}`,
              }}
            >
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(192,128,32,0.12)" }}
              >
                <FiBriefcase size={15} style={{ color: "#c08020" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[9px] uppercase tracking-[0.06em] font-bold mb-0.5"
                  style={{ color: textMuted }}
                >
                  Job title
                </p>
                <p
                  className="text-[13px] font-semibold truncate"
                  style={{ color: textPrimary }}
                >
                  {capitalizeFirstWord(data.job)}
                </p>
              </div>
              <FiChevronRight
                size={14}
                style={{ color: borderColor, flexShrink: 0 }}
              />
            </div>
          )}

          {/* Phone */}
          <motion.a
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            href={`tel:+${data?.phone}`}
            className="flex items-center gap-3 px-3 py-3 rounded-[13px]"
            style={{
              background: innerRowBg,
              border: `1px solid ${borderColor}`,
            }}
          >
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(76,175,128,0.12)" }}
            >
              <FiPhone size={15} style={{ color: "#4caf80" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[9px] uppercase tracking-[0.06em] font-bold mb-0.5"
                style={{ color: textMuted }}
              >
                Phone
              </p>
              <p
                className="text-[13px] font-semibold truncate"
                style={{ color: textPrimary }}
              >
                {data?.phone}
              </p>
            </div>
            <FiChevronRight
              size={14}
              style={{ color: borderColor, flexShrink: 0 }}
            />
          </motion.a>

          {/* Address */}
          <motion.a
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-3 rounded-[13px]"
            style={{
              background: innerRowBg,
              border: `1px solid ${borderColor}`,
            }}
          >
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(91,140,245,0.12)" }}
            >
              <FiMapPin size={15} style={{ color: "#5b8cf5" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[9px] uppercase tracking-[0.06em] font-bold mb-0.5"
                style={{ color: textMuted }}
              >
                Location
              </p>
              <p
                className="text-[13px] font-semibold"
                style={{ color: "#5b8cf5" }}
              >
                View on map
              </p>
            </div>
            <FiExternalLink
              size={13}
              style={{ color: "#3a4a7a", flexShrink: 0 }}
            />
          </motion.a>
        </div>
      </motion.div>

      {/* ── About Card ── */}
      {data?.about && (
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
            {capitalizeFirstWord(data.about)}
          </p>
        </motion.div>
      )}

      {/* ── Social Card — original field names + .filter() logic, circular icons ── */}
      {socialLinks.length > 0 && (
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
          <div className="flex justify-start gap-3 flex-wrap">
            {socialLinks.map(({ Icon, bg, label, link }, i) => (
              <motion.a
                key={i}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.92 }}
                href={link!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5"
              >
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
      )}
    </div>
  );
};

export default SecondUI;
