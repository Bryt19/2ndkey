"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";

/**
 * Floating back-to-top button with a circular scroll-progress ring.
 * The ring fills as the page scrolls down; the button appears after the
 * first screenful and is fixed to the viewport — independent of any
 * section or footer. Hidden for users who prefer reduced motion.
 */
export function ScrollToTop() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (reduceMotion) return null;

  const RADIUS = 20;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  return (
    <motion.button
      type="button"
      aria-label="Back to top"
      initial={false}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 grid size-12 place-items-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:border-primary/40 hover:text-primary sm:bottom-8 sm:right-8"
    >
      {/* Circular progress ring */}
      <svg viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r={RADIUS} fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
        <motion.circle
          cx="24"
          cy="24"
          r={RADIUS}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          style={{ pathLength: progress }}
        />
      </svg>
      <ArrowUp className="size-4" aria-hidden="true" />
    </motion.button>
  );
}
