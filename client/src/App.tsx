import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { initializeData } from "@/lib/init-data";
import { useRealtimeAlerts } from "@/hooks/use-realtime-alerts";
import { useEffect } from "react";
import Dashboard from "@/pages/dashboard";
import AlertsPage from "@/pages/alerts";
import LocationsPage from "@/pages/locations";
import RoutesPage from "@/pages/routes-page";
import AnalyticsPage from "@/pages/analytics-page";
import NotFound from "@/pages/not-found";

function Router() {
  const { activeAlertCount } = useRealtimeAlerts(true);

  useEffect(() => {
    initializeData();
  }, []);

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar activeAlertCount={activeAlertCount} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/alerts" component={AlertsPage} />
              <Route path="/locations" component={LocationsPage} />
              <Route path="/routes" component={RoutesPage} />
              <Route path="/analytics" component={AnalyticsPage} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
