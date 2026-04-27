import { motion } from "framer-motion";
import { useLocation } from "wouter";
import {
  FlaskConical, Droplets, Leaf, Sprout, ArrowLeft,
  Lock, ShieldCheck, Star, AlertTriangle, Info,
  ChevronRight, Clock, Beaker,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

/* ─── Data (Now using translation keys) ───────────────── */

const TREATMENT_STEPS = [
  { step: 1, action: "immediate_isolation", detail: "isolation_desc", timing: "timing_now", urgency: "urgent" },
  { step: 2, action: "first_fungicide", detail: "fungicide_desc", timing: "timing_24h", urgency: "urgent" },
  { step: 3, action: "follow_up", detail: "followup_desc", timing: "timing_10_14", urgency: "moderate" },
  { step: 4, action: "recovery_monitoring", detail: "recovery_desc", timing: "timing_7_21", urgency: "info" },
];

const FERTILIZER_PLAN = [
  { nutrient: "nitrogen", product: "urea", dose: "20 kg/acre", timing: "after_control", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  { nutrient: "phosphorus", product: "dap", dose: "12 kg/acre", timing: "next_irrigation", color: "bg-blue-50 border-blue-200 text-blue-700" },
];

const APPLICATION_METHODS = [
  { icon: Droplets, method: "method_knapsack", detail: "method_knapsack_desc", recommended: true },
  { icon: Beaker, method: "method_drip", detail: "method_drip_desc", recommended: false },
  { icon: Leaf, method: "method_foliar", detail: "method_foliar_desc", recommended: false },
];

const ORGANIC_ALTERNATIVES = [
  { name: "trichoderma", type: "bio_agent", dose: "4 g/litre", benefit: "trichoderma_benefit" },
  { name: "neem_oil", type: "botanical", dose: "5 ml/litre", benefit: "neem_benefit" },
];

const urgencyStyle = {
  urgent: { dot: "bg-red-500", badge: "bg-red-50 text-red-700 border-red-200", border: "border-l-red-400" },
  moderate: { dot: "bg-amber-400", badge: "bg-amber-50 text-amber-700 border-amber-200", border: "border-l-amber-400" },
  info: { dot: "bg-blue-400", badge: "bg-blue-50 text-blue-700 border-blue-200", border: "border-l-blue-300" },
};

export default function PremiumRecommendationPage() {
  const [, navigate] = useLocation();
  const { t } = useTranslation();

  return (
    <AppLayout>
      <motion.div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <button onClick={() => navigate("/recommendations")} className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
            <ArrowLeft className="h-3.5 w-3.5" /> {t("back")}
          </button>

          <h1 className="text-2xl font-bold">{t("premium_plan")}</h1>
          <p className="text-sm text-muted-foreground">{t("disease_info")}</p>

          <div className="mt-2 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-xs font-semibold text-red-700">{t("urgent_action")}</span>
          </div>
        </div>

        {/* Treatment */}
        <Card>
          <CardHeader>
            <CardTitle>{t("treatment")}</CardTitle>
          </CardHeader>
          <CardContent>
            {TREATMENT_STEPS.map((step) => {
              const sty = urgencyStyle[step.urgency as keyof typeof urgencyStyle];
              return (
                <div key={step.step} className={`border-l-4 ${sty.border} p-3 mb-3`}>
                  <p className="font-semibold">{t(step.action)}</p>
                  <p className="text-sm">{t(step.detail)}</p>
                  <span className="text-xs">{t(step.timing)}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Fertilizer */}
        <Card>
          <CardHeader>
            <CardTitle>{t("fertilizer")}</CardTitle>
          </CardHeader>
          <CardContent>
            {FERTILIZER_PLAN.map((f) => (
              <div key={f.nutrient} className="mb-3">
                <p>{t(f.nutrient)}</p>
                <p>{t(f.product)}</p>
                <p>{f.dose}</p>
                <p>{t(f.timing)}</p>
              </div>
            ))}
            <p className="text-xs mt-2">{t("nitrogen_warning")}</p>
          </CardContent>
        </Card>

        {/* Application */}
        <Card>
          <CardHeader>
            <CardTitle>{t("application")}</CardTitle>
          </CardHeader>
          <CardContent>
            {APPLICATION_METHODS.map(({ icon: Icon, method, detail }) => (
              <div key={method} className="mb-3 flex gap-2">
                <Icon />
                <div>
                  <p>{t(method)}</p>
                  <p className="text-sm">{t(detail)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Organic */}
        <Card>
          <CardHeader>
            <CardTitle>{t("organic")}</CardTitle>
          </CardHeader>
          <CardContent>
            {ORGANIC_ALTERNATIVES.map((alt) => (
              <div key={alt.name} className="mb-3">
                <p>{t(alt.name)}</p>
                <p>{t(alt.benefit)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CTA */}
        <Button onClick={() => navigate("/subscription")} className="w-full">
          {t("renew_plan")}
        </Button>

      </motion.div>
    </AppLayout>
  );
}