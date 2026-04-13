import { useSearchParams } from "react-router-dom";
import "../../index.css";
import { useGetOneSoldServicesQuery } from "../../store/apiSlice/Soldslice";
import Snipper from "../../components/global/Snipper";
import { useState, useRef } from "react";
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiZoomIn,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useSwipe } from "../../hooks/useSwipe";

// ─── lightbox ─────────────────────────────────────────────────────────────────
const Lightbox = ({
  image,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  image: string;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) => {
  const swipe = useSwipe(onNext, onPrev); // swipe left → next, swipe right → prev

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.97)",
        backdropFilter: "blur(12px)",
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
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
          zIndex: 10001,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.4)",
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.1em",
          }}
        >
          {index + 1} / {total}
        </span>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onClose}
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.1)",
            border: "0.5px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.8)",
            cursor: "pointer",
          }}
        >
          <FiX size={16} />
        </motion.button>
      </div>

      {/* image */}
      <motion.img
        key={image}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        src={image}
        alt={`Menu page ${index + 1}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "100vw",
          maxHeight: "100vh",
          objectFit: "contain",
          display: "block",
        }}
      />

      {/* nav arrows */}
      {total > 1 && (
        <>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            style={{
              position: "fixed",
              left: 12,
              top: "50%",
              // transform: "translateY(-50%)",
              width: 42,
              height: 42,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.08)",
              border: "0.5px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              zIndex: 10001,
            }}
          >
            <FiChevronLeft size={20} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            style={{
              position: "fixed",
              right: 12,
              top: "50%",
              // transform: "translateY(-50%)",
              width: 42,
              height: 42,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.08)",
              border: "0.5px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              zIndex: 10001,
            }}
          >
            <FiChevronRight size={20} />
          </motion.button>
        </>
      )}

      {/* dot indicators */}
      {total > 1 && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 6,
            zIndex: 10001,
          }}
        >
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === index ? 20 : 6,
                height: 6,
                borderRadius: 99,
                background:
                  i === index
                    ? "rgba(255,255,255,0.85)"
                    : "rgba(255,255,255,0.2)",
                transition: "all 0.25s",
              }}
            />
          ))}
        </div>
      )}
    </motion.div>,
    document.body,
  );
};
// ─── thumbnail strip ──────────────────────────────────────────────────────────
const ThumbnailStrip = ({
  images,
  activeIndex,
  onSelect,
}: {
  images: string[];
  activeIndex: number;
  onSelect: (i: number) => void;
}) => {
  const stripRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={stripRef}
      style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        padding: "12px 16px",
        scrollbarWidth: "none",
        borderTop: "0.5px solid rgba(255,255,255,0.07)",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(16px)",
      }}
    >
      {images.map((img, i) => (
        <motion.div
          key={i}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            onSelect(i);
            const el = stripRef.current?.children[i] as HTMLElement;
            el?.scrollIntoView({
              behavior: "smooth",
              inline: "center",
              block: "nearest",
            });
          }}
          style={{
            flexShrink: 0,
            width: 52,
            height: 52,
            borderRadius: 10,
            overflow: "hidden",
            cursor: "pointer",
            border: `1.5px solid ${i === activeIndex ? "rgba(74,222,128,0.7)" : "rgba(255,255,255,0.1)"}`,
            opacity: i === activeIndex ? 1 : 0.45,
            transition: "border-color 0.2s, opacity 0.2s",
          }}
        >
          <img
            src={img}
            alt={`thumb ${i + 1}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </motion.div>
      ))}
    </div>
  );
};

// ─── single menu page ─────────────────────────────────────────────────────────
const MenuPage = ({
  image,
  index,
  total,
  onZoom,
  pageRef,
}: {
  image: string;
  index: number;
  total: number;
  onZoom: () => void;
  pageRef: (el: HTMLDivElement | null) => void;
}) => (
  <motion.div
    ref={pageRef}
    // initial={{ opacity: 0, y: 20 }}
    // whileInView={{ opacity: 1, y: 0 }}
    // viewport={{ once: true, margin: "-40px" }}
    // transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    style={{ position: "relative", width: "100%" }}
  >
    {/* page label */}
    <div
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 3,
        fontSize: 10,
        fontFamily: "'DM Mono', monospace",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: "3px 10px",
        borderRadius: 99,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(6px)",
        color: "rgba(255,255,255,0.45)",
        border: "0.5px solid rgba(255,255,255,0.1)",
      }}
    >
      Image {index + 1}
    </div>

    {/* zoom btn */}
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onZoom}
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 3,
        width: 34,
        height: 34,
        borderRadius: 9,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(6px)",
        border: "0.5px solid rgba(255,255,255,0.12)",
        color: "rgba(255,255,255,0.6)",
        cursor: "pointer",
      }}
    >
      <FiZoomIn size={14} />
    </motion.button>

    {/* full-width image */}
    <img
      src={image}
      alt={`Menu page ${index + 1}`}
      loading="lazy"
      onClick={onZoom}
      style={{
        width: "100%",
        display: "block",
        objectFit: "cover",
        cursor: "zoom-in",
      }}
    />

    {/* separator */}
    {index < total - 1 && (
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
        }}
      />
    )}
  </motion.div>
);

// ─── main ─────────────────────────────────────────────────────────────────────
const MenuTemplate: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [activeThumb, setActiveThumb] = useState(0);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const id = searchParams.get("id");
  const { data: response, isLoading } = useGetOneSoldServicesQuery(id);
  const menuService = response?.soldServices;
  const images: string[] = menuService?.menuUpdatableContent ?? [];

  const openLightbox = (index: number) => setPreviewIndex(index);
  const closeLightbox = () => setPreviewIndex(null);
  const goPrev = () =>
    setPreviewIndex((i) => ((i ?? 0) - 1 + images.length) % images.length);
  const goNext = () => setPreviewIndex((i) => ((i ?? 0) + 1) % images.length);

  const scrollToPage = (index: number) => {
    setActiveThumb(index);
    pageRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (!id)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(252,165,165,0.8)",
          fontSize: 15,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        Invalid or missing menu ID
      </div>
    );

  if (isLoading || !menuService) return <Snipper />;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0a0a0c",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* ── sticky header ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "13px 16px",
          background: "rgba(10,10,12,0.88)",
          backdropFilter: "blur(20px)",
          borderBottom: "0.5px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(20,83,45,0.3)",
              border: "0.5px solid rgba(74,222,128,0.2)",
            }}
          >
            <FiMenu size={14} color="#4ade80" />
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 600,
                color: "#fff",
                fontFamily: "'Syne', sans-serif",
              }}
            >
              Our Menu
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 10,
                color: "rgba(255,255,255,0.3)",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {images.length} image{images.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div> */}

        <span
          style={{
            fontSize: 11,
            padding: "4px 12px",
            borderRadius: 99,
            background: "rgba(20,83,45,0.22)",
            border: "0.5px solid rgba(74,222,128,0.2)",
            color: "rgba(134,239,172,0.75)",
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.05em",
          }}
        >
          scroll to browse our menu
        </span>
      </div>

      {/* ── pages ── */}
      {images.length > 0 ? (
        <>
          <div style={{ flex: 1 }}>
            {images.map((image, index) => (
              <MenuPage
                key={index}
                image={image}
                index={index}
                total={images.length}
                onZoom={() => openLightbox(index)}
                pageRef={(el) => (pageRefs.current[index] = el)}
              />
            ))}
          </div>

          {/* ── sticky thumbnail strip ── */}
          {images.length > 1 && (
            <div style={{ position: "sticky", bottom: 0, zIndex: 100 }}>
              <ThumbnailStrip
                images={images}
                activeIndex={activeThumb}
                onSelect={scrollToPage}
              />
            </div>
          )}
        </>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.25)",
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          No menu items available.
        </div>
      )}

      {/* ── lightbox ── */}
      <AnimatePresence>
        {previewIndex !== null && (
          <Lightbox
            image={images[previewIndex]}
            index={previewIndex}
            total={images.length}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuTemplate;
