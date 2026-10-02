"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Fades + lifts its children into view on scroll. Runs once.
 * Stagger siblings by passing increasing `delay` values.
 * Animation is disabled for users who prefer reduced motion.
 *
 * Uses `m` plus its own `LazyMotion` provider rather than the top-level
 * `motion` import. The provider is what lets the page ship the small
 * `domAnimation` feature set instead of the full framer-motion feature set.
 * It is mounted here as well as at the landing root because `Reveal` is also
 * used on pages that have no provider of their own; providers nest, and both
 * load the same features, so this costs one extra (already-cached) reference.
 */
export function Reveal({
  children,
  delay = 0,
  y = 14,
  className,
}: {
  children: ReactNode;
  /** Seconds to wait before animating (for stagger effects). */
  delay?: number;
  /** Starting offset in px. */
  y?: number;
  className?: string;
}) {
  return (
    <LazyMotion features={domAnimation}>
      <RevealInner delay={delay} y={y} className={className}>
        {children}
      </RevealInner>
    </LazyMotion>
  );
}

function RevealInner({
  children,
  delay,
  y,
  className,
}: {
  children: ReactNode;
  delay: number;
  y: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </m.div>
  );
}
