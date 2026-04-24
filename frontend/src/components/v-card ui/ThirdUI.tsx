import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { FiMapPin, FiPhone } from "react-icons/fi";
import { FaRegSave } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import tinycolor from "tinycolor2";
import { isDark } from "../../utils/colorBritness";
import { handleSaveContact } from "../../utils/contactFile";

const ThirdUI = ({ data }: { data: any }) => {
  const encodedAddress = encodeURIComponent(data?.address || "");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  const [textBtnColor, setTextBtnColor] = useState("text-black");

  const mainBg = data?.mainBackground || "#0d1321";
  const btnColor = data?.buttonBackground || "#fbbf24";

  const lightColor = tinycolor(mainBg).lighten(10).toHexString();
  const gradientBg = `linear-gradient(to bottom right, #0d1321, ${mainBg}, #16202d)`;

  const isMainDark = isDark(mainBg);
  const textPrimary = isMainDark ? "#f1f5f9" : "#111111";
  const textMuted = isMainDark ? "#475569" : "#9ca3af";
  const textSecondary = isMainDark ? "#64748b" : "#6b7280";
  const bioBorderColor = isMainDark
    ? "rgba(255,255,255,0.1)"
    : "rgba(0,0,0,0.08)";
  const bioInnerDivider = isMainDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.06)";
  const bioBg = isMainDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const rowBg = isMainDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const rowBorder = isMainDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
  const iconBg = isMainDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
  const arrowBg = isMainDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const badgeBg = isMainDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const badgeBorder = isMainDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)";
  const badgeText = isMainDark ? "#94a3b8" : "#6b7280";

  useEffect(() => {
    setTextBtnColor(isDark(btnColor) ? "text-white" : "text-black");
  }, [btnColor]);

  return (
    <div
      style={{ background: gradientBg }}
      className="w-full max-w-[500px] mx-auto min-h-screen overflow-hidden pb-8"
    >
      {/* Hero image with overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden"
      >
        <img
          src={data?.image}
          alt="Profile"
          className="w-full h-[400px] object-cover object-top"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${mainBg} 20%, rgba(0,0,0,0.4) 60%, transparent 100%)`,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <h2
            className="text-[22px] font-bold mb-2 leading-tight"
            style={{ color: textPrimary }}
          >
            {data?.name}
          </h2>
          {data?.job && (
            <span
              className="text-[10px] px-3 py-1 rounded-full tracking-[0.1em] uppercase"
              style={{
                background: badgeBg,
                border: `0.5px solid ${badgeBorder}`,
                color: badgeText,
              }}
            >
              {data.job}
            </span>
          )}
        </div>
      </motion.div>

      <div className="px-5 pt-4">
        {/* Bio + About card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="rounded-[14px] p-4 mb-3"
          style={{ background: bioBg, border: `0.5px solid ${bioBorderColor}` }}
        >
          {data?.bio && (
            <p
              className="text-sm italic leading-relaxed mb-2.5"
              style={{ color: textPrimary }}
            >
              "{data.bio}"
            </p>
          )}
          {data?.bio && data?.about && (
            <div
              className="h-px mb-2.5"
              style={{ background: bioInnerDivider }}
            />
          )}
          {data?.about && (
            <p
              className="text-[11px] leading-relaxed"
              style={{ color: textSecondary }}
            >
              {data.about}
            </p>
          )}
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mb-3"
        >
          <p
            className="text-[10px] tracking-[0.13em] uppercase font-semibold mb-2.5"
            style={{ color: textMuted }}
          >
            Contact
          </p>
          <div className="flex flex-col gap-2">
            {/* Phone */}
            <motion.a
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              href={`tel:+${data?.phone}`}
              className="flex items-center gap-3 px-3.5 py-3 rounded-[14px]"
              style={{ background: rowBg, border: `0.5px solid ${rowBorder}` }}
            >
              <div
                className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0"
                style={{ background: iconBg }}
              >
                <FiPhone size={14} style={{ color: lightColor }} />
              </div>
              <div className="flex-1">
                <p
                  className="text-[10px] mb-0.5 tracking-[0.05em] uppercase"
                  style={{ color: textMuted }}
                >
                  Phone
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: textPrimary }}
                >
                  {data?.phone}
                </p>
              </div>
              <div
                className="w-[26px] h-[26px] rounded-lg flex items-center justify-center text-sm"
                style={{ background: arrowBg, color: textMuted }}
              >
                ›
              </div>
            </motion.a>

            {/* Address */}
            <motion.a
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3.5 py-3 rounded-[14px]"
              style={{ background: rowBg, border: `0.5px solid ${rowBorder}` }}
            >
              <div
                className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0"
                style={{ background: iconBg }}
              >
                <FiMapPin size={14} style={{ color: lightColor }} />
              </div>
              <div className="flex-1">
                <p
                  className="text-[10px] mb-0.5 tracking-[0.05em] uppercase"
                  style={{ color: textMuted }}
                >
                  Address
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: textPrimary }}
                >
                  View on map
                </p>
              </div>
              <div
                className="w-[26px] h-[26px] rounded-lg flex items-center justify-center text-sm"
                style={{ background: arrowBg, color: textMuted }}
              >
                ›
              </div>
            </motion.a>
          </div>
        </motion.div>

        {/* Social */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mb-4"
        >
          <p
            className="text-[10px] tracking-[0.13em] uppercase font-semibold mb-2.5"
            style={{ color: textMuted }}
          >
            Social
          </p>
          <div className="flex gap-2">
            {[
              { Icon: FaFacebook, bg: "#1877f2", link: data?.facebook_link },
              { Icon: FaTwitter, bg: "#1da1f2", link: data?.twitter_link },
              { Icon: FaLinkedin, bg: "#0077b5", link: data?.linkedin_link },
              {
                Icon: FaInstagram,
                bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366)",
                link: data?.instgram_link,
              },
            ]
              .filter((s) => !!s.link)
              .map(({ Icon, bg, link }, i) => (
                <motion.a
                  key={i}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 h-11 rounded-[13px] flex items-center justify-center text-white"
                  style={{ background: bg }}
                >
                  <Icon size={15} />
                </motion.a>
              ))}
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSaveContact(data)}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-[14px] font-bold text-sm ${textBtnColor}`}
            style={{ background: btnColor }}
          >
            <FaRegSave size={14} />
            Save Contact
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ThirdUI;
