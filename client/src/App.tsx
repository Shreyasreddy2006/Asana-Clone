import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyTasks from "./pages/MyTasks";
import Inbox from "./pages/Inbox";
import Reporting from "./pages/Reporting";
import ProjectDetail from "./pages/ProjectDetail";
import Welcome from "./pages/Welcome";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import Goals from "./pages/Goals";
import Portfolios from "./pages/Portfolios";
import PortfolioSetup from "./pages/PortfolioSetup";
import PortfolioDetail from "./pages/PortfolioDetail";
import DashboardDetail from "./pages/DashboardDetail";
import Workflow from "./pages/Workflow";
import Workspace from "./pages/Workspace";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/onboarding" replace />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-tasks" element={<MyTasks />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/reporting" element={<Reporting />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/portfolios" element={<Portfolios />} />
          <Route path="/portfolio-setup" element={<PortfolioSetup />} />
          <Route path="/portfolio-detail" element={<PortfolioDetail />} />
          <Route path="/dashboard-detail" element={<DashboardDetail />} />
          <Route path="/workflow" element={<Workflow />} />
          <Route path="/workflows" element={<Workflow />} />
          <Route path="/workspace/*" element={<Workspace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
