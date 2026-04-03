import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  LayoutDashboard, Camera, Lightbulb, History,
  MessageSquare, User, Leaf, LogOut, X, Star,
  CreditCard, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useBhoomi } from "@/lib/bhoomi-context";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Camera, label: "AI Scan", href: "/scan" },
  { icon: Lightbulb, label: "Recommendations", href: "/recommendations" },
  { icon: History, label: "Scan History", href: "/history" },
  { icon: MessageSquare, label: "Chat with BHOOMI", href: "__bhoomi__" },
  { icon: User, label: "Profile", href: "/profile" },
];

const PAYMENT_ITEMS: NavItem[] = [
  { icon: Star, label: "Pro Plans", href: "/subscription", badge: "Hot" },
  { icon: CreditCard, label: "Payment & Billing", href: "/checkout" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const [location, navigate] = useLocation();
  const { logout, user } = useAuth();
  const { setOpen: setBhoomiOpen } = useBhoomi();

  const handleNav = (href: string) => {
    if (href === "__bhoomi__") {
      setBhoomiOpen(true);
      onClose();
      return;
    }
    navigate(href);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  };

  const isActive = (href: string) =>
    location === href || (href !== "/dashboard" && location.startsWith(href));

  const NavButton = ({ item }: { item: NavItem }) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    return (
      <button
        onClick={() => handleNav(item.href)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group text-left",
          active
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-sidebar-accent-foreground")} />
        <span className="flex-1">{item.label}</span>
        {item.badge && !active && (
          <span className="text-[9px] font-bold bg-amber-400 text-white px-1.5 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
        {active && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground/60" />}
      </button>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Mobile header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border lg:hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-sm">AgroLens</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {/* Main Navigation */}
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 py-2">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => <NavButton key={item.href} item={item} />)}

        {/* Payment & Subscription Section */}
        <div className="pt-3 mt-3 border-t border-sidebar-border">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 py-2">
            Plans & Billing
          </p>
          {PAYMENT_ITEMS.map((item) => <NavButton key={item.href} item={item} />)}
        </div>

        {/* Pro upsell card */}
        <div className="mt-3 mx-1">
          <button
            onClick={() => handleNav("/subscription")}
            className="w-full bg-gradient-to-br from-primary/10 to-emerald-50 border border-primary/20 rounded-xl p-3 text-left hover:border-primary/40 transition-all group"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-xs font-bold text-foreground">Upgrade to Pro</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Unlimited scans · BHOOMI voice · Treatment protocols
            </p>
            <div className="mt-2 text-[11px] font-semibold text-primary group-hover:underline flex items-center gap-1">
              View plans — from ₹199/mo →
            </div>
          </button>
        </div>
      </nav>

      {/* User info + logout */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        {user && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-primary font-bold text-xs">
                {user.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{user.fullName}</p>
              <p className="text-[10px] text-muted-foreground font-mono truncate">{user.farmerId}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-150"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -288 }} animate={{ x: 0 }} exit={{ x: -288 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-72 z-50 bg-sidebar border-r border-sidebar-border shadow-xl lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      <aside className="hidden lg:flex flex-col fixed top-16 left-0 h-[calc(100vh-64px)] w-64 z-30 bg-sidebar border-r border-sidebar-border">
        {sidebarContent}
      </aside>
    </>
  );
}
