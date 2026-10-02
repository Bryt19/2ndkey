"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BadgeCheck, MapPin } from "lucide-react";

import { TESTIMONIALS } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/* ── Avatar initials bubble ── */
function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-11 shrink-0 place-items-center rounded-full border border-[#d6ff34]/30 bg-[#161a08] font-mono text-xs font-bold text-[#d6ff34]"
    >
      {getInitials(name)}
    </span>
  );
}

/* ── Star rating ── */
function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="size-3.5 fill-[#d6ff34]" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function CommunityTestimonials() {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const [activeIndex, setActiveIndex] = useState(0);
  /* Bumped on every re-measure so the scroll handler picks up new offsets. */
  const [metricsVersion, setMetricsVersion] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  /** Last snapped stop, so we only touch the DOM when the card actually changes. */
  const lastStopRef = useRef(-1);
  /** How far the track can slide, in px. Each stop is a uniform step of it. */
  const distanceRef = useRef(0);

  /** Number of evenly spaced stops along the horizontal track. */
  const stops = Math.max(1, TESTIMONIALS.length - 1);
  /**
   * Scroll granted to each card, as a fraction of the pinned stage height.
   * Higher = the cards advance more slowly.
   *
   * Measured against the stage rather than `window.innerHeight` on purpose: the
   * stage is sized in `svh`, so it does not change when a mobile browser's URL
   * bar hides, whereas `innerHeight` does — and a mid-scroll re-measure there
   * would shift the runway and snap the active card unexpectedly.
   */
  const CARD_SCROLL_FACTOR = 0.6;

  /* ── Measure: how far the track must slide, and how tall the scroll runway is ── */
  useEffect(() => {
    if (prefersReducedMotion) return;
    const outer = scrollRef.current;
    const stage = stageRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!outer || !stage || !viewport || !track) return;

    const measure = () => {
      const viewportWidth = viewport.clientWidth;
      const card = track.children[0] as HTMLElement | undefined;
      const cardWidth = card?.offsetWidth ?? 0;

      /*
        Pad the track by half the leftover space so the first and last cards can
        sit dead centre. That makes the travel exactly `stops * step`, so every
        stop centres a card with no clamping and no empty space at the ends.
      */
      const pad = Math.max(0, (viewportWidth - cardWidth) / 2);
      track.style.paddingLeft = `${pad}px`;
      track.style.paddingRight = `${pad}px`;

      distanceRef.current = Math.max(0, track.scrollWidth - viewportWidth);

      /* One calm scroll zone per card, so a card stays put while you read it. */
      const runway = stops * stage.offsetHeight * CARD_SCROLL_FACTOR;
      outer.style.height = `${stage.offsetHeight + runway}px`;

      setMetricsVersion((version) => version + 1);
    };

    measure();
    /* Re-measure when the window height changes (mobile browser chrome, rotate). */
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    observer.observe(stage);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      outer.style.height = "";
      track.style.paddingLeft = "";
      track.style.paddingRight = "";
    };
  }, [prefersReducedMotion, stops, CARD_SCROLL_FACTOR]);

  /* ── Drive the horizontal slide from vertical scroll position ── */
  useEffect(() => {
    if (prefersReducedMotion) return;
    const outer = scrollRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!outer || !stage || !track) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
      const travel = outer.offsetHeight - stage.offsetHeight;
      if (travel <= 0) return;

      const progress = clamp((stickyTop - outer.getBoundingClientRect().top) / travel, 0, 1);

      /* Snap: each scroll zone advances exactly one card. */
      const next = clamp(Math.round(progress * stops), 0, stops);
      if (next === lastStopRef.current) return;
      lastStopRef.current = next;

      /* Even steps: stop n centres card n. */
      const offset = (next / stops) * distanceRef.current;
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      setActiveIndex(next);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    lastStopRef.current = -1;
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      track.style.transform = "";
    };
  }, [prefersReducedMotion, metricsVersion, stops, CARD_SCROLL_FACTOR]);

  /* ── Jump the page to the scroll position that shows a given card ── */
  const scrollToSlide = (index: number) => {
    const outer = scrollRef.current;
    const stage = stageRef.current;
    if (!outer || !stage) return;
    const travel = outer.offsetHeight - stage.offsetHeight;
    const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
    const progress = clamp(index / stops, 0, 1);
    /* progress maps 1:1 onto the snapped stops, so this lands on the card. */
    const docTop = outer.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: docTop - stickyTop + progress * travel, behavior: "smooth" });
  };

  /* ── Reduced-motion fallback: static grid ── */
  if (prefersReducedMotion) {
    return (
      <section
        id="community"
        aria-labelledby="community-heading"
        className="scroll-mt-24 border-t border-zinc-800 bg-black px-5 py-16 sm:px-8 sm:py-24 lg:px-14"
      >
        <div className="mx-auto w-full max-w-6xl">
          <p className="mb-3 text-xs font-bold tracking-[0.18em] uppercase text-[#d6ff34]">
            Community
          </p>
          <h2
            id="community-heading"
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white"
          >
            Real people. Real peace of mind.
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <article
                key={t.id}
                className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xs font-bold tracking-wider text-zinc-500">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Stars />
                  </div>
                  <blockquote className="mt-4 text-sm leading-relaxed text-zinc-300">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>
                <div className="mt-5 flex items-center gap-3 border-t border-zinc-800/80 pt-4">
                  <Avatar name={t.name} />
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-zinc-500">
                      {t.role} · {t.country}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── Scroll-driven pinned carousel ── */
  return (
    <section
      id="community"
      aria-labelledby="community-heading"
      className="relative scroll-mt-24 border-t border-zinc-800 bg-black text-white"
    >
      {/* Scroll runway — the sticky stage stays pinned while you scroll through it.
          The static height is a pre-measurement fallback (~1 stage + one scroll
          zone per card); the effect replaces it with the measured value. */}
      <div ref={scrollRef} className="relative h-[340svh] w-full">
        <div
          ref={stageRef}
          className="sticky top-12 z-10 flex min-h-[calc(100svh-3rem)] w-full flex-col justify-center sm:top-16 sm:min-h-[calc(100svh-4rem)]"
        >
          {/* Section header */}
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-14">
            <div className="text-center">
              <p className="mb-2 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#d6ff34]">
                Community
              </p>
              <h2
                id="community-heading"
                className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white"
              >
                Real people.{" "}
                <span className="text-[#d6ff34]">Real peace of mind.</span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
                Hear how early vault keepers protect what matters most to their families.
              </p>
            </div>
          </div>

          {/* Carousel viewport — full-bleed so cards slide past the edges */}
          <div ref={viewportRef} className="relative mt-8 w-full overflow-hidden sm:mt-10">
            <div
              ref={trackRef}
              className="flex gap-5 pl-5 pr-5 will-change-transform transition-transform duration-500 ease-out motion-reduce:transition-none sm:gap-6 sm:pl-8 sm:pr-8 lg:pl-14 lg:pr-14"
            >
              {TESTIMONIALS.map((t, index) => (
                <article
                  key={t.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${TESTIMONIALS.length}`}
                  className={cn(
                    "relative flex min-h-[17rem] w-[calc(100vw-2.5rem)] max-w-2xl shrink-0 flex-col rounded-2xl border bg-[#080b05] p-5 transition-colors duration-500 sm:min-h-[21rem] sm:p-7",
                    index === activeIndex
                      ? "border-[#d6ff34]/40"
                      : "border-zinc-800"
                  )}
                >
                  {/* Neon top edge accent */}
                  <div
                    className="pointer-events-none absolute inset-x-6 top-0 h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(214,255,52,0.65), transparent)",
                    }}
                  />

                  {/* Rating + verification row */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Stars />
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#d6ff34]/25 bg-[#161a08] px-2 py-0.5 text-2xs font-semibold text-[#d6ff34]">
                        <BadgeCheck className="size-3" aria-hidden="true" />
                        Verified
                      </span>
                    </div>
                    <span
                      className={cn(
                        "font-mono text-2xs font-semibold tracking-wider transition-colors duration-500",
                        index === activeIndex ? "text-[#d6ff34]" : "text-zinc-600"
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Quote */}
                  <figure className="relative mb-5 mt-5 pl-6">
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-[-0.35rem] font-serif text-4xl leading-none text-[#d6ff34]/35"
                    >
                      &ldquo;
                    </span>
                    <blockquote className="line-clamp-6 max-w-prose text-sm leading-relaxed text-zinc-200 sm:line-clamp-none sm:text-base">
                      {t.quote}
                    </blockquote>
                  </figure>

                  {/* Author */}
                  <figcaption className="mt-auto flex items-center gap-3 border-t border-zinc-800/80 pt-4">
                    <Avatar name={t.name} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{t.name}</p>
                      <p className="truncate text-xs text-zinc-500">{t.role}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-2xs text-zinc-500">
                        <MapPin className="size-3 shrink-0 text-[#d6ff34]/60" aria-hidden="true" />
                        {t.country}
                      </p>
                    </div>
                    {t.isSample && (
                      <span className="ml-auto shrink-0 rounded-md border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 text-2xs font-semibold uppercase tracking-wider text-zinc-500">
                        Sample
                      </span>
                    )}
                  </figcaption>
                </article>
              ))}
            </div>
          </div>

          {/* Progress + nav */}
          <div className="mx-auto mt-8 w-full max-w-6xl px-5 sm:px-8 sm:mt-10 lg:px-14">
            <div className="h-px w-full bg-zinc-800">
              <div
                className="h-px bg-[#d6ff34] transition-[width] duration-300 ease-out"
                style={{
                  width: `${((activeIndex + 1) / TESTIMONIALS.length) * 100}%`,
                }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div
                aria-live="polite"
                aria-atomic="true"
                className="font-mono text-xs font-semibold text-zinc-500"
              >
                <span className="text-[#d6ff34]">{activeIndex + 1}</span>
                {" / "}
                {TESTIMONIALS.length}
              </div>

              <div aria-label="Testimonial slides" className="flex items-center gap-2">
                {TESTIMONIALS.map((t, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      aria-current={isActive ? "true" : undefined}
                      aria-label={`Show testimonial ${index + 1}: ${t.name}`}
                      onClick={() => scrollToSlide(index)}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6ff34]/50",
                        isActive ? "w-8 bg-[#d6ff34]" : "w-2 bg-zinc-700 hover:bg-zinc-500"
                      )}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
