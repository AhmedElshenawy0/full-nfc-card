import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiMessageCircle } from "react-icons/fi";

type ShapeId = "medal" | "card" | "ring";

type ShapeItem = {
  id: ShapeId;
  title: string;
  blurb: string;
  accent: "purple" | "green";
  /** Drop a file in /public/images later, e.g. /images/nfc-medal.png */
  image?: string;
};

type ServiceItem = {
  id: "vCard" | "menu";
  kicker: string;
  title: string;
  description: string;
  bullets: string[];
  accent: "purple" | "green";
  image?: string;
};

const SHAPES: ShapeItem[] = [
  {
    id: "medal",
    title: "Medal",
    blurb: "A round NFC tag you wear or attach. One tap shares your profile or menu — no app needed.",
    accent: "purple",
  },
  {
    id: "card",
    title: "Card",
    blurb: "Wallet-size tap card. Hand it over like a business card; their phone opens your digital identity instantly.",
    accent: "green",
  },
  {
    id: "ring",
    title: "Ring",
    blurb: "NFC built into a wearable ring. Tap phones, posters, or readers without pulling anything out.",
    accent: "purple",
  },
];

const SERVICES: ServiceItem[] = [
  {
    id: "vCard",
    kicker: "Digital identity",
    title: "vCard",
    description:
      "Your living business card. Name, contacts, socials, and a save-to-phone action — all behind a single NFC tap.",
    bullets: [
      "Share contact details without typing",
      "Update your profile anytime — the tap stays the same",
      "Looks like a premium page, not a PDF",
    ],
    accent: "purple",
  },
  {
    id: "menu",
    kicker: "Hospitality",
    title: "Menu",
    description:
      "Guests tap the table tag and open a live flip-book menu. Swap dishes or prices from your dashboard — no reprinting.",
    bullets: [
      "Photo-rich pages that feel like a real menu",
      "Change items instantly across every table",
      "Works on any phone that can tap NFC",
    ],
    accent: "green",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

const HS_STYLES = `
  .hs-wrap {
    width: 100%;
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    gap: 36px;
  }
  .hs-head { text-align: center; margin-bottom: 20px; }
  .hs-kicker {
    margin: 0 0 8px;
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(167,139,250,0.75);
    font-family: "DM Mono", monospace;
  }
  .hs-title {
    margin: 0 0 8px;
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    font-family: Syne, sans-serif;
    letter-spacing: -0.4px;
  }
  .hs-sub {
    margin: 0 auto;
    font-size: 13px;
    line-height: 1.55;
    color: rgba(255,255,255,0.38);
    font-family: "DM Sans", sans-serif;
    max-width: 42ch;
  }
  .hs-shapes, .hs-services {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .hs-service-cta { margin-top: auto; }
  @keyframes nfc-pulse {
    0% { transform: scale(0.85); opacity: 0.7; }
    100% { transform: scale(1.35); opacity: 0; }
  }
  @media (min-width: 640px) {
    .hs-wrap { margin-top: 56px; gap: 48px; }
    .hs-title { font-size: 26px; }
    .hs-sub { font-size: 14px; max-width: 52ch; }
    .hs-shapes { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
    .hs-shape-visual { height: 108px !important; }
  }
  @media (min-width: 960px) {
    .hs-wrap { margin-top: 72px; gap: 64px; }
    .hs-head { margin-bottom: 28px; }
    .hs-title { font-size: 32px; letter-spacing: -0.6px; }
    .hs-services { grid-template-columns: 1fr 1fr; gap: 20px; }
    .hs-service-panel { padding: 28px !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    .hs-shape-visual { animation: none !important; }
  }
`;

const ACCENT = {
  purple: {
    border: "rgba(167,139,250,0.22)",
    borderHov: "rgba(167,139,250,0.45)",
    bg: "rgba(88,28,135,0.12)",
    glow: "rgba(167,139,250,0.18)",
    kicker: "rgba(192,132,252,0.85)",
    chip: "rgba(167,139,250,0.35)",
  },
  green: {
    border: "rgba(74,222,128,0.22)",
    borderHov: "rgba(74,222,128,0.45)",
    bg: "rgba(20,83,45,0.16)",
    glow: "rgba(74,222,128,0.16)",
    kicker: "rgba(134,239,172,0.9)",
    chip: "rgba(74,222,128,0.35)",
  },
};

const SectionHead = ({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle: string;
}) => (
  <div className="hs-head">
    <p className="hs-kicker">{kicker}</p>
    <h3 className="hs-title">{title}</h3>
    <p className="hs-sub">{subtitle}</p>
  </div>
);

const OptionalImage = ({
  src,
  alt,
  fallback,
}: {
  src?: string;
  alt: string;
  fallback: ReactNode;
}) => {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <>{fallback}</>;
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        display: "block",
      }}
    />
  );
};

const MedalArt = () => (
  <svg viewBox="0 0 120 120" width="88" height="88" aria-hidden>
    <defs>
      <radialGradient id="medal-face" cx="40%" cy="35%" r="70%">
        <stop offset="0%" stopColor="#c4b5fd" />
        <stop offset="55%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#3a0d4e" />
      </radialGradient>
    </defs>
    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(167,139,250,0.25)" strokeWidth="1.2" />
    <circle cx="60" cy="60" r="44" fill="url(#medal-face)" />
    <circle cx="60" cy="60" r="36" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.4" />
    <circle cx="60" cy="60" r="22" fill="rgba(26,8,36,0.55)" />
    <path
      d="M48 60c0-8 5.5-14 12-14s12 6 12 14-5.5 14-12 14"
      fill="none"
      stroke="#86efac"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M52 60c0-5 3.4-9 8-9s8 4 8 9"
      fill="none"
      stroke="#86efac"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <circle cx="60" cy="60" r="3" fill="#86efac" />
  </svg>
);

const CardArt = () => (
  <svg viewBox="0 0 140 88" width="108" height="68" aria-hidden>
    <defs>
      <linearGradient id="card-face" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#14532d" />
        <stop offset="100%" stopColor="#3a0d4e" />
      </linearGradient>
    </defs>
    <rect x="6" y="8" width="128" height="72" rx="12" fill="url(#card-face)" />
    <rect
      x="6"
      y="8"
      width="128"
      height="72"
      rx="12"
      fill="none"
      stroke="rgba(134,239,172,0.35)"
      strokeWidth="1.2"
    />
    <rect x="18" y="22" width="22" height="16" rx="3" fill="rgba(250,204,21,0.75)" />
    <path
      d="M108 28c4 0 7 3 7 7s-3 7-7 7"
      fill="none"
      stroke="#86efac"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M103 32c2.4 0 4 2 4 4.5S105.4 41 103 41"
      fill="none"
      stroke="#86efac"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <rect x="18" y="52" width="54" height="6" rx="3" fill="rgba(255,255,255,0.18)" />
    <rect x="18" y="64" width="32" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
  </svg>
);

const RingArt = () => (
  <svg viewBox="0 0 120 120" width="88" height="88" aria-hidden>
    <defs>
      <linearGradient id="ring-metal" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#e9d5ff" />
        <stop offset="45%" stopColor="#a78bfa" />
        <stop offset="100%" stopColor="#4c1d95" />
      </linearGradient>
    </defs>
    <ellipse cx="60" cy="62" rx="40" ry="16" fill="none" stroke="url(#ring-metal)" strokeWidth="14" />
    <ellipse cx="60" cy="62" rx="40" ry="16" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
    <rect x="52" y="42" width="16" height="12" rx="3" fill="#86efac" opacity="0.9" />
    <rect x="55" y="45" width="10" height="6" rx="1.5" fill="#14532d" />
    <circle cx="60" cy="48" r="18" fill="none" stroke="rgba(167,139,250,0.2)" strokeWidth="1" />
  </svg>
);

const SHAPE_ART: Record<ShapeId, ReactNode> = {
  medal: <MedalArt />,
  card: <CardArt />,
  ring: <RingArt />,
};

const ShapeTile = ({
  item,
  index,
}: {
  item: ShapeItem;
  index: number;
}) => {
  const [hov, setHov] = useState(false);
  const colors = ACCENT[item.accent];

  return (
    <motion.article
      className="hs-shape-tile"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 16,
        border: `0.5px solid ${hov ? colors.borderHov : colors.border}`,
        background: colors.bg,
        padding: "18px 16px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        textAlign: "center",
        height: "100%",
        boxShadow: hov ? `0 16px 36px ${colors.glow}` : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    >
      <motion.div
        className="hs-shape-visual"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4 + index * 0.4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          height: 92,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {item.id !== "card" && (
          <span
            style={{
              position: "absolute",
              width: 78,
              height: 78,
              borderRadius: "50%",
              border: `1px solid ${colors.chip}`,
              animation: "nfc-pulse 2.6s ease-out infinite",
              animationDelay: `${index * 0.35}s`,
              pointerEvents: "none",
            }}
          />
        )}
        <OptionalImage
          src={item.image}
          alt={item.title}
          fallback={SHAPE_ART[item.id]}
        />
      </motion.div>
      <h4
        style={{
          margin: 0,
          fontSize: 15,
          fontWeight: 600,
          color: "rgba(255,255,255,0.92)",
          fontFamily: "'Syne', sans-serif",
        }}
      >
        {item.title}
      </h4>
      <p
        style={{
          margin: 0,
          fontSize: 12,
          lineHeight: 1.55,
          color: "rgba(255,255,255,0.4)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {item.blurb}
      </p>
    </motion.article>
  );
};

const ServicePanel = ({
  item,
  index,
  whatsappNumber,
}: {
  item: ServiceItem;
  index: number;
  whatsappNumber: string;
}) => {
  const [hov, setHov] = useState(false);
  const colors = ACCENT[item.accent];

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello! I'm interested in the ${item.title} NFC service. Could you share options, pricing, and how to order?`,
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <motion.article
      className="hs-service-panel"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 18,
        border: `0.5px solid ${hov ? colors.borderHov : colors.border}`,
        background: colors.bg,
        padding: 20,
        boxShadow: hov ? `0 16px 40px ${colors.glow}` : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -20,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: colors.glow,
          filter: "blur(18px)",
          pointerEvents: "none",
        }}
      />
      {item.image && (
        <div style={{ height: 120, marginBottom: 14 }}>
          <OptionalImage src={item.image} alt={item.title} fallback={null} />
        </div>
      )}
      <p
        style={{
          margin: "0 0 6px",
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: colors.kicker,
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {item.kicker}
      </p>
      <h4
        style={{
          margin: "0 0 8px",
          fontSize: 20,
          fontWeight: 700,
          color: "#fff",
          fontFamily: "'Syne', sans-serif",
        }}
      >
        {item.title}
      </h4>
      <p
        style={{
          margin: "0 0 14px",
          fontSize: 13,
          lineHeight: 1.6,
          color: "rgba(255,255,255,0.42)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {item.description}
      </p>
      <ul
        style={{
          margin: "0 0 16px",
          padding: 0,
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          flex: 1,
        }}
      >
        {item.bullets.map((bullet) => (
          <li
            key={bullet}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
              fontSize: 12,
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.62)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <span
              style={{
                marginTop: 5,
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: colors.kicker,
                flexShrink: 0,
                boxShadow: `0 0 8px ${colors.kicker}`,
              }}
            />
            {bullet}
          </li>
        ))}
      </ul>
      <motion.button
        type="button"
        className="hs-service-cta"
        whileTap={{ scale: 0.97 }}
        onClick={openWhatsApp}
        style={{
          width: "100%",
          marginTop: "auto",
          padding: "11px 0",
          borderRadius: 12,
          border: `0.5px solid ${colors.borderHov}`,
          background: "rgba(0,0,0,0.18)",
          color: colors.kicker,
          fontSize: 13,
          fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <FiMessageCircle size={14} />
        Ask about {item.title}
        <FiArrowRight size={13} />
      </motion.button>
    </motion.article>
  );
};

export const HomeShowcase = ({ whatsappNumber }: { whatsappNumber: string }) => (
  <section className="hs-wrap">
    <style>{HS_STYLES}</style>

    <div>
      <SectionHead
        kicker="Hardware"
        title="NFC in every shape"
        subtitle="Medal, card, or ring — same tap, same instant open. Built-in chip, no charging, no app install."
      />
      <div className="hs-shapes">
        {SHAPES.map((item, index) => (
          <ShapeTile key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>

    <div>
      <SectionHead
        kicker="What it opens"
        title="vCard & Menu"
        subtitle="The tag is just the key. Behind it: a profile people save, or a menu that never goes out of date."
      />
      <div className="hs-services">
        {SERVICES.map((item, index) => (
          <ServicePanel
            key={item.id}
            item={item}
            index={index}
            whatsappNumber={whatsappNumber}
          />
        ))}
      </div>
    </div>
  </section>
);
