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
import tinycolor from "tinycolor2";
import { isDark } from "../../utils/colorBritness";

const FirstUITest = ({
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
    formData?.buttomBackground || tempButtonBackground
      ? formData?.buttomBackground || tempButtonBackground
      : "#868822"
  )
    .lighten(50)
    .toHexString();

  const color = tinycolor(
    formData?.buttomBackground || tempButtonBackground
      ? formData?.buttomBackground || tempButtonBackground
      : "#868822"
  )
    .lighten(60)
    .toHexString();

  return (
    <div
      style={{
        background:
          formData?.mainBackground || tempMainBackground
            ? formData?.mainBackground || tempMainBackground
            : "",
      }}
      className="w-full bg-blue-950 min-h-[100vh] max-w-lg mx-auto overflow-hidden shadow-xl"
    >
      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <img
          src={formData?.image}
          alt="Profile"
          className="w-full h-100 object-cover object-top rounded-b-lg shadow-lg"
        />
        <div
          style={{
            backgroundImage:
              formData?.mainBackground || tempMainBackground
                ? `linear-gradient(to top, ${
                    formData?.mainBackground || tempMainBackground
                  },transparent )`
                : "linear-gradient(to top, #162456 ,transparent )",
          }}
          className={`absolute -bottom-2 w-full  pb-6 pt-14 text-center`}
        >
          <h2
            className={` ${textColor} text-3xl mb-2 font-extrabold animate-fade-in`}
          >
            {formData?.name}
          </h2>
          <p
            style={{
              color:
                formData?.buttomBackground || tempButtonBackground
                  ? tempButtonBackground || formData?.buttomBackground
                  : `#868822`,
            }}
            className={` text-lg font-medium animate-slide-up`}
          >
            {formData.job}
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
          className={`  font-bold text-lg text-center`}
        >
          {formData?.bio}
        </p>
        <p
          style={{ color: `${color}` }}
          className={`text-sm mt-4 px-4 italic text-center`}
        >
          {formData?.about}
        </p>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className={`p-6 ${textColor}`}
      >
        <h3
          style={{ color: `${lightColor}` }}
          className={` font-semibold text-lg text-center`}
        >
          Contact Information
        </h3>
        <hr
          className={` ${
            tempMainBackground ? `text-[#${lightColor}]` : "text-yellow-300"
          }  my-3 `}
        />
        <div className="flex flex-col items-center space-y-6">
          {/* Phone */}
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <a
              style={{
                backgroundColor:
                  formData.buttonBackgroud || tempButtonBackground
                    ? formData.buttonBackground || tempButtonBackground
                    : `#868822`,
                color: textColor,
              }}
              className={`flex justify-center items-center w-14 h-14  rounded-full shadow-md`}
            >
              <FaPhone />
            </a>
            <p
              style={{ color: `${textColor}` }}
              className={` mt-5 mb-1 text-sm italic`}
            >
              Phone
            </p>
            <a
              style={{ color: textColor }}
              className={` font-semibold text-xl`}
            >
              {formData.phone}
            </a>
          </motion.div>
          {/* Address */}
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <a
              href={""}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor:
                  formData.buttonBackgroud || tempButtonBackground
                    ? formData.buttonBackground || tempButtonBackground
                    : `#868822`,
                color: textColor,
              }}
              className={`flex justify-center items-center w-14 h-14  rounded-full shadow-md`}
            >
              <FiMapPin />
            </a>
            <p
              style={{ color: `${textColor}` }}
              className={` mt-5 mb-1 text-sm italic`}
            >
              Address
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=47+W+13th+St,+New+York"
              target="_blank"
              rel="noopener noreferrer"
              className={`${textColor} text-md font-medium text-center`}
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
        <motion.div
          whileTap={{ scale: 0.95 }}
          style={{
            background:
              formData?.buttonBackground || tempButtonBackground
                ? formData?.buttonBackground || tempButtonBackground
                : `#868822`,
            color: textBtnColor,
          }}
          className={`${textBtnColor} w-full flex items-center justify-center gap-3 py-3 text-white bg-[#5d5413] font-semibold text-lg rounded-lg shadow-lg cursor-pointer transition`}
        >
          {formData.select ? formData.select : "Save Contact"}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FirstUITest;
