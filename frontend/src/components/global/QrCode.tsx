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

const QRWithImage = ({ qrUrl }: QRWithImageProps) => {
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [logoName, setLogoName] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [btnHov, setBtnHov] = useState(false);
  const qrPreviewRef = useRef<HTMLDivElement | null>(null);
  const qrInstanceRef = useRef<QRCodeStyling | null>(null);

  // build QR config
  const buildQR = useCallback(
    (size: number, logo?: string) =>
      new QRCodeStyling({
        width: size,
        height: size,
        data: qrUrl,
        margin: size === 220 ? 4 : 20,
        image: logo,
        qrOptions: { errorCorrectionLevel: "H" },
        imageOptions: logo
          ? {
              crossOrigin: "anonymous",
              margin: size === 220 ? 6 : 12,
              imageSize: 0.5,
              hideBackgroundDots: true,
              saveAsBlob: true,
            }
          : {},
        dotsOptions: { color: "#4ade80", type: "extra-rounded" },
        cornersSquareOptions: { color: "#4ade80", type: "extra-rounded" },
        cornersDotOptions: { color: "#16a34a", type: "dot" },
        backgroundOptions: { color: "#0c0c10" },
      }),
    [qrUrl],
  );

  // render preview
  const [logoBase64, setLogoBase64] = useState<string | undefined>(undefined);
  const generatePreview = useCallback(() => {
    if (!qrPreviewRef.current) return;
    qrPreviewRef.current.innerHTML = "";
    const qr = buildQR(220, logoBase64);
    qrInstanceRef.current = qr;
    qr.append(qrPreviewRef.current);
  }, [buildQR, logoBase64]);
  useEffect(() => {
    if (showModal) generatePreview();
  }, [showModal, generatePreview]);

  // re-render preview when logo changes
  useEffect(() => {
    if (showModal && qrPreviewRef.current) generatePreview();
  }, [logoBase64]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoName(file.name);
    setLogoUrl(URL.createObjectURL(file)); // for preview display

    // convert to base64 immediately using FileReader
    const reader = new FileReader();
    reader.onload = () => {
      setLogoBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = async () => {
    try {
      console.log("1. Starting download...");
      console.log("2. logoBase64 exists:", !!logoBase64);
      console.log("3. qrUrl:", qrUrl);

      const size = 1024;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;

      const qrNoLogo = new QRCodeStyling({
        width: size,
        height: size,
        data: qrUrl,
        margin: 20,
        dotsOptions: { color: "#4ade80", type: "extra-rounded" },
        cornersSquareOptions: { color: "#4ade80", type: "extra-rounded" },
        cornersDotOptions: { color: "#16a34a", type: "dot" },
        backgroundOptions: { color: "#0c0c10" },
        qrOptions: { errorCorrectionLevel: "H" },
      });

      console.log("4. Getting QR raw data...");
      const qrBlob = await qrNoLogo.getRawData("png");
      console.log("5. qrBlob:", qrBlob);

      if (!qrBlob) throw new Error("Failed to get QR data");

      const qrBlobUrl = URL.createObjectURL(qrBlob as Blob);
      console.log("6. qrBlobUrl:", qrBlobUrl);

      await new Promise<void>((resolve, reject) => {
        const qrImg = new Image();
        qrImg.onload = () => {
          console.log("7. QR image loaded successfully");
          ctx.drawImage(qrImg, 0, 0, size, size);
          URL.revokeObjectURL(qrBlobUrl);
          resolve();
        };
        qrImg.onerror = (err) => {
          console.log("7. QR image FAILED to load:", err);
          reject(err);
        };
        qrImg.src = qrBlobUrl;
      });

      if (logoBase64) {
        console.log("8. Drawing logo...");
        await new Promise<void>((resolve, reject) => {
          const logoImg = new Image();
          logoImg.onload = () => {
            console.log("9. Logo loaded successfully");
            const logoSize = size * 0.3;
            const logoX = (size - logoSize) / 2;
            const logoY = (size - logoSize) / 2;
            const radius = logoSize / 2;
            ctx.save();
            ctx.beginPath();
            ctx.arc(
              logoX + radius,
              logoY + radius,
              radius + 20,
              0,
              Math.PI * 2,
            );
            ctx.fillStyle = "#0c0c10";
            ctx.fill();
            ctx.restore();
            ctx.save();
            ctx.beginPath();
            ctx.arc(logoX + radius, logoY + radius, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
            ctx.restore();
            resolve();
          };
          logoImg.onerror = (err) => {
            console.log("9. Logo FAILED to load:", err);
            reject(err);
          };
          logoImg.src = logoBase64;
        });
      } else {
        console.log("8. No logo provided, skipping...");
      }

      console.log("10. Creating download link...");
      const link = document.createElement("a");
      link.download = "qr-code.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      console.log("11. Download triggered!");

      toast.success("QR downloaded!");
      setShowModal(false);
    } catch (err) {
      console.error("DOWNLOAD ERROR:", err);
      toast.error("Failed to generate QR code.");
    }
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
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

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleLogoChange}
      />

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
              {/* header */}
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

              {/* QR preview */}
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
                    padding: 8,
                    background: "#0c0c10",
                    boxShadow: "0 0 0 0.5px rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    ref={qrPreviewRef}
                    style={{ display: "flex", justifyContent: "center" }}
                  />
                </div>
              </div>

              {/* logo name */}
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
                  onClick={() => fileInputRef.current?.click()}
                  icon={<FaUpload size={11} />}
                  label={logoUrl ? "Change Logo" : "Upload Logo (optional)"}
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
