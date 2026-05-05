import { FaRegSave } from "react-icons/fa";
import { FiMapPin, FiPhone, FiBriefcase } from "react-icons/fi";
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.45 }}
        className="flex items-center px-4 py-3 gap-2"
        style={{ borderBottom: `1px solid ${borderColor}` }}
      >
        {/* Call — tappable, uses original phone field */}
        <motion.a
          href={`tel:+${data?.phone}`}
          className="flex items-center gap-2 flex-1"
        >
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
            <p className="text-[10px]" style={{ color: textMuted }}>
              {data?.phone || "—"}
            </p>
          </div>
        </motion.a>

        {/* Divider */}
        <div
          className="w-px self-stretch"
          style={{ background: borderColor, margin: "4px 8px" }}
        />

        {/* Add */}
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
            <p className="text-[10px]" style={{ color: textMuted }}>
              Save contact
            </p>
          </div>
        </div>

        {/* Save Contact button — original handleSaveContact logic */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => handleSaveContact(data)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full font-semibold text-xs cursor-pointer flex-shrink-0 ${textBtnColor}`}
          style={{ background: btnColor }}
        >
          <FaRegSave size={11} />
          Save Contact
        </motion.button>
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
          {data?.job && (
            <div
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
                  {capitalizeFirstWord(data.job)}
                </p>
              </div>
            </div>
          )}

          {/* Phone */}
          <motion.a
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
            href={`tel:+${data?.phone}`}
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
                {data?.phone}
              </p>
            </div>
          </motion.a>

          {/* Address — original mapsUrl logic */}
          <motion.a
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
            href={mapsUrl}
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
