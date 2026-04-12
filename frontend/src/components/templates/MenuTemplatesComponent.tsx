import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud, FiX, FiCheck, FiImage } from "react-icons/fi";
import toast from "react-hot-toast";
import { CustomError } from "../../types/types";
import { useCreateSoldServiceMutation } from "../../store/apiSlice/Soldslice";
import BtnSnipper from "../global/BtnSnipper";

// ─── small reusable button ────────────────────────────────────────────────────
interface GhostBtnProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "danger" | "neutral";
}

const GhostBtn = ({
  onClick,
  children,
  variant = "neutral",
}: GhostBtnProps) => {
  const [hov, setHov] = useState(false);
  const isDanger = variant === "danger";
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px",
        borderRadius: 8,
        border: `0.5px solid ${isDanger ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)"}`,
        background: hov
          ? isDanger
            ? "rgba(127,29,29,0.4)"
            : "rgba(255,255,255,0.08)"
          : isDanger
            ? "rgba(127,29,29,0.2)"
            : "rgba(255,255,255,0.04)",
        color: isDanger ? "rgba(252,165,165,0.9)" : "rgba(255,255,255,0.5)",
        cursor: "pointer",
        transition: "background 0.15s, border-color 0.15s",
      }}
    >
      {children}
    </button>
  );
};

// ─── image thumbnail card ─────────────────────────────────────────────────────
const ThumbCard = ({
  file,
  index,
  onDelete,
}: {
  file: File;
  index: number;
  onDelete: (i: number) => void;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.85 }}
    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    style={{
      position: "relative",
      width: "calc(50% - 6px)",
      aspectRatio: "1 / 1",
      borderRadius: 14,
      overflow: "hidden",
      border: "0.5px solid rgba(255,255,255,0.1)",
      flexShrink: 0,
    }}
  >
    <img
      src={URL.createObjectURL(file)}
      alt={`Preview ${index}`}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
      }}
    />
    {/* overlay on hover */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)",
        pointerEvents: "none",
      }}
    />
    {/* filename */}
    <p
      style={{
        position: "absolute",
        bottom: 28,
        left: 8,
        margin: 0,
        fontSize: 10,
        color: "rgba(255,255,255,0.55)",
        fontFamily: "'DM Mono', monospace",
        maxWidth: "80%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        pointerEvents: "none",
      }}
    >
      {file.name}
    </p>
    {/* delete btn */}
    <div style={{ position: "absolute", bottom: 6, right: 6 }}>
      <GhostBtn onClick={() => onDelete(index)} variant="danger">
        <FiX size={12} />
      </GhostBtn>
    </div>
  </motion.div>
);

// ─── main component ───────────────────────────────────────────────────────────
const MenuTemplatesComponent: React.FC = () => {
  const navigate = useNavigate();
  const [menuImages, setMenuImages] = useState<File[]>([]);
  const [uniqueCode, setUniqueCode] = useState<string>("");
  const [inputFocused, setInputFocused] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [searchParams] = useSearchParams();
  const service_type = searchParams.get("service-type");

  const [createSoldService, { isLoading, isError, isSuccess, error, data }] =
    useCreateSoldServiceMutation();

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    setMenuImages((prev) => [...prev, ...Array.from(files)]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleDeleteImage = (index: number) => {
    setMenuImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!service_type) {
      toast.error("No service type provided");
      return;
    }
    const formData = new FormData();
    formData.append("type", service_type);
    formData.append("uniqueCode", uniqueCode);
    formData.append("vCardUi", "");
    menuImages.forEach((file) => formData.append("files", file));
    try {
      await createSoldService(formData).unwrap();
    } catch (err) {
      console.error("Error creating service:", err);
    }
  };

  const customError = error as CustomError;

  useEffect(() => {
    if (isError && customError?.data?.message)
      toast.error(customError.data.message);
    else if (isSuccess) {
      toast.success("Menu created successfully!");
      navigate("/client-dashboard");
    }
  }, [isError, isSuccess, error, data]);

  const canSubmit = menuImages.length > 0 && uniqueCode.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        width: "100%",
      }}
    >
      {/* ── upload zone ── */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          borderRadius: 16,
          border: `1.5px dashed ${dragOver ? "rgba(167,139,250,0.6)" : "rgba(167,139,250,0.25)"}`,
          background: dragOver
            ? "rgba(88,28,135,0.15)"
            : "rgba(88,28,135,0.07)",
          padding: "28px 20px",
          textAlign: "center",
          cursor: "pointer",
          transition: "border-color 0.2s, background 0.2s",
          position: "relative",
        }}
      >
        <label htmlFor="image" style={{ cursor: "pointer", display: "block" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "rgba(167,139,250,0.12)",
              border: "0.5px solid rgba(167,139,250,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            <FiUploadCloud size={20} color="rgba(192,132,252,0.85)" />
          </div>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: 14,
              fontWeight: 500,
              color: "rgba(255,255,255,0.8)",
            }}
          >
            {dragOver ? "Drop images here" : "Click or drag to upload"}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "rgba(255,255,255,0.3)",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            PNG, JPG, WEBP · max 3 MB each
          </p>
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
      </div>

      {/* ── image grid ── */}
      <AnimatePresence>
        {menuImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}
          >
            {/* header row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <FiImage size={13} color="rgba(255,255,255,0.35)" />
                <span
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.35)",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {menuImages.length} image{menuImages.length !== 1 ? "s" : ""}
                </span>
              </div>
              <GhostBtn onClick={() => setMenuImages([])} variant="danger">
                <FiX size={12} />
              </GhostBtn>
            </div>

            {/* thumbnails */}
            <motion.div
              layout
              style={{ display: "flex", flexWrap: "wrap", gap: 12 }}
            >
              <AnimatePresence>
                {menuImages.map((file, i) => (
                  <ThumbCard
                    key={`${file.name}-${i}`}
                    file={file}
                    index={i}
                    onDelete={handleDeleteImage}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── unique code input ── */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
            marginBottom: 8,
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Unique Code
        </label>
        <input
          type="text"
          value={uniqueCode}
          onChange={(e) => setUniqueCode(e.target.value)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          placeholder="Enter your unique code…"
          style={{
            width: "100%",
            padding: "11px 14px",
            borderRadius: 12,
            border: `0.5px solid ${inputFocused ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.1)"}`,
            background: inputFocused
              ? "rgba(88,28,135,0.12)"
              : "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.85)",
            fontSize: 14,
            fontFamily: "'DM Sans', sans-serif",
            outline: "none",
            transition: "border-color 0.2s, background 0.2s",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* ── submit ── */}
      <AnimatePresence>
        {menuImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={!canSubmit || isLoading}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px 24px",
                borderRadius: 14,
                border: canSubmit
                  ? "0.5px solid rgba(74,222,128,0.3)"
                  : "0.5px solid rgba(255,255,255,0.08)",
                background: canSubmit
                  ? "rgba(20,83,45,0.45)"
                  : "rgba(255,255,255,0.04)",
                color: canSubmit
                  ? "rgba(134,239,172,0.95)"
                  : "rgba(255,255,255,0.25)",
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                cursor: canSubmit ? "pointer" : "not-allowed",
                transition: "background 0.2s, border-color 0.2s, color 0.2s",
              }}
            >
              {isLoading ? (
                <BtnSnipper />
              ) : (
                <>
                  <FiCheck size={15} />
                  Confirm & Create Menu
                </>
              )}
            </motion.button>

            {!uniqueCode.trim() && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  margin: "8px 0 0",
                  textAlign: "center",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.25)",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                Enter your unique code to enable submission
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MenuTemplatesComponent;
