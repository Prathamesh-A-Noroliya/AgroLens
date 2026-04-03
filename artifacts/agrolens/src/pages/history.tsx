import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Leaf, X, SlidersHorizontal, Camera } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Severity = "urgent" | "moderate" | "mild" | "healthy";

interface ScanRecord {
  id: string;
  date: string;
  dateRaw: Date;
  crop: string;
  field: string;
  result: string;
  severity: Severity;
  thumbnail: string;
  confidence: number;
}

/* ─── Mock scan records ──────────────────────────────── */

const MOCK_SCANS: ScanRecord[] = [
  { id: "1", date: "Today, 10:24 AM", dateRaw: new Date(), crop: "Wheat", field: "Field A", result: "Yellow Leaf Rust", severity: "urgent", thumbnail: "🌾", confidence: 86 },
  { id: "2", date: "Yesterday, 3:12 PM", dateRaw: new Date(Date.now() - 864e5), crop: "Rice", field: "Field B", result: "Blast Disease", severity: "urgent", thumbnail: "🌾", confidence: 88 },
  { id: "3", date: "Apr 1, 2026", dateRaw: new Date(Date.now() - 2*864e5), crop: "Tomato", field: "Greenhouse", result: "Early Blight", severity: "moderate", thumbnail: "🍅", confidence: 91 },
  { id: "4", date: "Mar 30, 2026", dateRaw: new Date(Date.now() - 4*864e5), crop: "Cotton", field: "Field C", result: "Aphid Infestation", severity: "moderate", thumbnail: "🌿", confidence: 78 },
  { id: "5", date: "Mar 28, 2026", dateRaw: new Date(Date.now() - 6*864e5), crop: "Mustard", field: "Field D", result: "Alternaria Leaf Spot", severity: "moderate", thumbnail: "🌻", confidence: 74 },
  { id: "6", date: "Mar 25, 2026", dateRaw: new Date(Date.now() - 9*864e5), crop: "Soybean", field: "Field A", result: "All Healthy", severity: "healthy", thumbnail: "🌱", confidence: 95 },
  { id: "7", date: "Mar 22, 2026", dateRaw: new Date(Date.now() - 12*864e5), crop: "Potato", field: "Field E", result: "Late Blight", severity: "urgent", thumbnail: "🥔", confidence: 82 },
  { id: "8", date: "Mar 19, 2026", dateRaw: new Date(Date.now() - 15*864e5), crop: "Wheat", field: "Field B", result: "Powdery Mildew (Mild)", severity: "mild", thumbnail: "🌾", confidence: 63 },
  { id: "9", date: "Mar 15, 2026", dateRaw: new Date(Date.now() - 19*864e5), crop: "Onion", field: "Greenhouse", result: "Purple Blotch", severity: "moderate", thumbnail: "🧅", confidence: 79 },
  { id: "10", date: "Mar 10, 2026", dateRaw: new Date(Date.now() - 24*864e5), crop: "Mango", field: "Orchard", result: "All Healthy", severity: "healthy", thumbnail: "🥭", confidence: 97 },
  { id: "11", date: "Mar 5, 2026", dateRaw: new Date(Date.now() - 29*864e5), crop: "Rice", field: "Field C", result: "Bacterial Leaf Blight", severity: "urgent", thumbnail: "🌾", confidence: 71 },
  { id: "12", date: "Feb 28, 2026", dateRaw: new Date(Date.now() - 34*864e5), crop: "Tomato", field: "Field A", result: "Nutrient Deficiency", severity: "mild", thumbnail: "🍅", confidence: 55 },
];

const SEVERITY_STYLE: Record<Severity, { label: string; badge: string; dot: string }> = {
  urgent: { label: "Urgent", badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
  moderate: { label: "Moderate", badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-400" },
  mild: { label: "Mild", badge: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-400" },
  healthy: { label: "Healthy", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
};

const FILTER_OPTIONS: Array<{ label: string; value: Severity | "all" }> = [
  { label: "All", value: "all" },
  { label: "Urgent", value: "urgent" },
  { label: "Moderate", value: "moderate" },
  { label: "Mild", value: "mild" },
  { label: "Healthy", value: "healthy" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function HistoryPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Severity | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_SCANS.filter((s) => {
      const matchQuery = !q || s.crop.toLowerCase().includes(q) || s.result.toLowerCase().includes(q) || s.field.toLowerCase().includes(q);
      const matchFilter = filter === "all" || s.severity === filter;
      return matchQuery && matchFilter;
    });
  }, [query, filter]);

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Scan History</h1>
          <p className="text-muted-foreground text-sm mt-1">{MOCK_SCANS.length} total scans · last 34 days</p>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-2">
          {(["urgent", "moderate", "mild", "healthy"] as Severity[]).map((sev) => {
            const count = MOCK_SCANS.filter((s) => s.severity === sev).length;
            const sty = SEVERITY_STYLE[sev];
            return (
              <button
                key={sev}
                onClick={() => setFilter(filter === sev ? "all" : sev)}
                className={cn(
                  "border rounded-xl p-2.5 text-center transition-all duration-150 cursor-pointer",
                  filter === sev ? `${sty.badge} ring-2 ring-current/30` : "border-border/60 bg-card hover:bg-muted/60"
                )}
              >
                <p className="text-lg font-bold text-foreground">{count}</p>
                <p className="text-[10px] font-medium text-muted-foreground capitalize">{sev}</p>
              </button>
            );
          })}
        </div>

        {/* Search + Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search crop, disease, field…"
              className="pl-9 h-11 rounded-xl pr-8"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setQuery("")}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 border border-border/60 rounded-xl px-3 bg-card">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              className="text-sm bg-transparent border-none outline-none text-foreground pr-1 py-0 h-full cursor-pointer"
              value={filter}
              onChange={(e) => setFilter(e.target.value as Severity | "all")}
            >
              {FILTER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""}
            {query && <> for "<span className="font-semibold text-foreground">{query}</span>"</>}
          </p>
          {(query || filter !== "all") && (
            <button
              className="text-xs text-primary hover:underline"
              onClick={() => { setQuery(""); setFilter("all"); }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Scan list */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">No scans found</p>
              <p className="text-xs text-muted-foreground">Try a different search term or clear your filters.</p>
            </motion.div>
          ) : (
            <motion.div key="list" variants={container} initial="hidden" animate="show" className="space-y-2.5">
              {filtered.map((scan) => {
                const sty = SEVERITY_STYLE[scan.severity];
                return (
                  <motion.div key={scan.id} variants={item} layout>
                    <Card className="rounded-2xl border-border/60 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group hover:border-primary/30">
                      <CardContent className="p-0">
                        <div className="flex items-stretch gap-0 overflow-hidden">
                          {/* Thumbnail */}
                          <div className="w-16 sm:w-20 shrink-0 flex items-center justify-center bg-muted/60 border-r border-border/60 text-3xl select-none">
                            {scan.thumbnail}
                          </div>

                          {/* Main content */}
                          <div className="flex-1 min-w-0 p-3.5">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="text-sm font-bold text-foreground">{scan.crop}</p>
                                  <span className="text-xs text-muted-foreground">· {scan.field}</span>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">{scan.result}</p>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${sty.badge}`}>
                                {sty.label}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                <Leaf className="h-3 w-3" />
                                {scan.date}
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                <div className="h-1.5 w-12 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className={cn("h-full rounded-full", scan.confidence > 80 ? "bg-emerald-500" : scan.confidence > 60 ? "bg-amber-400" : "bg-slate-400")}
                                    style={{ width: `${scan.confidence}%` }}
                                  />
                                </div>
                                <span className="font-medium">{scan.confidence}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AppLayout>
  );
}
