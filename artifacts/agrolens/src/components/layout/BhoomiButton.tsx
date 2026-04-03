import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Mic, X, Bot, Send, MicOff, Volume2,
  Leaf, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBhoomi } from "@/lib/bhoomi-context";

/* ─── BHOOMI Auto-Responder ──────────────────────────── */

type BhoomiMessage = { id: number; from: "user" | "bhoomi"; text: string; time: string };

const now = () => new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const BHOOMI_RESPONSES: Array<{ keywords: string[]; reply: string }> = [
  {
    keywords: ["hello", "hi", "namaste", "namaskar", "hey"],
    reply: "Namaste! 🌿 I am BHOOMI, your AI farming assistant. I can help you with crop diseases, fertilizer schedules, weather advice, and market prices. What would you like to know today?",
  },
  {
    keywords: ["disease", "infection", "blight", "rust", "fungus", "mould", "mold", "spot", "lesion"],
    reply: "For disease identification, upload clear photos of the affected leaves and stems via the AI Scan page. I'll analyse the images and provide a detailed diagnosis with treatment recommendations within seconds. Should I take you there?",
  },
  {
    keywords: ["scan", "photo", "upload", "image", "camera"],
    reply: "The AI Scan feature lets you upload 3 photos — a whole plant view, a leaf close-up, and a soil/root shot. This gives me the most accurate diagnosis. Tap 'AI Scan' in the sidebar to begin.",
  },
  {
    keywords: ["wheat", "roti", "gehu", "gehun"],
    reply: "Wheat is currently in high risk for Yellow Leaf Rust in Maharashtra and Punjab. I recommend applying Propiconazole 25% EC at 1 ml/litre water as a preventive spray this week. Sow resistant varieties like HD-2967 or WH-542 next season.",
  },
  {
    keywords: ["rice", "paddy", "dhan", "chawal"],
    reply: "For rice, Blast Disease and Bacterial Leaf Blight are most common this season. Maintain optimum water levels (5 cm standing water) and apply Tricyclazole 75% WP at 0.6 g/litre if blast symptoms appear on flag leaves.",
  },
  {
    keywords: ["tomato", "tamatar", "tamater"],
    reply: "Tomato Early Blight is widespread this season. Start a preventive spray programme with Mancozeb 75% WP at 2 g/litre every 10 days. Ensure adequate spacing (60×45 cm) for air circulation.",
  },
  {
    keywords: ["fertilizer", "fertiliser", "urea", "dap", "nitrogen", "npk", "nutrient", "khad"],
    reply: "For most kharif crops, the recommended base dose is 20 kg Nitrogen + 40 kg P₂O₅ + 20 kg K₂O per acre. Apply 50% N as basal dose and the remainder at 30 DAS. I can generate a crop-specific schedule if you tell me your crop type!",
  },
  {
    keywords: ["water", "irrigation", "drip", "paani", "pani"],
    reply: "Smart irrigation tip: Most cereal crops need 400–600 mm water per season. Install soil moisture sensors or use the thumb test — press soil 6 inches deep; if it crumbles, it's time to irrigate. Drip irrigation saves 40–60% water compared to flood.",
  },
  {
    keywords: ["weather", "rain", "monsoon", "temperature", "mausam"],
    reply: "Today's forecast for your region: 28°C, partly cloudy with 65% humidity. Light rainfall expected around 3 PM. Avoid pesticide application before rain. Optimal spray window: 6–9 AM tomorrow morning when wind speed is low.",
  },
  {
    keywords: ["price", "market", "mandi", "rate", "sell", "bazaar"],
    reply: "Current mandi prices (today): Wheat ₹2,150/quintal, Rice ₹1,980/quintal, Cotton ₹6,200/quintal, Tomato ₹850/quintal. Prices are 8% higher than last month. Best markets: Azadpur (Delhi), Vashi (Mumbai), Koyambedu (Chennai).",
  },
  {
    keywords: ["organic", "natural", "bio", "neem", "jeev", "jaivik"],
    reply: "Great choice going organic! Neem oil (5 ml/litre) is excellent for controlling aphids, whiteflies, and fungal diseases. Trichoderma viride (4 g/litre) is a powerful soil biocontrol agent. Both are available at your nearest KVK centre.",
  },
  {
    keywords: ["subscription", "premium", "plan", "upgrade", "pro", "payment", "pay"],
    reply: "AgroLens Pro gives you unlimited AI scans, full treatment protocols, BHOOMI voice assistant, and market alerts — all for just ₹199/month (yearly plan). Shall I take you to the subscription page?",
  },
  {
    keywords: ["help", "kya", "what", "how", "kaise", "batao", "bata"],
    reply: "I can help you with: 🌾 Crop disease diagnosis · 💊 Treatment & fertilizer plans · 🌧 Weather advisories · 💹 Market prices · 🌿 Organic alternatives · 🗓 Crop calendars. Just type your question or use the mic to speak in any language!",
  },
];

function getBhoomiReply(text: string): string {
  const lower = text.toLowerCase();
  for (const item of BHOOMI_RESPONSES) {
    if (item.keywords.some((k) => lower.includes(k))) {
      return item.reply;
    }
  }
  const fallbacks = [
    "That's a great farming question! Based on best agricultural practices, I'd recommend consulting your local KVK (Krishi Vigyan Kendra) for region-specific advice, while I can help with general guidance here.",
    "Interesting query! Crop health depends on many factors — soil condition, moisture, temperature, and pest pressure. Could you tell me more about your specific situation so I can give you targeted advice?",
    "I'm still learning about that area! But I do know that regular field monitoring, proper spacing, and timely irrigation resolve 70% of crop issues. Want me to guide you through a crop health checklist?",
    "For best results, try uploading a clear photo via the AI Scan feature — I can analyse it and give you a precise diagnosis. General symptoms can sometimes match multiple conditions.",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

/* ─── Voice Command Navigation ───────────────────────── */

const VOICE_NAV: Array<{ keywords: string[]; path: string; label: string }> = [
  { keywords: ["dashboard", "home", "main"], path: "/dashboard", label: "Dashboard" },
  { keywords: ["scan", "scan crop", "detect", "camera", "photo"], path: "/scan", label: "AI Scan" },
  { keywords: ["history", "past scans", "previous"], path: "/history", label: "Scan History" },
  { keywords: ["recommendation", "advice", "suggest", "tips"], path: "/recommendations", label: "Recommendations" },
  { keywords: ["subscription", "premium", "upgrade", "plan", "pricing"], path: "/subscription", label: "Subscription" },
  { keywords: ["payment", "pay", "checkout", "buy"], path: "/checkout", label: "Checkout" },
  { keywords: ["profile", "account", "settings", "my profile"], path: "/profile", label: "Profile" },
  { keywords: ["premium recommendation", "full recommendation", "treatment plan"], path: "/premium-recommendation", label: "Premium Plan" },
];

function detectNavCommand(transcript: string): { path: string; label: string } | null {
  const lower = transcript.toLowerCase();
  const goPattern = /(?:go to|open|show|navigate to|take me to|visit)\s+(.+)/i;
  const match = goPattern.exec(lower) ?? null;
  const searchText = match ? match[1] : lower;
  for (const cmd of VOICE_NAV) {
    if (cmd.keywords.some((k) => searchText.includes(k))) {
      return { path: cmd.path, label: cmd.label };
    }
  }
  return null;
}

/* ─── Chat Modal ─────────────────────────────────────── */

const INITIAL_MESSAGES: BhoomiMessage[] = [
  {
    id: 0,
    from: "bhoomi",
    text: "🌿 Namaste! I'm BHOOMI, your AI farming assistant. Ask me about crop diseases, fertilizers, weather, or market prices. You can also use your voice in any language!",
    time: now(),
  },
];

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export default function BhoomiButton() {
  const { open, setOpen } = useBhoomi();
  const [messages, setMessages] = useState<BhoomiMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [navSuggestion, setNavSuggestion] = useState<{ path: string; label: string } | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [, navigate] = useLocation();
  let nextId = useRef(1);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const addMessage = (from: "user" | "bhoomi", text: string) => {
    const msg: BhoomiMessage = { id: nextId.current++, from, text, time: now() };
    setMessages((prev) => [...prev, msg]);
    return msg;
  };

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput("");

    addMessage("user", trimmed);

    const navCmd = detectNavCommand(trimmed);
    if (navCmd) {
      setNavSuggestion(navCmd);
    }

    setTyping(true);
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 600));
    setTyping(false);

    const reply = navCmd
      ? `Sure! Navigating you to the ${navCmd.label} page now… 🚀`
      : getBhoomiReply(trimmed);

    addMessage("bhoomi", reply);

    if (navCmd) {
      await new Promise((r) => setTimeout(r, 800));
      navigate(navCmd.path);
      setNavSuggestion(null);
    }
  }, [navigate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      addMessage("bhoomi", "Voice input is not supported in your browser. Please type your question instead.");
      return;
    }
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = ""; // auto-detect / use device language
    recognitionRef.current = recognition;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      addMessage("bhoomi", "I couldn't catch that. Please speak clearly or type your question.");
    };
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };
    recognition.start();
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <AnimatePresence>
          {showTooltip && !open && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              className="bg-foreground text-background text-xs font-medium px-3 py-2 rounded-xl shadow-lg whitespace-nowrap flex items-center gap-1.5"
            >
              <Bot className="h-3.5 w-3.5" /> Chat with BHOOMI
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setShowTooltip(true)}
          onHoverEnd={() => setShowTooltip(false)}
          onClick={() => setOpen((v) => !v)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary to-emerald-600 shadow-xl flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Open BHOOMI AI assistant"
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-primary"
            animate={open ? {} : { scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div key="x" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>
                <ChevronDown className="h-6 w-6 relative z-10" />
              </motion.div>
            ) : (
              <motion.div key="mic" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Mic className="h-6 w-6 relative z-10" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Chat Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop (mobile) */}
            <motion.div
              className="fixed inset-0 z-40 sm:hidden bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className={cn(
                "fixed z-50 flex flex-col bg-card shadow-2xl border border-border/60",
                "bottom-24 right-4 left-4 rounded-2xl",
                "sm:left-auto sm:right-6 sm:w-[370px] sm:bottom-24",
              )}
              style={{ maxHeight: "calc(100vh - 140px)" }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/60 bg-gradient-to-r from-primary/5 to-emerald-50/50 rounded-t-2xl shrink-0">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-sm">
                    <Leaf className="h-5 w-5 text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-card" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">BHOOMI</p>
                  <p className="text-[11px] text-muted-foreground">Your Farming Assistant · Online</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={listening ? stopVoice : startVoice}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                      listening ? "bg-red-100 text-red-600 animate-pulse" : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    )}
                    title={listening ? "Stop listening" : "Voice input"}
                  >
                    {listening ? <MicOff className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                    className={cn("flex gap-2", msg.from === "user" ? "justify-end" : "justify-start")}
                  >
                    {msg.from === "bhoomi" && (
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Leaf className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                    <div className="max-w-[78%]">
                      <div
                        className={cn(
                          "px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed",
                          msg.from === "user"
                            ? "bg-blue-500 text-white rounded-br-sm"
                            : "bg-emerald-50 border border-emerald-100 text-foreground rounded-bl-sm"
                        )}
                      >
                        {msg.text}
                      </div>
                      <p className={cn("text-[10px] text-muted-foreground mt-1", msg.from === "user" ? "text-right" : "text-left")}>
                        {msg.time}
                      </p>
                    </div>
                    {msg.from === "user" && (
                      <div className="w-7 h-7 rounded-xl bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-white text-[10px] font-bold">U</span>
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Typing indicator */}
                <AnimatePresence>
                  {typing && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shrink-0">
                        <Leaf className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div className="bg-emerald-50 border border-emerald-100 px-3.5 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-emerald-400"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ delay: i * 0.15, duration: 0.5, repeat: Infinity }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Nav suggestion */}
                <AnimatePresence>
                  {navSuggestion && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-center"
                    >
                      <div className="bg-primary/10 border border-primary/20 text-primary text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <Bot className="h-3 w-3" /> Navigating to {navSuggestion.label}…
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={bottomRef} />
              </div>

              {/* Voice listening banner */}
              <AnimatePresence>
                {listening && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border-t border-red-100">
                      <motion.div
                        className="w-2.5 h-2.5 rounded-full bg-red-500"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.7, repeat: Infinity }}
                      />
                      <p className="text-xs text-red-700 font-medium">Listening in your language… speak now</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input area */}
              <div className="p-3 border-t border-border/60 shrink-0">
                <div className="flex items-center gap-2 bg-muted/60 rounded-xl px-3 py-2 border border-border/40 focus-within:border-primary/40 focus-within:bg-background transition-all">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Ask BHOOMI anything…"
                    className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground min-w-0"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    onClick={listening ? stopVoice : startVoice}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all",
                      listening ? "bg-red-100 text-red-600" : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    )}
                    title="Voice input"
                  >
                    {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim()}
                    className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0 disabled:opacity-40 hover:bg-primary/90 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-[10px] text-center text-muted-foreground mt-2">
                  Speak in Hindi, Marathi, English or any language · Voice nav enabled
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
