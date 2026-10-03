"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { motion } from "framer-motion";

import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { useFHEVMWallet } from "@/components/providers/fhevmWalletProvider";

const NAV_LINKS = [
  { href: "#how-it-works", id: "how-it-works", label: "How it works" },
  { href: "#safety", id: "safety", label: "Safety" },
  { href: "#faq", id: "faq", label: "FAQ" },
] as const;

export function LandingHeader() {
  const { wallet } = useFHEVMWallet();
  const isConnected = wallet.isConnected;
  const [floating, setFloating] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFloating(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* Sentinel for top 24px scroll detection */}
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-6 w-full"
      />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:border focus:border-zinc-800 focus:bg-black focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 transition-all duration-300 bg-transparent"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        {/* Capsule animation container */}
        <div
          className={cn(
            "mx-auto flex items-center justify-between gap-4 transition-all duration-300 ease-in-out",
            floating
              ? "mt-3 w-[calc(100%-2rem)] max-w-[900px] rounded-full border border-white/15 bg-black/40 backdrop-blur-lg px-5 py-2 shadow-2xl shadow-black/60"
              : "mt-0 w-full max-w-[1400px] rounded-none border border-transparent bg-transparent backdrop-blur-none px-6 sm:px-10 lg:px-16 py-2.5 shadow-none"
          )}
        >
          {/* 2ndKey Brand Logo */}
          <Link href="/" aria-label="2ndKey home" onClick={closeMenu} className="flex items-center gap-2">
            <Logo />
          </Link>

          {/* Navigation Links */}
          <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={activeId === link.id ? "true" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  activeId === link.id
                    ? "bg-zinc-800 text-[#d6ff34]"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!isConnected && (
              <>
                <Link
                  href="/signin"
                  className="hidden text-sm font-medium text-zinc-300 transition-colors hover:text-white md:block"
                >
                  Sign in
                </Link>
                <Link href="/signin">
                  <button className="h-8 sm:h-9 px-4 sm:px-5 rounded-full bg-[#d6ff34] text-black font-bold text-xs sm:text-sm hover:bg-[#c2f82c] transition-colors cursor-pointer">
                    Get started
                  </button>
                </Link>
              </>
            )}
            <button
              ref={menuButtonRef}
              type="button"
              className="grid size-8 sm:size-9 place-items-center rounded-full border border-zinc-800 text-white md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="size-3.5" aria-hidden="true" /> : <Menu className="size-3.5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            id="mobile-nav"
            className="mx-auto mt-2 w-[calc(100%-32px)] max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl md:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  aria-current={activeId === link.id ? "true" : undefined}
                  className={cn(
                    "rounded-xl px-4 py-3 text-base font-medium",
                    activeId === link.id
                      ? "bg-zinc-900 text-[#d6ff34]"
                      : "text-zinc-300 hover:bg-zinc-900/50"
                  )}
                >
                  {link.label}
                </a>
              ))}
              {!isConnected && (
                <Link
                  href="/signin"
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 text-base font-medium text-zinc-300 hover:bg-zinc-900/50"
                >
                  Sign in
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
