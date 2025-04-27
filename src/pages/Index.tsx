
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import SearchBar from "@/components/SearchBar";
import CryptoTable from "@/components/CryptoTable";
import AddToPortfolioDialog from "@/components/AddToPortfolioDialog";
import Layout from "@/components/Layout";
import { Cryptocurrency, fetchCryptocurrencies, loadPortfolio, savePortfolio } from "@/services/crypto-api";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [portfolio, setPortfolio] = useState(loadPortfolio());

  // Fetch cryptocurrency data
  const { data: cryptocurrencies = [], isLoading } = useQuery({
    queryKey: ["cryptocurrencies"],
    queryFn: fetchCryptocurrencies,
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  // Filter cryptocurrencies based on search query
  const filteredCryptocurrencies = cryptocurrencies.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToPortfolio = (id: string, quantity: number, purchasePrice: number) => {
    const existingItemIndex = portfolio.findIndex((item) => item.id === id);
    
    if (existingItemIndex !== -1) {
      // Update existing item
      const updatedPortfolio = [...portfolio];
      const existingItem = updatedPortfolio[existingItemIndex];
      
      const totalValue = existingItem.quantity * existingItem.purchasePrice + quantity * purchasePrice;
      const totalQuantity = existingItem.quantity + quantity;
      const averagePrice = totalValue / totalQuantity;
      
      updatedPortfolio[existingItemIndex] = {
        ...existingItem,
        quantity: totalQuantity,
        purchasePrice: averagePrice,
      };
      
      setPortfolio(updatedPortfolio);
      savePortfolio(updatedPortfolio);
      toast.success(`Updated ${selectedCrypto?.name} in your portfolio`);
    } else {
      // Add new item
      const newPortfolio = [...portfolio, { id, quantity, purchasePrice }];
      setPortfolio(newPortfolio);
      savePortfolio(newPortfolio);
      toast.success(`Added ${selectedCrypto?.name} to your portfolio`);
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-6">Cryptocurrency Markets</h1>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <CryptoTable 
        cryptocurrencies={filteredCryptocurrencies} 
        isLoading={isLoading}
        onCryptoClick={(crypto) => {
          setSelectedCrypto(crypto);
          setIsDialogOpen(true);
        }}
      />
      
      <AddToPortfolioDialog
        crypto={selectedCrypto}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAdd={handleAddToPortfolio}
      />
    </Layout>
  );
};

export default Index;
