import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaTiktok,
} from "react-icons/fa";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiMessageSquare,
  FiUserPlus,
} from "react-icons/fi";
import { FaRegSave } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { isDark } from "../../utils/colorBritness";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
  name?: string;
  job?: string;
  company?: string;
  bio?: string;
  about?: string;
  phone?: string;
  email?: string;
  image?: string; // profile / avatar photo
  coverImage?: string; // wide background photo
  select?: string; // CTA button label
  mainBackground?: string;
  buttonBackground?: string;
  skills?: string[];
}

// ─── Component ───────────────────────────────────────────────────────────────

const ThirdUITest = ({
  formData,
  tempButtonBackground,
  tempMainBackground,
}: {
  formData: FormData;
  tempMainBackground?: string;
  tempButtonBackground?: string;
}) => {
  const mainBg = tempMainBackground || formData?.mainBackground || "#ffffff";
  const btnColor =
    tempButtonBackground || formData?.buttonBackground || "#111111";

  const isLight = !isDark(mainBg);

  const surface = isLight ? "#f8f8f8" : "#0f0f0f";
  const card = isLight ? "#ffffff" : "#1a1a1a";
  const border = isLight ? "#eeeeee" : "#2a2a2a";
  const borderRow = isLight ? "#f5f5f5" : "#222222";
  const textPrimary = isLight ? "#111111" : "#f1f5f9";
  const textSecondary = isLight ? "#555555" : "#94a3b8";
  const textMuted = isLight ? "#bbbbbb" : "#475569";
  const actionIconBg = isLight ? "#f0f0f0" : "#1e1e1e";
  const actionIconBorder = isLight ? "#e0e0e0" : "#2e2e2e";
  const dividerColor = isLight ? "#e8e8e8" : "#222222";
  const btnText = isDark(btnColor) ? "#ffffff" : "#111111";

  const hasBio = !!(formData?.bio || formData?.about);
  const hasSkills =
    Array.isArray(formData?.skills) && formData.skills.length > 0;

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.08 + i * 0.06, duration: 0.38, ease: "easeOut" },
  });

  return (
    <div
      className="w-full max-w-lg mx-auto min-h-screen pb-8"
      style={{
        background: surface,
        fontFamily:
          "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
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
        {formData?.coverImage ? (
          <img
            src={formData.coverImage}
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
          // Fallback gradient if no cover image
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
          marginTop: -46,
          position: "relative",
          zIndex: 2,
        }}
      >
        {formData?.image ? (
          <img
            src={formData.image}
            alt={formData.name || "Profile"}
            style={{
              width: 92,
              height: 92,
              borderRadius: "50%",
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
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 600,
              color: "#fff",
            }}
          >
            {formData?.name?.charAt(0) ?? "?"}
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
          {formData?.name && (
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: textPrimary,
                letterSpacing: "-0.3px",
              }}
            >
              {formData.name}
            </span>
          )}
          {/* Verified tick */}
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

        {(formData?.job || formData?.company) && (
          <p
            style={{
              fontSize: 12,
              color: textMuted,
              marginTop: 3,
              letterSpacing: "0.01em",
            }}
          >
            {[formData.job, formData.company].filter(Boolean).join(" · ")}
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
            href: formData?.phone ? `tel:${formData.phone}` : "#",
          },
          {
            icon: <FiMail size={18} />,
            label: "Email",
            href: formData?.email ? `mailto:${formData.email}` : "#",
          },
          { icon: <FiMessageSquare size={18} />, label: "Message", href: "#" },
          { icon: <FiUserPlus size={18} />, label: "Add", href: "#" },
        ].map(({ icon, label, href }, i) => (
          <motion.a
            key={i}
            whileTap={{ scale: 0.92 }}
            href={href}
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
                background: actionIconBg,
                border: `0.5px solid ${actionIconBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: textPrimary,
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
          style={{
            width: "100%",
            padding: "13px 0",
            background: btnColor,
            borderRadius: 26,
            border: "none",
            fontSize: 14,
            fontWeight: 500,
            color: btnText,
            cursor: "pointer",
            letterSpacing: "0.01em",
          }}
        >
          {formData?.select || "Connect With Me"}
        </motion.button>
      </motion.div>

      {/* ── Social divider ── */}
      <motion.div
        {...stagger(4)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "20px 16px 0",
        }}
      >
        <div style={{ flex: 1, height: "0.5px", background: dividerColor }} />
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
        <div style={{ flex: 1, height: "0.5px", background: dividerColor }} />
      </motion.div>

      {/* ── Social icons ── */}
      <motion.div
        {...stagger(5)}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          padding: "14px 16px 0",
        }}
      >
        {[
          { Icon: FaInstagram, bg: "#E1306C" },
          { Icon: FaFacebook, bg: "#1877f2" },
          { Icon: FaTwitter, bg: "#1da1f2" },
          { Icon: FaLinkedin, bg: "#0077b5" },
          { Icon: FaTiktok, bg: "#010101" },
        ].map(({ Icon, bg }, i) => (
          <motion.a
            key={i}
            whileTap={{ scale: 0.92 }}
            href="#"
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
          {formData?.phone && (
            <InfoRow
              href={`tel:${formData.phone}`}
              iconBg="#eff6ff"
              iconColor="#3b82f6"
              icon={<FiPhone size={14} />}
              label="Phone"
              value={formData.phone}
              rowBorder={borderRow}
              textPrimary={textPrimary}
              textMuted={textMuted}
              isLast={!formData?.email}
            />
          )}
          {formData?.email && (
            <InfoRow
              href={`mailto:${formData.email}`}
              iconBg="#f0fdf4"
              iconColor="#22c55e"
              icon={<FiMail size={14} />}
              label="Email"
              value={formData.email}
              rowBorder={borderRow}
              textPrimary={textPrimary}
              textMuted={textMuted}
              isLast={false}
            />
          )}
          <InfoRow
            href="#"
            iconBg="#fdf4ff"
            iconColor="#a855f7"
            icon={<FiMapPin size={14} />}
            label="Location"
            value="View on map"
            rowBorder={borderRow}
            textPrimary={textPrimary}
            textMuted={textMuted}
            isLast
          />
        </div>
      </motion.div>

      {/* ── Skills / Tags ── */}
      {hasSkills && (
        <motion.div {...stagger(7)} style={{ padding: "18px 16px 0" }}>
          <SectionLabel color={textMuted}>Expertise</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {(formData.skills ?? []).map((skill, i) => (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  padding: "5px 11px",
                  borderRadius: 7,
                  background: card,
                  color: textSecondary,
                  border: `0.5px solid ${border}`,
                  letterSpacing: "0.01em",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Bio / About ── */}
      {hasBio && (
        <motion.div {...stagger(8)} style={{ padding: "18px 16px 0" }}>
          <SectionLabel color={textMuted}>About</SectionLabel>
          <div
            style={{
              background: card,
              border: `0.5px solid ${border}`,
              borderRadius: 14,
              padding: "14px 16px",
            }}
          >
            {formData?.bio && (
              <p
                style={{
                  fontSize: 13,
                  fontStyle: "italic",
                  color: textPrimary,
                  lineHeight: 1.65,
                }}
              >
                "{formData.bio}"
              </p>
            )}
            {formData?.bio && formData?.about && (
              <div
                style={{
                  height: "0.5px",
                  background: border,
                  margin: "10px 0",
                }}
              />
            )}
            {formData?.about && (
              <p
                style={{ fontSize: 12, color: textSecondary, lineHeight: 1.7 }}
              >
                {formData.about}
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Save button (bottom) ── */}
      <motion.div {...stagger(9)} style={{ padding: "18px 16px 0" }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
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
          Save to contacts
        </motion.button>
      </motion.div>

      {/* ── Footer ── */}
      {formData?.company && (
        <div style={{ textAlign: "center", padding: "18px 0 4px" }}>
          <span
            style={{ fontSize: 10, color: textMuted, letterSpacing: "0.05em" }}
          >
            vcard · {formData.company.toLowerCase().replace(/\s/g, "")}.com
          </span>
        </div>
      )}
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

export default ThirdUITest;
