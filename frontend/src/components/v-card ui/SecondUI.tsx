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
import { handleSaveContact } from "../../utils/contactFile";
import { isDark } from "../../utils/colorBritness";

const SecondUI = ({ data }: { data: any }) => {
  const encodedAddress = encodeURIComponent(data?.address || "");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  // Default text and btn color
  const [textColor, setTextColor] = useState("text-black");
  const [textBtnColor, setTextBtnColor] = useState("text-black");

  useEffect(() => {
    // check if color is dark Update text color

    setTextColor(isDark(data?.mainBackground) ? "text-white" : "text-black");
    setTextBtnColor(
      isDark(data?.buttonBackground) ? "text-white" : "text-black"
    );
  }, [data?.mainBackground, data?.buttonBackground]);

  const lightColor = tinycolor(data?.mainBackground).lighten(60).toHexString();
  return (
    <div className=" max-w-[500px] mx-auto min-h-screen bg-gradient-to-b from-gray-900 to-black text-white shadow-2xl p-6">
      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          backgroundImage: data?.buttonBackground
            ? `linear-gradient(to bottom right, ${data?.mainBackground},  #1a1a1a)`
            : "",
          border: data?.buttonBackground
            ? `1px solid ${data?.buttonBackground}`
            : "",
        }}
        className="relative bg-gradient-to-b from-purple-800 to-gray-900 p-6 pb-16 text-center shadow-2xl rounded-xl"
      >
        <div className="relative flex justify-center">
          <img
            src={data?.image}
            alt="Profile"
            style={{
              border: data?.mainBackground ? `8px solid ${lightColor}` : "",
            }}
            className="w-48 h-48 object-cover object-top rounded-full border-8 border-purple-400 shadow-xl transform hover:scale-110 transition-transform duration-300"
          />
        </div>
        <h2
          className={`text-3xl font-extrabold mt-6 ${
            data?.buttonBackground ? textColor : ""
          } drop-shadow-lg`}
        >
          {data?.name}
        </h2>
        <p
          style={{ color: data?.mainBackground ? lightColor : "" }}
          className="text-purple-300 text-lg mt-2 font-semibold"
        >
          {data?.job}
        </p>
      </motion.div>

      {/* Info Section */}
      <div className="p-6 text-center bg-opacity-10 backdrop-blur-md rounded-lg ">
        <p
          style={{ color: data?.mainBackground ? lightColor : "" }}
          className="text-purple-300 font-semibold text-lg italic leading-relaxed w-full"
        >
          {data?.bio}
        </p>
        <p className="text-sm mt-3 text-gray-300 leading-relaxed">
          {data?.about}
        </p>
      </div>

      {/* Contact Section */}
      <div className="p-6">
        <h3
          style={{ color: data?.mainBackground ? lightColor : "" }}
          className="text-purple-400 font-semibold text-xl text-center mb-4"
        >
          Contact Info
        </h3>
        <div className="space-y-6">
          <motion.a
            whileHover={{ scale: 1.05 }}
            href={`tel:+${data?.phone}`}
            className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <FaPhone
                style={{ color: data?.mainBackground ? lightColor : "" }}
                className="text-purple-400 text-xl"
              />
              <span className="font-semibold italic">Phone</span>
            </div>
            <span
              style={{ color: data?.mainBackground ? lightColor : "" }}
              className="text-lg font-bold text-purple-300"
            >
              {data?.phone}
            </span>
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.05 }}
            href={mapsUrl}
            target="_blank"
            className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-mdtransition"
          >
            <div className="flex items-center gap-3">
              <FiMapPin
                style={{ color: data?.mainBackground ? lightColor : "" }}
                className="text-purple-400 text-xl"
              />
              <span className="font-semibold italic">Address</span>
            </div>
            <span
              style={{ color: data?.mainBackground ? lightColor : "" }}
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
            link: data?.facebook_link,
          },
          {
            icon: FaTwitter,
            color: "bg-blue-400",
            link: data?.twitter_link,
          },
          {
            icon: FaLinkedin,
            color: "bg-blue-700",
            link: data?.linkedin_link,
          },
          {
            icon: FaInstagram,
            color: "bg-pink-600",
            link: data?.instgram_link, // تأكد من الاسم الصحيح هنا!
          },
        ]
          .filter((social) => !!social.link) // ✅ يظهر فقط الروابط غير الفارغة
          .map((social, index) => (
            <motion.a
              key={index}
              whileHover={{ scale: 1.1 }}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-12 h-12 flex items-center justify-center rounded-full shadow-md text-white ${social.color} transition-transform`}
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
            backgroundImage: data?.buttonBackground
              ? `linear-gradient(to bottom right, ${data?.buttonBackground},  #1a1a1a)`
              : "",
          }}
          className={`w-full flex items-center justify-center gap-3 py-3 ${
            data?.buttonBackground ? textBtnColor : ""
          } bg-gradient-to-r from-purple-500 to-purple-700 font-bold rounded-xl shadow-md transition`}
        >
          <FaRegSave /> Save Contact
        </motion.button>
      </div>
    </div>
  );
};

export default SecondUI;
