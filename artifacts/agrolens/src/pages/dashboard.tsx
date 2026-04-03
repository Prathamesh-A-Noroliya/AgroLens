import { motion } from "framer-motion";
import {
  Camera, Lightbulb, MessageSquare, History,
  TrendingUp, AlertTriangle, CheckCircle2, Leaf, Sun, Droplets, Wind,
} from "lucide-react";
import { useLocation } from "wouter";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const STATS = [
  { label: "Scans Done", value: "24", icon: Camera, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Issues Found", value: "3", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
  { label: "Resolved", value: "21", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
  { label: "Health Score", value: "87%", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
];

const QUICK_ACTIONS = [
  { label: "AI Scan", desc: "Scan your crop", icon: Camera, href: "/scan", color: "bg-blue-500" },
  { label: "Recommendations", desc: "View suggestions", icon: Lightbulb, href: "/recommendations", color: "bg-amber-500" },
  { label: "Chat BHOOMI", desc: "Ask anything", icon: MessageSquare, href: "/chat", color: "bg-primary" },
  { label: "History", desc: "Past scans", icon: History, href: "/history", color: "bg-purple-500" },
];

const RECENT_ALERTS = [
  { crop: "Wheat", issue: "Rust detected", severity: "high", time: "2h ago" },
  { crop: "Rice", issue: "Minor leaf blight", severity: "medium", time: "1d ago" },
  { crop: "Tomato", issue: "Healthy", severity: "low", time: "2d ago" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <AppLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Greeting */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {greeting()}, {user?.fullName.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Here's the overview of your farm today.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 px-3 py-2 rounded-xl w-fit">
            <Leaf className="h-3.5 w-3.5 text-primary" />
            ID: <span className="font-mono font-semibold text-foreground">{user?.farmerId}</span>
          </div>
        </motion.div>

        {/* Weather strip */}
        <motion.div variants={itemVariants}>
          <Card className="rounded-2xl border-border/60 shadow-sm overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <Sun className="h-8 w-8 text-amber-400" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">Partly Cloudy · 28°C</p>
                    <p className="text-xs text-muted-foreground">{user?.state}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Droplets className="h-3.5 w-3.5 text-blue-400" />
                    <span>62% humidity</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wind className="h-3.5 w-3.5 text-slate-400" />
                    <span>12 km/h NW</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Good conditions for spraying today</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="rounded-2xl border-border/60 shadow-sm">
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`h-4.5 w-4.5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.href}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(action.href)}
                  className="bg-card border border-border/60 rounded-2xl p-4 text-left shadow-sm hover:shadow-md transition-all duration-200 group"
                >
                  <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mb-3`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="font-semibold text-foreground text-sm">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.desc}</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Alerts */}
        <motion.div variants={itemVariants}>
          <Card className="rounded-2xl border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-foreground">Recent Crop Alerts</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/60">
                {RECENT_ALERTS.map((alert, i) => (
                  <div key={i} className="flex items-center gap-3 px-6 py-3">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${
                      alert.severity === "high" ? "bg-destructive" :
                      alert.severity === "medium" ? "bg-amber-400" : "bg-emerald-500"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{alert.crop}</p>
                      <p className="text-xs text-muted-foreground truncate">{alert.issue}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{alert.time}</span>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 border-t border-border/60">
                <Button variant="ghost" size="sm" className="text-primary text-xs w-full" onClick={() => navigate("/history")}>
                  View All History
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
