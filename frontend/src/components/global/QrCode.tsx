import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import QRCodeStyling from "qr-code-styling";
import { motion, AnimatePresence } from "framer-motion";
import { FaDownload, FaTimes, FaUpload } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import toast from "react-hot-toast";

interface QRWithImageProps {
  qrUrl: string;
}

// ─── modal rendered into document.body via portal ─────────────────────────────
const ModalOverlay = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) =>
  createPortal(
    <motion.div
      key="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>,
    document.body,
  );

// ─── action button inside modal ───────────────────────────────────────────────
interface ModalBtnProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  variant: "blue" | "green" | "danger";
}

const ModalBtn = ({ onClick, icon, label, variant }: ModalBtnProps) => {
  const [hov, setHov] = useState(false);

  const styles = {
    blue: {
      bg: hov ? "rgba(37,99,235,0.85)" : "rgba(37,99,235,0.7)",
      border: "rgba(96,165,250,0.3)",
      color: "#fff",
    },
    green: {
      bg: hov ? "rgba(21,128,61,0.85)" : "rgba(21,128,61,0.7)",
      border: "rgba(74,222,128,0.3)",
      color: "#fff",
    },
    danger: {
      bg: hov ? "rgba(127,29,29,0.2)" : "transparent",
      border: "rgba(239,68,68,0.25)",
      color: "rgba(252,165,165,0.9)",
    },
  }[variant];

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "10px 16px",
        borderRadius: 12,
        border: `0.5px solid ${styles.border}`,
        background: styles.bg,
        color: styles.color,
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "'DM Sans', sans-serif",
        cursor: "pointer",
        transition: "background 0.15s",
      }}
    >
      {icon}
      {label}
    </motion.button>
  );
};

// ─── main component ───────────────────────────────────────────────────────────
const QRWithImage = ({ qrUrl }: QRWithImageProps) => {
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [logoName, setLogoName] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [btnHov, setBtnHov] = useState(false);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const qrPreviewRef = useRef<HTMLDivElement | null>(null);
  const circleImage = (src: string, size = 160): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0, size, size);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
      img.src = src;
    });
  };
  const generateQR = useCallback(() => {
    if (!qrPreviewRef.current) return;
    qrPreviewRef.current.innerHTML = "";

    qrCodeRef.current = new QRCodeStyling({
      width: 220,
      height: 220,
      data: qrUrl,
      image: logoUrl ?? undefined,
      margin: 4,
      qrOptions: { errorCorrectionLevel: "H" },
      imageOptions: logoUrl
        ? {
            crossOrigin: "anonymous",
            margin: 6,
            imageSize: 0.25,
            hideBackgroundDots: true,
          }
        : {},
      dotsOptions: { color: "#1a1a1a", type: "rounded" },
      cornersSquareOptions: { color: "#111", type: "extra-rounded" },
      cornersDotOptions: { color: "#111" },
      backgroundOptions: { color: "#ffffff" },
    });

    qrCodeRef.current.append(qrPreviewRef.current);
  }, [qrUrl, logoUrl]);

  useEffect(() => {
    if (showModal) generateQR();
  }, [showModal, generateQR]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoName(file.name);
    setLogoUrl(URL.createObjectURL(file));
  };

  const handleDownload = async () => {
    try {
      const circularLogo = logoUrl
        ? await circleImage(logoUrl, 160)
        : await circleImage("/elrateb.jpg", 160);

      const qrCode = new QRCodeStyling({
        width: 2048,
        height: 2048,
        data: qrUrl,
        margin: 20,
        dotsOptions: { color: "#4ade80", type: "extra-rounded" },
        cornersSquareOptions: { color: "#4ade80", type: "extra-rounded" },
        cornersDotOptions: { color: "#16a34a", type: "dot" },
        backgroundOptions: { color: "#0c0c10" },
        image: circularLogo,
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 12,
          imageSize: 0.3,
          saveAsBlob: true,
        },
        qrOptions: { errorCorrectionLevel: "H" },
      });

      qrCode.download({ name: "qr-code", extension: "svg" });
      toast.success("QR downloaded!");
      setShowModal(false);
    } catch {
      toast.error("Failed to generate QR code.");
    }
  };

  return (
    <>
      {/* trigger button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setShowModal(true)}
        onMouseEnter={() => setBtnHov(true)}
        onMouseLeave={() => setBtnHov(false)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "9px 0",
          borderRadius: 10,
          border: "0.5px solid rgba(255,255,255,0.12)",
          background: btnHov
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,255,255,0.04)",
          color: "rgba(255,255,255,0.65)",
          fontSize: 13,
          fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif",
          cursor: "pointer",
          transition: "background 0.15s",
        }}
      >
        <FiDownload size={13} />
        Download QR
      </motion.button>

      {/* hidden file input */}
      <input
        id="logoInput"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleLogoChange}
      />

      {/* modal */}
      <AnimatePresence>
        {showModal && (
          <ModalOverlay onClose={() => setShowModal(false)}>
            <div
              style={{
                width: "100%",
                maxWidth: 360,
                background: "rgba(15,15,18,0.97)",
                borderRadius: 20,
                border: "0.5px solid rgba(255,255,255,0.1)",
                overflow: "hidden",
                boxShadow: "0 32px 64px rgba(0,0,0,0.6)",
              }}
            >
              {/* modal header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 18px 14px",
                  borderBottom: "0.5px solid rgba(255,255,255,0.07)",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#fff",
                      fontFamily: "'Syne', sans-serif",
                    }}
                  >
                    QR Code
                  </p>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    Customize & download
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setShowModal(false)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.06)",
                    border: "0.5px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.5)",
                    cursor: "pointer",
                  }}
                >
                  <FaTimes size={11} />
                </motion.button>
              </div>

              {/* QR preview area */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "24px 0 20px",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    background: "#fff",
                    padding: 8,
                    boxShadow: "0 0 0 0.5px rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    ref={qrPreviewRef}
                    style={{ display: "flex", justifyContent: "center" }}
                  />
                </div>
              </div>

              {/* logo hint */}
              {logoName && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    margin: "0 18px 2px",
                    fontSize: 11,
                    color: "rgba(74,222,128,0.7)",
                    fontFamily: "'DM Mono', monospace",
                    textAlign: "center",
                  }}
                >
                  ✓ {logoName}
                </motion.p>
              )}

              {/* actions */}
              <div
                style={{
                  padding: "14px 18px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <ModalBtn
                  onClick={() => document.getElementById("logoInput")?.click()}
                  icon={<FaUpload size={11} />}
                  label={logoUrl ? "Change Logo" : "Upload Logo"}
                  variant="blue"
                />
                <ModalBtn
                  onClick={handleDownload}
                  icon={<FaDownload size={11} />}
                  label="Download QR Code"
                  variant="green"
                />
                <ModalBtn
                  onClick={() => setShowModal(false)}
                  icon={<FaTimes size={11} />}
                  label="Cancel"
                  variant="danger"
                />
              </div>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default QRWithImage;
