import { FaRegSave } from "react-icons/fa";
import { FiMapPin, FiPhone } from "react-icons/fi";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import tinycolor from "tinycolor2";
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
  const [textBtnColor, setTextBtnColor] = useState("text-white");

  const mainBg = tempMainBackground || formData?.mainBackground || "#1a1a1a";
  const btnColor =
    tempButtonBackground || formData?.buttonBackground || "#f0f0f0";

  const isMainDark = isDark(mainBg);

  const heroBg = tinycolor(mainBg).lighten(5).toHexString();
  const cardBg = tinycolor(mainBg).lighten(4).toHexString();
  const innerRowBg = tinycolor(mainBg).lighten(2).toHexString();
  const iconBg = tinycolor(mainBg).lighten(8).toHexString();
  const borderColor = tinycolor(mainBg).lighten(10).toHexString();
  const heroBorderColor = tinycolor(mainBg).lighten(8).toHexString();

  const textPrimary = isMainDark ? "#f0f0f0" : "#111111";
  const textSecondary = isMainDark ? "#888888" : "#666666";
  const textMuted = isMainDark ? "#555555" : "#bbbbbb";
  const textBio = isMainDark ? "#888888" : "#777777";

  useEffect(() => {
    setTextBtnColor(isDark(btnColor) ? "text-white" : "text-black");
  }, [btnColor]);

  return (
    <div
      style={{ background: mainBg }}
      className="w-full max-w-lg mx-auto min-h-screen overflow-hidden pb-6 relative"
    >
      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          background: heroBg,
          borderBottom: `1px solid ${heroBorderColor}`,
          borderRadius: "0 0 24px 24px",
        }}
        className="px-6 pt-10 pb-7 relative overflow-hidden"
      >
        {/* Decorative circles */}
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
          style={{
            background: isMainDark
              ? "rgba(255,255,255,0.03)"
              : "rgba(0,0,0,0.03)",
            transform: "translate(40px, -40px)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-24 h-24 rounded-full pointer-events-none"
          style={{
            background: isMainDark
              ? "rgba(255,255,255,0.02)"
              : "rgba(0,0,0,0.02)",
            transform: "translate(-20px, 20px)",
          }}
        />

        {/* Avatar + Name row */}
        <div className="flex items-center gap-4 relative">
          <div
            className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0"
            style={{ border: `3px solid ${iconBg}` }}
          >
            <img
              src={formData?.image}
              alt="Profile"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div>
            {formData?.job && (
              <p
                className="text-[9px] tracking-[0.15em] uppercase font-medium mb-1"
                style={{ color: textMuted }}
              >
                {formData.job}
              </p>
            )}
            <h2
              className="text-2xl font-bold leading-tight"
              style={{ color: textPrimary }}
            >
              {formData?.name}
            </h2>
          </div>
        </div>

        {/* Bio quote */}
        {formData?.bio && (
          <div
            className="mt-5 pt-5 relative"
            style={{ borderTop: `1px solid ${heroBorderColor}` }}
          >
            <p
              className="text-xs italic leading-relaxed"
              style={{ color: textBio }}
            >
              "{formData.bio}"
            </p>
          </div>
        )}
      </motion.div>

      {/* About Card */}
      {formData?.about && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: 18,
          }}
          className="mx-3.5 mt-3 px-5 py-4"
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
            {formData.about}
          </p>
        </motion.div>
      )}

      {/* Contact Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
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
          Contact
        </p>
        <div className="flex flex-col gap-2.5">
          {/* Phone */}
          <motion.a
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
            href={`tel:+${formData?.phone}`}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl"
            style={{
              background: innerRowBg,
              border: `1px solid ${borderColor}`,
            }}
          >
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
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
                {formData?.phone}
              </p>
            </div>
          </motion.a>

          {/* Address */}
          <motion.a
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl"
            style={{
              background: innerRowBg,
              border: `1px solid ${borderColor}`,
            }}
          >
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
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

      {/* Social Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
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
        <div className="flex gap-2.5">
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
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-11 rounded-xl flex items-center justify-center text-white"
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
        className="mx-3.5 mt-3"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm cursor-pointer ${textBtnColor}`}
          style={{ background: "white" }}
        >
          <FaRegSave size={14} />
          {formData?.select ? formData.select : "Save Contact"}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SecondUiTest;
