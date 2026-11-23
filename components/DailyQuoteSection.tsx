"use client";

import * as React from "react";
import { type ClassValue, clsx } from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export interface QuoteItem {
  text: string;
  author: string;
}

export interface DailyQuoteSectionProps {
  label?: string;
  buttonLabel?: string;
  quotes?: QuoteItem[];
  className?: string;
}

const GLIDE = [0.22, 1, 0.36, 1] as const;

const DEFAULT_QUOTES: QuoteItem[] = [
  {
    text: "Simplicity is about subtracting the obvious and adding the meaningful.",
    author: "John Maeda",
  },
  {
    text: "Make it work, make it right, make it fast.",
    author: "Kent Beck",
  },
  {
    text: "Details are not the details. They make the design.",
    author: "Charles Eames",
  },
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
  },
  {
    text: "Good design is as little design as possible.",
    author: "Dieter Rams",
  },
  {
    text: "Ship early, listen closely, and iterate with taste.",
    author: "Builder's Note",
  },
];

export const DailyQuoteSection = React.forwardRef<
  HTMLElement,
  DailyQuoteSectionProps
>(function DailyQuoteSection(
  {
    label = "DAILY INSPIRATION",
    buttonLabel = "Get Today's Quote",
    quotes = DEFAULT_QUOTES,
    className,
  },
  ref,
) {
  const still = !!useReducedMotion();
  const [index, setIndex] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);

  const handleGetQuote = () => {
    if (!revealed) {
      setRevealed(true);
      return;
    }
    if (quotes.length <= 1) return;
    setIndex((prev) => {
      let next = Math.floor(Math.random() * quotes.length);
      if (next === prev) {
        next = (prev + 1) % quotes.length;
      }
      return next;
    });
  };

  const current = quotes[index] ?? DEFAULT_QUOTES[0]!;

  return (
    <motion.section
      ref={ref}
      initial={still ? false : { opacity: 0, y: 14 }}
      whileInView={still ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, ease: GLIDE }}
      className={cn(
        "w-full rounded-[26px] bg-white p-6 text-[#242423] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.14)] sm:p-8 dark:bg-zinc-900 dark:text-zinc-100",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
          {label}
        </p>

        <motion.button
          type="button"
          onClick={handleGetQuote}
          whileTap={still ? undefined : { scale: 0.97 }}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#242423] px-4 py-2 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none dark:bg-zinc-100 dark:text-[#242423] dark:hover:bg-zinc-200"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
          </svg>
          <span>{revealed ? "Another Quote" : buttonLabel}</span>
        </motion.button>
      </div>

      <div className="mt-5 min-h-[4.5rem]">
        <AnimatePresence mode="wait">
          {revealed ? (
            <motion.blockquote
              key={`${index}-${current.text}`}
              initial={still ? false : { opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={still ? undefined : { opacity: 0, y: -6, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease: GLIDE }}
              className="space-y-2"
            >
              <p className="text-base font-medium leading-relaxed text-[#242423] sm:text-lg dark:text-zinc-100">
                &ldquo;{current.text}&rdquo;
              </p>
              <footer className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                — {current.author}
              </footer>
            </motion.blockquote>
          ) : (
            <motion.p
              key="placeholder"
              initial={still ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={still ? undefined : { opacity: 0 }}
              className="text-sm text-zinc-500 dark:text-zinc-400"
            >
              Click{" "}
              <span className="font-medium text-[#242423] dark:text-zinc-200">
                {buttonLabel}
              </span>{" "}
              for a quick thought on building, design, and craft.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
});