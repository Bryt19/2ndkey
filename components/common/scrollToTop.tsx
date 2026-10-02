"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";

/**
 * Floating back-to-top button with a circular scroll-progress ring.
 *
 * Deliberately not built on framer-motion's `useScroll`/`useSpring`: those
 * drive React state on every animation frame for the whole life of the page,
 * which re-renders the component continuously while scrolling. Instead a
 * single passive, rAF-throttled scroll listener writes `strokeDashoffset` and
 * `opacity` straight to the DOM, so scrolling costs no React renders at all.
 *
 * The ring track is hidden until the button appears, so a hidden button does no
 * painting work.
 */
export function ScrollToTop() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (reduceMotion) return;

    const CIRCUMFERENCE = 2 * Math.PI * 20;
    let frame = 0;

    const paint = () => {
      frame = 0;

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const nextVisible = window.scrollY > window.innerHeight * 0.6;

      if (progressRef.current) {
        progressRef.current.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - progress));
      }
      if (buttonRef.current) {
        buttonRef.current.style.opacity = nextVisible ? "1" : "0";
        buttonRef.current.style.transform = nextVisible ? "scale(1)" : "scale(0.8)";
        buttonRef.current.style.pointerEvents = nextVisible ? "auto" : "none";
      }
      setVisible(nextVisible);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 grid size-12 place-items-center rounded-full border border-border bg-card text-foreground opacity-0 shadow-md transition-colors hover:border-primary/40 hover:text-primary sm:bottom-8 sm:right-8"
      style={{ transform: "scale(0.8)", transitionProperty: "opacity, transform", transitionDuration: "200ms" }}
    >
      <svg
        viewBox="0 0 48 48"
        className="absolute inset-0 size-full -rotate-90"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
        <circle
          ref={progressRef}
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 20}
          strokeDashoffset={2 * Math.PI * 20}
        />
      </svg>
      <ArrowUp className="size-4" aria-hidden="true" />
    </button>
  );
}
