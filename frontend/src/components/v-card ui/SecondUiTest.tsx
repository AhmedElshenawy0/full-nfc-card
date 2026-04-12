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
import tinycolor from "tinycolor2";
import { useEffect, useState } from "react";
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
  const [textColor, setTextColor] = useState("text-white");
  const [textBtnColor, setTextBtnColor] = useState("text-black");

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
        : "text-black",
    );
  }, [
    tempMainBackground,
    formData?.mainBackground,
    tempButtonBackground,
    formData?.buttonBackground,
  ]);

  const accentColor =
    tempMainBackground || formData?.mainBackground || "#7c3aed";
  const btnColor = tempButtonBackground || formData?.buttonBackground;
  const lightColor = tinycolor(accentColor).lighten(35).toHexString();
  const dimColor = tinycolor(accentColor).setAlpha(0.12).toRgbString();
  const borderColor = tinycolor(accentColor).setAlpha(0.25).toRgbString();
  const conicGradient = `conic-gradient(${accentColor}, ${lightColor}, #ec4899, ${accentColor})`;

  return (
    <div
      style={{
        background: accentColor
          ? `linear-gradient(160deg, #0f0a1e 0%, ${tinycolor(accentColor).darken(20).toHexString()} 50%, #0a0a0a 100%)`
          : "linear-gradient(160deg, #0f0a1e, #1a0f2e, #0a0a0a)",
      }}
      className="w-full max-w-lg mx-auto min-h-screen text-white overflow-hidden pb-8 relative"
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${tinycolor(accentColor).setAlpha(0.2).toRgbString()} 0%, transparent 70%)`,
        }}
      />

      {/* Hero / Profile */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="pt-12 pb-6 px-8 text-center relative"
      >
        {/* Avatar with conic ring */}
        <div className="relative inline-block mb-4">
          <div
            className="absolute inset-[-4px] rounded-full"
            style={{ background: conicGradient }}
          />
          <img
            src={formData?.image}
            alt="Profile"
            className="relative w-28 h-28 rounded-full object-cover object-top border-[3px] border-[#0f0a1e] z-10 hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Job badge */}
        {formData?.job && (
          <div className="mb-3">
            <span
              className="text-[11px] px-3 py-1 rounded-full border tracking-widest uppercase"
              style={{ color: lightColor, background: dimColor, borderColor }}
            >
              {formData.job}
            </span>
          </div>
        )}

        <h2 className={`text-2xl font-medium tracking-tight mb-1 ${textColor}`}>
          {formData?.name}
        </h2>
      </motion.div>

      {/* Divider */}
      <div
        className="h-px mx-8 mb-1"
        style={{
          background: `linear-gradient(to right, transparent, ${borderColor}, transparent)`,
        }}
      />

      {/* Bio */}
      <div
        className="mx-6 my-4 p-4 rounded-xl"
        style={{ background: dimColor, border: `0.5px solid ${borderColor}` }}
      >
        <p
          className="text-sm italic text-center leading-relaxed mb-2"
          style={{ color: lightColor }}
        >
          "{formData?.bio}"
        </p>
        <p className="text-xs text-center leading-relaxed text-slate-500">
          {formData?.about}
        </p>
      </div>

      {/* Contact */}
      <p
        className="text-[11px] tracking-widest uppercase px-6 mb-3 font-medium"
        style={{ color: lightColor }}
      >
        Contact
      </p>
      <div className="px-6 flex flex-col gap-2.5">
        <motion.a
          whileHover={{ scale: 1.02 }}
          href={`tel:+${formData?.phone}`}
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: dimColor, border: `0.5px solid ${borderColor}` }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: tinycolor(accentColor).setAlpha(0.2).toRgbString(),
            }}
          >
            <FaPhone style={{ color: lightColor, fontSize: 13 }} />
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-slate-500 mb-0.5">Phone</p>
            <p className={`text-sm font-medium ${textColor}`}>
              {formData?.phone}
            </p>
          </div>
          <span className="text-slate-600 text-lg">›</span>
        </motion.a>

        <motion.a
          whileHover={{ scale: 1.02 }}
          href=""
          target="_blank"
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: dimColor, border: `0.5px solid ${borderColor}` }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: tinycolor(accentColor).setAlpha(0.2).toRgbString(),
            }}
          >
            <FiMapPin style={{ color: lightColor, fontSize: 13 }} />
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-slate-500 mb-0.5">Address</p>
            <p className={`text-sm font-medium ${textColor}`}>View on map</p>
          </div>
          <span className="text-slate-600 text-lg">›</span>
        </motion.a>
      </div>

      {/* Socials */}
      <p
        className="text-[11px] tracking-widest uppercase px-6 mt-5 mb-3 font-medium"
        style={{ color: lightColor }}
      >
        Social
      </p>
      <div className="px-6 flex gap-2.5">
        {[
          { Icon: FaFacebook, bg: "#1877f2" },
          { Icon: FaTwitter, bg: "#1da1f2" },
          { Icon: FaLinkedin, bg: "#0077b5" },
          {
            Icon: FaInstagram,
            bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366)",
          },
        ].map(({ Icon, bg }, i) => (
          <motion.a
            key={i}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
            style={{ background: bg }}
          >
            <Icon size={15} />
          </motion.a>
        ))}
      </div>

      {/* Save Button — div + formData.select (no handleSaveContact, test mode) */}
      <div className="px-6 mt-5">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-sm cursor-pointer ${textBtnColor}`}
          style={{
            background: btnColor
              ? btnColor
              : `linear-gradient(135deg, ${accentColor}, ${lightColor})`,
          }}
        >
          <FaRegSave size={15} />
          {formData?.select ? formData.select : "Save Contact"}
        </motion.div>
      </div>
    </div>
  );
};

export default SecondUiTest;
