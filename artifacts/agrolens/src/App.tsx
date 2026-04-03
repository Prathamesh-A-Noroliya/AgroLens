import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { ScanProvider } from "@/lib/scan-store";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import DashboardPage from "@/pages/dashboard";
import ScanPage from "@/pages/scan";
import ScanResultPage from "@/pages/scan-result";
import PlaceholderPage from "@/pages/placeholder";
import { Lightbulb, History, MessageSquare, User } from "lucide-react";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user } = useAuth();
  if (!user) return <Redirect to="/login" />;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <Redirect to="/login" />
      </Route>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/dashboard">
        <ProtectedRoute component={DashboardPage} />
      </Route>
      <Route path="/scan/result">
        <ProtectedRoute component={ScanResultPage} />
      </Route>
      <Route path="/scan">
        <ProtectedRoute component={ScanPage} />
      </Route>
      <Route path="/recommendations">
        <ProtectedRoute component={() => (
          <PlaceholderPage
            title="Smart Recommendations"
            description="Get personalised crop care recommendations based on your scan results and local weather data."
            icon={Lightbulb}
          />
        )} />
      </Route>
      <Route path="/history">
        <ProtectedRoute component={() => (
          <PlaceholderPage
            title="Scan History"
            description="View all your past crop scans, disease detections, and treatment records in one place."
            icon={History}
          />
        )} />
      </Route>
      <Route path="/chat">
        <ProtectedRoute component={() => (
          <PlaceholderPage
            title="BHOOMI AI Assistant"
            description="Chat with BHOOMI — your intelligent farming companion. Ask questions about crops, weather, market prices, and more."
            icon={MessageSquare}
          />
        )} />
      </Route>
      <Route path="/profile">
        <ProtectedRoute component={() => (
          <PlaceholderPage
            title="Farmer Profile"
            description="Manage your farmer profile, farm details, notification preferences, and account settings."
            icon={User}
          />
        )} />
      </Route>
      <Route>
        <Redirect to="/login" />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ScanProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </ScanProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
