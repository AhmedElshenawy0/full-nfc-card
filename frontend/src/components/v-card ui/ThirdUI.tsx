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
import { handleSaveContact } from "../../utils/contactFile";
import { isDark } from "../../utils/colorBritness";
import tinycolor from "tinycolor2";

const ThirdUI = ({ data }: { data: any }) => {
  const encodedAddress = encodeURIComponent(data?.address || "");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  // Default text and btn color
  const [textColor, setTextColor] = useState("text-gray-300");
  const [textBtnColor, setTextBtnColor] = useState("text-black");

  useEffect(() => {
    // check if color is dark Update text color
    data?.mainBackground
      ? setTextColor(
          isDark(data?.mainBackground) ? "text-gray-300" : "text-gray-900"
        )
      : "";
    data?.buttonBackground
      ? setTextBtnColor(
          isDark(data?.buttonBackground) ? "text-gray-300" : "text-gray-900"
        )
      : "";
  }, [data?.mainBackground, data?.buttonBackground]);

  const lightColor = tinycolor(
    data?.mainBackground ? data?.mainBackground : "#0d1321"
  )
    .lighten(10)
    .toHexString();
  return (
    <div
      // style={{ background: data?.mainBackground && data?.mainBackground }}
      className={`min-h-screen max-w-[500px] mx-auto flex bg-black text-white p-6`}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          backgroundImage:
            data?.mainBackground &&
            `linear-gradient(to bottom right, #1a1a1a, ${
              data?.mainBackground || "#ffffff"
            }, #2d2d2d)`,
        }}
        className={`w-full max-w-lg bg-gradient-to-br from-gray-900 via-black to-gray-800 shadow-2xl rounded-2xl overflow-hidden p-6 border border-gray-700`}
      >
        <div className="relative" style={{ border: `1px solid ${lightColor}` }}>
          <img
            src={data?.image}
            alt="Profile"
            className="w-full h-72 object-cover object-top rounded-lg shadow-lg"
          />
          <div
            style={{
              backgroundImage:
                data?.mainBackground &&
                `linear-gradient(to top, ${data.mainBackground}, transparent)`,
            }}
            className={`absolute bottom-0 w-full  bg-gradient-to-t from-black to-transparent p-6 text-center`}
          >
            <h2 className={`${textColor} text-2xl font-bold`}>{data?.name}</h2>
            <p className={`${textColor} text-lg font-medium`}>{data.job}</p>
          </div>
        </div>

        <div className="p-6 text-center">
          <p className={`${textColor} text-lg italic`}>{data?.bio}</p>
        </div>

        {/* About Section */}
        <div
          style={{
            border: data?.buttonBackground
              ? `1px solid ${data?.buttonBackground}`
              : "",
            backgroundColor: lightColor,
          }}
          className="p-6 rounded-lg text-center mt-6 border border-gray-700"
        >
          <h3 className={`text-xl font-bold text-gold-500 mb-3  ${textColor}`}>
            About
          </h3>
          <p className={`${textColor} leading-relaxed italic`}>
            {data?.about || "No additional information available."}
          </p>
        </div>

        <div className="flex flex-col items-center space-y-6 mt-6 gap-2">
          <a
            href={`tel:+${data.phone}`}
            className={`flex items-center gap-3 ${textColor} text-lg font-semibold flex-col`}
          >
            <FaPhone className="text-2xl" /> {data.phone}
          </a>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 flex-col ${textColor}`}
          >
            <FiMapPin className="text-2xl text-gold-400" />{" "}
            {data?.address || "Location unavailable"}
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
          <button
            onClick={() => handleSaveContact(data)}
            style={{
              background: data?.buttonBackground && data?.buttonBackground,
            }}
            className={`w-full py-3 ${textBtnColor} font-semibold text-lg rounded-lg shadow-xl transition transform hover:scale-105 bg-amber-400`}
          >
            Save Contact
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ThirdUI;
