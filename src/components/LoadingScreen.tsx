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
      className={`flex flex-col items-center justify-center gap-6 overflow-hidden ${
        fullScreen ? "min-h-screen bg-background relative" : "min-h-[200px] py-12"
      }`}
      style={fullScreen ? { background: "var(--gradient-hero)" } : undefined}
    >
      {/* Background Animated Orbs for WOW factor */}
      {fullScreen && (
        <>
          <motion.div
            className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[100px]"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -40, 0],
              y: [0, -60, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-8 relative z-10"
      >
        <div className="relative flex items-center justify-center">
          {/* Outer Orbital Ring */}
          <motion.div
            className="absolute w-32 h-32 rounded-full border-2 border-dashed border-primary/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner Orbital Ring */}
          <motion.div
            className="absolute w-24 h-24 rounded-full border border-accent/40"
            style={{ rotateX: 60, rotateY: 30 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />

          {/* Central Cosmic Orb */}
          <div className="relative h-20 w-20 flex items-center justify-center">
            {/* Orb Glow */}
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/40 blur-xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* The Orb */}
            <motion.div
              className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary via-accent to-primary shadow-2xl z-10 border border-white/20"
              animate={{
                background: [
                  "linear-gradient(135deg, hsl(190 90% 50%), hsl(260 80% 65%))",
                  "linear-gradient(225deg, hsl(260 80% 65%), hsl(190 90% 50%))",
                  "linear-gradient(135deg, hsl(190 90% 50%), hsl(260 80% 65%))",
                ],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Drifting Particles */}
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary/60"
                animate={{
                  x: [0, (i % 2 === 0 ? 40 : -40)],
                  y: [0, (i < 2 ? -40 : 40)],
                  opacity: [1, 0],
                  scale: [1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm shadow-primary/20"
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 1, 0.4] 
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          
          <div className="text-center space-y-1">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-lg font-semibold tracking-tight ${fullScreen ? "text-white" : "text-foreground"}`}
            >
              {message}
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.5 }}
              className={`text-sm font-display uppercase tracking-[0.2em] font-medium ${fullScreen ? "text-white/60" : "text-muted-foreground"}`}
            >
              Ramini Academy
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
