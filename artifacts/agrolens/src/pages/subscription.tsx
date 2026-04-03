import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  CheckCircle2, Star, Zap, Shield, Leaf, ArrowRight,
  ChevronLeft, Sparkles, Lock,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FEATURES = [
  "Unlimited AI crop scans",
  "BHOOMI voice assistant (24/7)",
  "Full premium treatment protocols",
  "Fertilizer & dosage plans",
  "Historical disease insights",
  "Weather-based spray advisories",
  "Market price & mandi alerts",
  "Priority support (< 2 hour response)",
  "Offline scan mode",
  "Multi-field management",
];

const PLANS = [
  {
    id: "monthly",
    label: "Monthly",
    price: "₹299",
    period: "/month",
    total: "₹299 billed monthly",
    saving: null,
    badge: null,
    highlight: false,
    description: "Perfect for trying out AgroLens Pro.",
  },
  {
    id: "yearly",
    label: "Yearly",
    price: "₹199",
    period: "/month",
    total: "₹2,388 billed annually",
    saving: "Save ₹1,200/year",
    badge: "Best Value",
    highlight: true,
    description: "For serious farmers — maximum savings.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" } },
};

export default function SubscriptionPage() {
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState<"monthly" | "yearly">("yearly");

  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <motion.div variants={item}>
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3">
            <ChevronLeft className="h-4 w-4" /> Back to Dashboard
          </button>
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Unlock AgroLens Pro</h1>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Get the full power of AI crop intelligence — unlimited scans, BHOOMI assistant, and expert treatment protocols.
            </p>
          </div>
        </motion.div>

        {/* Plan Toggle */}
        <motion.div variants={item}>
          <div className="flex items-center justify-center gap-3 mb-4">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id as "monthly" | "yearly")}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                  selected === plan.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {plan.label}
                {plan.saving && selected === plan.id && (
                  <span className="ml-2 text-[10px] bg-primary-foreground/20 text-primary-foreground px-1.5 py-0.5 rounded-full">
                    Save 33%
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PLANS.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ y: -2 }}
                onClick={() => setSelected(plan.id as "monthly" | "yearly")}
                className={cn(
                  "relative rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200",
                  selected === plan.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border/60 bg-card hover:border-primary/40"
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{plan.label}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    </div>
                  </div>
                  <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all", selected === plan.id ? "border-primary bg-primary" : "border-border/60")}>
                    {selected === plan.id && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{plan.description}</p>
                <p className="text-xs text-muted-foreground mt-2">{plan.total}</p>
                {plan.saving && (
                  <div className="mt-2 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2 py-0.5 rounded-full">
                    <Zap className="h-3 w-3" /> {plan.saving}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features List */}
        <motion.div variants={item}>
          <Card className="rounded-2xl border-border/60 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Everything included</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4">
                {FEATURES.map((feat, i) => (
                  <motion.div
                    key={feat}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="text-sm text-foreground">{feat}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trust badges */}
        <motion.div variants={item} className="flex items-center justify-center gap-6 flex-wrap">
          {[
            { icon: Shield, label: "Cancel anytime" },
            { icon: Lock, label: "Secure payment" },
            { icon: Star, label: "50K+ farmers" },
            { icon: Leaf, label: "Made in India" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Icon className="h-3.5 w-3.5 text-primary" />
              {label}
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={item} className="pb-4">
          <Button
            className="w-full h-13 rounded-xl font-bold text-base gap-2 shadow-sm"
            size="lg"
            onClick={() => navigate("/checkout")}
          >
            <Sparkles className="h-5 w-5" />
            Continue to Payment — {selected === "yearly" ? "₹2,388/yr" : "₹299/mo"}
            <ArrowRight className="h-5 w-5" />
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-2.5">
            7-day free trial · No questions asked cancellation
          </p>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
