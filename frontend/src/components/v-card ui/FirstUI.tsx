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
import tinycolor from "tinycolor2";
import { isDark } from "../../utils/colorBritness";
// import tinycolor from "tinycolor2";
// import { isDark } from "../../utils/colorBritness";

const FirstUI = ({ data }: { data: any }) => {
  const encodedAddress = encodeURIComponent(data?.address || "");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  // Default text color and btn
  const [textColor, setTextColor] = useState("text-white");
  const [textBtnColor, setTextBtnColor] = useState("text-black");

  useEffect(() => {
    // check if color is dark Update text color
    data?.mainBackground
      ? setTextColor(isDark(data?.mainBackground) ? "text-white" : "text-black")
      : "";
    data?.buttonBackground
      ? setTextBtnColor(
          isDark(data?.buttonBackground) ? "text-white" : "text-black"
        )
      : "";
  }, [data?.mainBackground, data?.buttonBackground]);

  const lightColor = tinycolor(
    data?.buttomBackground ? data?.buttomBackground : "#868822"
  )
    .lighten(20)
    .toHexString();

  const color = tinycolor(
    data?.buttomBackground ? data?.buttomBackground : "#868822"
  )
    .lighten(40)
    .toHexString();

  return (
    <div
      style={{ background: data?.mainBackground ? data?.mainBackground : "" }}
      className="w-full bg-blue-950 min-h-[100vh] max-w-[500px] mx-auto overflow-hidden shadow-xl"
    >
      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <img
          src={data?.image}
          alt="Profile"
          className="w-full h-80 object-top object-cover rounded-b-lg shadow-lg"
        />
        <div
          style={{
            backgroundImage: data?.mainBackground
              ? `linear-gradient(to top, ${data?.mainBackground},transparent )`
              : "linear-gradient(to top, #162456 ,transparent )",
          }}
          className={`absolute -bottom-1 w-full bg-gradient-to-t from-[${data?.mainBackground}] to-transparent pb-6 pt-14 text-center`}
        >
          <h2
            className={` ${textColor} text-3xl mb-2 font-extrabold animate-fade-in capitalize `}
          >
            {data?.name}
          </h2>
          <p
            style={{
              color: data?.buttomBackground
                ? data?.buttomBackground
                : `#868822`,
            }}
            className="text-lg font-medium animate-slide-up capitalize"
          >
            {data.job}
          </p>
        </div>
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className={`p-6 ${textColor}`}
      >
        <p
          style={{ color: `${lightColor}` }}
          className="text-yellow-400 font-bold text-lg text-center"
        >
          {data?.bio}
        </p>
        <p
          style={{ color: `${color}` }}
          className={`text-sm mt-3 text-center italic`}
        >
          {data?.about}
        </p>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="p-6 text-white"
      >
        <h3
          style={{ color: `${lightColor}` }}
          className={`   font-semibold text-lg text-center`}
        >
          Contact Information
        </h3>
        <hr
          className={` ${
            data?.mainBackground ? `text-[#${lightColor}]` : "text-yellow-300"
          }  my-3 `}
        />{" "}
        <div className="flex flex-col items-center space-y-6">
          {/* Phone */}
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <a
              style={{
                backgroundColor: data.buttonBackgroud
                  ? data.buttonBackground
                  : `#868822`,
                color: textColor,
              }}
              href={`tel:+${data.phone}`}
              className="flex justify-center items-center w-14 h-14 bg-yellow-00 rounded-full shadow-md"
            >
              <FaPhone />
            </a>
            <p
              style={{ color: textColor }}
              className="mt-5 mb-1 italic text-sm"
            >
              Phone
            </p>
            <a
              style={{ color: textColor }}
              href={`tel:+${data.phone}`}
              className="font-semibold text-xl"
            >
              {data.phone}
            </a>
          </motion.div>
          {/* Address */}
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: data.buttonBackgroud
                  ? data.buttonBackground
                  : `#868822`,
                color: textColor,
              }}
              className="flex justify-center items-center w-14 h-14 bg-[#868822] rounded-full shadow-md"
            >
              <FiMapPin />
            </a>
            <p
              style={{ color: textColor }}
              className="mt-5 mb-1 italic text-sm"
            >
              Address
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=47+W+13th+St,+New+York"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: textColor }}
              className="text-md font-medium text-center"
            >
              13th Street 47 W 13th St, New York
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Social Media Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="p-6 flex justify-center space-x-6"
      >
        {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram].map((Icon, index) => (
          <motion.a
            key={index}
            whileTap={{ scale: 0.9 }}
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full shadow-md text-white"
            style={{
              backgroundColor: ["#1877f2", "#1da1f2", "#0077b5", "#e1306c"][
                index
              ],
            }}
          >
            <Icon />
          </motion.a>
        ))}
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="p-6 flex flex-col space-y-3"
      >
        <motion.button
          onClick={() => handleSaveContact(data)}
          whileTap={{ scale: 0.95 }}
          style={{
            background: data?.buttonBackground
              ? data?.buttonBackground
              : `#868822`,
            color: textBtnColor,
          }}
          className={`${textBtnColor} w-full flex items-center justify-center gap-3 py-3 bg-gradient-to-r from-gray-700 to-gray-800 font-bold text-lg rounded-lg shadow-lg cursor-pointer transition`}
        >
          Save Contact
        </motion.button>
      </motion.div>
    </div>
  );
};

export default FirstUI;
