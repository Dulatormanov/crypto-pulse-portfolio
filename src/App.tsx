import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import NotFound from "./pages/NotFound";
import FloatingAiAssistant from "./components/FloatingAiAssistant";
import { Cryptocurrency } from "@/services/crypto-api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// App wrapper to access React Router hooks
const AppContent = () => {
  const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency | undefined>(undefined);
  
  // Function to update selected crypto, to be passed to routes
  const handleSelectCrypto = (crypto: Cryptocurrency | undefined) => {
    setSelectedCrypto(crypto);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Index onSelectCrypto={handleSelectCrypto} />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FloatingAiAssistant selectedCrypto={selectedCrypto} />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" duration={3000} />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
