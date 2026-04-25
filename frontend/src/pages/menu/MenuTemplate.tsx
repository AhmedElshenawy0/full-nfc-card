import { useSearchParams } from "react-router-dom";
import "../../index.css";
import { useGetOneSoldServicesQuery } from "../../store/apiSlice/Soldslice";
import Snipper from "../../components/global/Snipper";
import { useState, useEffect } from "react";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useSwipe } from "../../hooks/useSwipe";
import HTMLFlipBook from "react-pageflip";
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
          className=""
        >
          <img
            src={src}
            onClick={() => onZoom(i)}
            style={{
              width: "100%",
              height: "100%",
              // objectFit: "", // ← full image always visible
              objectPosition: "center",
              backgroundColor: "#000", // fills empty space around it
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
// ─── Lightbox ─────────────────────────────────────────────────
const Lightbox = ({ images, index, onClose }) => {
  const swipe = useSwipe(
    () => {},
    () => {},
  );

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { width, height } = dimensions;

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
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "scroll",
        // height: "100%",
      }}
      onTouchStart={swipe.onTouchStart}
      onTouchEnd={swipe.onTouchEnd}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100vw", height: "100vh" }}
      >
        <HTMLFlipBook
          width={width}
          height={height}
          size="stretch"
          minWidth={300}
          maxWidth={width}
          minHeight={400}
          maxHeight={height}
          drawShadow={false}
          flippingTime={700}
          startPage={index}
          useMouseEvents
          mobileScrollSupport
          showCover={false}
          style={{ margin: 0, padding: 0 }}
        >
          {images.map((src, i) => (
            <div key={i} style={{ width, height, overflow: "scroll" }}>
              <img
                src={src}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  // objectFit: "contain",
                  background: "#000",
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
      className=""
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

      <Lightbox images={images} index={previewIndex} onClose={close} />

      <AnimatePresence>
        {previewIndex !== null && (
          <Lightbox images={images} index={previewIndex} onClose={close} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuTemplate;
