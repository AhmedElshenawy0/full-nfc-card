import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaTwitter,
} from "react-icons/fa";
import { FaRegSave } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { handleSaveContact } from "../../utils/contactFile";
import { isDark } from "../../utils/colorBritness";
import tinycolor from "tinycolor2";

const ThirdUI = ({ data }: { data: any }) => {
  const encodedAddress = encodeURIComponent(data?.address || "");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  const [textColor, setTextColor] = useState("text-gray-300");
  const [textBtnColor, setTextBtnColor] = useState("text-black");

  useEffect(() => {
    if (data?.mainBackground)
      setTextColor(
        isDark(data.mainBackground) ? "text-gray-300" : "text-gray-900",
      );
    if (data?.buttonBackground)
      setTextBtnColor(
        isDark(data.buttonBackground) ? "text-gray-300" : "text-gray-900",
      );
  }, [data?.mainBackground, data?.buttonBackground]);

  const accentColor = data?.mainBackground || "#0d1321";
  const btnColor = data?.buttonBackground;
  const lightColor = tinycolor(accentColor).lighten(35).toHexString();
  const dimColor = tinycolor(accentColor).setAlpha(0.12).toRgbString();
  const borderColor = tinycolor(accentColor).setAlpha(0.25).toRgbString();
  const amberLight = "rgba(251,191,36,0.1)";
  const amberBorder = "rgba(251,191,36,0.2)";

  return (
    <div className="min-h-screen max-w-[500px] mx-auto flex items-center bg-[#050505] ">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{
          background: data?.mainBackground
            ? `linear-gradient(135deg, #111 0%, ${tinycolor(data.mainBackground).darken(15).toHexString()} 50%, #0d0d0d 100%)`
            : "linear-gradient(135deg, #111 0%, #1a1a1a 50%, #0d0d0d 100%)",
          border: "0.5px solid rgba(255,255,255,0.08)",
        }}
        className="w-full min-h-screen rounded-2xl overflow-hidden"
      >
        {/* Hero image with overlay */}
        <div className="relative">
          <img
            src={data?.image}
            alt="Profile"
            className="w-full h-64 object-cover object-top"
          />
          <div
            className="absolute inset-0"
            style={{
              background: data?.mainBackground
                ? `linear-gradient(to top, ${data.mainBackground} 0%, transparent 100%)`
                : "linear-gradient(to top, #111 0%, transparent 100%)",
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-5">
            {data?.job && (
              <span
                className="inline-block text-[11px] tracking-widest uppercase px-3 py-1 rounded-full border mb-2"
                style={{ color: lightColor, background: dimColor, borderColor }}
              >
                {data.job}
              </span>
            )}
            <h2 className={`text-xl font-medium ${textColor}`}>{data?.name}</h2>
            {data?.address && (
              <p className="text-xs text-slate-400 mt-0.5">{data.address}</p>
            )}
          </div>
        </div>

        {/* Bio */}
        <p
          className={`text-sm italic text-center px-6 pt-4 pb-2 leading-relaxed ${textColor}`}
        >
          "{data?.bio}"
        </p>

        {/* About box — ThirdUI's unique identity */}
        <div
          className="mx-5 my-3 p-4 rounded-xl"
          style={{
            background: data?.buttonBackground
              ? amberLight
              : "rgba(255,255,255,0.03)",
            border: data?.buttonBackground
              ? `0.5px solid ${amberBorder}`
              : `0.5px solid rgba(255,255,255,0.07)`,
          }}
        >
          <p
            className="text-[11px] tracking-widest uppercase font-medium mb-2"
            style={{ color: btnColor || "#fbbf24" }}
          >
            About
          </p>
          <p className={`text-sm leading-relaxed italic ${textColor}`}>
            {data?.about || "No additional information available."}
          </p>
        </div>

        {/* Divider */}
        <div
          className="h-px mx-5 my-1"
          style={{
            background: `linear-gradient(to right, transparent, ${borderColor || amberBorder}, transparent)`,
          }}
        />

        {/* Contact — 2 col card grid */}
        <div className="grid grid-cols-2 gap-2.5 px-5 py-4">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            href={`tel:+${data?.phone}`}
            className="flex flex-col items-center gap-2 p-3.5 rounded-xl"
            style={{
              background: amberLight,
              border: `0.5px solid ${amberBorder}`,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(251,191,36,0.12)",
                border: `0.5px solid ${amberBorder}`,
              }}
            >
              <FaPhone style={{ color: btnColor || "#fbbf24", fontSize: 14 }} />
            </div>
            <span className="text-[11px] text-slate-500">Phone</span>
            <span className={`text-xs font-medium text-center ${textColor}`}>
              {data?.phone}
            </span>
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-3.5 rounded-xl"
            style={{
              background: amberLight,
              border: `0.5px solid ${amberBorder}`,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(251,191,36,0.12)",
                border: `0.5px solid ${amberBorder}`,
              }}
            >
              <FiMapPin
                style={{ color: btnColor || "#fbbf24", fontSize: 14 }}
              />
            </div>
            <span className="text-[11px] text-slate-500">Address</span>
            <span className={`text-xs font-medium text-center ${textColor}`}>
              View on map
            </span>
          </motion.a>
        </div>

        {/* Divider */}
        <div
          className="h-px mx-5"
          style={{
            background: `linear-gradient(to right, transparent, ${borderColor || amberBorder}, transparent)`,
          }}
        />

        {/* Socials */}
        <p
          className="text-[11px] tracking-widest uppercase px-5 pt-4 pb-2.5 font-medium"
          style={{ color: btnColor || "#fbbf24" }}
        >
          Social
        </p>
        <div className="flex gap-2.5 px-5">
          {[
            { Icon: FaFacebook, bg: "#1877f2", href: "https://facebook.com" },
            { Icon: FaTwitter, bg: "#1da1f2", href: "https://twitter.com" },
            { Icon: FaLinkedin, bg: "#0077b5", href: "https://linkedin.com" },
            {
              Icon: FaInstagram,
              bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366)",
              href: "https://instagram.com",
            },
          ].map(({ Icon, bg, href }, i) => (
            <motion.a
              key={i}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{ background: bg }}
            >
              <Icon size={15} />
            </motion.a>
          ))}
        </div>

        {/* Save Button */}
        <div className="px-5 py-5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSaveContact(data)}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-sm ${textBtnColor}`}
            style={{
              background: btnColor
                ? btnColor
                : "linear-gradient(135deg, #b45309, #fbbf24)",
            }}
          >
            <FaRegSave size={15} />
            Save Contact
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ThirdUI;
