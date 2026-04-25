import { FaRegSave } from "react-icons/fa";
import { FiMapPin, FiPhone } from "react-icons/fi";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import tinycolor from "tinycolor2";
import { handleSaveContact } from "../../utils/contactFile";
import { isDark } from "../../utils/colorBritness";

const FourthUI = ({ data }: { data: any }) => {
  const encodedAddress = encodeURIComponent(data?.address || "");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  const [textBtnColor, setTextBtnColor] = useState("text-black");

  const accentColor = data?.mainBackground || "#a855f7";
  const btnColor = data?.buttonBackground;

  const lightColor = tinycolor(accentColor).lighten(40).toHexString();
  const dimColor = tinycolor(accentColor).setAlpha(0.15).toRgbString();
  const dimColorStrong = tinycolor(accentColor).setAlpha(0.18).toRgbString();
  const borderColor = tinycolor(accentColor).setAlpha(0.25).toRgbString();
  const conicGradient = `conic-gradient(${accentColor}, ${lightColor}, #ec4899, ${accentColor})`;
  const quoteColor = tinycolor(accentColor).lighten(38).toHexString();
  const aboutColor = tinycolor(accentColor).lighten(22).toHexString();
  const labelColor = tinycolor(accentColor).lighten(22).toHexString();

  const btnBackground =
    btnColor || `linear-gradient(135deg, ${accentColor}, ${lightColor})`;

  useEffect(() => {
    const bg = btnColor || lightColor;
    setTextBtnColor(isDark(bg) ? "text-white" : "text-black");
  }, [btnColor, lightColor]);

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(160deg, #1a1a1a 0%, ${accentColor} 50%, #2d2d2d 100%)`,
      }}
      className="w-full max-w-[500px] mx-auto min-h-screen text-white overflow-hidden pb-8 relative"
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${tinycolor(accentColor).setAlpha(0.25).toRgbString()} 0%, transparent 70%)`,
        }}
      />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="pt-11 pb-7 px-8 text-center relative"
      >
        {/* Avatar with conic ring */}
        <div className="relative inline-block mb-4">
          <div
            className="absolute inset-[-4px] rounded-full"
            style={{ background: conicGradient }}
          />
          <div className="relative w-24 h-24 rounded-full border-[3px] border-[#1a1a1a] overflow-hidden z-10">
            <img
              src={data?.image}
              alt="Profile"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* Name */}
        <h2 className="text-[22px] font-semibold text-white tracking-tight mb-2">
          {data?.name}
        </h2>

        {/* Job badge */}
        {data?.job && (
          <span
            className="text-[10px] px-3.5 py-1 rounded-full border tracking-[0.1em] uppercase"
            style={{ background: dimColor, borderColor, color: lightColor }}
          >
            {data.job}
          </span>
        )}
      </motion.div>

      {/* Divider */}
      <div
        className="h-px mx-8"
        style={{
          background: `linear-gradient(to right, transparent, ${borderColor}, transparent)`,
        }}
      />

      {/* Bio Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="mx-5 my-4 p-[18px] rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: `0.5px solid ${borderColor}`,
        }}
      >
        {data?.bio && (
          <p
            className="text-sm italic leading-relaxed mb-2.5"
            style={{ color: quoteColor }}
          >
            "{data.bio}"
          </p>
        )}
        {data?.bio && data?.about && (
          <div
            className="h-px mb-2.5"
            style={{
              background: tinycolor(accentColor).setAlpha(0.2).toRgbString(),
            }}
          />
        )}
        {data?.about && (
          <p
            className="text-[11px] leading-relaxed"
            style={{ color: aboutColor }}
          >
            {data.about}
          </p>
        )}
      </motion.div>

      {/* Contact */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.5 }}
      >
        <p
          className="text-[10px] tracking-[0.13em] uppercase px-5 mb-2.5 font-semibold"
          style={{ color: labelColor }}
        >
          Contact
        </p>
        <div className="px-5 flex flex-col gap-2">
          {/* Phone */}
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={`tel:+${data?.phone}`}
            className="flex items-center gap-3 p-3.5 rounded-[14px]"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: `0.5px solid ${borderColor}`,
            }}
          >
            <div
              className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0"
              style={{ background: dimColorStrong }}
            >
              <FiPhone style={{ color: lightColor, fontSize: 14 }} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-slate-400 mb-0.5 tracking-[0.05em] uppercase">
                Phone
              </p>
              <p className="text-sm font-semibold text-white">{data?.phone}</p>
            </div>
            <div
              className="w-[26px] h-[26px] rounded-lg flex items-center justify-center text-slate-400 text-sm"
              style={{ background: "rgba(255,255,255,0.07)" }}
            >
              ›
            </div>
          </motion.a>

          {/* Address */}
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3.5 rounded-[14px]"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: `0.5px solid ${borderColor}`,
            }}
          >
            <div
              className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0"
              style={{ background: dimColorStrong }}
            >
              <FiMapPin style={{ color: lightColor, fontSize: 14 }} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-slate-400 mb-0.5 tracking-[0.05em] uppercase">
                Address
              </p>
              <p className="text-sm font-semibold text-white">View on map</p>
            </div>
            <div
              className="w-[26px] h-[26px] rounded-lg flex items-center justify-center text-slate-400 text-sm"
              style={{ background: "rgba(255,255,255,0.07)" }}
            >
              ›
            </div>
          </motion.a>
        </div>
      </motion.div>

      {/* Social */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        <p
          className="text-[10px] tracking-[0.13em] uppercase px-5 mt-5 mb-2.5 font-semibold"
          style={{ color: labelColor }}
        >
          Social
        </p>
        <div className="px-5 flex gap-2">
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="px-5 mt-5"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSaveContact(data)}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-[14px] font-bold text-sm ${textBtnColor}`}
          style={{ background: "#ffffff" }}
        >
          <FaRegSave size={14} />
          Save Contact
        </motion.button>
      </motion.div>
    </div>
  );
};

export default FourthUI;
