import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaTwitter,
} from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { FaRegSave } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { handleSaveContact } from "../../utils/contactFile";
import tinycolor from "tinycolor2";
import { isDark } from "../../utils/colorBritness";

const FirstUI = ({ data }: { data: any }) => {
  const encodedAddress = encodeURIComponent(data?.address || "");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  const [textColor, setTextColor] = useState("text-white");
  const [textBtnColor, setTextBtnColor] = useState("text-black");

  useEffect(() => {
    if (data?.mainBackground)
      setTextColor(isDark(data.mainBackground) ? "text-white" : "text-black");
    if (data?.buttonBackground)
      setTextBtnColor(
        isDark(data.buttonBackground) ? "text-white" : "text-black",
      );
  }, [data?.mainBackground, data?.buttonBackground]);

  const accentColor = data?.buttonBackground || "#b45309";
  const lightColor = tinycolor(accentColor).lighten(20).toHexString();
  const dimColor = tinycolor(accentColor).setAlpha(0.12).toRgbString();
  const borderColor = tinycolor(accentColor).setAlpha(0.28).toRgbString();
  const aboutColor = tinycolor(accentColor).lighten(35).toHexString();

  return (
    <div
      style={{ background: data?.mainBackground || "#0f1729" }}
      className="w-full min-h-screen max-w-[500px] mx-auto overflow-hidden text-white relative"
    >
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative h-[400px] overflow-hidden"
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
            background: data?.mainBackground
              ? `linear-gradient(to top, ${data.mainBackground} 10%, rgba(0,0,0,0.45) 60%, transparent 100%)`
              : "linear-gradient(to top, #0f1729 10%, rgba(15,23,41,0.5) 60%, transparent 100%)",
          }}
        />

        {/* Name & job over image */}
        <div className="absolute bottom-0 left-0 right-0 px-7 pb-6">
          {data?.job && (
            <span
              className="inline-block text-[11px] tracking-widest uppercase px-3 py-1 rounded-full border mb-2.5"
              style={{
                color: lightColor,
                background: dimColor,
                borderColor,
              }}
            >
              {data.job}
            </span>
          )}
          <h2 className={`text-2xl font-medium tracking-tight ${textColor}`}>
            {data?.name}
          </h2>
        </div>
      </motion.div>

      {/* Bio */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="px-7 py-5"
      >
        <p
          className="text-sm font-medium italic text-center leading-relaxed mb-2"
          style={{ color: lightColor }}
        >
          "{data?.bio}"
        </p>
        <p
          className="text-xs text-center leading-relaxed"
          style={{ color: aboutColor }}
        >
          {data?.about}
        </p>
      </motion.div>

      {/* Divider */}
      <div
        className="h-px mx-7"
        style={{
          background: `linear-gradient(to right, transparent, ${borderColor}, transparent)`,
        }}
      />

      {/* Contact */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.6 }}
      >
        <p
          className="text-[11px] tracking-widest uppercase px-7 pt-5 pb-3 font-medium"
          style={{ color: lightColor }}
        >
          Contact
        </p>

        <div className="grid grid-cols-2 gap-3 px-7">
          {/* Phone */}
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            href={`tel:+${data?.phone}`}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: `0.5px solid ${borderColor}`,
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: dimColor,
                border: `0.5px solid ${borderColor}`,
              }}
            >
              <FaPhone style={{ color: lightColor, fontSize: 16 }} />
            </div>
            <span className="text-[11px] text-slate-500">Phone</span>
            <span className={`text-sm font-medium text-center ${textColor}`}>
              {data?.phone}
            </span>
          </motion.a>

          {/* Address */}
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: `0.5px solid ${borderColor}`,
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: dimColor,
                border: `0.5px solid ${borderColor}`,
              }}
            >
              <FiMapPin style={{ color: lightColor, fontSize: 16 }} />
            </div>
            <span className="text-[11px] text-slate-500">Address</span>
            <span className={`text-sm font-medium text-center ${textColor}`}>
              View on map
            </span>
          </motion.a>
        </div>
      </motion.div>

      {/* Socials */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.6 }}
      >
        <p
          className="text-[11px] tracking-widest uppercase px-7 pt-5 pb-3 font-medium"
          style={{ color: lightColor }}
        >
          Social
        </p>
        <div className="flex gap-2.5 px-7">
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
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.6 }}
        className="px-7 pt-5 pb-8"
      >
        <motion.button
          onClick={() => handleSaveContact(data)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-sm ${textBtnColor}`}
          style={{
            background: data?.buttonBackground
              ? data.buttonBackground
              : `linear-gradient(135deg, #b45309, #fbbf24)`,
          }}
        >
          <FaRegSave size={15} />
          Save Contact
        </motion.button>
      </motion.div>
    </div>
  );
};

export default FirstUI;
