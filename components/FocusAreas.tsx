"use client";

import * as React from "react";
import { type ClassValue, clsx } from "clsx";
import { motion, useReducedMotion } from "motion/react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export interface FocusAreaItem {
  id: string;
  title: string;
  description: string;
  badgeClassName: string;
  icon: React.ReactNode;
}

export interface FocusAreasProps {
  label?: string;
  items?: FocusAreaItem[];
  className?: string;
}

const GLIDE = [0.22, 1, 0.36, 1] as const;

const DEFAULT_FOCUS_ITEMS: FocusAreaItem[] = [
  {
    id: "design-engineering",
    title: "Design Engineering and Taste",
    description:
      "I break down designs, talk about developing design taste and share trends.",
    badgeClassName:
      "bg-gradient-to-br from-lime-400 to-green-600 text-white shadow-sm",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M18 3H6a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
        <path d="M12 9v4" />
        <path d="M10 13h2v8" />
      </svg>
    ),
  },
  {
    id: "ai-workflows",
    title: "AI Tools, Workflows and Processes",
    description:
      "I use AI tools and check their usability in my daily workflow. I share my learnings and tips on how to use them effectively.",
    badgeClassName:
      "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-sm",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    id: "saas-products",
    title: "SaaS and Product Development",
    description:
      "I build products and apps that can impact millions of lives. As I build, I talk about it.",
    badgeClassName:
      "bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-sm",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <path d="M3 9h18" />
      </svg>
    ),
  },
];

export const FocusAreas = React.forwardRef<HTMLElement, FocusAreasProps>(
  function FocusAreas(
    {
      label = "THINGS I FOCUS ON",
      items = DEFAULT_FOCUS_ITEMS,
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
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, ease: GLIDE }}
        className={cn(
          "w-full rounded-[26px] bg-white p-6 text-[#242423] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.14)] dark:bg-zinc-900 dark:text-zinc-100",
          className,
        )}
      >
        <p className="font-mono text-xs tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
          {label}
        </p>

        <div className="mt-5 space-y-5">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={still ? false : { opacity: 0, y: 8 }}
              whileInView={still ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.4,
                delay: still ? 0 : idx * 0.06,
                ease: GLIDE,
              }}
              className="group space-y-1.5"
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-lg transition-transform duration-200 group-hover:scale-105",
                    item.badgeClassName,
                  )}
                >
                  {item.icon}
                </span>
                <h3 className="text-base font-semibold tracking-tight text-[#242423] dark:text-zinc-100">
                  {item.title}
                </h3>
              </div>
              <p className="pl-10 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    );
  },
);