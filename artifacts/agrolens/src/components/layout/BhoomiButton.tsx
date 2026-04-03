import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Bot } from "lucide-react";
import { useLocation } from "wouter";

export default function BhoomiButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [, navigate] = useLocation();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="bg-foreground text-background text-xs font-medium px-3 py-2 rounded-xl shadow-lg whitespace-nowrap flex items-center gap-2"
          >
            <Bot className="h-3.5 w-3.5" />
            Chat with BHOOMI
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
        onClick={() => navigate("/chat")}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary to-emerald-600 shadow-lg flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Open BHOOMI chatbot"
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-primary"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <Mic className="h-6 w-6 relative z-10" />
      </motion.button>
    </div>
  );
}
