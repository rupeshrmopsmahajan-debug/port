"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SocialIcon } from "./SocialIcons";
import { DottedUnderline } from "./DottedUnderline";

const DEFAULT_SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com", icon: "instagram" },
  { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
  { label: "GitHub", href: "https://github.com", icon: "github" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
];

export const SiteFooter = React.forwardRef(function SiteFooter(
  { onSubscribe, className },
  ref,
) {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    try {
      setStatus("submitting");
      await onSubscribe?.(trimmed);
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer
      ref={ref}
      className={cn("w-full  px-6 py-10 text-center", className)}
    >
      <div className="flex justify-center">
        <Image
          src="/sign.png"
          alt="sign"
          height={100}
          width={100}
          className="object-cover"
        />
      </div>

      <div className="mx-auto mt-6 max-w-md">
        <p className="text-sm font-medium">My not so regular newsletter :)</p>

        <form
          onSubmit={handleSubmit}
          className="mt-3.5 flex items-center gap-2 rounded-2xl border border-border bg-white p-1.5 transition-colors focus-within:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/60 dark:focus-within:border-zinc-600"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== "idle") setStatus("idle");
            }}
            placeholder="you@youremail.com"
            aria-label="Email address"
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-[#242423] placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="shrink-0 cursor-pointer rounded-xl bg-[#242423] px-4 py-2.5 text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-zinc-800 active:scale-[0.97] disabled:opacity-60 dark:bg-zinc-100 dark:text-[#242423] dark:hover:bg-zinc-200"
          >
            {status === "submitting" ? "..." : "SUBSCRIBE"}
          </button>
        </form>

        {status === "done" ? (
          <p className="mt-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Subscribed! Check your inbox soon.
          </p>
        ) : status === "error" ? (
          <p className="mt-2.5 text-xs font-medium text-rose-600 dark:text-rose-400">
            Something went wrong. Please try again.
          </p>
        ) : (
          <p className="mt-2.5 text-xs text-zinc-400 dark:text-zinc-500">
            Powered by{" "}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-dotted underline-offset-4 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              AutoSend
            </a>
          </p>
        )}
      </div>

      <DottedUnderline />

      <nav
        aria-label="Social links"
        className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-sm text-zinc-500 dark:text-zinc-400"
      >
        {DEFAULT_SOCIALS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1.5 transition-colors hover:text-[#242423] dark:hover:text-zinc-100"
          >
            <span className="inline-flex items-center transition-transform duration-200 group-hover:-translate-y-0.5">
              <SocialIcon kind={item.icon} className="size-4" />
            </span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </footer>
  );
});
