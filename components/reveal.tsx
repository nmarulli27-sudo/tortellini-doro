"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/* Fade-in + slide-up discreto allo scroll (una volta sola). */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        opacity: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98], delay },
        y: { type: "spring", stiffness: 90, damping: 18, delay },
      }}
    >
      {children}
    </motion.div>
  );
}

/* Reveal "messa a fuoco" per le immagini: blur 8px → 0 + fade-in. */
export function RevealImage({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
