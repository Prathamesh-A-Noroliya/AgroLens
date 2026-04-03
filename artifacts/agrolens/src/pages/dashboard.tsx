import { useState } from "react";
import { motion } from "framer-motion";
import {
  Camera, CloudUpload, History, Bell, CheckCircle2,
  AlertTriangle, TrendingUp, Star, Leaf, Sun, Droplets,
  Wind, CloudRain, Thermometer, Zap, ArrowRight, Sparkles,
  ShieldCheck, Clock,
} from "lucide-react";
import { useLocation } from "wouter";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";

/* ─── Mock Data ─────────────────────────────────────── */

const HEALTH_DONUT = [
  { name: "Healthy", value: 62, color: "#22c55e" },
  { name: "At Risk", value: 21, color: "#f59e0b" },
  { name: "Diseased", value: 11, color: "#ef4444" },
  { name: "Unknown", value: 6, color: "#cbd5e1" },
];

const WEEKLY_SCANS = [
  { day: "Mon", scans: 3 },
  { day: "Tue", scans: 5 },
  { day: "Wed", scans: 2 },
  { day: "Thu", scans: 7 },
  { day: "Fri", scans: 4 },
  { day: "Sat", scans: 6 },
  { day: "Sun", scans: 1 },
];

const SCAN_HISTORY = [
  { crop: "Wheat", field: "Field A", result: "Rust detected", severity: "high", date: "Today, 10:24 AM" },
  { crop: "Rice", field: "Field B", result: "Minor leaf blight", severity: "medium", date: "Yesterday" },
  { crop: "Tomato", field: "Greenhouse", result: "All healthy", severity: "low", date: "2 days ago" },
  { crop: "Cotton", field: "Field C", result: "Aphid infestation", severity: "high", date: "3 days ago" },
];

const RECOMMENDATIONS = [
  { text: "Apply copper-based fungicide to wheat in Field A within 48 hours.", priority: "urgent" },
  { text: "Increase irrigation for rice paddies — soil moisture below optimal.", priority: "moderate" },
  { text: "Rotate crops in Field C next season to reduce aphid risk.", priority: "info" },
];

const HOURLY_RAIN = [
  { time: "6AM", mm: 0 },
  { time: "9AM", mm: 0 },
  { time: "12PM", mm: 2 },
  { time: "3PM", mm: 5 },
  { time: "6PM", mm: 3 },
  { time: "9PM", mm: 1 },
];

/* ─── Animation Variants ────────────────────────────── */

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" } },
};

/* ─── Custom Donut Label ─────────────────────────────── */

function DonutLabel({ cx, cy }: { cx: number; cy: number }) {
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
      <tspan x={cx} dy="-0.4em" className="fill-foreground" style={{ fontSize: 22, fontWeight: 700 }}>
        62%
      </tspan>
      <tspan x={cx} dy="1.4em" style={{ fontSize: 11, fill: "#6b7280" }}>
        Healthy
      </tspan>
    </text>
  );
}

/* ─── Severity helpers ───────────────────────────────── */

const severityBadge: Record<string, string> = {
  high: "bg-red-50 text-red-600 border-red-200",
  medium: "bg-amber-50 text-amber-600 border-amber-200",
  low: "bg-emerald-50 text-emerald-600 border-emerald-200",
};

const priorityDot: Record<string, string> = {
  urgent: "bg-red-500",
  moderate: "bg-amber-400",
  info: "bg-blue-400",
};

/* ─── Component ──────────────────────────────────────── */

export default function DashboardPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <AppLayout>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-5"
      >
        {/* ── Welcome Banner ───────────────────────────── */}
        <motion.div variants={item}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-primary to-emerald-700 p-6 text-white shadow-md">
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-12 right-20 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
              <Leaf className="h-20 w-20 text-white" />
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-emerald-100 text-sm font-medium mb-1">{today}</p>
                <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                  Welcome back, {user?.fullName.split(" ")[0]}!
                </h1>
                <p className="text-emerald-100 text-sm mt-1.5">
                  Your farm is being monitored. Here's today's overview.
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 text-sm">
                  <Leaf className="h-4 w-4 text-emerald-200" />
                  <span className="text-white/80 text-xs">Farmer ID</span>
                  <span className="font-mono font-bold text-white">{user?.farmerId}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 text-sm">
                  <ShieldCheck className="h-4 w-4 text-emerald-200" />
                  <span className="text-white/80 text-xs">Crop</span>
                  <span className="font-semibold text-white capitalize">{user?.cropType ?? "—"}</span>
                </div>
              </div>
            </div>

            {/* Stat pills */}
            <div className="relative z-10 mt-5 flex items-center gap-3 flex-wrap">
              {[
                { icon: Camera, label: "24 Scans", bg: "bg-white/15" },
                { icon: AlertTriangle, label: "3 Active Issues", bg: "bg-red-400/30" },
                { icon: TrendingUp, label: "87% Health", bg: "bg-white/15" },
              ].map(({ icon: Icon, label, bg }) => (
                <div key={label} className={`flex items-center gap-1.5 ${bg} rounded-full px-3 py-1 text-xs font-medium text-white`}>
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Quick Actions ────────────────────────────── */}
        <motion.div variants={item}>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Scan Crop */}
            <motion.button
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/scan")}
              className="relative overflow-hidden group bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-left shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute right-4 top-4 opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none">
                <Camera className="h-16 w-16 text-white" />
              </div>
              <div className="relative z-10">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <p className="text-white font-bold text-lg leading-tight">Scan Crop</p>
                <p className="text-blue-100 text-sm mt-1">Use AI camera to detect diseases instantly</p>
                <div className="mt-4 flex items-center gap-1 text-white/80 text-xs font-medium">
                  Start scanning <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </motion.button>

            {/* Upload Image */}
            <motion.button
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/scan")}
              className="relative overflow-hidden group bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-left shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
            >
              <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute right-4 top-4 opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none">
                <CloudUpload className="h-16 w-16 text-white" />
              </div>
              <div className="relative z-10">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                  <CloudUpload className="h-6 w-6 text-white" />
                </div>
                <p className="text-white font-bold text-lg leading-tight">Upload Image</p>
                <p className="text-violet-100 text-sm mt-1">Upload a photo from your gallery for analysis</p>
                <div className="mt-4 flex items-center gap-1 text-white/80 text-xs font-medium">
                  Upload now <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* ── Data Cards Row ───────────────────────────── */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          {/* Scan History Summary */}
          <Card className="rounded-2xl border-border/60 shadow-sm hover:shadow-md transition-shadow duration-200 group">
            <CardHeader className="pb-2 pt-5 px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" /> Scan History
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-primary px-2" onClick={() => navigate("/history")}>
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-2">
              {[
                { label: "Total Scans", value: "24", icon: Camera, color: "text-blue-500" },
                { label: "Issues Found", value: "3", icon: AlertTriangle, color: "text-red-500" },
                { label: "Resolved", value: "21", icon: CheckCircle2, color: "text-emerald-500" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className={`h-3.5 w-3.5 ${color}`} />
                    {label}
                  </div>
                  <span className="font-bold text-foreground text-sm">{value}</span>
                </div>
              ))}
              <div className="pt-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Resolution rate</span>
                  <span className="font-semibold text-emerald-600">87.5%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "87.5%" }}
                    transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Subscription */}
          <Card className="rounded-2xl border-border/60 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2 pt-5 px-5">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" /> Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-200">
                  <Zap className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">AgroLens Pro</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-emerald-600 font-medium">Active</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                {[
                  "Unlimited AI scans",
                  "BHOOMI voice assistant",
                  "Market price alerts",
                  "Priority support",
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 rounded-xl px-3 py-2">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                Renews on <span className="font-semibold text-foreground ml-1">May 3, 2026</span>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations Alert */}
          <Card className="rounded-2xl border-border/60 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <CardHeader className="pb-2 pt-5 px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" /> AI Insights
                </CardTitle>
                <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20 font-medium">
                  {RECOMMENDATIONS.length} new
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-2.5">
              {RECOMMENDATIONS.map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex gap-2.5 bg-muted/50 rounded-xl p-3"
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${priorityDot[rec.priority]}`} />
                  <p className="text-xs text-foreground leading-relaxed">{rec.text}</p>
                </motion.div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-primary text-xs mt-1"
                onClick={() => navigate("/recommendations")}
              >
                View all recommendations <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Visual Analytics Row ─────────────────────── */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-3">

          {/* Crop Health Donut Chart */}
          <Card className="rounded-2xl border-border/60 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-0 pt-5 px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" /> Crop Health Overview
                </CardTitle>
                <span className="text-xs text-muted-foreground">Last 30 days</span>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="flex flex-col sm:flex-row items-center gap-6 mt-2">
                <div className="w-full sm:w-48 h-48 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={HEALTH_DONUT}
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="80%"
                        paddingAngle={3}
                        dataKey="value"
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                        labelLine={false}
                      >
                        {HEALTH_DONUT.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={entry.color}
                            opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                            strokeWidth={activeIndex === index ? 2 : 0}
                            stroke={entry.color}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: number, name: string) => [`${val}%`, name]}
                        contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2.5 w-full">
                  {HEALTH_DONUT.map((entry, i) => (
                    <motion.div
                      key={entry.name}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.08 }}
                      className="flex items-center justify-between gap-2 group cursor-default"
                      onMouseEnter={() => setActiveIndex(i)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                        <span className="text-sm text-muted-foreground truncate">{entry.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: entry.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${entry.value}%` }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 0.7, ease: "easeOut" }}
                          />
                        </div>
                        <span className="text-sm font-bold text-foreground w-8 text-right">{entry.value}%</span>
                      </div>
                    </motion.div>
                  ))}
                  <div className="pt-2 mt-2 border-t border-border/60">
                    <p className="text-xs text-muted-foreground">Based on <span className="font-semibold text-foreground">24 scans</span> across <span className="font-semibold text-foreground">3 fields</span></p>
                  </div>
                </div>
              </div>

              {/* Weekly scan bar chart */}
              <div className="mt-4 pt-4 border-t border-border/60">
                <p className="text-xs font-medium text-muted-foreground mb-3">Weekly Scan Activity</p>
                <div className="h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={WEEKLY_SCANS} barSize={10}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 11 }}
                        formatter={(v: number) => [v, "Scans"]}
                      />
                      <Bar dataKey="scans" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weather Widget */}
          <Card className="rounded-2xl border-border/60 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <CardHeader className="pb-0 pt-5 px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-500" /> Weather Widget
                </CardTitle>
                <span className="text-xs text-muted-foreground">{user?.state}</span>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-4">
              {/* Current condition */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Sun className="h-14 w-14 text-amber-400" />
                    <CloudRain className="h-7 w-7 text-blue-400 absolute -bottom-1 -right-1" />
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-foreground">28°C</p>
                    <p className="text-sm text-muted-foreground">Partly Cloudy</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Feels like</p>
                  <p className="text-lg font-bold text-foreground">31°C</p>
                </div>
              </div>

              {/* Stat pills */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Droplets, label: "Humidity", value: "62%", color: "text-blue-500" },
                  { icon: Wind, label: "Wind", value: "12 km/h", color: "text-slate-500" },
                  { icon: Thermometer, label: "UV Index", value: "7 High", color: "text-orange-500" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="bg-muted/60 rounded-xl p-2.5 text-center">
                    <Icon className={`h-4 w-4 mx-auto mb-1 ${color}`} />
                    <p className="text-xs font-semibold text-foreground">{value}</p>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              {/* Rainfall prediction chart */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-muted-foreground">Rainfall Prediction (today)</p>
                  <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                    <CloudRain className="h-3 w-3" />
                    11 mm expected
                  </div>
                </div>
                <div className="h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={HOURLY_RAIN} barSize={8}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 11 }}
                        formatter={(v: number) => [`${v} mm`, "Rain"]}
                      />
                      <Bar dataKey="mm" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Advisory */}
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  Rain expected in the afternoon. Avoid pesticide spraying after 12 PM today.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Recent Scan History ──────────────────────── */}
        <motion.div variants={item}>
          <Card className="rounded-2xl border-border/60 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pt-5 px-5 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" /> Recent Crop Alerts
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-primary px-2" onClick={() => navigate("/history")}>
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="divide-y divide-border/50">
                {SCAN_HISTORY.map((entry, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.07 }}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-muted/40 transition-colors cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Leaf className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{entry.crop}</p>
                        <span className="text-xs text-muted-foreground">· {entry.field}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{entry.result}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${severityBadge[entry.severity]} capitalize`}>
                        {entry.severity}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{entry.date}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
