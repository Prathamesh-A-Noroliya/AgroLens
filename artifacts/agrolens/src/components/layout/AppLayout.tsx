import { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import Sidebar from "./Sidebar";
import BhoomiButton from "./BhoomiButton";
import { BhoomiProvider } from "@/lib/bhoomi-context";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BhoomiProvider>
      <div className="min-h-screen bg-background">
        
        {/* Header (LanguageSwitcher is inside Header) */}
        <Header
          onMenuToggle={() => setSidebarOpen((v) => !v)}
          sidebarOpen={sidebarOpen}
        />

        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="pt-16 lg:pl-64 min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>

        {/* Bhoomi AI Button */}
        <BhoomiButton />

      </div>
    </BhoomiProvider>
  );
}