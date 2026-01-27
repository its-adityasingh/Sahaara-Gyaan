import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Index from "./pages/Index";
import LearnPage from "./pages/LearnPage";
import VideoPlayerPage from "./pages/VideoPlayerPage";
import OfflinePage from "./pages/OfflinePage";
import AccessibilityPage from "./pages/AccessibilityPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

// Configure QueryClient with proper error handling and retry logic
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

// Loading component to prevent white screen
const AppLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
      <p className="text-muted-foreground">Loading Sahaara Gyaan...</p>
    </div>
  </div>
);

const AppContent = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Small delay to ensure all providers are ready
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isInitialized) {
    return <AppLoader />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/learn" element={<LearnPage />} />
      <Route path="/learn/video" element={<VideoPlayerPage />} />
      <Route path="/offline" element={<OfflinePage />} />
      <Route path="/accessibility" element={<AccessibilityPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  // Catch any errors during render
  try {
    return (
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <AppContent />
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Fatal error in App component:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-destructive mb-4">Application Error</h1>
          <p className="text-muted-foreground mb-4">
            A fatal error occurred while loading the application.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
};

export default App;
