"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/* Transizione morbida a ogni cambio pagina. Solo opacità (niente transform,
   che romperebbe gli elementi sticky/fixed dentro le pagine). */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
