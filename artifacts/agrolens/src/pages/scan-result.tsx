import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  AlertTriangle, ChevronRight, Lock, Leaf, RotateCcw,
  CheckCircle2, FlaskConical, ShieldAlert, ArrowLeft,
  Share2, Sprout, Info, Clock, MapPin, X,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useScan } from "@/lib/scan-store";
import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────── */

type Severity = "urgent" | "moderate" | "mild";

interface DiseaseOutcome {
  rank: 1 | 2;
  disease: string;
  scientificName: string;
  confidence: number;
  severity: Severity;
  cause: string;
  affected: string;
  spreadRate: string;
  estimatedLoss: string;
  treatmentWindow: string;
  quickFix: string;
  icon: React.ElementType;
}

/* ─── Mock Result Logic ──────────────────────────────── */

function getOutcomes(crop: string): [DiseaseOutcome, DiseaseOutcome] {
  const c = crop.toLowerCase();

  const map: Record<string, [DiseaseOutcome, DiseaseOutcome]> = {
    wheat: [
      { rank: 1, disease: "Yellow Leaf Rust", scientificName: "Puccinia striiformis", confidence: 86, severity: "urgent", cause: "Fungal — airborne spores", affected: "~40% leaf area", spreadRate: "Very High", estimatedLoss: "15–30%", treatmentWindow: "48 hours", quickFix: "Propiconazole 25% EC at 1 ml/L", icon: ShieldAlert },
      { rank: 2, disease: "Powdery Mildew", scientificName: "Blumeria graminis", confidence: 61, severity: "moderate", cause: "Fungal — dry humid conditions", affected: "~18% leaf area", spreadRate: "Moderate", estimatedLoss: "8–15%", treatmentWindow: "5–7 days", quickFix: "Tebuconazole 25.9% EC at 1 ml/L", icon: AlertTriangle },
    ],
    tomato: [
      { rank: 1, disease: "Early Blight", scientificName: "Alternaria solani", confidence: 91, severity: "moderate", cause: "Fungal — water-splash spread", affected: "~25% foliage", spreadRate: "Moderate", estimatedLoss: "10–20%", treatmentWindow: "5–7 days", quickFix: "Mancozeb 75% WP at 2 g/L", icon: AlertTriangle },
      { rank: 2, disease: "Septoria Leaf Spot", scientificName: "Septoria lycopersici", confidence: 54, severity: "mild", cause: "Fungal — warm wet weather", affected: "~12% leaf area", spreadRate: "Low–Moderate", estimatedLoss: "5–10%", treatmentWindow: "7–10 days", quickFix: "Chlorothalonil 75% WP at 2 g/L", icon: Info },
    ],
    rice: [
      { rank: 1, disease: "Blast Disease", scientificName: "Magnaporthe oryzae", confidence: 88, severity: "urgent", cause: "Fungal — airborne conidia", affected: "~50% tillers", spreadRate: "Very High", estimatedLoss: "Up to 70%", treatmentWindow: "Immediate", quickFix: "Tricyclazole 75% WP at 0.6 g/L", icon: ShieldAlert },
      { rank: 2, disease: "Bacterial Leaf Blight", scientificName: "Xanthomonas oryzae", confidence: 71, severity: "moderate", cause: "Bacterial — seed/water borne", affected: "~30% leaf margins", spreadRate: "Moderate", estimatedLoss: "10–30%", treatmentWindow: "3–5 days", quickFix: "Copper oxychloride at 3 g/L", icon: AlertTriangle },
    ],
    potato: [
      { rank: 1, disease: "Late Blight", scientificName: "Phytophthora infestans", confidence: 83, severity: "urgent", cause: "Oomycete — cool wet weather", affected: "~45% vines", spreadRate: "Very High", estimatedLoss: "20–60%", treatmentWindow: "24–48 hours", quickFix: "Metalaxyl + Mancozeb at 2.5 g/L", icon: ShieldAlert },
      { rank: 2, disease: "Early Blight", scientificName: "Alternaria solani", confidence: 59, severity: "moderate", cause: "Fungal — warm humid weather", affected: "~20% leaf area", spreadRate: "Moderate", estimatedLoss: "10–20%", treatmentWindow: "5–7 days", quickFix: "Azoxystrobin 23% SC at 1 ml/L", icon: AlertTriangle },
    ],
    cotton: [
      { rank: 1, disease: "Leaf Curl Virus", scientificName: "Cotton Leaf Curl Virus (CLCuV)", confidence: 79, severity: "urgent", cause: "Viral — whitefly transmitted", affected: "~35% crop stand", spreadRate: "High", estimatedLoss: "15–40%", treatmentWindow: "Immediate", quickFix: "Control whitefly with Imidacloprid 17.8% SL", icon: ShieldAlert },
      { rank: 2, disease: "Root Rot", scientificName: "Rhizoctonia solani", confidence: 52, severity: "moderate", cause: "Fungal — waterlogged soil", affected: "~15% plant stand", spreadRate: "Low", estimatedLoss: "5–15%", treatmentWindow: "7–10 days", quickFix: "Carbendazim 50% WP soil drench at 2 g/L", icon: AlertTriangle },
    ],
  };

  return (
    map[c] ?? [
      { rank: 1, disease: "Leaf Blight Infection", scientificName: "Mixed fungal/bacterial", confidence: 82, severity: "moderate", cause: "Fungal or bacterial — mixed symptoms", affected: "~30% leaf surface", spreadRate: "Moderate", estimatedLoss: "10–25%", treatmentWindow: "3–5 days", quickFix: "Copper-based fungicide at 3 g/L", icon: AlertTriangle },
      { rank: 2, disease: "Nutrient Deficiency", scientificName: "Nitrogen / Micronutrient imbalance", confidence: 47, severity: "mild", cause: "Soil nutrient depletion", affected: "Systemic yellowing", spreadRate: "Non-infectious", estimatedLoss: "8–15%", treatmentWindow: "10–15 days", quickFix: "Apply balanced NPK + micronutrient foliar spray", icon: Info },
    ] as [DiseaseOutcome, DiseaseOutcome]
  );
}

/* ─── Severity config ────────────────────────────────── */

const SEV: Record<Severity, { label: string; color: string; bg: string; border: string; badge: string; headerBg: string }> = {
  urgent: { label: "Urgent", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", badge: "bg-red-50 text-red-700 border-red-200", headerBg: "from-red-50 to-red-50/30" },
  moderate: { label: "Moderate", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-50 text-amber-700 border-amber-200", headerBg: "from-amber-50 to-amber-50/30" },
  mild: { label: "Mild", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-50 text-blue-700 border-blue-200", headerBg: "from-blue-50 to-blue-50/30" },
};

/* ─── Animated bar ───────────────────────────────────── */

function Bar({ value, delay, color }: { value: number; delay: number; color: string }) {
  return (
    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
      <motion.div className={`h-full rounded-full ${color}`} initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ delay, duration: 0.8, ease: "easeOut" }} />
    </div>
  );
}

/* ─── Disease Outcome Card ───────────────────────────── */

function OutcomeCard({ outcome, delay }: { outcome: DiseaseOutcome; delay: number }) {
  const [expanded, setExpanded] = useState(outcome.rank === 1);
  const sev = SEV[outcome.severity];
  const SevIcon = outcome.icon;

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}>
      <Card className={cn("rounded-2xl shadow-sm border-2 overflow-hidden", outcome.rank === 1 ? `border-${outcome.severity === "urgent" ? "red" : outcome.severity === "moderate" ? "amber" : "blue"}-300` : "border-border/60")}>
        {/* Card header */}
        <div
          className={cn("flex items-start gap-3 p-4 cursor-pointer select-none", `bg-gradient-to-r ${sev.headerBg}`)}
          onClick={() => setExpanded((v) => !v)}
        >
          <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center shrink-0", sev.bg, sev.border)}>
            <SevIcon className={cn("h-5 w-5", sev.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", sev.badge)}>{sev.label}</span>
              <span className="text-[10px] bg-muted text-muted-foreground font-semibold px-2 py-0.5 rounded-full border border-border/60">
                #{outcome.rank} {outcome.rank === 1 ? "Most Likely" : "Possible"}
              </span>
            </div>
            <p className="text-sm font-bold text-foreground truncate">{outcome.disease}</p>
            <p className="text-[11px] text-muted-foreground italic">{outcome.scientificName}</p>
          </div>
          <div className="text-right shrink-0">
            <p className={cn("text-xl font-black", outcome.rank === 1 ? sev.color : "text-muted-foreground")}>{outcome.confidence}%</p>
            <p className="text-[10px] text-muted-foreground">confidence</p>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="px-4 pb-2 pt-1">
          <Bar
            value={outcome.confidence}
            delay={delay + 0.2}
            color={outcome.rank === 1
              ? outcome.severity === "urgent" ? "bg-gradient-to-r from-red-400 to-red-500"
              : outcome.severity === "moderate" ? "bg-gradient-to-r from-amber-400 to-amber-500"
              : "bg-gradient-to-r from-blue-400 to-blue-500"
              : "bg-gradient-to-r from-slate-300 to-slate-400"}
          />
        </div>

        {/* Expanded details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Cause", value: outcome.cause },
                    { label: "Affected Area", value: outcome.affected },
                    { label: "Spread Rate", value: outcome.spreadRate },
                    { label: "Est. Loss", value: outcome.estimatedLoss },
                    { label: "Treatment Window", value: outcome.treatmentWindow },
                    { label: "Quick Fix", value: outcome.quickFix },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-muted/50 rounded-xl p-2.5">
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
                      <p className="text-xs font-semibold text-foreground mt-0.5 leading-snug">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-center gap-1 text-[11px] text-muted-foreground py-2 border-t border-border/60 hover:bg-muted/40 transition-colors"
        >
          {expanded ? "Collapse details" : "Expand details"}
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight className="h-3 w-3 rotate-90" />
          </motion.div>
        </button>
      </Card>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────── */

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.38 } } };

export default function ScanResultPage() {
  const [, navigate] = useLocation();
  const { scanData, clearScan } = useScan();
  const hasRedirected = useRef(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!scanData && !hasRedirected.current) {
      hasRedirected.current = true;
      navigate("/scan");
    }
  }, [scanData, navigate]);

  if (!scanData) return null;

  const [outcome1, outcome2] = getOutcomes(scanData.cropType);
  const primarySev = SEV[outcome1.severity];

  const handleNewScan = () => { clearScan(); navigate("/scan"); };

  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <motion.div variants={item} className="flex items-center justify-between">
          <div>
            <button onClick={handleNewScan} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to scan
            </button>
            <h1 className="text-2xl font-bold text-foreground">AI Scan Results</h1>
          </div>
          <button className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors">
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </button>
        </motion.div>

        {/* Scan summary strip */}
        <motion.div variants={item}>
          <Card className="rounded-2xl border-border/60 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1.5 rounded-full">
                  <Leaf className="h-3 w-3" />
                  {scanData.cropType.charAt(0).toUpperCase() + scanData.cropType.slice(1)}
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1.5 rounded-full border border-amber-200">
                  <FlaskConical className="h-3 w-3" />
                  {scanData.soilType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </div>
                <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1.5 rounded-full border border-blue-200">
                  <Sprout className="h-3 w-3" />
                  {scanData.growthStage.split(" (")[0]}
                </div>
                <div className="flex items-center gap-1.5 bg-muted text-muted-foreground text-xs font-semibold px-2.5 py-1.5 rounded-full">
                  <MapPin className="h-3 w-3" />
                  {scanData.fieldName}
                </div>
                <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Photo thumbnails */}
        <motion.div variants={item}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Analysed Photos</p>
          <div className="grid grid-cols-3 gap-2">
            {scanData.photos.map((photo) => (
              <button
                key={photo.type}
                onClick={() => setSelectedPhoto(photo.url)}
                className="relative group overflow-hidden rounded-xl border border-border/60 hover:border-primary/40 transition-all"
              >
                <img src={photo.url} alt={photo.type} className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
                  <p className="text-white text-[10px] font-semibold capitalize">{photo.type === "whole" ? "Whole Plant" : photo.type === "leaf" ? "Leaf Close-up" : "Soil / Root"}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Primary diagnosis banner */}
        <motion.div variants={item}>
          <div className={cn("rounded-2xl border p-4 flex items-start gap-3", primarySev.bg, primarySev.border)}>
            <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center shrink-0", primarySev.bg, primarySev.border)}>
              <outcome1.icon className={cn("h-5 w-5", primarySev.color)} />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Primary Diagnosis</p>
              <p className={cn("text-base font-black", primarySev.color)}>{outcome1.disease}</p>
              <p className="text-xs text-muted-foreground">{outcome1.scientificName} · {outcome1.confidence}% confidence</p>
            </div>
            <span className={cn("ml-auto text-[10px] font-bold px-2 py-1 rounded-full border shrink-0 uppercase tracking-wider", primarySev.badge)}>
              {primarySev.label}
            </span>
          </div>
        </motion.div>

        {/* 2 Outcome Cards */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            2 Possible Diagnoses — tap to expand
          </p>
          <div className="space-y-3">
            <OutcomeCard outcome={outcome1} delay={0.3} />
            <OutcomeCard outcome={outcome2} delay={0.45} />
          </div>
        </div>

        {/* Premium CTA */}
        <motion.div variants={item}>
          <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden">
            <CardHeader className="pt-5 px-5 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" /> Full BHOOMI Treatment Protocol
                </CardTitle>
                <Badge className="text-[10px] bg-amber-100 text-amber-700 border-amber-200">Premium</Badge>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="space-y-0 divide-y divide-border/60 mb-4">
                {["Propiconazole 25% EC — exact spray schedule and mix ratios", "10-day follow-up protocol with fungicide rotation plan", "Post-treatment nitrogen dosage and timing", "Organic Trichoderma + Neem oil alternative program"].map((t) => (
                  <div key={t} className="flex items-center gap-3 py-2.5 opacity-50 select-none">
                    <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-sm text-muted-foreground blur-[3px] flex-1 pointer-events-none">{t}</span>
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/premium-recommendation")}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-emerald-600 text-white text-sm font-bold shadow-md flex items-center justify-center gap-2"
              >
                <Lock className="h-4 w-4" /> Unlock Full Recommendations
                <ChevronRight className="h-4 w-4" />
              </motion.button>
              <p className="text-center text-[11px] text-muted-foreground mt-2">AgroLens Pro · ₹199/month</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action row */}
        <motion.div variants={item} className="flex gap-3 pb-4">
          <Button variant="outline" className="flex-1 rounded-xl h-11 gap-2" onClick={handleNewScan}>
            <RotateCcw className="h-4 w-4" /> New Scan
          </Button>
          <Button className="flex-1 rounded-xl h-11 gap-2" onClick={() => navigate("/premium-recommendation")}>
            <CheckCircle2 className="h-4 w-4" /> View Full Plan
          </Button>
        </motion.div>
      </motion.div>

      {/* Photo lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.img
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              src={selectedPhoto}
              alt="Photo preview"
              className="max-w-full max-h-full rounded-2xl object-contain"
            />
            <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors" onClick={() => setSelectedPhoto(null)}>
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
