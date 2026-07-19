"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/academics", label: "Academics" },
  { href: "/staff-page", label: "Staff" },
  { href: "/news", label: "News" },
  { href: "/apply", label: "Apply" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-navy/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-11 w-11 overflow-hidden rounded-md border border-gold bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="Qhemegha SPS crest"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="leading-tight">
            <p className="font-heading text-lg font-bold text-navy">
              Qhemegha SPS
            </p>
            <p className="text-[10px] uppercase tracking-wide text-gold">
              Sebenza Uphumelela
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-navy hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild size="sm" className="bg-gold text-navy hover:bg-gold-dark">
            <Link href="/apply">Apply online</Link>
          </Button>
        </nav>

        <button
          className="rounded-sm p-2 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6 text-navy" /> : <Menu className="h-6 w-6 text-navy" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-navy/10 bg-white px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-3 pt-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-navy hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="bg-gold text-navy hover:bg-gold-dark w-full">
              <Link href="/apply" onClick={() => setOpen(false)}>
                Apply online
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
