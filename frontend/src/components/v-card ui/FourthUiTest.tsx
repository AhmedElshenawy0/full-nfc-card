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
import { isDark } from "../../utils/colorBritness";

const FourthUiTest = ({
  formData,
  tempMainBackground,
  tempButtonBackground,
}: {
  formData: any;
  tempMainBackground: any;
  tempButtonBackground: any;
}) => {
  const [textColor, setTextColor] = useState("text-white");
  const [textBtnColor, setTextBtnColor] = useState("text-white");

  useEffect(() => {
    setTextColor(
      tempMainBackground || formData?.mainBackground
        ? isDark(tempMainBackground || formData?.mainBackground)
          ? "text-white"
          : "text-black"
        : "text-white",
    );
    setTextBtnColor(
      tempButtonBackground || formData?.buttonBackground
        ? isDark(tempButtonBackground || formData?.buttonBackground)
          ? "text-white"
          : "text-black"
        : "text-white",
    );
  }, [
    tempMainBackground,
    formData?.mainBackground,
    tempButtonBackground,
    formData?.buttonBackground,
  ]);

  const accentColor =
    tempMainBackground || formData?.mainBackground || "#a855f7";
  const btnColor = tempButtonBackground || formData?.buttonBackground;
  const lightColor = tinycolor(accentColor).lighten(40).toHexString();
  const dimColor = tinycolor(accentColor).setAlpha(0.15).toRgbString();
  const borderColor = tinycolor(accentColor).setAlpha(0.3).toRgbString();

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(160deg, #1a1a1a 0%, ${accentColor} 50%, #2d2d2d 100%)`,
      }}
      className="w-full max-w-md mx-auto min-h-screen text-white rounded-2xl shadow-2xl overflow-hidden pb-8 relative"
    >
      {/* Glow effect */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${tinycolor(accentColor).setAlpha(0.2).toRgbString()} 0%, transparent 70%)`,
        }}
      />

      {/* Hero / Profile */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-10 pb-6 px-8 text-center relative"
      >
        {/* Avatar with conic gradient ring */}
        <div className="relative inline-block mb-4">
          <div
            className="absolute inset-[-4px] rounded-full"
            style={{
              background: `conic-gradient(${accentColor}, ${lightColor}, #ec4899, ${accentColor})`,
            }}
          />
          <div className="relative w-24 h-24 rounded-full border-[3px] border-[#1a1a1a] overflow-hidden z-10">
            <img
              src={formData?.image}
              alt="Profile"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* Badge */}
        <div className="mb-3">
          <span
            className="text-[11px] px-3 py-1 rounded-full border tracking-wide"
            style={{ background: dimColor, borderColor, color: lightColor }}
          >
            {formData?.job ? formData.job.toUpperCase() : "PROFESSIONAL"}
          </span>
        </div>

        <h2 className={`text-xl font-medium ${textColor} tracking-tight mb-1`}>
          {formData?.name}
        </h2>
        <p
          className="text-xs tracking-widest uppercase"
          style={{ color: lightColor }}
        >
          {formData?.job}
        </p>
      </motion.div>

      {/* Divider */}
      <div
        className="h-px mx-8"
        style={{
          background: `linear-gradient(to right, transparent, ${borderColor}, transparent)`,
        }}
      />

      {/* Bio */}
      <div
        className="mx-6 my-4 p-4 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `0.5px solid ${borderColor}`,
        }}
      >
        <p className={`text-sm italic leading-relaxed ${textColor} mb-2`}>
          "{formData?.bio}"
        </p>
        <p
          className="text-xs leading-relaxed"
          style={{ color: tinycolor(accentColor).lighten(20).toHexString() }}
        >
          {formData?.about}
        </p>
      </div>

      {/* Contact */}
      <p
        className="text-[11px] tracking-widest uppercase px-6 mb-3"
        style={{ color: lightColor }}
      >
        Contact
      </p>
      <div className="px-6 flex flex-col gap-2.5">
        {/* Phone */}
        <motion.a
          whileHover={{ scale: 1.02 }}
          href={`tel:+${formData?.phone}`}
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
            <p className={`text-sm font-medium ${textColor}`}>
              {formData?.phone}
            </p>
          </div>
          <span className="text-slate-500 text-lg">›</span>
        </motion.a>

        {/* Address */}
        <motion.a
          whileHover={{ scale: 1.02 }}
          href="#"
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

      {/* Socials */}
      <p
        className="text-[11px] tracking-widest uppercase px-6 mt-5 mb-3"
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
        ].map((s, i) => (
          <motion.a
            key={i}
            whileHover={{ scale: 1.1, y: -2 }}
            href="#"
            target="_blank"
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "0.5px solid rgba(255,255,255,0.12)",
            }}
          >
            <s.icon size={16} color={s.color} />
          </motion.a>
        ))}
      </div>

      {/* Save Button */}
      <div className="px-6 mt-5">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-sm ${textBtnColor}`}
          style={{
            background:
              btnColor ||
              `linear-gradient(135deg, ${accentColor}, ${lightColor})`,
          }}
        >
          <FaRegSave size={15} />
          {formData?.select || "Save Contact"}
        </motion.button>
      </div>
    </div>
  );
};

export default FourthUiTest;
