import { FaRegSave } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaTwitter,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import tinycolor from "tinycolor2";
import { handleSaveContact } from "../../utils/contactFile";
import { isDark } from "../../utils/colorBritness";

const FourthUI = ({ data }: { data: any }) => {
  const encodedAddress = encodeURIComponent(data?.address || "");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  const [textColor, setTextColor] = useState("text-[#cbd5e1]");
  const [textBtnColor, setTextBtnColor] = useState("text-gray-300");

  useEffect(() => {
    setTextColor(
      isDark(data?.mainBackground) ? "text-[#cbd5e1]" : "text-black",
    );
    setTextBtnColor(
      isDark(data?.buttonBackground) ? "text-[#cbd5e1]" : "text-black",
    );
  }, [data?.mainBackground, data?.buttonBackground]);

  const accentColor = data?.mainBackground || "#a855f7";
  const btnColor = data?.buttonBackground;
  const lightColor = tinycolor(accentColor).lighten(40).toHexString();
  const dimColor = tinycolor(accentColor).setAlpha(0.15).toRgbString();
  const borderColor = tinycolor(accentColor).setAlpha(0.3).toRgbString();

  return (
    <div
      style={{
        backgroundImage: data?.mainBackground
          ? `linear-gradient(160deg, #1a1a1a 0%, ${accentColor} 50%, #2d2d2d 100%)`
          : "linear-gradient(160deg, #0f172a, #1e293b)",
      }}
      className="w-full max-w-[500px] mx-auto min-h-screen text-white overflow-hidden pb-8 relative"
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${tinycolor(accentColor).setAlpha(0.2).toRgbString()} 0%, transparent 70%)`,
        }}
      />

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="pt-12 pb-7 px-8 text-center relative"
      >
        {/* Avatar ring */}
        <div className="relative inline-block mb-4">
          <div
            className="absolute inset-[-4px] rounded-full"
            style={{
              background: data?.mainBackground
                ? `conic-gradient(${accentColor}, ${lightColor}, #ec4899, ${accentColor})`
                : "conic-gradient(#a855f7, #6366f1, #ec4899, #a855f7)",
            }}
          />
          <img
            src={data?.image}
            alt="Profile"
            className="relative w-28 h-28 rounded-full object-cover object-top border-[3px] border-[#1a1a1a] z-10 hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Job badge */}
        {data?.job && (
          <div className="mb-3">
            <span
              className="text-[11px] px-3 py-1 rounded-full border tracking-widest uppercase"
              style={{
                background: dimColor,
                borderColor,
                color: lightColor,
              }}
            >
              {data.job}
            </span>
          </div>
        )}

        <h2 className={`text-2xl font-medium tracking-tight mb-1 ${textColor}`}>
          {data?.name}
        </h2>
      </motion.div>

      {/* Divider */}
      <div
        className="h-px mx-8 mb-1"
        style={{
          background: `linear-gradient(to right, transparent, ${borderColor}, transparent)`,
        }}
      />

      {/* Bio / Info Section */}
      <div
        className="mx-6 my-4 p-4 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `0.5px solid ${borderColor}`,
        }}
      >
        <p className={`text-sm italic leading-relaxed mb-2 ${textColor}`}>
          "{data?.bio}"
        </p>
        <p
          className="text-xs leading-relaxed"
          style={{ color: tinycolor(accentColor).lighten(25).toHexString() }}
        >
          {data?.about}
        </p>
      </div>

      {/* Contact Section */}
      <p
        className="text-[11px] tracking-widest uppercase px-6 mb-3 font-medium"
        style={{ color: lightColor }}
      >
        Contact
      </p>
      <div className="px-6 flex flex-col gap-2.5">
        {/* Phone */}
        <motion.a
          whileHover={{ scale: 1.02 }}
          href={`tel:+${data?.phone}`}
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: `0.5px solid ${borderColor}`,
          }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: dimColor }}
          >
            <FaPhone style={{ color: lightColor, fontSize: 14 }} />
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-slate-400 mb-0.5">Phone</p>
            <p className={`text-sm font-medium ${textColor}`}>{data?.phone}</p>
          </div>
          <span className="text-slate-500 text-lg">›</span>
        </motion.a>

        {/* Address */}
        <motion.a
          whileHover={{ scale: 1.02 }}
          href={mapsUrl}
          target="_blank"
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: `0.5px solid ${borderColor}`,
          }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: dimColor }}
          >
            <FiMapPin style={{ color: lightColor, fontSize: 14 }} />
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-slate-400 mb-0.5">Address</p>
            <p className={`text-sm font-medium ${textColor}`}>View on map</p>
          </div>
          <span className="text-slate-500 text-lg">›</span>
        </motion.a>
      </div>

      {/* Social Media */}
      <p
        className="text-[11px] tracking-widest uppercase px-6 mt-5 mb-3 font-medium"
        style={{ color: lightColor }}
      >
        Social
      </p>
      <div className="px-6 flex gap-3">
        {[
          { icon: FaFacebook, color: "#60a5fa" },
          { icon: FaTwitter, color: "#38bdf8" },
          { icon: FaLinkedin, color: "#818cf8" },
          { icon: FaInstagram, color: "#f472b6" },
        ].map((social, index) => (
          <motion.a
            key={index}
            whileHover={{ scale: 1.1, y: -2 }}
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "0.5px solid rgba(255,255,255,0.12)",
            }}
          >
            <social.icon size={16} color={social.color} />
          </motion.a>
        ))}
      </div>

      {/* Save Button */}
      <div className="px-6 mt-5">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSaveContact(data)}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-sm ${textBtnColor}`}
          style={{
            background: btnColor
              ? btnColor
              : `linear-gradient(135deg, ${accentColor}, ${lightColor})`,
          }}
        >
          <FaRegSave size={15} />
          Save Contact
        </motion.button>
      </div>
    </div>
  );
};

export default FourthUI;
