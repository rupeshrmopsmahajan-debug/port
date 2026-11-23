"use client";

import * as React from "react";
import Link from "next/link";
import { type ClassValue, clsx } from "clsx";
import { motion, useReducedMotion } from "motion/react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export interface EssayItem {
  id: string;
  title: string;
  date: string;
  href?: string;
}

export interface WritingSectionProps {
  intro?: string;
  essays?: EssayItem[];
  showDots?: boolean;
  className?: string;
}

const GLIDE = [0.22, 1, 0.36, 1] as const;

const DEFAULT_ESSAYS: EssayItem[] = [
  { id: "outcomes", title: "Outcomes", date: "29.JUL.2026", href: "/writing/outcomes" },
  { id: "manufacturing-luck", title: "Manufacturing Luck", date: "09.JUN.2026", href: "/writing/manufacturing-luck" },
  { id: "taste-cant-be-prompted", title: "Taste Can't Be Prompted", date: "17.APR.2026", href: "/writing/taste-cant-be-prompted" },
  { id: "trying-to-be-human", title: "Trying to Be Human", date: "07.DEC.2025", href: "/writing/trying-to-be-human" },
  { id: "buy-a-domain", title: "Buy a Domain", date: "02.DEC.2025", href: "/writing/buy-a-domain" },
  { id: "stop-writing-fictional-case-studies", title: "Stop Writing Fictional Case Studies", date: "26.NOV.2025", href: "/writing/stop-writing-fictional-case-studies" },
  { id: "design-is-the-moat", title: "Design Is The Moat", date: "15.NOV.2025", href: "/writing/design-is-the-moat" },
  { id: "growth-without-hacks", title: "Growth Without Hacks", date: "05.NOV.2025", href: "/writing/growth-without-hacks" },
  { id: "make-something-you-want", title: "Make Something YOU Want", date: "01.NOV.2025", href: "/writing/make-something-you-want" },
];

export const WritingSection = React.forwardRef<HTMLElement, WritingSectionProps>(
  function WritingSection(
    {
      intro = "I write whenever inspiration strikes, which means I'm pretty irregular about it. These are my raw thoughts on design, building products, and the startup journey. Some are polished, others are more stream-of-consciousness, but they all capture what I was thinking about at the time.",
      essays = DEFAULT_ESSAYS,
      showDots = true,
      className,
    },
    ref,
  ) {
    const still = !!useReducedMotion();

    return (
      <motion.section
        ref={ref}
        initial={still ? false : { opacity: 0, y: 14 }}
        whileInView={still ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: GLIDE }}
        className={cn(
          "w-full rounded-[26px] bg-white p-6 text-[#242423] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.14)] sm:p-8 dark:bg-zinc-900 dark:text-zinc-100",
          className,
        )}
      >
        {/* Intro Paragraph */}
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-[15px] dark:text-zinc-300">
          {intro}
        </p>

        {/* Essays List */}
        <ul className="mt-8 space-y-1">
          {essays.map((essay, idx) => {
            const row = (
              <motion.div
                initial={still ? false : { opacity: 0, y: 6 }}
                whileInView={still ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.35,
                  delay: still ? 0 : Math.min(0.35, idx * 0.03),
                  ease: GLIDE,
                }}
                className="flex items-baseline justify-between gap-4 rounded-xl px-2 py-2.5 transition-colors hover:bg-[#242423]/3 dark:hover:bg-white/4"
              >
                <span className="min-w-0 flex-1 truncate text-sm font-semibold tracking-tight text-[#242423] transition-transform duration-200 group-hover:translate-x-0.5 sm:text-[15px] dark:text-zinc-100">
                  {essay.title}
                </span>
                <time className="shrink-0 font-mono text-xs tracking-wider text-zinc-400 uppercase tabular-nums dark:text-zinc-500">
                  {essay.date}
                </time>
              </motion.div>
            );

            return (
              <li key={essay.id} className="group">
                {essay.href ? (
                  <Link
                    href={essay.href}
                    className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                  >
                    {row}
                  </Link>
                ) : (
                  row
                )}
              </li>
            );
          })}
        </ul>

        {/* Three-Dot Ornament */}
        {showDots && (
          <div
            aria-hidden
            className="mt-8 flex items-center justify-center gap-2"
          >
            <span className="size-2 rounded-full bg-rose-500" />
            <span className="size-2 rounded-full bg-amber-400" />
            <span className="size-2 rounded-full bg-emerald-500" />
          </div>
        )}
      </motion.section>
    );
  },
);