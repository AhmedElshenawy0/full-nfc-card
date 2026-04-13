import { useLocation, Outlet } from "react-router-dom";
import logo from "/images/SignUp Logo White (1).png";
import { lazy, Suspense, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const LazyTypewriter = lazy(() => import("typewriter-effect"));

/* ─── Brand tokens ──────────────────────────────────────────────────── */
const BRAND = {
  purple: "#3a0d4e",
  purpleLight: "#6b21a8",
  purpleMid: "#390f4d",
  green: "#14532d",
  greenGlow: "#16a34a",
  greenAccent: "#4ade80",
};

/* ─── NFC rings canvas ──────────────────────────────────────────────── */
const NFCRings = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      t += 0.004;

      const cx = width * 0.85;
      const cy = height * 0.15;

      // Purple rings
      for (let i = 0; i < 5; i++) {
        const phase = t - i * 0.4;
        const radius = 36 + i * 48 + Math.sin(phase) * 5;
        const alpha = Math.max(0, 0.18 - i * 0.025 + Math.sin(phase) * 0.04);
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(107,33,168,${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Green pulse ring
      const pulseR = 30 + Math.sin(t * 1.5) * 8;
      const pulseA = 0.12 + Math.sin(t * 1.5) * 0.06;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(74,222,128,${pulseA})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Floating particles
      for (let i = 0; i < 14; i++) {
        const angle = (i / 14) * Math.PI * 2 + t * 0.25;
        const r = 70 + Math.sin(t * 0.6 + i) * 18;
        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r * 0.45;
        const a = 0.2 + Math.sin(t * 0.9 + i) * 0.1;
        ctx.beginPath();
        ctx.arc(px, py, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${a})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

/* ─── Grid overlay ──────────────────────────────────────────────────── */
const GridOverlay = () => (
  <div
    className="absolute inset-0 z-0 pointer-events-none"
    style={{
      backgroundImage: `
        linear-gradient(rgba(58,13,78,0.2) 1px, transparent 1px),
        linear-gradient(90deg, rgba(58,13,78,0.2) 1px, transparent 1px)
      `,
      backgroundSize: "52px 52px",
    }}
  />
);

/* ─── Glow blobs ────────────────────────────────────────────────────── */
const GlowBlobs = () => (
  <>
    <div
      className="absolute top-[-100px] right-[-60px] w-[400px] h-[400px] rounded-full pointer-events-none z-0"
      style={{
        background: `radial-gradient(circle, ${BRAND.purple}bb 0%, transparent 70%)`,
        filter: "blur(50px)",
      }}
    />
    <div
      className="absolute bottom-[-60px] left-[-40px] w-[300px] h-[300px] rounded-full pointer-events-none z-0"
      style={{
        background: `radial-gradient(circle, ${BRAND.green}99 0%, transparent 70%)`,
        filter: "blur(45px)",
      }}
    />
    <div
      className="absolute top-[35%] left-[25%] w-[220px] h-[220px] rounded-full pointer-events-none z-0"
      style={{
        background: `radial-gradient(circle, rgba(58,13,78,0.18) 0%, transparent 70%)`,
        filter: "blur(60px)",
      }}
    />
  </>
);

/* ─── Scan line ─────────────────────────────────────────────────────── */
const ScanLine = () => (
  <div
    className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
    style={{ opacity: 0.04 }}
  >
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "2px",
        background: `linear-gradient(90deg, transparent, ${BRAND.greenAccent}, transparent)`,
        animation: "scanline 7s linear infinite",
      }}
    />
    <style>{`@keyframes scanline { 0% { top: -2px; } 100% { top: 100%; } }`}</style>
  </div>
);

/* ─── Layout ────────────────────────────────────────────────────────── */
const Layout = () => {
  const location = useLocation();

  const hideHeaderRoutes = ["/template", "/menu-template", "/edit-template"];
  const noPaddingRoutes = ["/menu-template", "/template"];
  const hasPadding = !noPaddingRoutes.includes(location.pathname);
  const showHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <div
      className="min-h-screen relative overflow-hidden text-gray-200"
      style={{
        background: `linear-gradient(145deg, ${BRAND.purple} 0%, #1c0628 45%, #000000 100%)`,
      }}
    >
      {showHeader && (
        <>
          <GridOverlay />
          <GlowBlobs />
          <NFCRings />
          <ScanLine />
        </>
      )}
      <div className={`relative z-10 ${hasPadding ? "px-5 py-7" : ""}`}>
        {showHeader && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center mb-12"
          >
            {/* Logo with spinning brand-colored border */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 350 }}
              className="relative flex-shrink-0"
            >
              <div
                className="absolute -inset-[2px] rounded-full"
                style={{
                  background: `conic-gradient(from 0deg, ${BRAND.greenGlow}, ${BRAND.purpleLight}, ${BRAND.purple}, ${BRAND.greenGlow})`,
                  borderRadius: "9999px",
                  animation: "spin-slow 6s linear infinite",
                  opacity: 0.75,
                }}
              />
              <div
                className="relative w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${BRAND.green}, ${BRAND.purpleMid})`,
                  boxShadow: `0 0 20px ${BRAND.green}55, 0 0 40px ${BRAND.purple}33`,
                }}
              >
                <img
                  src={logo}
                  alt="SignUp Logo"
                  className="w-7 h-7 object-contain"
                />
              </div>
            </motion.div>

            {/* Divider */}
            <div className="flex flex-col items-center mx-4 gap-1">
              <div
                className="w-[1px] h-3"
                style={{
                  background: `linear-gradient(to bottom, transparent, ${BRAND.greenAccent}55)`,
                }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: BRAND.greenAccent,
                  boxShadow: `0 0 8px ${BRAND.greenAccent}`,
                  animation: "pulse-dot 2s ease-in-out infinite",
                }}
              />
              <div
                className="w-[1px] h-3"
                style={{
                  background: `linear-gradient(to top, transparent, ${BRAND.greenAccent}55)`,
                }}
              />
            </div>

            {/* Typewriter text */}
            <div className="flex flex-col">
              <span
                className="text-[8px] mb-1 tracking-[0.3em] uppercase"
                style={{
                  color: `${BRAND.greenAccent}`,
                  fontFamily: "monospace",
                }}
              >
                SIGNUP · NFC · SOLUTION
              </span>
              <div
                className="text-[17px] font-light"
                style={{
                  fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
                  color: "rgba(255,255,255,0.9)",
                  letterSpacing: "0.015em",
                }}
              >
                <Suspense
                  fallback={
                    <span style={{ opacity: 0.4 }}>Connect smarter</span>
                  }
                >
                  <LazyTypewriter
                    onInit={(typewriter) => {
                      typewriter
                        .typeString("Connect smarter")
                        .pauseFor(2200)
                        .deleteAll(38)
                        .typeString("Tap. Share. Done.")
                        .pauseFor(2200)
                        .deleteAll(38)
                        .start();
                    }}
                    options={{ loop: true, delay: 65, deleteSpeed: 28 }}
                  />
                </Suspense>
              </div>
            </div>

            {/* Live badge */}
            <div className="ml-auto">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase"
                style={{
                  background: `rgba(20,83,45,0.2)`,
                  border: `0.5px solid ${BRAND.greenAccent}35`,
                  color: `${BRAND.greenAccent}bb`,
                  fontFamily: "monospace",
                  boxShadow: `inset 0 0 10px ${BRAND.green}22`,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: BRAND.greenAccent,
                    boxShadow: `0 0 5px ${BRAND.greenAccent}`,
                    animation: "pulse-dot 2s ease-in-out infinite",
                  }}
                />
                Live
              </div>
            </div>
          </motion.header>
        )}

        <motion.main
          key={location.pathname}
          // initial={{ opacity: 0, y: 10 }}
          // animate={{ opacity: 1, y: 0 }}
          // transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Outlet />
        </motion.main>

        {showHeader && (
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-14 flex flex-col items-center gap-2 pb-2"
          >
            <div
              className="w-28 h-[0.5px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${BRAND.purple}cc, transparent)`,
              }}
            />
            <p
              className="text-[11px] tracking-widest uppercase"
              style={{
                color: "rgba(255,255,255,0.35)",
                fontFamily: "monospace",
              }}
            >
              © 2026 SignUp · All rights reserved
            </p>
          </motion.footer>
        )}
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.75); }
        }
      `}</style>
    </div>
  );
};

export default Layout;
