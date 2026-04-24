import { useSearchParams } from "react-router-dom";
import "../../index.css";
import { useGetOneSoldServicesQuery } from "../../store/apiSlice/Soldslice";
import Snipper from "../../components/global/Snipper";
import { useState } from "react";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useSwipe } from "../../hooks/useSwipe";
import HTMLFlipBook from "react-pageflip";

// ─── Lightbox ─────────────────────────────────────────────────
const Lightbox = ({ images, index, onClose }) => {
  const swipe = useSwipe(
    () => {}, // مش محتاج next هنا
    () => {},
  );

  const width = window.innerWidth;
  const height = window.innerHeight;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.97)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onTouchStart={swipe.onTouchStart}
      onTouchEnd={swipe.onTouchEnd}
    >
      {/* top bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 16px",
          background: "linear-gradient(to bottom,rgba(0,0,0,0.7),transparent)",
          zIndex: 10002,
        }}
      >
        {/* <span style={{ color: "#fff", fontSize: 12 }}>Flip Mode</span> */}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <FiX size={20} color="#fff" />
        </button>
      </div>

      {/* ✅ Flipbook fullscreen */}
      <div onClick={(e) => e.stopPropagation()}>
        <HTMLFlipBook
          width={width}
          height={height}
          size="stretch"
          minWidth={300}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1500}
          drawShadow
          flippingTime={700}
          startPage={index} // 🔥 يبدأ من الصورة اللي ضغطت عليها
          useMouseEvents
          mobileScrollSupport
          showCover={false}
        >
          {images.map((src, i) => (
            <div key={i} style={{ width: "100%", height: "100%" }}>
              <img
                src={src}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          ))}
        </HTMLFlipBook>
      </div>
    </motion.div>,
    document.body,
  );
};
// ─── Flipbook ─────────────────────────────────────────────────
const Flipbook = ({ images, onZoom, onFlip }) => {
  const width = Math.min(window.innerWidth * 0.9, 420);
  const height = width * 1.4;

  return (
    <HTMLFlipBook
      width={width}
      height={height}
      showCover={false}
      drawShadow
      flippingTime={700}
      onFlip={(e) => onFlip(e.data)}
    >
      {images.map((src, i) => (
        <div
          key={i}
          style={{ position: "relative", width: "100%", height: "100%" }}
        >
          <img
            src={src}
            onClick={() => onZoom(i)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              cursor: "zoom-in",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
            }}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onZoom(i);
            }}
            style={{ position: "absolute", top: 10, right: 10 }}
          >
            🔍
          </button>
        </div>
      ))}
    </HTMLFlipBook>
  );
};

// ─── Main ─────────────────────────────────────────────────
const MenuTemplate = () => {
  const [searchParams] = useSearchParams();
  const [previewIndex, setPreviewIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // ← track current page

  const id = searchParams.get("id");
  const { data, isLoading } = useGetOneSoldServicesQuery(id);
  const images = data?.soldServices?.menuUpdatableContent ?? [];

  const close = () => setPreviewIndex(null);
  const prev = () =>
    setPreviewIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setPreviewIndex((i) => (i + 1) % images.length);

  if (isLoading) return <Snipper />;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0c",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* counter */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(255,255,255,0.08)",
          border: "0.5px solid rgba(255,255,255,0.15)",
          borderRadius: 99,
          padding: "6px 14px",
        }}
      >
        {images.length <= 8 && (
          <div style={{ display: "flex", gap: 3 }}>
            {images.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === currentPage ? 14 : 5,
                  height: 5,
                  borderRadius: 99,
                  background:
                    i === currentPage
                      ? "rgba(255,255,255,0.9)"
                      : "rgba(255,255,255,0.25)",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        )}
        <span
          style={{
            fontSize: 12,
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          {currentPage + 1}
          <span style={{ color: "rgba(255,255,255,0.3)", margin: "0 3px" }}>
            of
          </span>
          {images.length}
        </span>
      </div>

      <Flipbook
        images={images}
        onZoom={setPreviewIndex}
        onFlip={setCurrentPage} // ← pass flip handler
      />

      <AnimatePresence>
        {previewIndex !== null && (
          <Lightbox images={images} index={previewIndex} onClose={close} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuTemplate;
