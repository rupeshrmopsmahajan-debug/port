// "use client";

// import * as React from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { motion, useReducedMotion } from "motion/react";
// import {cn} from "@/lib/utils"
// import { RotatingText } from "./RotatingText";
// import { ThemeToggle } from "./ThemeToggle";

// const DEFAULT_ITEMS = [
//   { label: "Home", href: "/" },
//   { label: "Writing", href: "/writing" },
// ];

// const GLIDE = [0.22, 1, 0.36, 1];

// export const SiteNavigation = React.forwardRef(function FloatingNav(
//   { items = DEFAULT_ITEMS, className },
//   ref,
// ) {
//   const pathname = usePathname();
//   const still = !!useReducedMotion();
//   const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");

//   return (
//     <motion.header
//       ref={ref}
//       initial={still ? false : { opacity: 0, y: -10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.45, ease: GLIDE }}
//       className={cn("mx-auto w-full flex  justify-center py-4", className)}
//     >
//       <nav
//         aria-label="Primary navigation"
//         className="inline-flex items-center gap-1 rounded-full bg-white p-1.5 text-sm shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_28px_-14px_rgba(0,0,0,0.16)] dark:bg-zinc-900"
//       >
//         <RotatingText />

//         {items.map((item) => {
//           const isActive =
//             item.href === "/"
//               ? pathname === "/"
//               : pathname === item.href || pathname?.startsWith(`${item.href}/`);

//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               aria-current={isActive ? "page" : undefined}
//               className={cn(
//                 "relative rounded-full px-4 py-1.5 font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-zinc-400",
//                 isActive
//                   ? "text-white dark:text-[#242423]"
//                   : "text-zinc-600 hover:text-[#242423] dark:text-zinc-400 dark:hover:text-zinc-100",
//               )}
//             >
//               {isActive && (
//                 <motion.span
//                   layoutId={`${uid}-pill`}
//                   transition={
//                     still
//                       ? { duration: 0 }
//                       : { type: "spring", stiffness: 420, damping: 32 }
//                   }
//                   className="absolute inset-0 rounded-full bg-[#242423] dark:bg-zinc-100"
//                 />
//               )}
//               <span className="relative z-10">{item.label}</span>
//             </Link>
//           );
//         })}

//         <ThemeToggle />
//       </nav>
//     </motion.header>
//   );
// });
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const DEFAULT_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Writing", href: "/writing" },
];

export const SiteNavigation = React.forwardRef(function SiteNavigation(
  { items = DEFAULT_ITEMS, className },
  ref,
) {
  const pathname = usePathname();

  return (
    <header ref={ref} className={cn("w-full py-4", className)}>
      <nav
        aria-label="Primary navigation"
        className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-sm"
      >
        <div className="flex items-center gap-0.5">
          {items.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname?.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-1.5 font-medium transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-zinc-400",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <ThemeToggle />
      </nav>
    </header>
  );
});
