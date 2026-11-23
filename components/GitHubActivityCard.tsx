// "use client";

// import * as React from "react";
// import {
//   forwardRef,
//   useCallback,
//   useEffect,
//   useImperativeHandle,
//   useRef,
//   useState,
// } from "react";
// import { type ClassValue, clsx } from "clsx";
// import {
//   animate,
//   AnimatePresence,
//   motion,
//   type MotionValue,
//   useAnimation,
//   useInView,
//   useMotionValue,
//   useMotionValueEvent,
//   useReducedMotion,
//   useTransform,
//   useVelocity,
//   type Variants,
// } from "motion/react";
// import { twMerge } from "tailwind-merge";
// import type { ContributionDay, GitHubActivityData } from "@/lib/github";

// function cn(...inputs: ClassValue[]): string {
//   return twMerge(clsx(inputs));
// }

// // Animated icon: flame
// const FlameIcon = (() => {
//   interface FlameIconHandle {
//     startAnimation: () => void;
//     stopAnimation: () => void;
//   }

//   interface FlameIconProps extends React.HTMLAttributes<HTMLSpanElement> {
//     size?: number;
//     active?: boolean;
//     strokeWidth?: number | string;
//   }

//   const PATH_VARIANTS: Variants = {
//     normal: {
//       pathLength: 1,
//       opacity: 1,
//       pathOffset: 0,
//     },
//     animate: {
//       opacity: [0, 1],
//       pathLength: [0, 1],
//       transition: {
//         delay: 0.1,
//         duration: 0.4,
//         opacity: { duration: 0.1, delay: 0.1 },
//       },
//     },
//   };

//   const FlameIcon = forwardRef<FlameIconHandle, FlameIconProps>(
//     (
//       {
//         onMouseEnter,
//         onMouseLeave,
//         className,
//         size,
//         active,
//         style,
//         strokeWidth,
//         ...props
//       },
//       ref,
//     ) => {
//       const controls = useAnimation();
//       const isControlledRef = useRef(false);

//       useImperativeHandle(ref, () => {
//         isControlledRef.current = true;
//         return {
//           startAnimation: () => controls.start("animate"),
//           stopAnimation: () => controls.start("normal"),
//         };
//       });

//       const handleMouseEnter = useCallback(
//         (e: React.MouseEvent<HTMLSpanElement>) => {
//           if (isControlledRef.current) {
//             onMouseEnter?.(e);
//           } else {
//             controls.start("animate");
//           }
//         },
//         [controls, onMouseEnter],
//       );

//       const handleMouseLeave = useCallback(
//         (e: React.MouseEvent<HTMLSpanElement>) => {
//           if (isControlledRef.current) {
//             onMouseLeave?.(e);
//           } else {
//             controls.start("normal");
//           }
//         },
//         [controls, onMouseLeave],
//       );

//       const wrap = useRef<HTMLSpanElement>(null);
//       const reduced = useReducedMotion();
//       const [hosted, setHosted] = useState(false);

//     useEffect(() => {
//   const fake = {} as React.MouseEvent<HTMLSpanElement>;

//   if (reduced) {
//     return;
//   }

//   if (active !== undefined) {
//     (active ? handleMouseEnter : handleMouseLeave)(fake);
//     return;
//   }

//   const host = wrap.current?.parentElement?.closest<HTMLElement>(
//     "button, a, [role=button], [role=menuitem], [role=tab], [role=switch], [role=radio], label",
//   );

//   if (!host) return;

//   const on = () => handleMouseEnter(fake);
//   const off = () => handleMouseLeave(fake);

//   host.addEventListener("pointerenter", on);
//   host.addEventListener("pointerleave", off);

//   return () => {
//     host.removeEventListener("pointerenter", on);
//     host.removeEventListener("pointerleave", off);
//   };
// }, [active, reduced, handleMouseEnter, handleMouseLeave]);

//       return (
//         <span
//           ref={wrap}
//           className={cn(
//             "inline-grid size-6 shrink-0 place-items-center align-middle [&>svg]:size-full",
//             className,
//           )}
//           style={size ? { width: size, height: size, ...style } : style}
//           onMouseEnter={hosted ? undefined : handleMouseEnter}
//           onMouseLeave={hosted ? undefined : handleMouseLeave}
//           {...props}
//         >
//           <svg
//             fill="none"
//             height={size}
//             stroke="currentColor"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={strokeWidth ?? 2}
//             viewBox="0 0 24 24"
//             width={size}
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <motion.path
//               animate={controls}
//               d="M8.9 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
//               fill="none"
//               initial="normal"
//               variants={PATH_VARIANTS}
//             />
//           </svg>
//         </span>
//       );
//     },
//   );

//   FlameIcon.displayName = "FlameIcon";
//   return FlameIcon;
// })();

// export interface GitHubStreakCardProps {
//   data: GitHubActivityData;
//   title?: string;
//   /** Days per row. Default `14` (98 days = 14 weeks). */
//   columns?: number;
//   /** Accent color for active days. Default `"#269a5a"`. */
//   color?: string;
//   className?: string;
// }

// const GLIDE = [0.22, 1, 0.36, 1] as const;
// const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
// const MAX_BLUR = 0.5;
// const COUNT = [0.5, 1, 0.89, 1] as const;

// const LEVEL_ALPHA: Record<0 | 1 | 2 | 3 | 4, number> = {
//   0: 0,
//   1: 0.25,
//   2: 0.5,
//   3: 0.75,
//   4: 1,
// };

// function Wheel({
//   value,
//   rate,
//   place,
// }: {
//   value: MotionValue<number>;
//   rate: MotionValue<number>;
//   place: number;
// }) {
//   const position = useTransform(value, (a) => {
//     const ticks = Math.max(0, a) + 1e-6;
//     const whole = Math.floor(ticks);
//     const turning = ticks - whole;
//     const digit = Math.floor(whole / place) % 10;
//     const turn =
//       place === 1 ? turning : whole % place === place - 1 ? turning : 0;
//     return digit + turn;
//   });
//   const y = useTransform(position, (p) => `${(-p * 100) / 11}%`);
//   const filter = useTransform(rate, (v) => {
//     const px = Math.min(MAX_BLUR, (Math.abs(v) / place) * 0.015);
//     return px < 0.1 ? "none" : `blur(${px.toFixed(2)}px)`;
//   });

//   return (
//     <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden">
//       <motion.span
//         className="absolute inset-x-0 top-0 flex flex-col"
//         style={{ y, filter }}
//       >
//         {[...DIGITS, 0].map((d, i) => (
//           <span key={i} className="flex h-[1em] items-center justify-center">
//             {d}
//           </span>
//         ))}
//       </motion.span>
//     </span>
//   );
// }

// function Odometer({
//   value,
//   label,
//   group = ",",
// }: {
//   value: MotionValue<number>;
//   label: string;
//   group?: string;
// }) {
//   const rate = useVelocity(value);
//   const places = (a: number) =>
//     Math.max(1, String(Math.floor(Math.max(0, a) + 1e-6)).length);
//   const [count, setCount] = React.useState(() => places(value.get()));

//   useMotionValueEvent(value, "change", (a) => {
//     const n = places(a);
//     if (n !== count) setCount(n);
//   });

//   const cells: React.ReactNode[] = [];
//   for (let k = count - 1; k >= 0; k--) {
//     cells.push(
//       <motion.span
//         key={`w${k}`}
//         className="inline-flex"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.2 }}
//       >
//         <Wheel value={value} rate={rate} place={10 ** k} />
//       </motion.span>,
//     );
//     if (k > 0 && k % 3 === 0 && group) {
//       cells.push(<span key={`g${k}`}>{group}</span>);
//     }
//   }

//   return (
//     <span aria-label={label} className="inline-flex leading-none tabular-nums">
//       <span aria-hidden className="invisible w-0">
//         0
//       </span>
//       <span aria-hidden className="inline-flex">
//         {cells}
//       </span>
//     </span>
//   );
// }

// /** Consecutive days with at least 1 contribution, counted back from the latest day. */
// function currentStreakOf(days: ContributionDay[]): number {
//   let n = 0;
//   for (let i = days.length - 1; i >= 0 && days[i].count > 0; i--) {
//     n++;
//   }
//   return n;
// }

// export const GitHubStreakCard = React.forwardRef<
//   HTMLDivElement,
//   GitHubStreakCardProps
// >(function GitHubStreakCard(
//   {
//     data,
//     title = "GitHub Activity",
//     columns = 14,
//     color = "#269a5a",
//     className,
//   },
//   ref,
// ) {
//   const root = React.useRef<HTMLDivElement>(null);
//   React.useImperativeHandle(ref, () => root.current!);

//   const still = !!useReducedMotion();
//   const inView = useInView(root, { once: true, amount: 0.4 });
//   const shown = inView || still;

//   const [hover, setHover] = React.useState<number | null>(null);
//   const [cardHover, setCardHover] = React.useState(false);

//   const days = data.days;
//   const streak = currentStreakOf(days);
//   const count = useMotionValue(still ? streak : 0);

//   React.useEffect(() => {
//     if (!shown || still) return;
//     const c = animate(count, streak, {
//       duration: 1.3,
//       delay: 0.2,
//       ease: COUNT,
//     });
//     return () => c.stop();
//   }, [shown, still, streak, count]);

//   const fmt = React.useMemo(
//     () =>
//       new Intl.DateTimeFormat("en", {
//         weekday: "short",
//         month: "short",
//         day: "numeric",
//       }),
//     [],
//   );

//   const formatDayLabel = (isoDate: string) => {
//     const parsed = new Date(`${isoDate}T00:00:00`);
//     return Number.isNaN(parsed.getTime()) ? isoDate : fmt.format(parsed);
//   };

//   return (
//     <motion.div
//       ref={root}
//       onPointerEnter={() => setCardHover(true)}
//       onPointerLeave={() => {
//         setCardHover(false);
//         setHover(null);
//       }}
//       initial={still ? false : { opacity: 0, y: 16 }}
//       animate={shown ? { opacity: 1, y: 0 } : undefined}
//       transition={{ duration: 0.6, ease: GLIDE }}
//       className={cn(
//         " max-w-full rounded-3xl bg-white p-6 text-[#242423] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.18)] dark:bg-zinc-900 dark:text-zinc-100",
//         className,
//       )}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between gap-2">
//         <div className="flex items-center gap-2">
//           <span className="grid size-8 place-items-center rounded-full bg-[#242423]/6 dark:bg-white/8">
//             <FlameIcon className="size-4" active={cardHover} />
//           </span>
//           <p className="text-base font-semibold tracking-tight">{title}</p>
//         </div>
//         <span className="text-xs text-zinc-500 dark:text-zinc-400">
//           @{data.username}
//         </span>
//       </div>

//       {/* Streak Odometer */}
//       <div className="mt-6 flex items-end gap-2">
//         <span className="text-[48px] font-semibold leading-[0.85] tracking-tight tabular-nums">
//           <Odometer value={count} label={`${streak}`} />
//         </span>
//         <span className="pb-0.5 text-sm leading-tight text-zinc-500 dark:text-zinc-400">
//           days
//           <br />
//           in a row
//         </span>
//       </div>

//       {/* Total Repos & Stars */}
//       <div className="mt-4 flex items-center gap-4 border-t border-zinc-100 pt-3.5 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
//         <div>
//           <span className="font-semibold text-[#242423] tabular-nums dark:text-zinc-100">
//             {data.publicRepos.toLocaleString()}
//           </span>{" "}
//           repos
//         </div>
//         <span className="text-zinc-300 dark:text-zinc-700">·</span>
//         <div>
//           <span className="font-semibold text-[#242423] tabular-nums dark:text-zinc-100">
//             {data.totalStars.toLocaleString()}
//           </span>{" "}
//           stars
//         </div>
//         <span className="text-zinc-300 dark:text-zinc-700">·</span>
//         <div>
//           <span className="font-semibold text-[#242423] tabular-nums dark:text-zinc-100">
//             {data.totalContributions.toLocaleString()}
//           </span>{" "}
//           commits/yr
//         </div>
//       </div>

//       {/* Dot Grid */}
//       <div
//         role="img"
//         aria-label={`Current streak of ${streak} days. ${days.filter((d) => d.count > 0).length} of the last ${days.length} days had GitHub contributions.`}
//         className="relative mt-5 grid gap-1.5"
//         style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
//       >
//         {days.map((day, i) => {
//           const r = Math.floor(i / columns);
//           const c = i % columns;
//           const isToday = i === days.length - 1;
//           const on = hover === i;
//           const active = day.count > 0;
//           const alpha = LEVEL_ALPHA[day.level];

//           return (
//             <span
//               key={day.date}
//               className="relative grid aspect-square place-items-center"
//               onPointerEnter={() => setHover(i)}
//             >
//               {isToday && !still && shown && (
//                 <motion.span
//                   aria-hidden
//                   className="absolute inset-0 rounded-full"
//                   style={{ boxShadow: `0 0 0 2px ${color}` }}
//                   animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
//                   transition={{
//                     duration: 1.6,
//                     repeat: Infinity,
//                     ease: "easeOut",
//                     delay: 1.4,
//                   }}
//                 />
//               )}

//               <motion.span
//                 className="absolute inset-0 rounded-full"
//                 style={{
//                   backgroundColor: active
//                     ? `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`
//                     : "rgba(36,36,35,0.08)",
//                 }}
//                 initial={still ? false : { scale: 0, opacity: 0 }}
//                 animate={
//                   shown
//                     ? {
//                         scale: on ? 1.35 : 1,
//                         opacity: 1,
//                         y: on ? -2 : 0,
//                       }
//                     : undefined
//                 }
//                 transition={{
//                   type: "spring",
//                   stiffness: 420,
//                   damping: 20,
//                   delay:
//                     on || hover !== null
//                       ? 0
//                       : still
//                         ? 0
//                         : 0.15 + (r + c) * 0.025,
//                 }}
//               />

//               <AnimatePresence>
//                 {on && (
//                   <motion.span
//                     initial={{ opacity: 0, y: 4, scale: 0.9 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     exit={{ opacity: 0, y: 2, scale: 0.95 }}
//                     transition={{
//                       type: "spring",
//                       stiffness: 500,
//                       damping: 30,
//                     }}
//                     className={cn(
//                       "pointer-events-none absolute bottom-full z-10 mb-2 inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#242423] px-2.5 text-xs font-medium text-white dark:bg-zinc-100 dark:text-[#242423]",
//                       c < 3
//                         ? "left-0"
//                         : c > columns - 4
//                           ? "right-0"
//                           : "left-1/2 -translate-x-1/2",
//                     )}
//                   >
//                     <span
//                       className="size-1.5 rounded-full"
//                       style={{
//                         backgroundColor: active
//                           ? color
//                           : "rgba(255,255,255,0.4)",
//                       }}
//                     />
//                     {isToday ? "Today" : formatDayLabel(day.date)}
//                     <span className="text-white/60 dark:text-[#242423]/60">
//                       {day.count === 1
//                         ? "1 contribution"
//                         : `${day.count} contributions`}
//                     </span>
//                   </motion.span>
//                 )}
//               </AnimatePresence>
//             </span>
//           );
//         })}
//       </div>
//     </motion.div>
//   );
// });
"use client";

import * as React from "react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { type ClassValue, clsx } from "clsx";
import {
  animate,
  AnimatePresence,
  motion,
  useAnimation,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Animated icon: activity
const ActivityIcon = (() => {
  interface ActivityIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
  }

  interface ActivityIconProps extends React.HTMLAttributes<HTMLSpanElement> {
    size?: number;
    active?: boolean;
    strokeWidth?: number | string;
  }

  const VARIANTS: Variants = {
    normal: {
      opacity: 1,
      pathLength: 1,
      pathOffset: 0,
      transition: {
        duration: 0.4,
        opacity: { duration: 0.1 },
      },
    },
    animate: {
      opacity: [0, 1],
      pathLength: [0, 1],
      pathOffset: [1, 0],
      transition: {
        duration: 0.6,
        ease: "linear",
        opacity: { duration: 0.1 },
      },
    },
  };

  const ActivityIcon = forwardRef<ActivityIconHandle, ActivityIconProps>(
    (
      {
        onMouseEnter,
        onMouseLeave,
        className,
        size,
        active,
        style,
        strokeWidth,
        ...props
      },
      ref,
    ) => {
      const controls = useAnimation();
      const isControlledRef = useRef(false);

      useImperativeHandle(ref, () => {
        isControlledRef.current = true;
        return {
          startAnimation: () => controls.start("animate"),
          stopAnimation: () => controls.start("normal"),
        };
      });

      const handleMouseEnter = useCallback(
        (e: React.MouseEvent<HTMLSpanElement>) => {
          if (isControlledRef.current) {
            onMouseEnter?.(e);
          } else {
            controls.start("animate");
          }
        },
        [controls, onMouseEnter],
      );

      const handleMouseLeave = useCallback(
        (e: React.MouseEvent<HTMLSpanElement>) => {
          if (isControlledRef.current) {
            onMouseLeave?.(e);
          } else {
            controls.start("normal");
          }
        },
        [controls, onMouseLeave],
      );

      const wrap = useRef<HTMLSpanElement>(null);
      const reduced = useReducedMotion();
      const [hosted, setHosted] = useState(false);

      useEffect(() => {
        const fake = {} as React.MouseEvent<HTMLSpanElement>;
        if (reduced) {
          setHosted(true);
          return;
        }
        if (active !== undefined) {
          setHosted(true);
          (active ? handleMouseEnter : handleMouseLeave)(fake);
          return;
        }
        const host = wrap.current?.parentElement?.closest<HTMLElement>(
          "button, a, [role=button], [role=menuitem], [role=tab], [role=switch], [role=radio], label",
        );
        setHosted(!!host);
        if (!host) return;
        const on = () => handleMouseEnter(fake);
        const off = () => handleMouseLeave(fake);
        host.addEventListener("pointerenter", on);
        host.addEventListener("pointerleave", off);
        return () => {
          host.removeEventListener("pointerenter", on);
          host.removeEventListener("pointerleave", off);
        };
      }, [active, reduced, handleMouseEnter, handleMouseLeave]);

      return (
        <span
          ref={wrap}
          className={cn(
            "inline-grid size-6 shrink-0 place-items-center align-middle [&>svg]:size-full",
            className,
          )}
          style={size ? { width: size, height: size, ...style } : style}
          onMouseEnter={hosted ? undefined : handleMouseEnter}
          onMouseLeave={hosted ? undefined : handleMouseLeave}
          {...props}
        >
          <svg
            fill="none"
            height={size}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth ?? 2}
            viewBox="0 0 24 24"
            width={size}
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              animate={controls}
              d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
              initial="normal"
              variants={VARIANTS}
            />
          </svg>
        </span>
      );
    },
  );

  ActivityIcon.displayName = "ActivityIcon";
  return ActivityIcon;
})();

// Animated icon: flame
const FlameIcon = (() => {
  interface FlameIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
  }

  interface FlameIconProps extends React.HTMLAttributes<HTMLSpanElement> {
    size?: number;
    active?: boolean;
    strokeWidth?: number | string;
  }

  const PATH_VARIANTS: Variants = {
    normal: {
      pathLength: 1,
      opacity: 1,
      pathOffset: 0,
    },
    animate: {
      opacity: [0, 1],
      pathLength: [0, 1],
      transition: {
        delay: 0.1,
        duration: 0.4,
        opacity: { duration: 0.1, delay: 0.1 },
      },
    },
  };

  const FlameIcon = forwardRef<FlameIconHandle, FlameIconProps>(
    (
      {
        onMouseEnter,
        onMouseLeave,
        className,
        size,
        active,
        style,
        strokeWidth,
        ...props
      },
      ref,
    ) => {
      const controls = useAnimation();
      const isControlledRef = useRef(false);

      useImperativeHandle(ref, () => {
        isControlledRef.current = true;
        return {
          startAnimation: () => controls.start("animate"),
          stopAnimation: () => controls.start("normal"),
        };
      });

      const handleMouseEnter = useCallback(
        (e: React.MouseEvent<HTMLSpanElement>) => {
          if (isControlledRef.current) {
            onMouseEnter?.(e);
          } else {
            controls.start("animate");
          }
        },
        [controls, onMouseEnter],
      );

      const handleMouseLeave = useCallback(
        (e: React.MouseEvent<HTMLSpanElement>) => {
          if (isControlledRef.current) {
            onMouseLeave?.(e);
          } else {
            controls.start("normal");
          }
        },
        [controls, onMouseLeave],
      );

      const wrap = useRef<HTMLSpanElement>(null);
      const reduced = useReducedMotion();
      const [hosted, setHosted] = useState(false);

      useEffect(() => {
        const fake = {} as React.MouseEvent<HTMLSpanElement>;
        if (reduced) {
          setHosted(true);
          return;
        }
        if (active !== undefined) {
          setHosted(true);
          (active ? handleMouseEnter : handleMouseLeave)(fake);
          return;
        }
        const host = wrap.current?.parentElement?.closest<HTMLElement>(
          "button, a, [role=button], [role=menuitem], [role=tab], [role=switch], [role=radio], label",
        );
        setHosted(!!host);
        if (!host) return;
        const on = () => handleMouseEnter(fake);
        const off = () => handleMouseLeave(fake);
        host.addEventListener("pointerenter", on);
        host.addEventListener("pointerleave", off);
        return () => {
          host.removeEventListener("pointerenter", on);
          host.removeEventListener("pointerleave", off);
        };
      }, [active, reduced, handleMouseEnter, handleMouseLeave]);

      return (
        <span
          ref={wrap}
          className={cn(
            "inline-grid size-6 shrink-0 place-items-center align-middle [&>svg]:size-full",
            className,
          )}
          style={size ? { width: size, height: size, ...style } : style}
          onMouseEnter={hosted ? undefined : handleMouseEnter}
          onMouseLeave={hosted ? undefined : handleMouseLeave}
          {...props}
        >
          <svg
            fill="none"
            height={size}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth ?? 2}
            viewBox="0 0 24 24"
            width={size}
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              animate={controls}
              d="M8.9 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
              fill="none"
              initial="normal"
              variants={PATH_VARIANTS}
            />
          </svg>
        </span>
      );
    },
  );

  FlameIcon.displayName = "FlameIcon";
  return FlameIcon;
})();

// Animated icon: trending-up
const TrendingUpIcon = (() => {
  interface TrendingUpIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
  }

  interface TrendingUpIconProps extends React.HTMLAttributes<HTMLSpanElement> {
    size?: number;
    active?: boolean;
    strokeWidth?: number | string;
  }

  const SVG_VARIANTS: Variants = {
    animate: {
      x: 0,
      y: 0,
      translateX: [0, 2, 0],
      translateY: [0, -2, 0],
      transition: {
        duration: 0.5,
      },
    },
  };

  const PATH_VARIANTS: Variants = {
    normal: {
      opacity: 1,
      pathLength: 1,
      transition: {
        duration: 0.4,
        opacity: { duration: 0.1 },
      },
    },
    animate: {
      opacity: [0, 1],
      pathLength: [0, 1],
      pathOffset: [1, 0],
      transition: {
        duration: 0.4,
        opacity: { duration: 0.1 },
      },
    },
  };

  const ARROW_VARIANTS: Variants = {
    normal: {
      opacity: 1,
      pathLength: 1,
      transition: {
        delay: 0.3,
        duration: 0.3,
        opacity: { duration: 0.1, delay: 0.3 },
      },
    },
    animate: {
      opacity: [0, 1],
      pathLength: [0, 1],
      pathOffset: [0.5, 0],
      transition: {
        delay: 0.3,
        duration: 0.3,
        opacity: { duration: 0.1, delay: 0.3 },
      },
    },
  };

  const TrendingUpIcon = forwardRef<TrendingUpIconHandle, TrendingUpIconProps>(
    (
      {
        onMouseEnter,
        onMouseLeave,
        className,
        size,
        active,
        style,
        strokeWidth,
        ...props
      },
      ref,
    ) => {
      const controls = useAnimation();
      const isControlledRef = useRef(false);

      useImperativeHandle(ref, () => {
        isControlledRef.current = true;
        return {
          startAnimation: () => controls.start("animate"),
          stopAnimation: () => controls.start("normal"),
        };
      });

      const handleMouseEnter = useCallback(
        (e: React.MouseEvent<HTMLSpanElement>) => {
          if (isControlledRef.current) {
            onMouseEnter?.(e);
          } else {
            controls.start("animate");
          }
        },
        [controls, onMouseEnter],
      );

      const handleMouseLeave = useCallback(
        (e: React.MouseEvent<HTMLSpanElement>) => {
          if (isControlledRef.current) {
            onMouseLeave?.(e);
          } else {
            controls.start("normal");
          }
        },
        [controls, onMouseLeave],
      );

      const wrap = useRef<HTMLSpanElement>(null);
      const reduced = useReducedMotion();
      const [hosted, setHosted] = useState(false);

      useEffect(() => {
        const fake = {} as React.MouseEvent<HTMLSpanElement>;
        if (reduced) {
          setHosted(true);
          return;
        }
        if (active !== undefined) {
          setHosted(true);
          (active ? handleMouseEnter : handleMouseLeave)(fake);
          return;
        }
        const host = wrap.current?.parentElement?.closest<HTMLElement>(
          "button, a, [role=button], [role=menuitem], [role=tab], [role=switch], [role=radio], label",
        );
        setHosted(!!host);
        if (!host) return;
        const on = () => handleMouseEnter(fake);
        const off = () => handleMouseLeave(fake);
        host.addEventListener("pointerenter", on);
        host.addEventListener("pointerleave", off);
        return () => {
          host.removeEventListener("pointerenter", on);
          host.removeEventListener("pointerleave", off);
        };
      }, [active, reduced, handleMouseEnter, handleMouseLeave]);

      return (
        <span
          ref={wrap}
          className={cn(
            "inline-grid size-6 shrink-0 place-items-center align-middle [&>svg]:size-full",
            className,
          )}
          style={size ? { width: size, height: size, ...style } : style}
          onMouseEnter={hosted ? undefined : handleMouseEnter}
          onMouseLeave={hosted ? undefined : handleMouseLeave}
          {...props}
        >
          <motion.svg
            animate={controls}
            fill="none"
            height={size}
            initial="normal"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth ?? 2}
            variants={SVG_VARIANTS}
            viewBox="0 0 24 24"
            width={size}
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.polyline
              animate={controls}
              initial="normal"
              points="22 7 13.5 15.5 8.5 10.5 2 17"
              variants={PATH_VARIANTS}
            />
            <motion.polyline
              animate={controls}
              initial="normal"
              points="16 7 22 7 22 13"
              variants={ARROW_VARIANTS}
            />
          </motion.svg>
        </span>
      );
    },
  );

  TrendingUpIcon.displayName = "TrendingUpIcon";
  return TrendingUpIcon;
})();

// Animated icon: zap
const ZapIcon = (() => {
  interface ZapHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
  }

  interface ZapProps extends React.HTMLAttributes<HTMLSpanElement> {
    size?: number;
    active?: boolean;
    strokeWidth?: number | string;
  }

  const PATH_VARIANTS: Variants = {
    normal: {
      opacity: 1,
      pathLength: 1,
      transition: {
        duration: 0.6,
        opacity: { duration: 0.1 },
      },
    },
    animate: {
      opacity: [0, 1],
      pathLength: [0, 1],
      transition: {
        duration: 0.6,
        opacity: { duration: 0.1 },
      },
    },
  };

  const ZapIcon = forwardRef<ZapHandle, ZapProps>(
    (
      {
        onMouseEnter,
        onMouseLeave,
        className,
        size,
        active,
        style,
        strokeWidth,
        ...props
      },
      ref,
    ) => {
      const controls = useAnimation();
      const isControlledRef = useRef(false);

      useImperativeHandle(ref, () => {
        isControlledRef.current = true;
        return {
          startAnimation: () => controls.start("animate"),
          stopAnimation: () => controls.start("normal"),
        };
      });

      const handleMouseEnter = useCallback(
        (e: React.MouseEvent<HTMLSpanElement>) => {
          if (isControlledRef.current) {
            onMouseEnter?.(e);
          } else {
            controls.start("animate");
          }
        },
        [controls, onMouseEnter],
      );

      const handleMouseLeave = useCallback(
        (e: React.MouseEvent<HTMLSpanElement>) => {
          if (isControlledRef.current) {
            onMouseLeave?.(e);
          } else {
            controls.start("normal");
          }
        },
        [controls, onMouseLeave],
      );

      const wrap = useRef<HTMLSpanElement>(null);
      const reduced = useReducedMotion();
      const [hosted, setHosted] = useState(false);

      useEffect(() => {
        const fake = {} as React.MouseEvent<HTMLSpanElement>;
        if (reduced) {
          setHosted(true);
          return;
        }
        if (active !== undefined) {
          setHosted(true);
          (active ? handleMouseEnter : handleMouseLeave)(fake);
          return;
        }
        const host = wrap.current?.parentElement?.closest<HTMLElement>(
          "button, a, [role=button], [role=menuitem], [role=tab], [role=switch], [role=radio], label",
        );
        setHosted(!!host);
        if (!host) return;
        const on = () => handleMouseEnter(fake);
        const off = () => handleMouseLeave(fake);
        host.addEventListener("pointerenter", on);
        host.addEventListener("pointerleave", off);
        return () => {
          host.removeEventListener("pointerenter", on);
          host.removeEventListener("pointerleave", off);
        };
      }, [active, reduced, handleMouseEnter, handleMouseLeave]);

      return (
        <span
          ref={wrap}
          className={cn(
            "inline-grid size-6 shrink-0 place-items-center align-middle [&>svg]:size-full",
            className,
          )}
          style={size ? { width: size, height: size, ...style } : style}
          onMouseEnter={hosted ? undefined : handleMouseEnter}
          onMouseLeave={hosted ? undefined : handleMouseLeave}
          {...props}
        >
          <svg
            fill="none"
            height={size}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth ?? 2}
            viewBox="0 0 24 24"
            width={size}
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              animate={controls}
              d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
              variants={PATH_VARIANTS}
            />
          </svg>
        </span>
      );
    },
  );

  ZapIcon.displayName = "ZapIcon";
  return ZapIcon;
})();

const NARROW = 352;

export const ACTIVITY_PALETTES = {
  ink: ["#dcdcda", "#a6a6a3", "#6e6e6b", "#242423"],
  green: ["#c9f2d5", "#7ddc96", "#2fbf5c", "#17803a"],
  violet: ["#ddd6ff", "#ad9bff", "#7b61ff", "#4a2fd1"],
  mint: ["#c6f4e3", "#6fe0b8", "#16c79a", "#0b8a6a"],
  amber: ["#ffe7b3", "#ffc85c", "#ffad1f", "#d98200"],
  sky: ["#cbeaff", "#7cc8ff", "#2aa8f2", "#0a72b8"],
} as const satisfies Record<string, readonly [string, string, string, string]>;

export interface GitHubActivityGridProps {
  username?: string;
  title?: string;
  /** Total public repositories. */
  repos?: number;
  /** Total stars across repositories. */
  stars?: number;
  /** One value per day, oldest first, the last one is today. */
  data?: number[];
  /** The last day in `data`. Default today. */
  endDate?: Date;
  /** What is counted, singular. Default `"contribution"`. */
  unit?: string;
  /** A ready made colour, in tints and shades. Default `"ink"`. */
  palette?: keyof typeof ACTIVITY_PALETTES;
  /** Four colours for the activity levels, quietest to busiest; overrides `palette`. */
  colors?: readonly [string, string, string, string];
  /** Preferred square size in px; squares grow up to 16px when the whole year fits. Default `11`. */
  cellSize?: number;
  /** Show the three streak tiles. Default `true`. */
  showStats?: boolean;
  className?: string;
}

const WEEKS = 53;
const GAP = 3;
const DAY_LABEL_W = 26;
const MAX_CELL = 16;
const LEVELS = [0, 1, 2, 3, 4] as const;

const EASE = [0.22, 1, 0.36, 1] as const;
const EASE_CSS = "cubic-bezier(0.22,1,0.36,1)";
const DAY = 86_400_000;
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function sampleData(days: number) {
  let seed = 11;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const out: number[] = [];
  for (let i = 0; i < days; i++) {
    const weekday = (i + 2) % 7 < 5;
    const wave =
      0.5 +
      0.3 * Math.sin((i / days) * Math.PI * 6) +
      0.2 * Math.sin((i / days) * Math.PI * 2 + 1.2);
    const quiet = (i > 96 && i < 106) || (i > 236 && i < 242);
    const run = i > days - 16;
    const r = rand();
    let v = 0;
    if (run) v = 2 + Math.round(r * 6);
    else if (!quiet && r < (weekday ? 0.86 : 0.45))
      v = Math.max(1, Math.round((0.25 + rand()) * 8 * wave));
    out.push(v);
  }
  return out;
}

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());
const shortDate = (d: Date) =>
  `${WEEKDAYS[(d.getDay() + 6) % 7]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
const longDate = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getDate()}`;

function Count({
  value,
  run,
  still,
  delay = 0,
}: {
  value: number;
  run: boolean;
  still: boolean;
  delay?: number;
}) {
  const mv = useMotionValue(still ? value : 0);
  const [text, setText] = React.useState(() =>
    Math.round(still ? value : 0).toLocaleString("en-US"),
  );
  useMotionValueEvent(mv, "change", (v) =>
    setText(Math.round(v).toLocaleString("en-US")),
  );
  const first = React.useRef(true);
  React.useEffect(() => {
    if (!run) return;
    if (still) {
      mv.set(value);
      return;
    }
    const c = animate(mv, value, {
      duration: first.current ? 1.3 : 0.7,
      delay: first.current ? delay : 0,
      ease: EASE,
    });
    first.current = false;
    return () => c.stop();
  }, [run, still, value, delay, mv]);
  return <span className="tabular-nums">{text}</span>;
}

export const GitHubActivityGrid = React.forwardRef<
  HTMLDivElement,
  GitHubActivityGridProps
>(function GitHubActivityGrid(
  {
    username,
    title = "GitHub activity",
    repos,
    stars,
    data: dataProp,
    endDate,
    unit = "contribution",
    palette = "ink",
    colors: colorsProp,
    cellSize = 11,
    showStats = true,
    className,
  },
  forwardedRef,
) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLDivElement);
  const colors =
    colorsProp ?? ACTIVITY_PALETTES[palette] ?? ACTIVITY_PALETTES.ink;
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const still = !!useReducedMotion();
  const shown = still || inView;

  const [today] = React.useState(() => startOfDay(endDate ?? new Date()));
  const todayRow = (today.getDay() + 6) % 7;
  const totalDays = (WEEKS - 1) * 7 + todayRow + 1;
  const data = React.useMemo(() => {
    const src = dataProp ?? sampleData(totalDays);
    const tail = src.slice(-totalDays);
    return [
      ...Array(Math.max(0, totalDays - tail.length)).fill(0),
      ...tail,
    ] as number[];
  }, [dataProp, totalDays]);
  const firstDay = new Date(today.getTime() - (totalDays - 1) * DAY);

  const thresholds = React.useMemo(() => {
    const active = data.filter((v) => v > 0).sort((a, b) => a - b);
    if (!active.length) return [1, 1, 1];
    const q = (p: number) =>
      active[Math.min(active.length - 1, Math.floor(p * active.length))]!;
    return [q(0.25), q(0.5), q(0.75)];
  }, [data]);
  const levelOf = (v: number) =>
    v <= 0
      ? 0
      : v <= thresholds[0]!
        ? 1
        : v <= thresholds[1]!
          ? 2
          : v <= thresholds[2]!
            ? 3
            : 4;

  const gridRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = gridRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setWidth(e!.contentRect.width));
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const area = Math.max(0, width - DAY_LABEL_W);
  const narrow = width > 0 && width < NARROW;
  const fit = Math.max(8, Math.floor((area + GAP) / (cellSize + GAP)));
  const cols = Math.min(WEEKS, fit);
  const cell =
    cols === WEEKS
      ? Math.max(cellSize, Math.min(MAX_CELL, Math.floor((area + GAP) / WEEKS) - GAP))
      : cellSize;
  const firstCol = WEEKS - cols;

  const dayIndex = (col: number, row: number) => col * 7 + row;
  const windowStart = firstCol * 7;
  const windowValues = data.slice(windowStart);
  const total = windowValues.reduce((a, b) => a + b, 0);
  const prevStart = windowStart - windowValues.length;
  const prevTotal =
    prevStart >= 0
      ? data.slice(prevStart, windowStart).reduce((a, b) => a + b, 0)
      : null;
  const change = prevTotal
    ? Math.round(((total - prevTotal) / prevTotal) * 100)
    : null;

  const streaks = React.useMemo(() => {
    let best = 0,
      bestEnd = -1,
      run = 0;
    windowValues.forEach((v, i) => {
      run = v > 0 ? run + 1 : 0;
      if (run > best) {
        best = run;
        bestEnd = i;
      }
    });
    let current = 0;
    for (let i = windowValues.length - 1; i >= 0 && windowValues[i]! > 0; i--)
      current++;
    const at = (i: number) =>
      new Date(firstDay.getTime() + (windowStart + i) * DAY);
    return {
      best,
      bestRange: best
        ? `${longDate(at(bestEnd - best + 1))} to ${longDate(at(bestEnd))}`
        : "No streak yet",
      current,
      currentRange: current
        ? `Since ${longDate(at(windowValues.length - current))}`
        : "Start one today",
    };
  }, [windowValues, firstDay, windowStart]);

  const weeksLabel = cols >= 52 ? "Last 12 months" : `Last ${cols} weeks`;
  const plural = (n: number) =>
    `${n.toLocaleString("en-US")} ${unit}${n === 1 ? "" : "s"}`;

  const months = React.useMemo(() => {
    const out: { col: number; label: string }[] = [];
    let last = -1,
      lastCol = -10;
    for (let c = 0; c < cols; c++) {
      const d = new Date(firstDay.getTime() + dayIndex(firstCol + c, 0) * DAY);
      if (d.getMonth() !== last) {
        if (c - lastCol >= 3 && !(c === 0 && d.getDate() > 20)) {
          out.push({ col: c, label: MONTHS[d.getMonth()]! });
          lastCol = c;
        }
        last = d.getMonth();
      }
    }
    return out;
  }, [cols, firstCol, firstDay]);

  const [active, setActive] = React.useState<{
    col: number;
    row: number;
  } | null>(null);
  const [level, setLevel] = React.useState<number | null>(null);
  const activeIdx = active ? dayIndex(firstCol + active.col, active.row) : -1;
  const activeDate = active
    ? new Date(firstDay.getTime() + activeIdx * DAY)
    : null;
  const tip =
    active && activeIdx < totalDays
      ? `${plural(data[activeIdx]!)}, ${shortDate(activeDate!)}`
      : "";

  const onKey = (e: React.KeyboardEvent) => {
    const moves: Record<string, [number, number]> = {
      ArrowRight: [1, 0],
      ArrowLeft: [-1, 0],
      ArrowDown: [0, 1],
      ArrowUp: [0, -1],
    };
    const m = moves[e.key];
    if (e.key === "Escape") return setActive(null);
    if (!m) return;
    e.preventDefault();
    setActive((a) => {
      const from = a ?? { col: cols - 1, row: todayRow };
      let col = Math.max(0, Math.min(cols - 1, from.col + m[0]));
      let row = Math.max(0, Math.min(6, from.row + m[1]));
      if (col === cols - 1 && row > todayRow) row = todayRow;
      return { col, row };
    });
  };

  const [hoverStat, setHoverStat] = React.useState<number | null>(null);
  const stats = [
    {
      label: `Total ${unit}s`,
      value: total,
      suffix: "",
      note: weeksLabel,
      Icon: ActivityIcon,
    },
    {
      label: "Longest streak",
      value: streaks.best,
      suffix: streaks.best === 1 ? " day" : " days",
      note: streaks.bestRange,
      Icon: FlameIcon,
    },
    {
      label: "Current streak",
      value: streaks.current,
      suffix: streaks.current === 1 ? " day" : " days",
      note: streaks.currentRange,
      Icon: ZapIcon,
    },
  ];

  const gridH = 7 * cell + 6 * GAP;

  return (
    <motion.div
      ref={ref}
      initial={still ? false : { opacity: 0, y: 16 }}
      animate={shown ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: EASE }}
      style={
        {
          "--ag": colors[3],
          "--l1": colors[0],
          "--l2": colors[1],
          "--l3": colors[2],
          "--l4": colors[3],
        } as React.CSSProperties
      }
      className={cn(
        !colorsProp &&
          palette === "ink" &&
          "dark:[--ag:#e4e4e7] dark:[--l1:#3f3f46] dark:[--l2:#71717a] dark:[--l3:#a1a1aa] dark:[--l4:#e4e4e7]",
        "relative w-full min-w-[min(260px,100%)] rounded-3xl bg-white p-5 text-[#242423] sm:p-6 dark:bg-zinc-900 dark:text-zinc-100",
        className,
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {title}
            </h3>
            {username && (
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                @{username}
              </span>
            )}
          </div>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-[32px] font-semibold leading-none tracking-[-0.03em]">
              <Count value={total} run={shown} still={still} delay={0.2} />
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {unit}s
            </span>
            {change !== null && (
              <span
                className={cn(
                  "inline-flex h-6 items-center gap-1 self-center rounded-full px-2 text-xs font-medium tabular-nums",
                  change >= 0
                    ? "bg-[#269a5a]/10 text-[#269a5a]"
                    : "bg-[#242423]/[0.06] text-zinc-500 dark:bg-white/[0.08] dark:text-zinc-400",
                )}
              >
                <TrendingUpIcon
                  className={cn("size-3", change < 0 && "-scale-y-100")}
                  active={shown}
                  strokeWidth={2.5}
                />
                {change >= 0 ? "+" : ""}
                {change}%
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {typeof repos === "number" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#242423]/[0.06] px-3 py-1 text-xs font-medium text-zinc-600 tabular-nums dark:bg-white/[0.08] dark:text-zinc-300">
              <strong className="font-semibold text-[#242423] dark:text-zinc-100">
                <Count value={repos} run={shown} still={still} delay={0.15} />
              </strong>
              repos
            </span>
          )}
          {typeof stars === "number" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#242423]/[0.06] px-3 py-1 text-xs font-medium text-zinc-600 tabular-nums dark:bg-white/[0.08] dark:text-zinc-300">
              <strong className="font-semibold text-[#242423] dark:text-zinc-100">
                <Count value={stars} run={shown} still={still} delay={0.2} />
              </strong>
              stars
            </span>
          )}
          <span className="shrink-0 rounded-full bg-[#242423]/[0.06] px-3 py-1 text-xs font-medium text-zinc-500 dark:bg-white/[0.08] dark:text-zinc-400">
            {weeksLabel}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div ref={gridRef} className="relative mt-5 w-full">
        {width > 0 && (
          <>
            <div
              className="relative h-4 text-xs text-zinc-400 dark:text-zinc-500"
              style={{ marginLeft: DAY_LABEL_W }}
            >
              {months.map((m) => (
                <span
                  key={`${m.col}-${m.label}`}
                  className="absolute top-0"
                  style={{ left: m.col * (cell + GAP) }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            <div className="mt-1.5 flex">
              <div
                className="relative shrink-0 text-xs text-zinc-400 dark:text-zinc-500"
                style={{ width: DAY_LABEL_W, height: gridH }}
              >
                {[0, 2, 4].map((r) => (
                  <span
                    key={r}
                    className="absolute left-0 leading-none"
                    style={{ top: r * (cell + GAP) + cell / 2 - 6 }}
                  >
                    {WEEKDAYS[r]}
                  </span>
                ))}
              </div>

              <div
                role="grid"
                tabIndex={0}
                aria-label={`${title}: ${plural(total)} in the ${weeksLabel.toLowerCase()}. Use the arrow keys to read each day.`}
                onKeyDown={onKey}
                onBlur={() => setActive(null)}
                onPointerLeave={() => setActive(null)}
                className="relative grid rounded-md outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-4 dark:focus-visible:ring-offset-zinc-900"
                style={{
                  gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
                  gridTemplateRows: `repeat(7, ${cell}px)`,
                  gridAutoFlow: "column",
                  gap: GAP,
                }}
              >
                {Array.from({ length: cols * 7 }, (_, i) => {
                  const col = Math.floor(i / 7);
                  const row = i % 7;
                  const idx = dayIndex(firstCol + col, row);
                  const isFuture =
                    col === cols - 1 && row > todayRow;

                  if (isFuture || idx >= totalDays) {
                    return (
                      <span
                        key={i}
                        aria-hidden
                        style={{ width: cell, height: cell }}
                        className="rounded-[3px] bg-transparent"
                      />
                    );
                  }

                  const val = data[idx] ?? 0;
                  const lvl = levelOf(val);
                  const isSelected =
                    active?.col === col && active?.row === row;
                  const dimmed = level !== null && lvl !== level;
                  const bg =
                    lvl === 0
                      ? "rgba(36,36,35,0.06)"
                      : `var(--l${lvl})`;

                  return (
                    <motion.button
                      key={i}
                      type="button"
                      tabIndex={-1}
                      aria-label={`${plural(val)}, ${shortDate(new Date(firstDay.getTime() + idx * DAY))}`}
                      onPointerEnter={() => setActive({ col, row })}
                      onFocus={() => setActive({ col, row })}
                      initial={still ? false : { scale: 0.4, opacity: 0 }}
                      animate={
                        shown
                          ? {
                              scale: isSelected ? 1.25 : 1,
                              opacity: dimmed ? 0.25 : 1,
                            }
                          : undefined
                      }
                      transition={{
                        duration: still ? 0 : 0.35,
                        delay: still
                          ? 0
                          : Math.min(0.6, (col * 7 + row) * 0.0012),
                        ease: EASE,
                      }}
                      style={{
                        width: cell,
                        height: cell,
                        backgroundColor: bg,
                        transitionTimingFunction: EASE_CSS,
                      }}
                      className={cn(
                        "cursor-pointer rounded-[3px] outline-none",
                        lvl === 0 && "dark:bg-white/[0.06]",
                        isSelected &&
                          "z-10 ring-2 ring-[#242423] dark:ring-zinc-100",
                      )}
                    />
                  );
                })}
              </div>
            </div>

            {/* Tooltip & Legend */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400 dark:text-zinc-500">
              <div className="min-h-[1.25rem]">
                <AnimatePresence mode="wait">
                  {tip ? (
                    <motion.span
                      key={tip}
                      initial={still ? false : { opacity: 0, y: 2 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -2 }}
                      transition={{ duration: 0.15 }}
                      className="inline-block font-medium text-[#242423] dark:text-zinc-200"
                    >
                      {tip}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="hint"
                      initial={still ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {narrow ? "Tap a square" : "Hover or use arrow keys"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-1">
                <span>Less</span>
                {LEVELS.map((lvl) => {
                  const isLvlActive = level === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      aria-label={`Highlight level ${lvl}`}
                      onClick={() =>
                        setLevel((prev) => (prev === lvl ? null : lvl))
                      }
                      style={{
                        backgroundColor:
                          lvl === 0
                            ? "rgba(36,36,35,0.06)"
                            : `var(--l${lvl})`,
                      }}
                      className={cn(
                        "size-3 cursor-pointer rounded-[2px] transition-transform hover:scale-110",
                        lvl === 0 && "dark:bg-white/[0.06]",
                        isLvlActive &&
                          "scale-110 ring-2 ring-[#242423] dark:ring-zinc-100",
                      )}
                    />
                  );
                })}
                <span>More</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Three Streak / Activity Tiles */}
      {showStats && (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {stats.map((item, i) => {
            const Icon = item.Icon;
            const hovered = hoverStat === i;
            return (
              <div
                key={item.label}
                onPointerEnter={() => setHoverStat(i)}
                onPointerLeave={() => setHoverStat(null)}
                className="rounded-2xl bg-[#242423]/[0.03] p-3.5 transition-colors hover:bg-[#242423]/[0.05] dark:bg-white/[0.04] dark:hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{item.label}</span>
                  <Icon className="size-3.5 text-zinc-400" active={hovered} />
                </div>
                <p className="mt-2 text-lg font-semibold tracking-tight text-[#242423] dark:text-zinc-100">
                  <Count value={item.value} run={shown} still={still} delay={0.25 + i * 0.08} />
                  {item.suffix}
                </p>
                <p className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                  {item.note}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
});