"use client";

import { useMemo, useState } from "react";
import { Calendar, MapPin, Clock, ArrowUpRight, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { useEventStore } from "@/lib/store";
import { categoryPills, sortBySoonest } from "@/lib/event-utils";
import type { EventCategory } from "@/lib/seed";

const categoryAccents: Record<EventCategory | "all", string> = {
  all: "var(--acid-violet)",
  music: "var(--acid-pink)",
  art: "var(--acid-cyan)",
  food: "var(--acid-amber)",
  sports: "#22C55E",
  family: "#F59E0B",
  nightlife: "var(--acid-violet)",
};

const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    day: d.getDate(),
    month: MONTHS[d.getMonth()],
    weekday: d.toLocaleDateString("id-ID", { weekday: "long" }),
    time: d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function HomePage() {
  const events = useEventStore((s) => s.events);
  const [category, setCategory] = useState<EventCategory | "all">("all");

  const filtered = useMemo(() => {
    const list = category === "all" ? events : events.filter((e) => e.category === category);
    return sortBySoonest(list);
  }, [events, category]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      {/* ═══ MARQUEE TICKER ═══ */}
      <div className="border-brutal-b overflow-hidden bg-[#0A0A0A] py-3">
        <div className="marquee-track">
          {[...events, ...events].map((e, i) => (
            <span
              key={`${e.id}-${i}`}
              className="mx-6 text-xs font-bold uppercase tracking-[0.2em] text-zinc-600 whitespace-nowrap"
            >
              {e.title}
              <span className="mx-4 text-zinc-800">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ HERO POSTER ═══ */}
      {featured && (
        <section className="hero-poster" style={{ minHeight: "70vh" }}>
          {featured.imageUrl ? (
            <Image
              src={featured.imageUrl}
              alt={featured.title}
              fill
              className="hero-poster-bg"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-black to-zinc-950" />
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-[1]" />

          <div className="hero-poster-content">
            <div className="max-w-3xl space-y-6">
              {/* Category tag */}
              <span className="hero-category-tag">{featured.category}</span>

              {/* Title — massive */}
              <h1
                className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-white"
                style={{ fontFamily: "var(--font-archivo-black)" }}
              >
                {featured.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-white/70">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-white/40" />
                  {formatDate(featured.date).weekday},{" "}
                  <strong className="text-white">{formatDate(featured.date).day}</strong>{" "}
                  {formatDate(featured.date).month}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-white/40" />
                  {formatDate(featured.date).time}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-white/40" />
                  {featured.location || "Jakarta"}
                </span>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-3 pt-4">
                <Link href={`/event/${featured.id}`} className="btn-brutal">
                  View Event
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <button className="btn-brutal btn-brutal-outline">
                  <Star className="h-4 w-4" />
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Date badge — top right, large */}
          <div className="absolute right-6 top-6 z-10 sm:right-10 sm:top-10">
            <div className="border-2 border-white/20 bg-black/80 px-5 py-3 text-center backdrop-blur-xl">
              <div
                className="text-5xl font-black leading-none text-white sm:text-7xl"
                style={{ fontFamily: "var(--font-archivo-black)" }}
              >
                {formatDate(featured.date).day}
              </div>
              <div className="mt-1 text-xs font-bold tracking-[0.2em] text-white/50">
                {formatDate(featured.date).month}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ CATEGORY STRIP — Horizontal Scroll ═══ */}
      <section className="border-brutal-b py-6">
        <div className="px-6 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
            Filter by vibe
          </span>
        </div>
        <div className="scroll-strip px-6">
          <button
            onClick={() => setCategory("all")}
            className={`scroll-pill ${category === "all" ? "active" : ""}`}
          >
            All
          </button>
          {categoryPills.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key as EventCategory)}
              className={`scroll-pill ${category === cat.key ? "active" : ""}`}
              style={category === cat.key ? { borderColor: categoryAccents[cat.key as EventCategory], background: categoryAccents[cat.key as EventCategory] } : undefined}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ═══ EVENTS — Asymmetric Grid ═══ */}
      <section className="px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2
            className="text-3xl font-black tracking-tighter sm:text-4xl"
            style={{ fontFamily: "var(--font-archivo-black)" }}
          >
            {category === "all" ? "THIS_WEEKEND" : category.toUpperCase()}
          </h2>
          <span className="text-sm text-zinc-600">{filtered.length} events</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-brutal">
            <Calendar className="mx-auto mb-4 h-10 w-10 text-zinc-800" />
            <p
              className="text-lg font-black text-zinc-600"
              style={{ fontFamily: "var(--font-archivo-black)" }}
            >
              NO EVENTS FOUND
            </p>
            <button
              onClick={() => setCategory("all")}
              className="mt-4 text-sm font-bold text-zinc-400 hover:text-white transition-colors"
            >
              Clear filters →
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((event, i) => {
              const date = formatDate(event.date);
              const accent = categoryAccents[event.category];
              // Varied card sizes: first card spans 2 cols, others are normal
              const isWide = i === 0;

              return (
                <Link
                  key={event.id}
                  href={`/event/${event.id}`}
                  className={`poster-card group flex flex-col bleed-violet ${
                    isWide ? "sm:col-span-2" : ""
                  }`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {event.imageUrl ? (
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(135deg, ${accent}40, #000)` }}
                      />
                    )}

                    {/* Date badge on image */}
                    <div className="absolute left-3 top-3 z-10 border-2 border-white/20 bg-black/80 px-3 py-1.5 text-center backdrop-blur-md">
                      <div
                        className="text-xl font-black leading-none text-white"
                        style={{ fontFamily: "var(--font-archivo-black)" }}
                      >
                        {date.day}
                      </div>
                      <div className="text-[9px] font-bold tracking-[0.15em] text-white/50">
                        {date.month}
                      </div>
                    </div>

                    {/* Category stripe on image */}
                    <div
                      className="absolute right-0 top-4 z-10 px-3 py-1"
                      style={{ background: accent }}
                    >
                      <span className="text-[9px] font-black uppercase tracking-[0.12em] text-black">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-1 flex-col gap-2 p-4">
                    <h3
                      className="text-base font-bold leading-tight text-white group-hover:text-white/90 transition-colors line-clamp-2 sm:text-lg"
                      style={{ fontFamily: "var(--font-archivo-black)" }}
                    >
                      {event.title}
                    </h3>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-zinc-600">
                        <Clock className="h-3 w-3" />
                        {date.time}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.08em] text-zinc-500 group-hover:text-white transition-colors">
                        Details
                        <ArrowUpRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ═══ NEWSLETTER CTA — brutalist ═══ */}
      <section className="mx-6 border-2 border-zinc-800 p-8 sm:p-12">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h3
            className="text-3xl font-black tracking-tighter sm:text-4xl"
            style={{ fontFamily: "var(--font-archivo-black)" }}
          >
            NEVER MISS A WEEKEND
          </h3>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Jakarta&apos;s best events. Every Friday. No spam. Just the good stuff.
          </p>
          <div className="flex gap-3 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 border-2 border-zinc-800 bg-transparent px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:border-white focus:outline-none transition-colors"
            />
            <button className="btn-brutal flex-shrink-0 text-xs">Subscribe</button>
          </div>
        </div>
      </section>

      <div className="h-16" />
    </>
  );
}
