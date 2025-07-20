import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaTwitter,
} from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
// import { handleSaveContact } from "../../utils/contactFile";
import { isDark } from "../../utils/colorBritness";
import tinycolor from "tinycolor2";

const ThirdUITest = ({
  formData,
  tempButtonBackground,
  tempMainBackground,
}: {
  formData: any;
  tempMainBackground: any;
  tempButtonBackground: any;
}) => {
  // Default text and btn color
  const [textColor, setTextColor] = useState("text-white");
  const [textBtnColor, setTextBtnColor] = useState("text-black");

  useEffect(() => {
    // check if color is dark Update text color

    setTextColor(
      tempMainBackground || formData?.mainBackground
        ? isDark(tempMainBackground || formData?.mainBackground)
          ? "text-white"
          : "text-black"
        : "text-white"
    );
    setTextBtnColor(
      tempButtonBackground || formData?.buttonBackground
        ? isDark(tempButtonBackground || formData?.buttonBackground)
          ? "text-white"
          : "text-black"
        : "text-black"
    );
  }, [
    tempMainBackground,
    formData?.mainBackground,
    tempButtonBackground,
    formData?.buttonBackground,
  ]);

  const lightColor = tinycolor(
    tempMainBackground ? tempMainBackground : "#0d1321"
  )
    .lighten(10)
    .toHexString();

  return (
    <div
      //   style={{ background: formData?.mainBackground }}
      className={`min-h-screen max-w-lg mx-auto flex bg-black text-white p-6`}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          backgroundImage:
            formData?.mainBackground || tempMainBackground
              ? `linear-gradient(to bottom right, #0d1321, ${
                  formData?.mainBackground || tempMainBackground
                }, #16202d)`
              : "",
          border: `1px solid ${lightColor}`,
        }}
        className={`w-full max-w-lg bg-gradient-to-br from-gray-900 via-black to-gray-800 shadow-2xl rounded-2xl overflow-hidden p-6 `}
      >
        <div
          className="relative overflow-hidden rounded-lg"
          style={{ border: `1px solid ${lightColor}` }}
        >
          <img
            src={formData?.image}
            alt="Profile"
            className="w-full h-72 object-cover rounded-lg shadow-lg"
          />
          <div className="absolute -bottom-[15px] w-full bg-gradient-to-t from-black to-transparent p-6 text-center">
            <h2 className={`${textColor} text-[23px] font-bold `}>
              {formData?.name}
            </h2>
            <p className={`${textColor}  text-lg font-medium`}>
              {formData.job}
            </p>
          </div>
        </div>

        <div className="p-6 text-center">
          <p className={`${textColor} text-lg italic`}>{formData?.bio}</p>
        </div>

        {/* About Section */}
        <div
          style={{
            border:
              tempButtonBackground || formData?.buttonBackground
                ? `1px solid ${
                    tempButtonBackground || formData?.buttonBackground
                  }`
                : "",
            backgroundColor: lightColor,
          }}
          className="p-6 rounded-lg text-center mt-6 border border-gray-700"
        >
          <h3 className={`text-xl font-bold text-gold-500 mb-3 ${textColor}`}>
            About
          </h3>
          <p className={`${textColor} leading-relaxed italic`}>
            {formData?.about || "No additional information available."}
          </p>
        </div>

        <div className="flex flex-col items-center space-y-6 mt-6 gap-2">
          <a
            className={`flex items-center gap-3 ${textColor} text-lg font-semibold flex-col`}
          >
            <FaPhone className="text-2xl" /> {formData.phone}
          </a>

          <a
            href={""}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 flex-col ${textColor}`}
          >
            <FiMapPin className="text-2xl text-gold-400" />{" "}
            {formData?.address || "Location unavailable"}
          </a>
        </div>

        <div className="flex justify-center space-x-10 mt-8">
          <a
            href="https://facebook.com"
            className="text-blue-600 text-3xl hover:text-gold-500"
          >
            <FaFacebook />
          </a>
          <a
            href="https://twitter.com"
            className="text-blue-400 text-3xl hover:text-gold-500"
          >
            <FaTwitter />
          </a>
          <a
            href="https://linkedin.com"
            className="text-blue-700 text-3xl hover:text-gold-500"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://instagram.com"
            className="text-pink-600 text-3xl hover:text-gold-500"
          >
            <FaInstagram />
          </a>
        </div>

        <div className="p-6 mt-6">
          <div
            style={{
              background:
                formData?.buttonBackground || tempButtonBackground
                  ? formData?.buttonBackground || tempButtonBackground
                  : "",
            }}
            className={` text-center w-full py-3 ${textBtnColor} font-semibold text-lg rounded-lg shadow-xl transition transform hover:scale-105 bg-amber-400`}
          >
            {formData.select ? formData.select : "Save Contact"}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ThirdUITest;
