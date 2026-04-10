import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  FlaskConical, Leaf, Sprout, ShieldCheck, AlertTriangle,
  Clock, Info, ChevronRight, Beaker, Star, Search, Filter,
  Zap, CheckCircle2, ArrowRight, Droplets,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/* ──── Types ───────────────────────────────────────── */
type Category = "All" | "Pesticide" | "Fertilizer" | "Organic" | "Preventive";
type Priority  = "urgent" | "moderate" | "info";

interface Rec {
  id: number;
  category: Exclude<Category, "All">;
  crop: string;
  disease: string;
  product: string;
  dosage: string;
  method: string;
  timing: string;
  note?: string;
  priority: Priority;
}

/* ──── Data ────────────────────────────────────────── */
const RECS: Rec[] = [
  /* ── Pesticide ── */
  {
    id: 1, category: "Pesticide", priority: "urgent",
    crop: "Wheat", disease: "Yellow Leaf Rust",
    product: "Propiconazole 25% EC",
    dosage: "1 ml / litre water",
    method: "Knapsack sprayer — cover both leaf surfaces. Best applied 6–9 AM when wind is calm.",
    timing: "Within 48 hours of first symptoms",
    note: "Rotate to Tebuconazole 25.9% EC on second spray (Day 10–14) to prevent resistance.",
  },
  {
    id: 2, category: "Pesticide", priority: "urgent",
    crop: "Rice", disease: "Blast Disease",
    product: "Tricyclazole 75% WP",
    dosage: "0.6 g / litre water",
    method: "Spray uniformly at tillering and panicle initiation stages.",
    timing: "Immediate — at first sign of leaf spots",
    note: "Apply before 10 AM or after 4 PM to avoid peak heat.",
  },
  {
    id: 3, category: "Pesticide", priority: "moderate",
    crop: "Tomato", disease: "Early Blight",
    product: "Mancozeb 75% WP",
    dosage: "2 g / litre water",
    method: "Foliar spray ensuring coverage of undersides. Repeat every 7 days.",
    timing: "At first appearance of dark lesions",
    note: "Avoid spraying within 3 days of harvest.",
  },
  {
    id: 4, category: "Pesticide", priority: "urgent",
    crop: "Potato", disease: "Late Blight",
    product: "Metalaxyl + Mancozeb",
    dosage: "2.5 g / litre water",
    method: "Full plant coverage spray including stems and tuber hills.",
    timing: "Immediately — Late Blight spreads in 48 hours",
    note: "Do not allow run-off to enter water sources.",
  },
  {
    id: 5, category: "Pesticide", priority: "urgent",
    crop: "Cotton", disease: "Leaf Curl Virus",
    product: "Imidacloprid 17.8% SL",
    dosage: "0.5 ml / litre water",
    method: "Spray to control whitefly vector. Focus on leaf undersides.",
    timing: "Immediate — vector control is the only management option",
    note: "Remove and destroy affected plants to limit spread.",
  },
  {
    id: 6, category: "Pesticide", priority: "moderate",
    crop: "Tomato / Potato", disease: "Septoria Leaf Spot",
    product: "Chlorothalonil 75% WP",
    dosage: "2 g / litre water",
    method: "Preventive sprays every 10–14 days in high-humidity seasons.",
    timing: "7–10 days after Early Blight treatment",
  },

  /* ── Fertilizer ── */
  {
    id: 7, category: "Fertilizer", priority: "moderate",
    crop: "All Crops", disease: "Post Disease Recovery",
    product: "Urea 46% (Nitrogen)",
    dosage: "20 kg / acre",
    method: "Soil broadcast or fertigation. Split into 2 applications, 10 days apart.",
    timing: "After disease control confirmed (7–10 days post-fungicide)",
    note: "⚠ Do NOT apply nitrogen while active fungal infection is present — it accelerates spread.",
  },
  {
    id: 8, category: "Fertilizer", priority: "moderate",
    crop: "All Crops", disease: "Nutrient Boost",
    product: "DAP 18:46:0 (Phosphorus)",
    dosage: "12 kg / acre",
    method: "Basal application at next irrigation cycle. Mix into topsoil 5–8 cm deep.",
    timing: "At next planned irrigation",
  },
  {
    id: 9, category: "Fertilizer", priority: "info",
    crop: "All Crops", disease: "Soil Correction",
    product: "Zinc Sulphate 33%",
    dosage: "5 kg / acre",
    method: "Soil application once per season. Can also apply as 0.5% foliar spray.",
    timing: "Before sowing or at transplanting",
    note: "Especially important in alkaline soils where zinc becomes unavailable.",
  },
  {
    id: 10, category: "Fertilizer", priority: "info",
    crop: "All Crops", disease: "Potassium Deficiency",
    product: "MOP — Muriate of Potash 60%",
    dosage: "8 kg / acre",
    method: "Mix with phosphorus application. Avoid waterlogged conditions at time of application.",
    timing: "Combined with DAP application",
  },

  /* ── Organic ── */
  {
    id: 11, category: "Organic", priority: "moderate",
    crop: "Wheat / Rice / Tomato", disease: "Fungal Diseases",
    product: "Trichoderma viride",
    dosage: "4 g / litre water",
    method: "Seed treatment (10 g/kg seed) or soil drench. Safe for beneficial insects.",
    timing: "Seed treatment before sowing; soil drench at transplanting",
    note: "Available at KVK centres and agricultural cooperatives. Store below 25°C.",
  },
  {
    id: 12, category: "Organic", priority: "moderate",
    crop: "All Crops", disease: "Fungal / Pest — Mild to Moderate",
    product: "Neem Oil 3000 ppm",
    dosage: "5 ml + 1 ml soap emulsifier / litre",
    method: "Spray at dusk or early morning. Coat both leaf surfaces. Repeat every 7 days.",
    timing: "At first sign of fungal lesions or pest activity",
    note: "Also repels aphids, whiteflies, and spider mites. Biodegradable and food-safe.",
  },
  {
    id: 13, category: "Organic", priority: "info",
    crop: "Rice / Wheat", disease: "Blast / Root Diseases",
    product: "Pseudomonas fluorescens",
    dosage: "10 g / litre water",
    method: "Seed bio-priming for 30 min before sowing. Or soil drench at root zone.",
    timing: "Pre-sowing seed treatment",
    note: "Works as a plant growth promoter as well as biocontrol agent.",
  },
  {
    id: 14, category: "Organic", priority: "info",
    crop: "All Crops", disease: "Mild Fungal Infection",
    product: "Garlic–Chilli Extract",
    dosage: "20 ml / litre (fermented 48h)",
    method: "Prepare: blend 100g garlic + 10 chillies in 1L water, ferment 48h, strain. Spray weekly.",
    timing: "For mild infections or as routine preventive spray",
    note: "Zero chemical input. Contains allicin (natural antifungal). Cost: ~₹5 per litre.",
  },

  /* ── Preventive ── */
  {
    id: 15, category: "Preventive", priority: "info",
    crop: "All Crops", disease: "General Prevention",
    product: "Seed Treatment Protocol",
    dosage: "Carbendazim 50% WP at 2 g/kg seed",
    method: "Treat all seeds before sowing. Allow to air-dry for 30 min in shade before sowing.",
    timing: "Before every sowing season",
    note: "Prevents seed-borne diseases including smuts, bunt, and early blight.",
  },
  {
    id: 16, category: "Preventive", priority: "info",
    crop: "All Crops", disease: "Disease Spread Prevention",
    product: "Crop Rotation Plan",
    dosage: "N/A — Agronomic practice",
    method: "Rotate between non-host crops: Cereals → Legumes → Oilseeds → Cereals cycle.",
    timing: "Plan before each season",
    note: "Breaks pathogen soil cycle. Reduces aphid and whitefly reservoir in soil.",
  },
  {
    id: 17, category: "Preventive", priority: "moderate",
    crop: "Rice / Tomato / Potato", disease: "Water-borne Disease Prevention",
    product: "Drainage & Irrigation Management",
    dosage: "Maintain 3–5 cm water level in rice; avoid waterlogging for others",
    method: "Ensure field bunds are intact. Use ridges and furrows to prevent pooling.",
    timing: "Before and during rainy season",
    note: "Waterlogging promotes Phytophthora, Pythium, and root rot diseases.",
  },
  {
    id: 18, category: "Preventive", priority: "info",
    crop: "All Crops", disease: "Resistance Management",
    product: "Fungicide Rotation Schedule",
    dosage: "Alternate chemical classes every 2 sprays",
    method: "Example: Spray 1–2: Propiconazole (DMI class) → Spray 3–4: Azoxystrobin (SDHI class).",
    timing: "Apply rotation from the first spray",
    note: "Prevents fungicide resistance — the fastest-growing threat to crop protection.",
  },
];

/* ──── Config ──────────────────────────────────────── */
const CATEGORIES: Category[] = ["All", "Pesticide", "Fertilizer", "Organic", "Preventive"];

const CAT_CONFIG: Record<Exclude<Category, "All">, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  Pesticide:  { icon: FlaskConical, color: "text-red-600",     bg: "bg-red-50",     border: "border-red-200" },
  Fertilizer: { icon: Beaker,       color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200" },
  Organic:    { icon: Sprout,       color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  Preventive: { icon: ShieldCheck,  color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200" },
};

const PRI_CONFIG: Record<Priority, { label: string; badge: string; border: string }> = {
  urgent:   { label: "Urgent",   badge: "bg-red-50 text-red-700 border-red-200",     border: "border-l-red-400"    },
  moderate: { label: "Moderate", badge: "bg-amber-50 text-amber-700 border-amber-200", border: "border-l-amber-400" },
  info:     { label: "Tip",      badge: "bg-blue-50 text-blue-700 border-blue-200",   border: "border-l-blue-300"  },
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const cardItem   = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

/* ──── Page ────────────────────────────────────────── */
export default function RecommendationsPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<Category>("All");
  const [search, setSearch] = useState("");

  const filtered = RECS.filter((r) => {
    const matchCat = activeTab === "All" || r.category === activeTab;
    const q = search.toLowerCase();
    const matchSearch = !q || r.crop.toLowerCase().includes(q) || r.product.toLowerCase().includes(q) || r.disease.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const counts: Record<Category, number> = {
    All: RECS.length,
    Pesticide:  RECS.filter((r) => r.category === "Pesticide").length,
    Fertilizer: RECS.filter((r) => r.category === "Fertilizer").length,
    Organic:    RECS.filter((r) => r.category === "Organic").length,
    Preventive: RECS.filter((r) => r.category === "Preventive").length,
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-5">

        {/* ── Header ───────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
                <Zap className="h-5 w-5 text-white" />
              </span>
              Recommendations
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Pesticide, fertilizer, organic & preventive guidance for your crops
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-xl"
            onClick={() => navigate("/premium-recommendation")}
          >
            <Star className="h-3.5 w-3.5 text-amber-500" /> Full Treatment Plans
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* ── Search ───────────────────────────────────── */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by crop, product, or disease…"
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-white/80 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <Filter className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* ── Category Tabs ─────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = activeTab === cat;
            const cfg = cat !== "All" ? CAT_CONFIG[cat] : null;
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                  isActive
                    ? cat === "All"
                      ? "gradient-primary text-white border-transparent shadow-sm"
                      : `${cfg!.bg} ${cfg!.color} ${cfg!.border} shadow-sm`
                    : "bg-white/70 text-muted-foreground border-border/60 hover:border-border"
                }`}
              >
                {cfg && <cfg.icon className="h-3.5 w-3.5" />}
                {cat}
                <span className={`ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/25" : "bg-muted"}`}>
                  {counts[cat]}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Summary strip ─────────────────────────────── */}
        <div className="grid grid-cols-4 gap-2">
          {(["Pesticide", "Fertilizer", "Organic", "Preventive"] as const).map((cat) => {
            const cfg = CAT_CONFIG[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl border transition-all ${
                  activeTab === cat ? `${cfg.bg} ${cfg.border} shadow-sm` : "bg-white/60 border-border/50 hover:bg-white/80"
                }`}
              >
                <cfg.icon className={`h-5 w-5 ${cfg.color}`} />
                <span className="text-[10px] font-semibold text-foreground">{cat}</span>
                <span className={`text-xs font-bold ${cfg.color}`}>{counts[cat]}</span>
              </button>
            );
          })}
        </div>

        {/* ── Cards ─────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + search}
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No recommendations found</p>
                <p className="text-xs mt-1">Try a different crop or product name</p>
              </div>
            ) : filtered.map((rec) => {
              const cat  = CAT_CONFIG[rec.category];
              const pri  = PRI_CONFIG[rec.priority];
              const CatIcon = cat.icon;
              return (
                <motion.div key={rec.id} variants={cardItem}>
                  <Card className={`rounded-2xl shadow-sm border-l-4 ${pri.border} border-border/60 overflow-hidden hover:shadow-md transition-shadow`}>
                    <CardContent className="p-5">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center ${cat.bg} border ${cat.border}`}>
                            <CatIcon className={`h-4.5 w-4.5 ${cat.color}`} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">{rec.product}</p>
                            <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cat.bg} ${cat.color} ${cat.border}`}>
                                {rec.category}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {rec.crop} · {rec.disease}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full border shrink-0 ${pri.badge}`}>
                          {pri.label}
                        </span>
                      </div>

                      {/* Detail grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                        <div className="bg-muted/40 rounded-xl p-3 border border-border/30">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold mb-1">Dosage</p>
                          <p className="text-sm font-bold text-foreground">{rec.dosage}</p>
                        </div>
                        <div className="bg-muted/40 rounded-xl p-3 border border-border/30">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold mb-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Timing
                          </p>
                          <p className="text-xs font-semibold text-foreground">{rec.timing}</p>
                        </div>
                      </div>

                      {/* Method */}
                      <div className="flex items-start gap-2 bg-muted/30 rounded-xl px-3 py-2.5 mb-2">
                        <Droplets className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground leading-relaxed">{rec.method}</p>
                      </div>

                      {/* Note */}
                      {rec.note && (
                        <div className="flex items-start gap-2 bg-amber-50/60 border border-amber-100 rounded-xl px-3 py-2.5">
                          <Info className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-800 leading-relaxed">{rec.note}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* ── Footer CTA ────────────────────────────────── */}
        <div className="pb-4">
          <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-sm shrink-0">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Crop-Specific Full Treatment Plan</p>
                  <p className="text-xs text-muted-foreground">Scan your crop to get a personalised protocol with exact schedules, charts & expert consultation.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1 rounded-xl gap-1.5 text-white border-0"
                  style={{ background: "linear-gradient(135deg, hsl(142 62% 36%), hsl(196 70% 44%))" }}
                  onClick={() => navigate("/scan")}
                >
                  <CheckCircle2 className="h-4 w-4" /> Scan My Crop
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl gap-1.5" onClick={() => navigate("/premium-recommendation")}>
                  View Sample Plan <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
