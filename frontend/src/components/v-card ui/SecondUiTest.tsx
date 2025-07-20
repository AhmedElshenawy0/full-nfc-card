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

  const lightColor = tinycolor(tempMainBackground).lighten(60).toHexString();

  return (
    <div className="w-full h-fit max-w-lg mx-auto bg-gradient-to-b from-gray-900 to-black text-white shadow-2xl overflow-hidden p-6 relative">
      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${
            tempMainBackground || formData?.mainBackground
          },  #1a1a1a)`,
          border: `1px solid ${
            tempButtonBackground || formData?.buttonBackground
          }`,
        }}
        className="relative bg-gradient-to-b from-purple-800 to-gray-900 p-6 pb-16 text-center shadow-2xl rounded-xl"
      >
        <div className="relative flex justify-center">
          <img
            src={formData?.image}
            alt="Profile"
            style={{
              border: tempMainBackground && `8px solid ${lightColor}`,
            }}
            className="w-48 h-48 object-cover object-top rounded-full border-8 border-purple-400 shadow-xl transform hover:scale-110 transition-transform duration-300"
          />
        </div>
        <h2
          className={`text-2xl font-extrabold mt-6 ${textColor} drop-shadow-lg`}
        >
          {formData?.name}
        </h2>
        <p className={` ${textColor} text-lg mt-2 font-semibold`}>
          {formData?.job}
        </p>
      </motion.div>

      {/* Info Section */}
      <div className="p-6 text-center bg-opacity-10 backdrop-blur-md rounded-lg">
        <p
          style={{ color: lightColor }}
          className="text-purple-300 font-semibold text-lg italic"
        >
          {formData?.bio}
        </p>
        <p className="text-sm mt-3 text-gray-300 leading-relaxed">
          {formData?.about}
        </p>
      </div>

      {/* Contact Section */}
      <div className="p-6">
        <h3
          style={{ color: lightColor }}
          className="text-purple-400 font-semibold text-xl text-center mb-4"
        >
          Contact Info
        </h3>
        <div className="space-y-6">
          <motion.a
            whileHover={{ scale: 1.05 }}
            href={`tel:+${formData?.phone}`}
            className="flex justify-between items-center max-[390px]:flex-col max-[390px]:gap-2 bg-gray-800 p-4 rounded-lg shadow-md  transition"
          >
            <div className="flex items-center gap-3">
              <FaPhone
                style={{ color: lightColor }}
                className="text-purple-400 text-xl"
              />
              <span className={` ${textColor}   font-semibold italic`}>
                Phone
              </span>
            </div>
            <span
              style={{ color: lightColor }}
              className="text-lg font-bold text-purple-300"
            >
              {formData?.phone}
            </span>
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.05 }}
            href={""}
            target="_blank"
            className="flex justify-between items-center max-[390px]:flex-col max-[390px]:gap-2 bg-gray-800 p-4 rounded-lg shadow-md  transition"
          >
            <div className="flex items-center gap-3">
              <FiMapPin
                style={{ color: lightColor }}
                className="text-purple-400 text-xl"
              />
              <span className={` ${textColor} font-semibold italic`}>
                Address
              </span>
            </div>
            <span
              style={{ color: lightColor }}
              className="text-md font-bold text-purple-300"
            >
              View Map
            </span>
          </motion.a>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="p-6 flex justify-center space-x-6">
        {[
          {
            icon: FaFacebook,
            color: "bg-blue-600",
          },
          {
            icon: FaTwitter,
            color: "bg-blue-400",
          },
          {
            icon: FaLinkedin,
            color: "bg-blue-700",
          },
          {
            icon: FaInstagram,
            color: "bg-pink-600",
          },
        ].map((social, index) => (
          <motion.a
            key={index}
            whileHover={{ scale: 1.1 }}
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md text-white ${social.color} transition-transform`}
          >
            {social.icon({ size: 24 })}
          </motion.a>
        ))}
      </div>

      {/* Buttons */}
      <div className="p-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            backgroundImage: `linear-gradient(to bottom right, ${
              tempButtonBackground || formData?.buttonBackground
            },  #1a1a1a)`,
          }}
          className={`w-full cursor-pointer flex items-center justify-center gap-3 py-3 ${textBtnColor} bg-gradient-to-r from-purple-500 to-purple-700 font-bold rounded-xl shadow-md transition`}
        >
          {formData?.select ? formData?.select : "Save Contact"}

          <FaRegSave />
        </motion.div>
      </div>
    </div>
  );
};

export default SecondUiTest;
