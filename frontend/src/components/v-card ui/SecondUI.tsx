import { FiMapPin, FiPhone, FiExternalLink } from "react-icons/fi";
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
      {/* ── Hero ── */}
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

        {/* Name + job + verified badge + bio */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
  {/* Name + verified badge */}
  <div className="flex items-center gap-2 mb-1.5">
    <h2
      className="text-2xl font-bold leading-tight"
      style={{ color: "#ffffff" }}
    >
      {capitalizeFirstWord(data?.name)}
    </h2>
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" className="flex-shrink-0">
      <circle cx="11" cy="11" r="11" fill="white" />
      <circle cx="11" cy="11" r="9" fill="#1a73e8" />
      <path d="M7 11l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>

  {/* Job pill */}
  {data?.job && (
    <div
      className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-full"
      style={{
        background: "rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: "#f0c040" }}
      />
      <span
        className="text-[11px] font-semibold tracking-[0.03em]"
        style={{ color: "rgba(255,255,255,0.85)" }}
      >
        {capitalizeFirstWord(data.job)}
      </span>
    </div>
  )}

  {/* Bio */}
  {data?.bio && (
    <p
      className="text-[11px] leading-relaxed"
      style={{ color: "rgba(255,255,255,0.6)" }}
    >
      {capitalizeFirstWord(data.bio)}
    </p>
  )}
</div>
      </motion.div>

      {/* ── Action Row ── */}
      {/* ── Action Row ── */}
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.15, duration: 0.45 }}
  className="flex items-center px-3.5 py-2.5 gap-2.5"
  style={{ borderBottom: `1px solid ${borderColor}` }}
>
  {/* Save Contact — takes most width */}
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    onClick={() => handleSaveContact(data)}
    className="flex items-center justify-center gap-2.5 flex-[3] px-4 py-2.5 rounded-[18px] relative overflow-hidden cursor-pointer"
    style={{ background: btnColor }}
  >
    <div
      className="absolute rounded-full"
      style={{ width: 80, height: 80, background: "rgba(255,255,255,0.07)", top: -20, right: -20 }}
    />
    <div
      className="absolute rounded-full"
      style={{ width: 50, height: 50, background: "rgba(255,255,255,0.05)", bottom: -15, left: -10 }}
    />
    <svg
      width="17" height="17" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={`relative z-10 ${textBtnColor}`}
    >
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
    <p className={`text-sm font-bold relative z-10 ${textBtnColor}`}>
      Save Contact
    </p>
  </motion.button>

  {/* Call — icon only */}
{/* Call — icon only */}
<motion.a
  href={`tel:+${data?.phone}`}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="flex items-center justify-center flex-1 rounded-full"
  style={{
    background: cardBg,
    border: `1px solid ${borderColor}`,
    // aspectRatio: "1",
    padding: "10px",
  }}
>
  <FiPhone size={18} style={{ color: "#4caf80" }} />
</motion.a>
</motion.div>

      {/* ── About Card ── */}
      {data?.about && (
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
          <div className="flex items-center justify-between mb-3">
            <p
              className="text-[9px] tracking-[0.14em] uppercase font-bold"
              style={{ color: textMuted }}
            >
              About
            </p>
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
              <path
                d="M0 14V8.4C0 3.733 2.667 1.067 8 0l1.2 1.8C6.133 2.6 4.467 4.067 4.2 6H8V14H0ZM12 14V8.4C12 3.733 14.667 1.067 20 0l1.2 1.8C18.133 2.6 16.467 4.067 16.2 6H20V14H12Z"
                fill={borderColor}
              />
            </svg>
          </div>
          <p
            className="text-xs leading-relaxed"
            style={{ color: textSecondary }}
          >
            {capitalizeFirstWord(data.about)}
          </p>
        </motion.div>
      )}

      {/* ── Location Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.33, duration: 0.45 }}
        style={{
          background: cardBg,
          border: `1px solid ${borderColor}`,
          borderRadius: 18,
        }}
        className="mx-3.5 mt-2.5 px-4 py-4"
      >
        <p
          className="text-[9px] tracking-[0.14em] uppercase font-bold mb-3"
          style={{ color: textMuted }}
        >
          Location
        </p>

        <motion.a
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-3 rounded-[13px]"
          style={{ background: innerRowBg, border: `1px solid ${borderColor}` }}
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
              Address
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
      </motion.div>

      {/* ── Social Card ── */}
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
