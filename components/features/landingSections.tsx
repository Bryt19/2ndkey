"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Bell,
  Check,
  ChevronDown,
  Clock,
  FileText,
  Github,
  Heart,
  Landmark,
  Lock,
  type LucideIcon,
  MapPin,
  RefreshCw,
  Send,
  ShieldCheck,
  Smartphone,
  Star,
  Twitter,
  UserMinus,
  Users,
  Wallet,
} from "lucide-react";

import { Countdown } from "@/components/ui";
import { Stats, type StatItem } from "@/components/ui/stats-05";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { Reveal } from "@/components/common/reveal";
import { ScrollToTop } from "@/components/common/scrollToTop";
import { CommunityTestimonials } from "@/components/features/communityTestimonials";
import { useFHEVMWallet } from "@/components/providers/fhevmWalletProvider";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Shared bits                                                                */
/* -------------------------------------------------------------------------- */

function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  className = "",
  curved = false,
  centered = false,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
  className?: string;
  curved?: boolean;
  centered?: boolean;
  neonBorder?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 border-t border-zinc-800 bg-black px-5 py-16 sm:px-8 sm:py-24 lg:px-14 text-white",
        curved && "rounded-t-[60px] sm:rounded-t-[100px]",
        className
      )}
    >
      <Reveal className={`mx-auto w-full ${centered ? "max-w-3xl text-center" : "max-w-6xl"}`}>
        {eyebrow && (
          <p className="mb-3 text-sm font-semibold tracking-wide uppercase text-[#d6ff34]">
            {eyebrow}
          </p>
        )}
        <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight text-white ${centered ? "mx-auto" : "max-w-2xl"}`}>
          {title}
        </h2>
        {lead && (
          <p
            className={cn(
              "mt-4 max-w-2xl text-lg leading-relaxed text-zinc-300 md:text-xl",
              centered && "mx-auto"
            )}
          >
            {lead}
          </p>
        )}
        <div className="mt-10">{children}</div>
      </Reveal>
    </section>
  );
}

/**
 * Glassy card surface: a translucent fill over backdrop blur, finished with a
 * hairline neon sheen along the top edge.
 *
 * Backdrop blur needs something behind it to pick up — MoneySection provides
 * the ambient neon, so these cards are only used there.
 */
const GLASS_CARD =
  "group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-colors duration-300 hover:border-[#d6ff34]/40";

/** Hairline sheen that sells the glass edge. */
const GLASS_SHEEN =
  "pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#d6ff34]/50 to-transparent";

type CardBadge = { label: string; tone: "available" | "soon" };

const BADGE_TONE: Record<CardBadge["tone"], string> = {
  available: "border-[#d6ff34]/30 bg-[#d6ff34]/[0.08] text-[#d6ff34]",
  soon: "border-amber-400/30 bg-amber-400/[0.08] text-amber-300",
};

function FeatureCard({
  icon,
  title,
  children,
  badge,
  points,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  badge?: CardBadge;
  points?: readonly string[];
}) {
  return (
    <div className={GLASS_CARD}>
      <span aria-hidden="true" className={GLASS_SHEEN} />

      <div className="flex items-start justify-between gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-[#d6ff34] transition-colors duration-300 group-hover:border-[#d6ff34]/40">
          {icon}
        </div>
        {badge && (
          <span
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-1 text-2xs font-semibold",
              BADGE_TONE[badge.tone]
            )}
          >
            {badge.label}
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-300">{children}</p>

      {points && points.length > 0 && (
        <ul className="mt-1 flex flex-col gap-2.5 border-t border-white/10 pt-4">
          {points.map((point) => (
            <li key={point} className="flex gap-2.5 text-xs leading-relaxed text-zinc-400">
              <Check className="mt-0.5 size-3.5 shrink-0 text-[#d6ff34]" aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

const DEMO_NEXT_CHECK_IN = new Date("2027-01-15T09:00:00Z");

function Hero() {
  const { wallet } = useFHEVMWallet();
  const isConnected = wallet.isConnected;

  return (
    <section className="relative min-h-[100vh] overflow-hidden bg-black text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">

      {/* ── Dot-grid background ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, #d6ff34 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* ── Floating ambient orbs ── */}
      <m.div
        animate={{ scale: [1, 1.22, 1], opacity: [0.35, 0.65, 0.35], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[6%] top-[18%] h-80 w-80 rounded-full bg-[#d6ff34]/30 blur-[90px] z-0"
      />
      <m.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.45, 0.2], x: [0, -25, 0], y: [0, 30, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="pointer-events-none absolute right-[8%] top-[28%] h-96 w-96 rounded-full bg-[#d6ff34]/22 blur-[110px] z-0"
      />
      <m.div
        animate={{ scale: [1, 1.35, 1], opacity: [0.12, 0.3, 0.12] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="pointer-events-none absolute bottom-[8%] left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full bg-[#d6ff34]/15 blur-[130px] z-0"/>

      {/*
        Neon arc. The wrapper is deliberately not `overflow-hidden`: that clip
        is what cut the old ambient glow band off at a hard horizontal seam
        across the hero. The band is gone with it — the arc's own box-shadow
        carries the glow now.
      */}
      <div className="pointer-events-none absolute inset-x-0 z-0 flex justify-center" style={{ top: "calc(50% + 45px)" }}>
        <div className="relative w-[130vw] max-w-[1600px] h-[480px]">
          <div
            className="absolute inset-0 rounded-[100%] border-t-[3px] border-[#d6ff34]/85"
            style={{ boxShadow: "0 -18px 80px rgba(214,255,52,0.75), 0 -6px 30px rgba(214,255,52,0.5), inset 0 16px 60px rgba(214,255,52,0.35)" }}
          />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto text-center flex flex-col items-center">


        {/* 2ndKey Hero Title */}
        <m.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-6 text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]"
        >
          Make sure the <span className="text-[#d6ff34]">people you love</span> <br />
          can reach what you leave behind.
        </m.h1>

        {/* Subtitle */}
        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-6 max-w-2xl text-base sm:text-lg text-zinc-300 leading-relaxed"
        >
          2ndKey keeps your USDC in a secure vault. If you stop checking in, it passes to the people you choose.
        </m.p>

        {/* CTA Buttons */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center w-full sm:w-auto"
        >
          {!isConnected ? (
            <Link href="/signin" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-13 px-9 py-3.5 rounded-full bg-[#d6ff34] text-black font-extrabold text-base sm:text-lg hover:bg-[#c2f82c] transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <span>Get started</span>
                <ArrowRight className="size-5 text-black" />
              </button>
            </Link>
          ) : (
            <m.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full sm:w-auto"
            >
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto h-13 px-9 py-3.5 rounded-full bg-[#d6ff34] text-black font-extrabold text-base sm:text-lg hover:bg-[#c2f82c] transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(214,255,52,0.35)] cursor-pointer">
                  <span>Visit Dashboard</span>
                  <ArrowRight className="size-5 text-black" />
                </button>
              </Link>
            </m.div>
          )}
          <Link href="#how-it-works" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto h-13 px-8 py-3.5 rounded-full border border-zinc-800 bg-zinc-950/80 text-white font-medium text-base hover:bg-zinc-900 transition-colors">
              See how it works
            </button>
          </Link>
        </m.div>

        {/* Family Vault — Physical Card + Stats */}
        <div className="relative mt-14 w-full">
          <m.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full overflow-hidden rounded-3xl border border-white/[0.07] bg-[#090b07] p-6 text-left sm:p-8 lg:p-10"
          >
          <div className="flex flex-col gap-8">

            {/* Top Vault Header Row */}
            <div className="flex flex-col justify-between gap-4 border-b border-white/[0.07] pb-6 sm:flex-row sm:items-center">
              <div className="flex flex-wrap items-center gap-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.02]">
                  <Wallet className="size-5 text-[#d6ff34]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-white">Family Inheritance Vault</h3>
                  <div className="mt-1 flex items-center gap-3">
                    <span className="font-mono text-xs text-zinc-500">Contract: 0x7a3f…9b21</span>
                    <span className="text-zinc-700">•</span>
                    <span className="text-xs font-medium text-zinc-400">Base Sepolia Testnet</span>
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard"
                className="inline-flex h-9 shrink-0 items-center rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 text-xs font-semibold text-white transition-colors hover:border-[#d6ff34]/40 hover:text-[#d6ff34]"
              >
                Manage Vault Settings
              </Link>
            </div>

            {/*
              Card + the two stat cards share a single grid row, so `items-stretch`
              makes all three exactly the same height. The security strip sits on
              its own full-width row below. Keeping the card in the same grid as
              the two cards (rather than in a separate left column) is what
              guarantees the heights match — a two-column layout would stretch
              the card to the full column, including the security strip.
            */}
            <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-[320px_1fr_1fr]">

              {/* ── Physical Vault Card ── */}
              <m.div
                whileHover={{ rotateY: 6, rotateX: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 240, damping: 20 }}
                style={{ perspective: 1200, transformStyle: "preserve-3d" }}
                className="h-full min-w-0"
              >
                {/*
                  Width is fixed by the grid track; height stretches to match the
                  two stat cards. Deliberately no `aspect-ratio` here — pinning
                  one would either overflow the row or collapse the card to a
                  fraction of its neighbours' height. The internal layout uses
                  `mt-auto` on the balance so the content redistributes rather
                  than leaving a gap at the bottom.
                */}
                <div
                  className="relative h-full w-full select-none overflow-hidden rounded-[20px]"
                  style={{
                    background: "linear-gradient(155deg, #16210b 0%, #0a1105 100%)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    boxShadow: "0 18px 40px -18px rgba(0,0,0,0.9)",
                  }}
                >
                  {/* Diagonal sheen, the only decorative layer */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(115deg, rgba(255,255,255,0.07) 0%, transparent 32%, transparent 68%, rgba(255,255,255,0.03) 100%)",
                    }}
                  />
                  {/* Hairline inset, as on a real card */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-[1px] rounded-[19px] border border-white/[0.05]"
                  />

                  <div className="relative z-10 flex h-full flex-col p-5">
                    {/* Wordmark + contactless */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[17px] font-extrabold leading-none tracking-tight">
                          <span className="text-[#d6ff34]">2</span>
                          <span className="text-white">ndKey</span>
                        </p>
                        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
                          Vault Card
                        </p>
                      </div>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                        className="mt-0.5 text-white/35"
                      >
                        <path
                          d="M8 4a12 12 0 0 1 0 16M13 7.5a7.5 7.5 0 0 1 0 9M17 11a3 3 0 0 1 0 2"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    {/* Chip */}
                    <div
                      className="mt-4 h-[26px] w-9 rounded-[5px]"
                      style={{
                        background: "linear-gradient(140deg, #e6cf94 0%, #b99a52 55%, #d8bf80 100%)",
                        boxShadow:
                          "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.35)",
                      }}
                    >
                      {/* Contact lines, drawn rather than faked with a grid */}
                      <svg viewBox="0 0 36 26" className="h-full w-full" aria-hidden="true">
                        <g stroke="rgba(0,0,0,0.28)" strokeWidth="1" fill="none">
                          <path d="M0 8.5h36M0 17.5h36" />
                          <path d="M12 0v26M24 0v26" />
                        </g>
                        <rect
                          x="12"
                          y="8.5"
                          width="12"
                          height="9"
                          rx="2.5"
                          fill="rgba(0,0,0,0.16)"
                        />
                      </svg>
                    </div>

                    {/* Balance — the card's one large element */}
                    <div className="mt-auto">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
                        Vault Balance
                      </p>
                      <p className="mt-1.5 font-mono text-[21px] font-semibold leading-none tracking-tight text-white">
                        2,450.00{" "}
                        <span className="text-[12px] font-medium tracking-normal text-white/45">
                          USDC
                        </span>
                      </p>
                    </div>

                    {/* Account + status row */}
                    <div className="mt-4 flex items-end justify-between border-t border-white/[0.07] pt-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                          Card Holder
                        </p>
                        <p className="mt-0.5 text-[11px] font-semibold tracking-tight text-white/85">
                          John Martinez
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                          Beneficiaries
                        </p>
                        <p className="mt-0.5 text-[11px] font-semibold tracking-tight text-[#d6ff34]">
                          3 Named
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </m.div>

              {/* Check-in Countdown */}

                {/*
                  Check-in countdown.

                  Read top to bottom as one thing: what the timer is for, whether
                  it is healthy, how long is left, then the window and the action.
                  The timer is the only large element in the card and the only
                  place lime is spent at that size, so the eye lands on the
                  number rather than on the chrome around it.
                */}
                <div className="flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        Next Check-in Required
                      </p>
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#d6ff34]/30 bg-[#d6ff34]/10 px-2.5 py-0.5 text-2xs font-semibold text-[#d6ff34]">
                        <span className="size-1.5 rounded-full bg-[#d6ff34]" aria-hidden="true" />
                        Healthy
                      </span>
                    </div>

                    <Countdown
                      compact
                      to={DEMO_NEXT_CHECK_IN}
                      className="mt-4 block font-mono text-[1.75rem] font-semibold leading-none tracking-tight tabular-nums text-white"
                    />
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
                    <span className="text-xs text-zinc-500">30-Day Check-in Window</span>
                    <button
                      type="button"
                      className="inline-flex h-9 shrink-0 cursor-pointer items-center rounded-full bg-[#d6ff34] px-4 text-xs font-bold text-black transition-colors hover:bg-[#c2f82c]"
                    >
                      Check In Now
                    </button>
                  </div>
                </div>

                {/* Beneficiary Breakdown */}
                <div className="flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Beneficiary Allocation</p>
                      <span className="rounded-md border border-white/[0.07] px-2 py-0.5 text-2xs font-semibold text-zinc-400">
                        3 Named
                      </span>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-xs font-medium text-zinc-200">
                        <span>Sarah M. (Spouse)</span>
                        <span className="font-mono text-[#d6ff34]">50%</span>
                      </div>
                      <div className="flex justify-between text-xs text-zinc-400">
                        <span>David M. (Son)</span>
                        <span className="font-mono text-zinc-300">35%</span>
                      </div>
                      <div className="flex justify-between text-xs text-zinc-400">
                        <span>Alex M. (Daughter)</span>
                        <span className="font-mono text-zinc-300">15%</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1 border-t border-white/[0.07] pt-3">
                    <div className="h-1.5 w-1/2 rounded-full bg-[#d6ff34]" />
                    <div className="h-1.5 w-[35%] rounded-full bg-zinc-500" />
                    <div className="h-1.5 w-[15%] rounded-full bg-zinc-700" />
                  </div>
                </div>

                {/* Security Guarantees */}
                <div className="grid grid-cols-1 gap-3 sm:col-span-2 sm:grid-cols-3 lg:col-span-3">
                  {[
                    { icon: Wallet, text: "Non-custodial smart contract" },
                    { icon: Bell, text: "Multi-channel deadline reminders" },
                    { icon: Clock, text: "72-hr safety delay on changes" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3.5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                      <Icon className="size-5 shrink-0 text-[#d6ff34]" aria-hidden="true" />
                      <p className="text-xs font-medium leading-relaxed text-zinc-300">{text}</p>
                    </div>
                  ))}
                </div>

            </div>

          </div>
          </m.div>
        </div>
      </div>


    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Why we built this                                                          */
/* -------------------------------------------------------------------------- */

function WhySection() {
  const items = [
    {
      big: "Keys and passwords",
      small: "are often private by design. If they are not shared, no one can use them.",
      backTitle: "The secret that dies with you",
      backBody:
        "Seed phrases, wallet PINs, exchange logins and hardware-wallet backups are built to be known by exactly one person. That protects you while you are alive — and locks everyone out the moment you are not.",
      backPoints: [
        "Most heirs never find the recovery phrase in time to act on it",
        "Centralised platforms freeze accounts until probate is resolved",
        "A single lost hardware wallet can hide an entire life's savings",
      ],
    },
    {
      big: "Money sits untouched",
      small: "because the people left behind do not know it exists or how to reach it.",
      backTitle: "Assets nobody knows about",
      backBody:
        "Families rarely lose money to theft. They lose it to silence: no inventory of what exists, no instructions for how to reach it, and no one with the authority or the know-how to move it.",
      backPoints: [
        "Crypto leaves no statement, no branch and no phone number to call",
        "Heirs usually do not know the wallet exists at all",
        "By the time access is figured out, deadlines and fees have eaten the value",
      ],
    },
    {
      big: "2ndKey exists",
      small: "so that a plan made calmly today becomes help for your family later. No one's legacy should be lost.",
      backTitle: "A plan that acts without you",
      backBody:
        "2ndKey turns inheritance into a one-time setup: your assets rest in a non-custodial vault, your check-ins prove you are fine, and the day you stop checking in the contract hands control to the people you named.",
      backPoints: [
        "Cold storage built in — no keys handed over to a custodian",
        "Beneficiaries and shares defined by you, not a court",
        "Automatic transfer with safety delays and encrypted private data",
      ],
    },
  ] as const;

  return (
    <Section
      id="why"
      eyebrow="Why we built this"
      title="Families lose money when knowledge is lost."
      lead="Every year, families lose access to money and digital assets when someone dies — because the keys, the passwords, or simply the knowledge of what exists and where die with them."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.big} delay={i * 0.08} className="h-full">
            {/* perspective wrapper — gives the card depth as it turns */}
            <div className="group h-full [perspective:1400px]">
              <div className="relative h-full min-h-[22rem] transition-transform duration-700 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)] motion-reduce:transition-none motion-reduce:group-hover:[transform:none] motion-reduce:group-focus-within:[transform:none]">

                {/* ── Front face ── */}
                <div className="flex h-full flex-col justify-between rounded-2xl border border-zinc-800 bg-black p-6 [backface-visibility:hidden]">
                  <div>
                    <p className="text-2xl font-semibold text-[#d6ff34]">{item.big}</p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-300">{item.small}</p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-wider text-zinc-500 transition-colors group-hover:text-zinc-400">
                    <RefreshCw className="size-3.5" aria-hidden="true" />
                    Hover to read more
                  </span>
                </div>

                {/* ── Back face ── */}
                <div className="absolute inset-0 flex h-full flex-col gap-3 overflow-y-auto rounded-2xl border border-[#d6ff34]/40 bg-zinc-950 p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <p className="text-sm font-semibold uppercase tracking-wider text-[#d6ff34]">
                    {item.backTitle}
                  </p>
                  <p className="text-xs leading-relaxed text-zinc-300">{item.backBody}</p>
                  <ul className="mt-1 space-y-2">
                    {item.backPoints.map((point) => (
                      <li key={point} className="flex gap-2 text-2xs leading-relaxed text-zinc-400">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-[#d6ff34]" aria-hidden="true" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* How it works                                                               */
/* -------------------------------------------------------------------------- */

const STEPS = [
  {
    step: "01",
    title: "Create your vault & add USDC",
    subtitle: "2 minute setup",
    body: "Open a non-custodial vault on Base Sepolia in seconds. Deposit the USDC or digital assets you want to protect for your family.",
    icon: Wallet,
    preview: {
      badge: "Non-Custodial Vault #0x7a3f",
      status: "Vault Active",
      val: "$25,000.00 USDC",
      sub: "Base Sepolia Testnet",
    },
  },
  {
    step: "02",
    title: "Designate beneficiaries & shares",
    subtitle: "Custom allocations",
    body: "Name the specific wallet addresses or emails of the people who matter most, and assign exact share percentages for each person.",
    icon: Users,
    preview: {
      beneficiaries: [
        { name: "Elena (Spouse)", share: "60%", amount: "$15,000 USDC" },
        { name: "Lucas (Son)", share: "40%", amount: "$10,000 USDC" },
      ],
    },
  },
  {
    step: "03",
    title: "Check in periodically with 1 tap",
    subtitle: "Zero friction",
    body: "Tap once from your phone or browser to confirm you are active. Receive automated multi-channel alerts before any check-in deadline.",
    icon: Bell,
    preview: {
      timer: "89 days, 14 hours remaining",
      buttonText: "Tap to Check-In Now",
      statusMsg: "Last check-in: 2 days ago",
    },
  },
  {
    step: "04",
    title: "Automated & encrypted transfer",
    subtitle: "Guaranteed inheritance",
    body: "If you ever stop checking in after your custom grace period, smart contracts automatically enable your named beneficiaries to claim their shares.",
    icon: FileText,
    preview: {
      claimStatus: "72-Hour Safety Delay Active",
      claimText: "Beneficiary Claims Enabled",
      security: "Smart Contract Verified · Non-Custodial Security",
    },
  },
] as const;

const STEP_CARD =
  "group relative flex cursor-pointer flex-col gap-3 overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 focus:outline-none sm:p-6";
const STEP_CARD_ON =
  "border-[#d6ff34] bg-zinc-950/90 shadow-[0_0_30px_rgba(214,255,52,0.15)] ring-1 ring-[#d6ff34]/40";
const STEP_CARD_OFF = "border-zinc-800/80 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-950/80";
const STEP_NUM_ON = "border-[#d6ff34]/50 bg-[#d6ff34]/15 text-[#d6ff34]";
const STEP_NUM_OFF = "border-zinc-800 bg-zinc-900 text-zinc-500 group-hover:text-zinc-300";
const STEP_ICON_ON = "text-[#d6ff34]";
const STEP_ICON_OFF = "text-zinc-500 group-hover:text-zinc-400";

function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const stepEls = useRef<(HTMLButtonElement | null)[]>([]);

  /**
   * Scrolling advances the step. The card whose centre sits closest to a
   * focus line ~45% down the viewport wins, so the highlight follows the
   * reader down the stacked (mobile) layout. Clicks still work — the scroll
   * handler only re-picks on an actual scroll or resize.
   *
   * On wide screens the cards share a single row, so their centres are level
   * and the pick stays put: clicking is what drives the step there.
   */
  useEffect(() => {
    let frame = 0;

    const sync = () => {
      frame = 0;
      const focus = window.innerHeight * 0.45;
      let best = -1;
      let bestDist = Infinity;

      stepEls.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const dist = Math.abs(rect.top + rect.height / 2 - focus);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });

      if (best >= 0) setActiveStep((prev) => (prev === best ? prev : best));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const step = STEPS[activeStep];

  return (
    <Section id="how-it-works" eyebrow="How it works" title="Four steps, then total peace of mind.">
      {/* ── Top timeline stage connector (Desktop) ── */}
      <div className="relative mb-10 hidden lg:block">
        <div className="absolute top-1/2 right-0 left-0 h-0.5 -translate-y-1/2 bg-zinc-800" />
        <div
          className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-[#d6ff34] transition-all duration-500 ease-out"
          style={{ width: `${(activeStep / (STEPS.length - 1)) * 100}%` }}
        />
        <div className="relative z-10 flex justify-between">
          {STEPS.map((s, idx) => {
            const isActive = activeStep === idx;
            const isPassed = activeStep >= idx;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setActiveStep(idx)}
                className="group flex cursor-pointer flex-col items-center focus:outline-none"
              >
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full border text-xs font-extrabold transition-all duration-300",
                    isPassed
                      ? "border-[#d6ff34] bg-[#d6ff34] text-black shadow-[0_0_20px_rgba(214,255,52,0.4)]"
                      : "border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-700 hover:text-white"
                  )}
                >
                  {s.step}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-semibold transition-colors duration-300",
                    isActive ? "text-[#d6ff34]" : "text-zinc-500 group-hover:text-zinc-300"
                  )}
                >
                  {s.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 4 Step Interactive Grid — scroll or click to advance ── */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          const isActive = activeStep === idx;
          return (
            <button
              key={s.title}
              type="button"
              ref={(el) => {
                stepEls.current[idx] = el;
              }}
              onClick={() => setActiveStep(idx)}
              aria-pressed={isActive}
              className={cn(STEP_CARD, isActive ? STEP_CARD_ON : STEP_CARD_OFF)}
            >
              {/*
                Active-step accent. A plain CSS transition rather than a
                `layoutId`: shared-layout animations make framer measure the
                surrounding subtree on every change, which is real work for a
                2px bar that just needs to fade in.
              */}
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-x-0 top-0 h-1 bg-[#d6ff34] transition-opacity duration-300",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              />

              <span className="flex items-center justify-between">
                <span
                  className={cn(
                    "grid size-9 place-items-center rounded-xl border text-sm font-black transition-colors duration-300",
                    isActive ? STEP_NUM_ON : STEP_NUM_OFF
                  )}
                >
                  {s.step}
                </span>
                <Icon
                  className={cn(
                    "size-5 transition-colors duration-300",
                    isActive ? STEP_ICON_ON : STEP_ICON_OFF
                  )}
                />
              </span>

              <span>
                <span
                  className={cn(
                    "block text-base font-bold transition-colors sm:text-lg",
                    isActive ? "text-white" : "text-zinc-200"
                  )}
                >
                  {s.title}
                </span>
                <span className="mt-2 block text-xs leading-relaxed text-zinc-400 sm:text-sm">
                  {s.body}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Live Step Interactive Preview Showcase ── */}
      <div className="relative rounded-3xl border border-zinc-800/90 bg-[#06080a] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle, #d6ff34 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d6ff34]/30 bg-[#161a08] px-3 py-1 text-xs font-semibold text-[#d6ff34]">
              <span>Stage {step.step} Preview</span>
            </div>
            <h4 className="text-xl font-extrabold text-white sm:text-2xl">{step.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.body}</p>
          </div>

          {/* Interactive Dynamic Display Box */}
          <div className="w-full md:w-auto min-w-[300px] sm:min-w-[380px] rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-inner">
            {activeStep === 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="text-xs font-mono text-zinc-400">{STEPS[0].preview.badge}</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#d6ff34]/40 bg-[#161a08] text-[#d6ff34] text-[11px] font-semibold">
                    <span className="size-1.5 rounded-full bg-[#d6ff34] animate-pulse" />
                    {STEPS[0].preview.status}
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">{STEPS[0].preview.val}</p>
                  <p className="text-xs text-zinc-400 mt-1">{STEPS[0].preview.sub}</p>
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Beneficiary Allocation Split</p>
                {STEPS[1].preview.beneficiaries.map((b) => (
                  <div key={b.name} className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3">
                    <div className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                      <span>{b.name}</span>
                      <span className="text-[#d6ff34]">{b.share} ({b.amount})</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                      <div className="h-full rounded-full bg-[#d6ff34]" style={{ width: b.share }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold">
                  <Clock className="size-3.5" />
                  <span>{STEPS[2].preview.timer}</span>
                </div>
                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-xl bg-[#d6ff34] text-black font-bold text-sm hover:bg-[#c4f028] transition-all shadow-[0_0_20px_rgba(214,255,52,0.3)] cursor-pointer"
                >
                  {STEPS[2].preview.buttonText}
                </button>
                <p className="text-xs text-zinc-500">{STEPS[2].preview.statusMsg}</p>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#d6ff34]">
                  <ShieldCheck className="size-4" />
                  <span>{STEPS[3].preview.claimStatus}</span>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5">
                  <p className="text-sm font-bold text-white">{STEPS[3].preview.claimText}</p>
                  <p className="text-xs text-zinc-400 mt-1">{STEPS[3].preview.security}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Safety                                                                     */
/* -------------------------------------------------------------------------- */

const SAFETY_POINTS = [
  {
    icon: Landmark,
    title: "Not held by the company",
    body: "Your money sits in a secure smart contract — a program with fixed rules — not in an account controlled by us.",
  },
  {
    icon: Clock,
    title: "72-hour safety delay",
    body: "Withdrawals and big changes wait 72 hours before they go through. If something was not you, you can cancel it.",
  },
  {
    icon: Bell,
    title: "Reminders first",
    body: "We remind you several times before anything happens. Nothing changes while you keep checking in.",
  },
  {
    icon: ShieldCheck,
    title: "Nothing is released while you check in",
    body: "As long as you check in, your vault stays yours. Claims only become possible after the quiet time you set, plus a grace period.",
  },
] as const;

function SafetySection() {
  return (
    <section
      id="safety"
      className="relative scroll-mt-24 rounded-t-[80px] sm:rounded-t-[130px] bg-[#d6ff34] border-t-4 border-[#d6ff34] px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-24 lg:px-14 text-black"
    >
      <Reveal className="mx-auto w-full max-w-6xl">
        <p className="mb-3 text-sm font-extrabold text-black/80 tracking-wider uppercase">
          Safety
        </p>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-black">
          Safety, in plain words.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-black/85 md:text-xl font-medium">
          No jargon. Here is exactly how your money is protected.
        </p>

        {/* Safety Boxes - SOLID BLACK boxes with WHITE visible text */}
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {SAFETY_POINTS.map((point, i) => {
            const Icon = point.icon;
            return (
              <Reveal key={point.title} delay={i * 0.06} className="h-full">
                <div className="flex h-full flex-col gap-4 rounded-2xl border border-black/20 bg-black p-7 transition-all duration-300 hover:scale-[1.02] shadow-2xl">
                  <div className="grid size-12 place-items-center rounded-xl border border-zinc-800 bg-zinc-900 text-[#d6ff34]">
                    <Icon className="size-6 text-[#d6ff34]" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{point.title}</h3>
                  <p className="text-base leading-relaxed text-zinc-100 font-normal">
                    {point.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-black/80 font-semibold">
          Vault balances and timers are visible on the public test network. Your beneficiaries are
          not told anything until a claim becomes possible.
        </p>
      </Reveal>
    </section>
  );
}


/* -------------------------------------------------------------------------- */
/* You stay in control                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Card surface for the control points. The rest state is deliberately plain;
 * everything that changes on hover is attached to the `hover:` modifiers at
 * the call site so the whole transition reads in one place.
 */
const CONTROL_CARD =
  "group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-md transition-all duration-300 ease-in-out cursor-default";

function ControlSection() {
  const points = [
    {
      icon: RefreshCw,
      title: "Change your mind any time",
      body: "Update vault amounts, timing windows, beneficiary shares, or anything else — your vault is always yours to edit. No fees, no delays.",
      stat: "100%",
      statLabel: "updatable",
    },
    {
      icon: UserMinus,
      title: "Remove a beneficiary instantly",
      body: "If you remove someone, their share is held back — it is not automatically redistributed to others. You decide what happens to it.",
      stat: "0s",
      statLabel: "delay to remove",
    },
    {
      icon: ShieldCheck,
      title: "Name a fallback person",
      body: "Any unallocated share goes to the fallback person you chose in advance. Nobody gets a surprise windfall — everything is deliberate.",
      stat: "1",
      statLabel: "designated fallback",
    },
    {
      icon: Clock,
      title: "Set your own check-in rhythm",
      body: "Daily, weekly, monthly — the check-in window is yours to choose. Miss a few? You get grace-period warnings before anything moves.",
      stat: "Flexible",
      statLabel: "intervals",
    },
    {
      icon: Bell,
      title: "Get warned before anything happens",
      body: "2ndKey sends you reminders well before a vault unlock. You will never be caught off guard by your own timer.",
      stat: "3×",
      statLabel: "reminders sent",
    },
    {
      icon: Lock,
      title: "Pause or close anytime",
      body: "Situations change. Pause the vault clock, withdraw your funds, or close the vault entirely — no questions asked, no penalties.",
      stat: "Always",
      statLabel: "reversible",
    },
  ] as const;

  return (
    <Section
      id="control"
      eyebrow="You stay in control"
      title="Your plan, your rules."
      lead="You are never locked in. Edit, pause, or close your vault at any time — because life rarely goes exactly to plan."
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {points.map((point, i) => {
          const Icon = point.icon;
          return (
            <m.li
              key={point.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={cn(
                CONTROL_CARD,
                "hover:border-[#d6ff34] hover:bg-[#0c1006]",
                "hover:shadow-[0_12px_32px_-10px_rgba(214,255,52,0.35)]"
              )}
            >
              {/*
                Corner brackets that snap in on hover. Scaled to 14px so they
                tuck into the padding and clear the icon tile.
              */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              >
                <div className="absolute left-2.5 top-2.5 h-3.5 w-3.5 border-l-2 border-t-2 border-[#d6ff34]" />
                <div className="absolute bottom-2.5 right-2.5 h-3.5 w-3.5 border-b-2 border-r-2 border-[#d6ff34]" />
              </div>

              {/* Icon + Stat row */}
              <div className="flex items-start justify-between">
                <div className="grid size-11 place-items-center rounded-xl border border-zinc-800 bg-black transition-all duration-200 group-hover:scale-105 group-hover:border-[#d6ff34]/40 group-hover:bg-[#161a08]">
                  <Icon className="size-5 text-[#d6ff34]" aria-hidden="true" />
                </div>
                <div className="text-right">
                  <p className="text-xl font-extrabold text-[#d6ff34] leading-none">{point.stat}</p>
                  <p className="text-2xs text-zinc-500 mt-0.5 uppercase tracking-wide">{point.statLabel}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base leading-snug text-white transition-colors duration-300 group-hover:text-[#d6ff34]">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400 transition-colors duration-300 group-hover:text-zinc-200">
                  {point.body}
                </p>
              </div>
            </m.li>
          );
        })}
      </ul>

      {/* Bottom callout */}
      <m.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 rounded-2xl border border-[#d6ff34]/20 bg-[#161a08]/60 p-5 flex flex-col sm:flex-row items-center gap-4"
      >
        <ShieldCheck className="size-6 text-[#d6ff34] shrink-0" aria-hidden="true" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          <span className="font-semibold text-white">Nothing moves automatically.</span>{" "}
          Every vault action requires your explicit instruction. The protocol enforces this on-chain — not just as a policy.
        </p>
      </m.div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Getting the money                                                          */
/* -------------------------------------------------------------------------- */

type MoneyOption = {
  icon: LucideIcon;
  title: string;
  body: string;
  badge?: CardBadge;
  /** Supporting detail lines rendered under the summary. */
  points: readonly string[];
};

const MONEY_OPTIONS: MoneyOption[] = [
  {
    icon: Wallet,
    title: "Keep it in USDC",
    body: "The money stays where it is, ready to use whenever they choose. No technical knowledge needed to receive a share.",
    badge: { label: "Available now", tone: "available" },
    points: [
      "Arrives in the wallet address you named — no sign-up or account to open",
      "Each share is the exact percentage you set, not a fixed amount",
      "Paid out by the vault contract; we never hold your funds",
    ],
  },
  {
    icon: Banknote,
    title: "Cash out to local currency",
    body: "Where available, heirs can convert to local money — for example Ghana cedis through mobile money. We are testing this now.",
    badge: { label: "Coming soon", tone: "soon" },
    points: [
      "Rolling out Ghana first, then Kenya and Nigeria",
      "Conversion happens after the payout — your vault and its shares do not change",
      "Still in testing, so there is no promised date yet",
    ],
  },
];

function MoneySection() {
  return (
    <Section
      id="getting-the-money"
      eyebrow="Getting the money"
      title="Simple options for the people who receive."
      lead="Heirs can keep the money as is, or turn it into local currency where that is available."
    >
      <div className="relative">
        {/*
          Ambient neon that sits behind the glass. Without something to blur the
          cards read as flat panels, so these soft pools are part of the effect
          rather than decoration.
        */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 left-[8%] size-64 rounded-full bg-[#d6ff34]/10 blur-3xl" />
          <div className="absolute -bottom-20 right-[6%] size-72 rounded-full bg-[#d6ff34]/[0.07] blur-3xl" />
        </div>

        <div className="relative grid gap-5 md:grid-cols-2">
          {MONEY_OPTIONS.map((option, index) => {
            const Icon = option.icon;
            return (
              <Reveal key={option.title} delay={index * 0.08} className="h-full">
                <FeatureCard
                  icon={<Icon className="size-6 text-[#d6ff34]" aria-hidden="true" />}
                  title={option.title}
                  badge={option.badge}
                  points={option.points}
                >
                  {option.body}
                </FeatureCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Who it is for                                                              */
/* -------------------------------------------------------------------------- */

function WhoSection() {
  const profiles = [
    {
      icon: Users,
      label: "Families",
      headline: "For people who think ahead",
      body: "Anyone who wants the people they love to be taken care of — without lawyers, courtrooms, or confusing paperwork. Set it up once and rest easy.",
      quote: "\"My kids are in three different countries. 2ndKey means no one has to fight over anything.\"",
    },
    {
      icon: Wallet,
      label: "Stablecoin holders",
      headline: "For people who already own USDC",
      body: "If you hold stablecoins, you already know they need a succession plan. Traditional wills don't cover on-chain assets. 2ndKey does.",
      quote: "\"I kept wondering — what happens to my USDC when I'm gone? Now I have an answer.\"",
    },
    {
      icon: Smartphone,
      label: "Diaspora families",
      headline: "For people supporting relatives abroad",
      body: "Send support from anywhere in the world. Beneficiaries get a simple mobile-first experience — no crypto wallet required to receive their share.",
      quote: "\"My mum in Accra doesn't know what a wallet is. With 2ndKey she doesn't need to.\"",
    },
    {
      icon: Landmark,
      label: "Crypto-savvy individuals",
      headline: "For people who value self-custody",
      body: "Your keys stay yours. The vault logic runs on-chain using FHE encryption — no custodian can freeze, redirect, or access your funds.",
      quote: "\"Finally, inheritance that doesn't require trusting a third party with my crypto.\"",
    },
    {
      icon: Heart,
      label: "Caregivers",
      headline: "For people planning for dependants",
      body: "Whether you are caring for aging parents, a sibling, or a child — you can earmark funds specifically for them with conditional access.",
      quote: "\"I set up a vault for my younger brother. He'll be looked after no matter what happens.\"",
    },
    {
      icon: Star,
      label: "Early adopters",
      headline: "For people who want to be first",
      body: "2ndKey is live on Base Sepolia. Test the full experience for free right now, and be first in line when it goes to mainnet.",
      quote: "\"I was vault number 12. It just works — simple, clean, and actually encrypted.\"",
    },
  ] as const;

  return (
    <Section id="who" eyebrow="Who it is for" title="Built for real people in real situations." lead="Not a product for crypto experts only — 2ndKey is for anyone who has people depending on them.">
      {/*
        Divider grid rather than six separate cards: the wrapper draws the top
        and left rules, each cell draws its own bottom and right, so the rules
        land flush at any column count without per-index breakpoint maths.
      */}
      <div className="grid grid-cols-1 border-l border-t border-white/10 sm:grid-cols-2 lg:grid-cols-3">
        {profiles.map((p, i) => {
          const Icon = p.icon;
          return (
            <m.div
              key={p.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="group/who relative flex flex-col border-b border-r border-white/10 px-7 py-9 sm:px-8"
            >
              {/* Wash rising off the bottom rule, revealed on hover. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/[0.07] to-transparent opacity-0 transition-opacity duration-200 group-hover/who:opacity-100"
              />

              <div className="relative z-10 mb-4 flex items-start justify-between gap-4">
                <Icon className="size-6 shrink-0 text-[#d6ff34]" aria-hidden="true" />
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-zinc-400 transition-colors duration-200 group-hover/who:border-[#d6ff34]/30 group-hover/who:text-[#d6ff34]">
                  {p.label}
                </span>
              </div>

              <h3 className="relative z-10 mb-2 text-lg font-bold leading-snug text-white">
                {/* Accent tick on the cell's left edge; grows and lights up on hover. */}
                <span
                  aria-hidden="true"
                  className="absolute -left-7 top-0 h-6 w-1 origin-center rounded-tr-full rounded-br-full bg-white/15 transition-all duration-200 group-hover/who:h-8 group-hover/who:bg-[#d6ff34] sm:-left-8"
                />
                <span className="inline-block transition-transform duration-200 group-hover/who:translate-x-2">
                  {p.headline}
                </span>
              </h3>

              <p className="relative z-10 max-w-xs text-sm leading-relaxed text-zinc-400">
                {p.body}
              </p>

              <p className="relative z-10 mt-auto pt-6 text-xs italic leading-relaxed text-zinc-500">
                {p.quote}
              </p>
            </m.div>
          );
        })}
      </div>

      {/* Footer strip */}
      <m.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-5"
      >
        <div className="flex items-center gap-3">
          <MapPin className="size-5 text-[#d6ff34] shrink-0" aria-hidden="true" />
          <p className="text-sm text-zinc-300">
            <span className="font-semibold text-white">Starting in Ghana,</span> then Kenya and Nigeria — more countries on the roadmap.
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-[#d6ff34]/30 bg-[#161a08] px-4 py-1.5 text-xs font-semibold text-[#d6ff34]">
          Live on Base Sepolia
        </span>
      </m.div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Our promise                                                                */
/* -------------------------------------------------------------------------- */

function PromiseSection() {
  const lines = [
    "We do not hold your funds. Your money stays in the vault contract, under rules neither you nor we can bend.",
    "We do not promise returns. There is no yield, no investment, no trading.",
    "We are honest about what is still being tested. 2ndKey is in its test phase and we will tell you plainly what works and what does not yet.",
    "Your unclaimed money never expires. The people you named can claim it for as long as it takes.",
    "You can leave whenever you want. Withdrawals wait 72 hours for safety, and you can cancel them.",
  ] as const;

  return (
    <Section id="promise" eyebrow="Our promise" title="Honest, from the start." centered>
      <ul className="grid gap-4">
        {lines.map((line, i) => (
          <Reveal key={line} delay={i * 0.06}>
            <li className="flex gap-4 rounded-2xl border border-zinc-800 bg-black p-6 text-left transition-colors duration-300 hover:border-[#d6ff34]/40">
              <Heart className="mt-0.5 size-5 shrink-0 text-[#d6ff34]" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-zinc-200">{line}</p>
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* FAQ                                                                        */
/* -------------------------------------------------------------------------- */

const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "What if I forget to check in on time?",
    answer:
      "We send automated email and telegram alerts before your deadline. If missed, a grace period begins. You can still check in during the grace period to reset the switch. Payouts only unlock after both the check-in window and grace period expire.",
  },
  {
    id: "faq-2",
    question: "Can I change or remove beneficiaries later?",
    answer:
      "Yes, at any time. You retain 100% control as vault owner. You can modify percentage allocations, add new addresses, or instantly remove beneficiaries with zero delay.",
  },
  {
    id: "faq-3",
    question: "How does 2ndKey protect my privacy?",
    answer:
      "2ndKey uses FHEVM (Fully Homomorphic Encryption EVM) on Base Sepolia. Beneficiary addresses and percentage allocations are encrypted on-chain, keeping your inheritance plans private until payout criteria are met.",
  },
  {
    id: "faq-4",
    question: "Do my beneficiaries need technical crypto knowledge?",
    answer:
      "No. When a claim unlocks, beneficiaries simply connect their wallet to the 2ndKey Claim Portal. The smart contract steps them through claiming their allocated USDC inheritance.",
  },
  {
    id: "faq-5",
    question: "Are my funds locked permanently?",
    answer:
      "No. As long as you remain active and check in according to your schedule, your vault stays locked and fully under your sole control. You can pause, adjust, or close your vault whenever you choose.",
  },
] as const;

function FaqSection() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  return (
    <Section id="faq" eyebrow="FAQ" title="Honest answers to fair questions." centered>
      <div className="mx-auto max-w-3xl space-y-3 text-left">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openId === item.id;
          return (
            <m.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={cn(
                "rounded-2xl border transition-all duration-300 overflow-hidden",
                isOpen
                  ? "border-[#d6ff34]/40 bg-zinc-900/90 shadow-[0_0_25px_rgba(214,255,52,0.06)]"
                  : "border-zinc-800/80 bg-zinc-950/60 hover:border-zinc-700"
              )}
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left text-base font-bold text-white transition-colors cursor-pointer"
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                <div
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-xl border transition-all duration-300",
                    isOpen
                      ? "border-[#d6ff34]/50 bg-[#161a08] text-[#d6ff34] rotate-180"
                      : "border-zinc-800 bg-zinc-900 text-zinc-400 group-hover:text-white"
                  )}
                >
                  <ChevronDown className="size-4" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <m.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <div className="border-t border-zinc-800/60 px-5 pb-5 pt-3 text-sm leading-relaxed text-zinc-300 font-normal">
                      {item.answer}
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </m.div>
          );
        })}
      </div>
      <p className="mt-8 mx-auto max-w-xl text-center text-xs leading-relaxed text-zinc-400">
        Have more technical questions? Check out our{" "}
        <Link href="/help" className="text-[#d6ff34] hover:underline font-semibold">
          Help &amp; Support Hub
        </Link>
        .
      </p>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Final call-to-action                                                       */
/* -------------------------------------------------------------------------- */


function ClosingCta() {
  const { wallet } = useFHEVMWallet();
  const isConnected = wallet.isConnected;

  return (
    <section className="px-5 pb-20 pt-8 sm:px-8 sm:pb-24 lg:px-14 bg-black">
      <div className="mx-auto w-full max-w-5xl">
        <Reveal>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center sm:p-14 relative overflow-hidden shadow-2xl">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight relative z-10">
              Set it up once, for the people who matter.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-zinc-300 relative z-10">
              Start with a test vault today while 2ndKey is in its test phase.
            </p>
            <div className="mt-8 flex justify-center relative z-10">
              <Link href={isConnected ? "/dashboard" : "/signin"}>
                <button className="h-13 px-9 py-3.5 rounded-full bg-[#d6ff34] text-black font-extrabold text-base hover:bg-[#c2f82c] transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <span>{isConnected ? "Visit Dashboard" : "Get started"}</span>
                  <ArrowRight className="size-5 text-black" />
                </button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Footer                                                                     */
/* -------------------------------------------------------------------------- */

const FOOTER_LINK_GROUPS = [
  {
    title: "Product",
    links: [
      { href: "#how-it-works", label: "How it works" },
      { href: "#safety", label: "Safety" },
      { href: "#getting-the-money", label: "Getting the money" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#why", label: "Why 2ndKey" },
      { href: "#community", label: "Community" },
      { href: "#promise", label: "Our promise" },
      { href: "#who", label: "Who it is for" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "#faq", label: "FAQ" },
      { href: "/design", label: "Design system" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
] as const;

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="border-t border-zinc-900 bg-black text-white">
      <div className="w-full px-5 sm:px-8 lg:px-14">
        {/* Top: brand + link columns */}
        <div className="grid gap-12 py-14 lg:grid-cols-[1.2fr_2fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              A calm way to make sure your digital money reaches the people you choose.
            </p>

            {/* Newsletter */}
            <div className="mt-8">
              <p className="text-sm font-semibold text-white">Get launch updates</p>
              <p className="mt-1 text-xs text-zinc-400">
                An occasional email when something ships. Nothing else.
              </p>
              {subscribed ? (
                <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/80 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                  <Check className="size-3.5" aria-hidden="true" />
                  You are on the list.
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
                  <label htmlFor="footer-email" className="sr-only">
                    Email address
                  </label>
                  <Input
                    id="footer-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-11 flex-1 bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-500"
                  />
                  <button type="submit" className="h-11 px-5 rounded-xl bg-[#d6ff34] text-black font-semibold text-xs hover:bg-[#c2f82c] transition-colors" aria-label="Subscribe">
                    <Send className="size-4 text-black" aria-hidden="true" />
                  </button>
                </form>
              )}
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:pl-10"
          >
            {FOOTER_LINK_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="text-2xs font-extrabold uppercase tracking-wider text-zinc-500">
                  {group.title}
                </p>
                <ul className="mt-4 flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-400 transition-colors hover:text-[#d6ff34]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Status bar */}
        <div className="flex flex-col gap-4 border-t border-zinc-900 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#d6ff34]/30 bg-[#161a08] px-3 py-1 text-xs font-semibold text-[#d6ff34]">
              <span className="size-1.5 animate-pulse rounded-full bg-[#d6ff34]" aria-hidden="true" />
              Base Sepolia Testnet
            </span>
            <span className="text-xs text-zinc-400">
              Ghana first, then Kenya and Nigeria
            </span>
          </div>
          <div className="flex items-center gap-2">
            {[
              { icon: Twitter, label: "2ndKey on X", href: "#" },
              { icon: Github, label: "2ndKey on GitHub", href: "#" },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="grid size-9 place-items-center rounded-full border border-zinc-800 text-zinc-400 transition-colors hover:border-[#d6ff34]/50 hover:text-[#d6ff34]"
              >
                <Icon className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-3 border-t border-zinc-900 py-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-3xl text-xs leading-relaxed text-zinc-400">
            2ndKey is in a testing phase. It is not a bank, deposits are not insured, and nothing
            here is financial or legal advice.
          </p>
          <p className="shrink-0 text-xs text-zinc-400">
            &copy; {new Date().getFullYear()} 2ndKey
          </p>
        </div>
      </div>

      {/* Giant cropped wordmark — centred, fills the footer width */}
      <div aria-hidden="true" className="mt-2 select-none overflow-hidden">
        <p
          className="w-full px-5 text-center text-[clamp(4.5rem,26vw,26rem)] font-black leading-[0.82] tracking-tighter sm:px-8 lg:px-14"
          style={{
            background: "linear-gradient(180deg, rgba(214,255,52,0.7) 0%, rgba(214,255,52,0.42) 45%, rgba(214,255,52,0.12) 80%, transparent 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          2ndKey
        </p>
      </div>
    </footer>
  );
}


/* -------------------------------------------------------------------------- */
/* Stats / By the Numbers                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Figures shown in the landing page stats band.
 * Restyled only — values, labels and supporting lines are unchanged.
 */
const LANDING_STATS: StatItem[] = [
  {
    icon: ShieldCheck,
    value: "99.97%",
    label: "On-chain Uptime",
    sublabel: "Base Sepolia Testnet",
  },
  {
    icon: Clock,
    value: "< 10 min",
    label: "Setup Time",
    sublabel: "From wallet to vault",
  },
  {
    icon: Lock,
    value: "72 hrs",
    label: "Safety Buffer",
    sublabel: "On all withdrawals",
  },
  {
    icon: Heart,
    value: "100%",
    label: "Non-custodial",
    sublabel: "You keep your keys",
  },
];


/* -------------------------------------------------------------------------- */
/* Page assembly                                                               */
/* -------------------------------------------------------------------------- */

export function LandingPage() {
  return (
    /*
      One LazyMotion provider for the whole page. Everything below uses `m`,
      which resolves from this provider, so the bundle carries only the
      `domAnimation` feature set (~15kb) instead of every framer-motion
      feature. The features are loaded synchronously, so no animation waits
      on a network round trip.
    */
    <LazyMotion features={domAnimation}>
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <Hero />
      <Reveal>
        <Stats
          id="stats"
          eyebrow="By the numbers"
          title="Built for trust, proven on-chain."
          subtitle="Every number here is backed by smart contract data — transparent, immutable, verifiable."
          items={LANDING_STATS}
        />
      </Reveal>
      <WhySection />
      <HowItWorksSection />
      <SafetySection />
      <CommunityTestimonials />
      <ControlSection />
      <MoneySection />
      <WhoSection />
      <PromiseSection />
      <FaqSection />
      <ClosingCta />
      <Footer />
    </div>
    </LazyMotion>
  );
}
