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

  // Default text and btn color
  const [textColor, setTextColor] = useState("text-[#cbd5e1]");
  const [textBtnColor, setTextBtnColor] = useState("text-gray-300");

  useEffect(() => {
    // check if color is dark Update text color
    setTextColor(
      isDark(data?.mainBackground) ? "text-[#cbd5e1]" : "text-black"
    );
    setTextBtnColor(
      isDark(data?.buttonBackground) ? "text-[#cbd5e1]" : "text-black"
    );
  }, [data?.mainBackground, data?.buttonBackground]);

  const lightColor = tinycolor(data?.mainBackground).lighten(60).toHexString();

  return (
    <div
      style={{
        backgroundImage: data?.mainBackground
          ? `linear-gradient(to bottom right, #1a1a1a, ${data?.mainBackground}, #2d2d2d)`
          : "",
        // border: `1px solid ${data?.buttonBackground}`,
      }}
      className="w-full max-w-[500px] mx-auto min-h-screen bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white shadow-xl overflow-hidden p-8 "
    >
      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        style={{
          backgroundImage: data?.mainBackground
            ? `linear-gradient(to bottom right,#1a1a1a, ${
                data?.mainBackground || "#ffffff"
              },  #2d2d2d)`
            : "",
          border: data?.mainBackground
            ? `1px solid ${data?.buttonBackground}`
            : "",
        }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-gradient-to-b from-[#1e293b] to-[#0f172a] p-8 mb-4 text-center shadow-2xl rounded-xl border border-gray-700"
      >
        <div className="relative flex justify-center">
          <img
            style={{
              border: data?.mainBackground ? `6px solid ${lightColor}` : "",
            }}
            src={data?.image}
            alt="Profile"
            className="w-48 h-48 object-cover object-top rounded-full border-8 border-[#cbd5e1] shadow-xl transform hover:scale-110 transition-transform duration-300"
          />
        </div>
        <h2
          className={`text-3xl ${
            data?.mainBackground ? textColor : ""
          } font-extrabold mt-6  drop-shadow-lg`}
        >
          {data?.name}
        </h2>
        <p
          className={`${
            data?.mainBackground ? textColor : ""
          } text-lg mt-2 font-semibold`}
        >
          {data?.job}
        </p>
      </motion.div>

      {/* Info Section */}
      <div
        style={{
          border: data?.buttonBackground
            ? `1px solid ${data?.buttonBackground}`
            : "",
        }}
        className="p-6 text-center bg-opacity-10 backdrop-blur-md rounded-lg border border-gray-600"
      >
        <p
          className={`${
            data?.mainBackground ? textColor : "text-gray-400"
          } font-semibold text-lg italic`}
        >
          {data?.bio}
        </p>
        <p
          className={`text-sm mt-3 italic ${
            data?.mainBackground ? textColor : "text-gray-400"
          } leading-relaxed`}
        >
          {data?.about}
        </p>
      </div>

      {/* Contact Section */}
      <div className="p-6">
        <h3
          className={` ${
            data?.mainBackground ? textColor : "white"
          } font-semibold text-xl text-center mb-4`}
        >
          Contact Info
        </h3>
        <div className="space-y-6">
          <motion.a
            whileHover={{ scale: 1.05 }}
            href={`tel:+${data?.phone}`}
            style={{
              backgroundImage: data?.mainBackground
                ? `linear-gradient(to bottom right, #1a1a1a,${data?.mainBackground}, #2d2d2d)`
                : "",
            }}
            className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md border border-gray-600 hover:bg-gray-700 transition"
          >
            <div className="flex items-center gap-3">
              <FaPhone
                className={` ${
                  data?.mainBackground ? textColor : "gray-300"
                } text-xl`}
              />
              <span
                className={`font-semibold italic ${
                  data?.mainBackground ? textColor : "gray-300"
                }`}
              >
                Phone
              </span>
            </div>
            <span
              className={`text-lg font-bold ${
                data?.mainBackground ? textColor : "gray-300"
              }`}
            >
              {data?.phone}
            </span>
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.05 }}
            href={mapsUrl}
            target="_blank"
            style={{
              backgroundImage: data?.mainBackground
                ? `linear-gradient(to bottom right, #1a1a1a, ${data?.mainBackground}, #2d2d2d)`
                : "",
            }}
            className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md border border-gray-600 hover:bg-gray-700 transition"
          >
            <div className="flex items-center gap-3">
              <FiMapPin
                className={` text-xl  ${
                  data?.mainBackground ? textColor : "gray-300"
                }`}
              />
              <span
                className={`font-semibold italic  ${
                  data?.mainBackground ? textColor : "gray-300"
                }`}
              >
                Address
              </span>
            </div>
            <span
              className={`text-md font-bold  ${
                data?.mainBackground ? textColor : "gray-300"
              }`}
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
            className={`w-12 h-12 flex items-center justify-center rounded-full shadow-md text-white border border-gray-500 ${social.color} transition-transform`}
          >
            {social.icon({ size: 24 })}
          </motion.a>
        ))}
      </div>

      {/* Buttons */}
      <div className="p-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSaveContact(data)}
          style={{
            background: data?.buttonBackground ? data?.buttonBackground : "",
          }}
          className={`${
            data?.buttonBackground ? textBtnColor : ""
          } w-full flex items-center justify-center gap-3 py-3 bg-gradient-to-r from-[#000000] to-gray-700 cursor-pointer font-bold rounded-xl shadow-md hover:from-gray-300 transition`}
        >
          <FaRegSave /> Save Contact
        </motion.button>
      </div>
    </div>
  );
};

export default FourthUI;
