import { motion } from "framer-motion";
import { LucideIcon, Construction } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface PlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  comingSoon?: boolean;
}

export default function PlaceholderPage({ title, description, icon: Icon, comingSoon = true }: PlaceholderProps) {
  const [, navigate] = useLocation();

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-[60vh] flex flex-col items-center justify-center text-center"
      >
        <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
          <Icon className="h-9 w-9 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground text-sm max-w-sm mb-4">{description}</p>
        {comingSoon && (
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            <Construction className="h-3.5 w-3.5" />
            Coming in Phase 2
          </div>
        )}
        <Button variant="outline" size="sm" className="rounded-xl" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </motion.div>
    </AppLayout>
  );
}
