import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import {
  AlertTriangle, ChevronRight, Lock, Leaf, RotateCcw,
  CheckCircle2, Info, FlaskConical, Sprout, ShieldAlert,
  Lightbulb, ArrowLeft, Share2,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useScan } from "@/lib/scan-store";

/* ─── Mock AI Result Data ───────────────────────────── */

function getMockResult(crop: string) {
  const cropLower = crop.toLowerCase();

  const diseaseMap: Record<string, {
    predictions: { disease: string; confidence: number; description: string }[];
    diagnosis: { name: string; severity: "urgent" | "moderate" | "mild"; cause: string; affected: string };
    quickFacts: { label: string; value: string }[];
  }> = {
    wheat: {
      predictions: [
        { disease: "Yellow Leaf Rust", confidence: 86, description: "Puccinia striiformis — a fungal infection causing yellow-orange pustules on leaves." },
        { disease: "Powdery Mildew", confidence: 62, description: "Blumeria graminis — white powdery coating reducing photosynthesis." },
      ],
      diagnosis: {
        name: "Yellow Leaf Rust (Stripe Rust)",
        severity: "urgent",
        cause: "Fungal — Puccinia striiformis f. sp. tritici",
        affected: "~40% of visible leaf area",
      },
      quickFacts: [
        { label: "Spread rate", value: "High (wind-borne)" },
        { label: "Crop stage", value: "Vegetative to flowering" },
        { label: "Estimated loss", value: "15–30% if untreated" },
        { label: "Treatment window", value: "Within 48–72 hours" },
      ],
    },
    tomato: {
      predictions: [
        { disease: "Early Blight", confidence: 91, description: "Alternaria solani — dark concentric-ring lesions on lower leaves spreading upward." },
        { disease: "Septoria Leaf Spot", confidence: 54, description: "Septoria lycopersici — small circular spots with dark borders and tan centres." },
      ],
      diagnosis: {
        name: "Early Blight (Alternaria Blight)",
        severity: "moderate",
        cause: "Fungal — Alternaria solani",
        affected: "~25% of foliage",
      },
      quickFacts: [
        { label: "Spread rate", value: "Moderate (water-splash)" },
        { label: "Crop stage", value: "Fruiting" },
        { label: "Estimated loss", value: "10–20% if untreated" },
        { label: "Treatment window", value: "Within 5–7 days" },
      ],
    },
    rice: {
      predictions: [
        { disease: "Blast Disease", confidence: 88, description: "Magnaporthe oryzae — greyish-white diamond-shaped lesions on leaves and neck." },
        { disease: "Bacterial Leaf Blight", confidence: 71, description: "Xanthomonas oryzae — yellowing water-soaked margins on young leaves." },
      ],
      diagnosis: {
        name: "Rice Blast",
        severity: "urgent",
        cause: "Fungal — Magnaporthe oryzae",
        affected: "~50% of tiller necks",
      },
      quickFacts: [
        { label: "Spread rate", value: "Very high (airborne)" },
        { label: "Crop stage", value: "Tillering to heading" },
        { label: "Estimated loss", value: "Up to 70% in severe cases" },
        { label: "Treatment window", value: "Immediate action required" },
      ],
    },
  };

  return (
    diseaseMap[cropLower] ?? {
      predictions: [
        { disease: "Leaf Blight", confidence: 85, description: "Bacterial or fungal lesions causing necrosis on leaf edges and surfaces." },
        { disease: "Nutrient Deficiency", confidence: 48, description: "Yellowing of leaves indicating nitrogen or micronutrient imbalance in the soil." },
      ],
      diagnosis: {
        name: "Leaf Blight Infection",
        severity: "moderate" as const,
        cause: "Fungal / Bacterial — mixed pathogen signature",
        affected: "~30% of leaf surface",
      },
      quickFacts: [
        { label: "Spread rate", value: "Moderate" },
        { label: "Crop stage", value: "Growth stage unknown" },
        { label: "Estimated loss", value: "10–25% if untreated" },
        { label: "Treatment window", value: "Within 3–5 days" },
      ],
    }
  );
}

/* ─── Severity Config ────────────────────────────────── */

const SEVERITY_CONFIG = {
  urgent: {
    label: "Urgent Action Required",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
    icon: ShieldAlert,
    badge: "bg-red-100 text-red-700 border-red-200",
  },
  moderate: {
    label: "Moderate — Act Soon",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-400",
    icon: AlertTriangle,
    badge: "bg-amber-100 text-amber-700 border-amber-200",
  },
  mild: {
    label: "Mild — Monitor Closely",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-400",
    icon: Info,
    badge: "bg-blue-100 text-blue-700 border-blue-200",
  },
};

/* ─── Animated Confidence Bar ────────────────────────── */

function ConfidenceBar({ value, color, delay }: { value: number; color: string; delay: number }) {
  return (
    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ delay, duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

/* ─── Locked Feature Row ─────────────────────────────── */

function LockedRow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5 opacity-50 select-none">
      <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <span className="text-sm text-muted-foreground blur-[3px] flex-1 pointer-events-none">{text}</span>
    </div>
  );
}

/* ─── Component ──────────────────────────────────────── */

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" } },
};

export default function ScanResultPage() {
  const [, navigate] = useLocation();
  const { scanData, clearScan } = useScan();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!scanData && !hasRedirected.current) {
      hasRedirected.current = true;
      navigate("/scan");
    }
  }, [scanData, navigate]);

  if (!scanData) return null;

  const result = getMockResult(scanData.cropType);
  const sev = SEVERITY_CONFIG[result.diagnosis.severity];
  const SevIcon = sev.icon;

  const handleNewScan = () => {
    clearScan();
    navigate("/scan");
  };

  return (
    <AppLayout>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-2xl mx-auto space-y-5"
      >
        {/* Header */}
        <motion.div variants={item} className="flex items-center justify-between">
          <div>
            <button
              onClick={handleNewScan}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to scan
            </button>
            <h1 className="text-2xl font-bold text-foreground">Scan Results</h1>
          </div>
          <button
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Share"
          >
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </button>
        </motion.div>

        {/* Image Preview + Crop Info */}
        <motion.div variants={item}>
          <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden">
            <div className="flex gap-0">
              <img
                src={scanData.imageUrl}
                alt="Scanned crop"
                className="w-28 sm:w-36 h-28 sm:h-36 object-cover shrink-0"
              />
              <div className="flex flex-col justify-center px-4 py-3 gap-2.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                    <Leaf className="h-3 w-3" />
                    {scanData.cropType.charAt(0).toUpperCase() + scanData.cropType.slice(1)}
                  </div>
                  <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200">
                    <FlaskConical className="h-3 w-3" />
                    {scanData.soilType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground truncate">{scanData.imageName}</p>
                  <p className="text-xs text-muted-foreground">
                    Analysed {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border w-fit ${sev.badge}`}>
                  <SevIcon className="h-3 w-3" />
                  {sev.label}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Disease Predictions */}
        <motion.div variants={item}>
          <Card className="rounded-2xl border-border/60 shadow-sm">
            <CardHeader className="pt-5 px-5 pb-3">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Sprout className="h-4 w-4 text-primary" />
                Top Disease Predictions
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-5">
              {result.predictions.map((pred, i) => (
                <motion.div
                  key={pred.disease}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.12 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {i + 1}
                      </span>
                      <p className="text-sm font-semibold text-foreground truncate">{pred.disease}</p>
                    </div>
                    <span className={`text-sm font-bold shrink-0 ${i === 0 ? "text-primary" : "text-muted-foreground"}`}>
                      {pred.confidence}%
                    </span>
                  </div>
                  <ConfidenceBar
                    value={pred.confidence}
                    color={i === 0 ? "bg-gradient-to-r from-emerald-400 to-primary" : "bg-gradient-to-r from-slate-300 to-slate-400"}
                    delay={0.5 + i * 0.15}
                  />
                  <p className="text-xs text-muted-foreground leading-relaxed">{pred.description}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Final Diagnosis */}
        <motion.div variants={item}>
          <Card className={`rounded-2xl shadow-sm border ${sev.border} ${sev.bg}`}>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${sev.bg} border ${sev.border} flex items-center justify-center shrink-0`}>
                  <SevIcon className={`h-5 w-5 ${sev.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className={`text-base font-bold ${sev.color}`}>Final Diagnosis</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sev.badge} uppercase tracking-wider`}>
                      {result.diagnosis.severity}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{result.diagnosis.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/60 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Cause</p>
                  <p className="text-xs text-foreground leading-relaxed">{result.diagnosis.cause}</p>
                </div>
                <div className="bg-white/60 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Affected Area</p>
                  <p className="text-xs text-foreground">{result.diagnosis.affected}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {result.quickFacts.map(({ label, value }) => (
                  <div key={label} className="bg-white/60 rounded-xl px-3 py-2">
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                    <p className="text-xs font-semibold text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Premium CTA — Locked */}
        <motion.div variants={item}>
          <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden">
            <CardHeader className="pt-5 px-5 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  BHOOMI Recommendations
                </CardTitle>
                <Badge className="text-[10px] bg-amber-100 text-amber-700 border-amber-200 font-medium">
                  Premium
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-0">
              {/* Blurred locked preview */}
              <div className="space-y-0 divide-y divide-border/60">
                <LockedRow text="Apply propiconazole 25% EC at 0.1% concentration — 500 ml per acre by knapsack sprayer" />
                <LockedRow text="Repeat application after 10 days if symptoms persist; rotate fungicide class to avoid resistance" />
                <LockedRow text="Nitrogen top-dressing recommended: 20 kg urea/acre after disease control is confirmed" />
                <LockedRow text="Remove and burn heavily infected leaves before applying treatment" />
              </div>
            </CardContent>

            {/* Big locked CTA */}
            <div className="px-5 pb-5 pt-4">
              <div className="bg-gradient-to-br from-primary/5 to-emerald-50 border border-primary/20 rounded-2xl p-4 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Unlock Premium Recommendations</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                    Get BHOOMI's full treatment protocol — exact chemicals, dosages, spray schedules, and market alternatives.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-emerald-600 text-white text-sm font-bold shadow-md flex items-center justify-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  Unlock Full Recommendations
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
                <p className="text-[11px] text-muted-foreground">
                  AgroLens Pro · ₹299/month · Unlimited scans & recommendations
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Action Row */}
        <motion.div variants={item} className="flex gap-3 pb-4">
          <Button
            variant="outline"
            className="flex-1 rounded-xl h-11 gap-2"
            onClick={handleNewScan}
          >
            <RotateCcw className="h-4 w-4" />
            New Scan
          </Button>
          <Button
            className="flex-1 rounded-xl h-11 gap-2"
            onClick={() => navigate("/recommendations")}
          >
            <CheckCircle2 className="h-4 w-4" />
            View Recommendations
          </Button>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
