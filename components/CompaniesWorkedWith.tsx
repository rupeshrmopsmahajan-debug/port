"use client";

import * as React from "react";
import { type ClassValue, clsx } from "clsx";
import { motion, useReducedMotion } from "motion/react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export interface CompanyItem {
  id: string;
  name: string;
  description: string;
  href?: string;
  iconBgClassName: string;
  icon: React.ReactNode;
}

export interface CompaniesWorkedWithProps {
  label?: string;
  companies?: CompanyItem[];
  className?: string;
}

const GLIDE = [0.22, 1, 0.36, 1] as const;

const DEFAULT_COMPANIES: CompanyItem[] = [
  {
    id: "cursor",
    name: "Cursor",
    description: "AI first code editor and development environment.",
    href: "https://cursor.com",
    iconBgClassName: "bg-zinc-950 text-white dark:bg-zinc-800",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
        <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
      </svg>
    ),
  },
  {
    id: "figma",
    name: "Figma",
    description: "Collaborative design and prototyping platform.",
    href: "https://figma.com",
    iconBgClassName: "bg-zinc-950 text-white dark:bg-zinc-800",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
        <circle cx="15" cy="12" r="2.6" className="fill-sky-400" />
        <path d="M9.4 4h2.6v5.2H9.4a2.6 2.6 0 0 1 0-5.2Z" className="fill-rose-500" />
        <path d="M12 4h2.6a2.6 2.6 0 0 1 0 5.2H12V4Z" className="fill-orange-400" />
        <path d="M9.4 9.2H12v5.2H9.4a2.6 2.6 0 0 1 0-5.2Z" className="fill-purple-500" />
        <path d="M9.4 14.4H12V17a2.6 2.6 0 0 1-5.2 0c0-1.44 1.16-2.6 2.6-2.6Z" className="fill-emerald-400" />
      </svg>
    ),
  },
  {
    id: "replit",
    name: "Replit",
    description: "AI-powered platform to build and ship software.",
    href: "https://replit.com",
    iconBgClassName: "bg-white text-orange-600 ring-1 ring-zinc-200 dark:bg-zinc-950 dark:ring-zinc-800",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
        <path d="M6 4h6v5H6V4zm6 5h6v6h-6V9zm-6 6h6v5H6v-5z" />
      </svg>
    ),
  },
  {
    id: "neon",
    name: "Neon",
    description: "Fast Postgres Databases for Teams and Agents.",
    href: "https://neon.tech",
    iconBgClassName: "bg-zinc-950 text-emerald-400 dark:bg-zinc-800",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
        <path d="M5 19V5h14v14h-4v-6l-6-6v12H5z" />
      </svg>
    ),
  },
  {
    id: "strapi",
    name: "Strapi",
    description: "Open-Source headless CMS for apps.",
    href: "https://strapi.io",
    iconBgClassName: "bg-indigo-600 text-white",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
        <path d="M5 4h14v14h-4v-4h-4V9H5V4z" />
      </svg>
    ),
  },
  {
    id: "hostinger",
    name: "Hostinger",
    description: "Web hosting and domains platform.",
    href: "https://hostinger.com",
    iconBgClassName: "bg-violet-600 text-white",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
        <path d="M7 5v14M17 5v14M7 12h10" />
      </svg>
    ),
  },
  {
    id: "posthog",
    name: "Posthog",
    description: "Open-Source product analytics platform.",
    href: "https://posthog.com",
    iconBgClassName: "bg-zinc-950 text-amber-400 dark:bg-zinc-800",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
        <path d="M5 17V9l3 2.5L11 8l3 3.5L17 8l2 2v7H5z" />
      </svg>
    ),
  },
  {
    id: "fireworks",
    name: "Fireworks",
    description: "Open-source AI models at blazing speed.",
    href: "https://fireworks.ai",
    iconBgClassName: "bg-purple-50 text-purple-600 ring-1 ring-purple-200/70 dark:bg-purple-950/50 dark:text-purple-300 dark:ring-purple-800/60",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
        <path d="M12 4v6M6 8l4 3M18 8l-4 3M5 15h14" />
      </svg>
    ),
  },
];

export const CompaniesWorkedWith = React.forwardRef<
  HTMLElement,
  CompaniesWorkedWithProps
>(function CompaniesWorkedWith(
  {
    label = "COMPANIES I'VE WORKED WITH",
    companies = DEFAULT_COMPANIES,
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
      transition={{ duration: 0.5, ease: GLIDE }}
      className={cn(
        "w-full rounded-[26px] bg-white p-6 text-[#242423] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.14)] dark:bg-zinc-900 dark:text-zinc-100",
        className,
      )}
    >
      <p className="font-mono text-xs tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
        {label}
      </p>

      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {companies.map((company, idx) => {
          const cardBody = (
            <motion.div
              initial={still ? false : { opacity: 0, y: 8 }}
              whileInView={still ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.35,
                delay: still ? 0 : idx * 0.04,
                ease: GLIDE,
              }}
              className="group space-y-2"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-lg transition-transform duration-200 group-hover:scale-105",
                    company.iconBgClassName,
                  )}
                >
                  {company.icon}
                </span>
                <h3 className="text-sm font-semibold tracking-tight text-[#242423] dark:text-zinc-100">
                  {company.name}
                </h3>
              </div>
              <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                {company.description}
              </p>
            </motion.div>
          );

          if (company.href) {
            return (
              <a
                key={company.id}
                href={company.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
              >
                {cardBody}
              </a>
            );
          }

          return <React.Fragment key={company.id}>{cardBody}</React.Fragment>;
        })}
      </div>
    </motion.section>
  );
});