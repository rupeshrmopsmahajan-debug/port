"use client";

import * as React from "react";
import Link from "next/link";
import { type ClassValue, clsx } from "clsx";
import { motion, useReducedMotion } from "motion/react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export interface WritingPost {
  id: string;
  title: string;
  date: string;
  href?: string;
}

export interface WritingListProps {
  label?: string;
  posts?: WritingPost[];
  className?: string;
}

const GLIDE = [0.22, 1, 0.36, 1] as const;

const DEFAULT_POSTS: WritingPost[] = [
  {
    id: "freelance-dev",
    title: "How to freelance and make money as a Freelance Web Developer",
    date: "24-03-2022",
    href: "/writing/how-to-freelance-as-a-web-developer",
  },
  {
    id: "portfolio-template",
    title: "Free portfolio website template that gets you hired in 2021",
    date: "02-08-2021",
    href: "/writing/free-portfolio-website-template",
  },
  {
    id: "js-interview",
    title: "Ace the Javascript Interview",
    date: "03-07-2021",
    href: "/writing/ace-the-javascript-interview",
  },
];

export const WritingList = React.forwardRef<HTMLElement, WritingListProps>(
  function WritingList(
    { label = "WRITING", posts = DEFAULT_POSTS, className },
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

        <ul className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800/80">
          {posts.map((post) => {
            const rowContent = (
              <div className="flex items-baseline justify-between gap-4 py-3 transition-colors group-hover:text-[#242423] dark:group-hover:text-white">
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-700 transition-transform duration-200 group-hover:translate-x-0.5 dark:text-zinc-300">
                  {post.title}
                </span>
                <time className="shrink-0 font-mono text-xs text-zinc-400 tabular-nums dark:text-zinc-500">
                  {post.date}
                </time>
              </div>
            );

            return (
              <li key={post.id} className="group">
                {post.href ? (
                  <Link href={post.href} className="block outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded-lg">
                    {rowContent}
                  </Link>
                ) : (
                  rowContent
                )}
              </li>
            );
          })}
        </ul>
      </motion.section>
    );
  },
);