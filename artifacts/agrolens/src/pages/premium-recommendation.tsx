import { motion } from "framer-motion";
import { useLocation } from "wouter";
import {
  Droplets, Leaf, Sprout, ArrowLeft,
  AlertTriangle, Beaker
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

/* ─── Data (Translation Keys Only) ───────────────── */

const TREATMENT_STEPS = [
  { step: 1, action: "immediate_isolation", detail: "isolation_desc", timing: "timing_now", urgency: "urgent" },
  { step: 2, action: "first_fungicide", detail: "fungicide_desc", timing: "timing_24h", urgency: "urgent" },
  { step: 3, action: "follow_up", detail: "followup_desc", timing: "timing_10_14", urgency: "moderate" },
  { step: 4, action: "recovery_monitoring", detail: "recovery_desc", timing: "timing_7_21", urgency: "info" },
];

const APPLICATION_METHODS = [
  { icon: Droplets, method: "method_knapsack", detail: "method_knapsack_desc" },
  { icon: Beaker, method: "method_drip", detail: "method_drip_desc" },
  { icon: Leaf, method: "method_foliar", detail: "method_foliar_desc" },
];

const ORGANIC_ALTERNATIVES = [
  { name: "trichoderma", benefit: "trichoderma_benefit" },
  { name: "neem_oil", benefit: "neem_benefit" },
];

const urgencyStyle = {
  urgent: "border-l-red-400",
  moderate: "border-l-amber-400",
  info: "border-l-blue-300",
};

export default function PremiumRecommendationPage() {
  const [, navigate] = useLocation();
  const { t } = useTranslation();

  return (
    <AppLayout>
      <motion.div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <button
            onClick={() => navigate("/recommendations")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("back")}
          </button>

          <h1 className="text-2xl font-bold">
            {t("premium_plan")}
          </h1>

          <p className="text-sm text-muted-foreground">
            {t("disease_info")}
          </p>

          <div className="mt-2 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-xs font-semibold text-red-700">
              {t("urgent_action")}
            </span>
          </div>
        </div>

        {/* Treatment */}
        <Card>
          <CardHeader>
            <CardTitle>{t("treatment")}</CardTitle>
          </CardHeader>
          <CardContent>
            {TREATMENT_STEPS.map((step) => (
              <div
                key={step.step}
                className={`border-l-4 ${urgencyStyle[step.urgency as keyof typeof urgencyStyle]} p-3 mb-3`}
              >
                <p className="font-semibold">{t(step.action)}</p>
                <p className="text-sm">{t(step.detail)}</p>
                <span className="text-xs text-muted-foreground">
                  {t(step.timing)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Fertilizer */}
        <Card>
          <CardHeader>
            <CardTitle>{t("fertilizer")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {t("nitrogen_warning")}
            </p>
          </CardContent>
        </Card>

        {/* Application */}
        <Card>
          <CardHeader>
            <CardTitle>{t("application")}</CardTitle>
          </CardHeader>
          <CardContent>
            {APPLICATION_METHODS.map(({ icon: Icon, method, detail }) => (
              <div key={method} className="mb-3 flex gap-2 items-start">
                <Icon className="h-5 w-5 mt-1" />
                <div>
                  <p className="font-medium">{t(method)}</p>
                  <p className="text-sm text-muted-foreground">
                    {t(detail)}
                  </p>
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
                <p className="font-medium">{t(alt.name)}</p>
                <p className="text-sm text-muted-foreground">
                  {t(alt.benefit)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CTA */}
        <Button
          onClick={() => navigate("/subscription")}
          className="w-full"
        >
          {t("renew_plan")}
        </Button>

      </motion.div>
    </AppLayout>
  );
}