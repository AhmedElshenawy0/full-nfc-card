import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { FiMapPin, FiPhone, FiMail, FiUserPlus } from "react-icons/fi";
import { FaRegSave } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import tinycolor from "tinycolor2";
import { isDark } from "../../utils/colorBritness";
import { handleSaveContact } from "../../utils/contactFile";

export const capitalizeFirstWord = (text: string) => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const ThirdUI = ({ data }: { data: any }) => {
  const encodedAddress = encodeURIComponent(data?.address || "");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  const [textBtnColor, setTextBtnColor] = useState("text-black");

  const btnColor = data?.buttonBackground || "#111111";

  // ── Semantic tokens ──────────────────────────────────────────────
  const surface = "#f8f8f8";
  const card = "#ffffff";
  const border = "#eeeeee";
  const borderRow = "#f5f5f5";
  const textPrimary = "#111111";
  const textSecondary = "#555555";
  const textMuted = "#bbbbbb";
  const actionIconBg = "#f0f0f0";
  const actionIconBorder = "#e0e0e0";
  const dividerColor = "#e8e8e8";

  const iconBgPhone = "#eff6ff";
  const iconColPhone = "#3b82f6";
  const iconBgAddr = "#fdf4ff";
  const iconColAddr = "#a855f7";

  useEffect(() => {
    setTextBtnColor(isDark(btnColor) ? "text-white" : "text-black");
  }, [btnColor]);

  const btnTextColor = isDark(btnColor) ? "#ffffff" : "#111111";

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.08 + i * 0.06, duration: 0.38, ease: "easeOut" },
  });

  const socials = [
    { Icon: FaFacebook, bg: "#1877f2", link: data?.facebook_link },
    { Icon: FaTwitter, bg: "#1da1f2", link: data?.twitter_link },
    { Icon: FaLinkedin, bg: "#0077b5", link: data?.linkedin_link },
    {
      Icon: FaInstagram,
      bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366)",
      link: data?.instgram_link,
    },
  ].filter((s) => !!s.link);

  const hasBio = !!(data?.bio || data?.about);
  const hasPhone = !!data?.phone;
  const hasAddress = !!data?.address;

  return (
    <div
      style={{
        background: surface,
        fontFamily:
          "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
      className="w-full max-w-[500px] mx-auto min-h-screen overflow-hidden pb-8"
    >
      {/* ── Cover image ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          height: 170,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {data?.coverImage ? (
          <img
            src={data.coverImage}
            alt="cover"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `linear-gradient(135deg, ${tinycolor(btnColor).lighten(15).toHexString()}, ${btnColor})`,
            }}
          />
        )}
      </motion.div>

      {/* ── Avatar ── */}
      <motion.div
        {...stagger(0)}
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: -70,
          position: "relative",
          zIndex: 2,
        }}
      >
        {data?.image ? (
          <img
            className="rounded-full"
            src={data.image}
            alt={data?.name || "Profile"}
            style={{
              width: 150,
              height: 150,
              // borderRadius: "50%",

              border: `3px solid ${card}`,
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: "50%",
              border: `3px solid ${card}`,
              background: btnColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 600,
              color: btnTextColor,
            }}
          >
            {data?.name?.charAt(0) ?? "?"}
          </div>
        )}
      </motion.div>

      {/* ── Name + job ── */}
      <motion.div
        {...stagger(1)}
        style={{ textAlign: "center", marginTop: 10, padding: "0 20px" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
          }}
        >
          {data?.name && (
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: textPrimary,
                letterSpacing: "-0.3px",
              }}
            >
              {capitalizeFirstWord(data.name)}
            </span>
          )}
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#1d9bf0",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
              <polyline
                points="2,5 4.2,7.5 8,3"
                stroke="#fff"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        {data?.job && (
          <p
            style={{
              fontSize: 12,
              color: textMuted,
              marginTop: 3,
              letterSpacing: "0.01em",
            }}
          >
            {capitalizeFirstWord(data.job)}
          </p>
        )}
      </motion.div>

      {/* ── Quick action buttons ── */}
      <motion.div
        {...stagger(2)}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 14,
          margin: "20px 16px 0",
        }}
      >
        {[
          {
            icon: <FiPhone size={18} />,
            label: "Call",
            href: hasPhone ? `tel:+${data.phone}` : undefined,
            iconBg: "#3b82f6",
            iconColor: "#ffffff",
          },
          {
            icon: <FiMail size={18} />,
            label: "Email",
            href: data?.email ? `mailto:${data.email}` : undefined,
            iconBg: "#f59e0b",
            iconColor: "#ffffff",
          },
          {
            icon: <FaWhatsapp size={18} />,
            label: "WhatsApp",
            href: hasPhone ? `https://wa.me/${data.phone}` : undefined,
            iconBg: "#25d366",
            iconColor: "#ffffff",
          },
          {
            icon: <FiUserPlus size={18} />,
            label: "Add",
            href: undefined,
            iconBg: btnColor,
            iconColor: btnTextColor,
            onClick: () => handleSaveContact(data),
          },
        ].map(({ icon, label, href, onClick, iconBg, iconColor }, i) => (
          <motion.a
            key={i}
            whileTap={{ scale: 0.92 }}
            href={href ?? "#"}
            target={label === "WhatsApp" ? "_blank" : undefined}
            rel={label === "WhatsApp" ? "noopener noreferrer" : undefined}
            onClick={
              onClick
                ? (e) => {
                    e.preventDefault();
                    onClick();
                  }
                : undefined
            }
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 5,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: iconColor,
              }}
            >
              {icon}
            </div>
            <span
              style={{
                fontSize: 10,
                color: textMuted,
                letterSpacing: "0.02em",
              }}
            >
              {label}
            </span>
          </motion.a>
        ))}
      </motion.div>

      {/* ── CTA button ── */}
      <motion.div {...stagger(3)} style={{ padding: "16px 16px 0" }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSaveContact(data)}
          style={{
            width: "100%",
            padding: "13px 0",
            background: btnColor,
            borderRadius: 26,
            border: "none",
            fontSize: 14,
            fontWeight: 500,
            color: btnTextColor,
            cursor: "pointer",
            letterSpacing: "0.01em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
          }}
        >
          <FaRegSave size={14} />
          {data?.select || "Connect With Me"}
        </motion.button>
      </motion.div>

      {/* ── Social divider + icons ── */}
      {socials.length > 0 && (
        <>
          <motion.div
            {...stagger(4)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "20px 16px 0",
            }}
          >
            <div
              style={{ flex: 1, height: "0.5px", background: dividerColor }}
            />
            <span
              style={{
                fontSize: 10,
                color: textMuted,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              My Links
            </span>
            <div
              style={{ flex: 1, height: "0.5px", background: dividerColor }}
            />
          </motion.div>

          <motion.div
            {...stagger(5)}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
              padding: "14px 16px 0",
            }}
          >
            {socials.map(({ Icon, bg, link }, i) => (
              <motion.a
                key={i}
                whileTap={{ scale: 0.92 }}
                whileHover={{ y: -3 }}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                }}
              >
                <Icon size={20} color="#fff" />
              </motion.a>
            ))}
          </motion.div>
        </>
      )}

      {/* ── Contact info rows ── */}
      <motion.div {...stagger(6)} style={{ padding: "20px 16px 0" }}>
        <SectionLabel color={textMuted}>Contact Info</SectionLabel>
        <div
          style={{
            background: card,
            borderRadius: 14,
            border: `0.5px solid ${border}`,
            overflow: "hidden",
          }}
        >
          {hasPhone && (
            <InfoRow
              href={`tel:+${data.phone}`}
              iconBg={iconBgPhone}
              iconColor={iconColPhone}
              icon={<FiPhone size={14} />}
              label="Phone"
              value={data.phone}
              rowBorder={borderRow}
              textPrimary={textPrimary}
              textMuted={textMuted}
              isLast={!hasAddress}
            />
          )}

          {hasAddress && (
            <InfoRow
              href={mapsUrl}
              target="_blank"
              iconBg={iconBgAddr}
              iconColor={iconColAddr}
              icon={<FiMapPin size={14} />}
              label="Address"
              value="View on map"
              rowBorder={borderRow}
              textPrimary={textPrimary}
              textMuted={textMuted}
              isLast
            />
          )}
        </div>
      </motion.div>

      {/* ── Bio / About ── */}
      {hasBio && (
        <motion.div {...stagger(7)} style={{ padding: "18px 16px 0" }}>
          <SectionLabel color={textMuted}>About</SectionLabel>
          <div
            style={{
              background: card,
              border: `0.5px solid ${border}`,
              borderRadius: 14,
              padding: "14px 16px",
            }}
          >
            {data?.bio && (
              <p
                style={{
                  fontSize: 13,
                  fontStyle: "italic",
                  color: textPrimary,
                  lineHeight: 1.65,
                }}
              >
                "{capitalizeFirstWord(data.bio)}"
              </p>
            )}
            {data?.bio && data?.about && (
              <div
                style={{
                  height: "0.5px",
                  background: border,
                  margin: "10px 0",
                }}
              />
            )}
            {data?.about && (
              <p
                style={{ fontSize: 12, color: textSecondary, lineHeight: 1.7 }}
              >
                {capitalizeFirstWord(data.about)}
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Save contact (bottom) ── */}
      <motion.div {...stagger(8)} style={{ padding: "18px 16px 0" }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSaveContact(data)}
          style={{
            width: "100%",
            padding: "13px 0",
            background: card,
            border: `0.5px solid ${border}`,
            borderRadius: 13,
            fontSize: 13,
            fontWeight: 500,
            color: textPrimary,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
          }}
        >
          <FaRegSave size={13} />
          Save Contact
        </motion.button>
      </motion.div>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionLabel = ({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) => (
  <p
    style={{
      fontSize: 10,
      fontWeight: 500,
      color,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      marginBottom: 10,
    }}
  >
    {children}
  </p>
);

const InfoRow = ({
  href,
  target,
  iconBg,
  iconColor,
  icon,
  label,
  value,
  rowBorder,
  textPrimary,
  textMuted,
  isLast,
}: {
  href: string;
  target?: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  rowBorder: string;
  textPrimary: string;
  textMuted: string;
  isLast?: boolean;
}) => (
  <motion.a
    whileTap={{ scale: 0.99 }}
    href={href}
    target={target}
    rel={target === "_blank" ? "noopener noreferrer" : undefined}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "11px 14px",
      borderBottom: isLast ? "none" : `0.5px solid ${rowBorder}`,
      textDecoration: "none",
      background: "transparent",
    }}
  >
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 9,
        background: iconBg,
        color: iconColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <p
        style={{
          fontSize: 10,
          color: textMuted,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          marginBottom: 1,
        }}
      >
        {label}
      </p>
      <p style={{ fontSize: 13, color: textPrimary, fontWeight: 500 }}>
        {value}
      </p>
    </div>
    <span style={{ fontSize: 15, color: "#cccccc", lineHeight: 1 }}>›</span>
  </motion.a>
);

export default ThirdUI;
