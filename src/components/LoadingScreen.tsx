import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
  /** Use full viewport height (e.g. auth check) vs compact (inline) */
  fullScreen?: boolean;
}

export function LoadingScreen({ message = "Loading...", fullScreen = true }: LoadingScreenProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-6 ${
        fullScreen ? "min-h-screen bg-background" : "min-h-[200px] py-12"
      }`}
      style={fullScreen ? { background: "var(--gradient-hero)" } : undefined}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/25">
            <GraduationCap className="w-10 h-10 text-primary-foreground" />
          </div>
          <motion.span
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent"
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        </motion.div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
          <p className={`text-sm font-medium ${fullScreen ? "text-white/90" : "text-muted-foreground"}`}>
            {message}
          </p>
          <p className={`text-xs font-display ${fullScreen ? "text-white/60" : "text-muted-foreground/70"}`}>
            Ramini Academy
          </p>
        </div>
      </motion.div>
    </div>
  );
}
