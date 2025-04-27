import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import PortfolioTable from "@/components/PortfolioTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { Cryptocurrency, PortfolioItem, fetchCryptocurrencies, formatCurrency, loadPortfolio, savePortfolio } from "@/services/crypto-api";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(loadPortfolio());

  // Fetch cryptocurrency data
  const { data: cryptocurrencies = [], isLoading } = useQuery({
    queryKey: ["cryptocurrencies"],
    queryFn: () => fetchCryptocurrencies(),
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  const handleRemoveFromPortfolio = (id: string) => {
    const updatedPortfolio = portfolio.filter((item) => item.id !== id);
    setPortfolio(updatedPortfolio);
    savePortfolio(updatedPortfolio);
    
    const cryptoName = cryptocurrencies.find((c) => c.id === id)?.name || "Cryptocurrency";
    toast.success(`Removed ${cryptoName} from your portfolio`, {
      duration: 3000
    });
  };

  // Calculate portfolio summary
  const calculateSummary = () => {
    let totalCurrentValue = 0;
    let totalCostBasis = 0;

    portfolio.forEach((item) => {
      const crypto = cryptocurrencies.find((c) => c.id === item.id);
      if (crypto) {
        totalCurrentValue += item.quantity * crypto.current_price;
        totalCostBasis += item.quantity * item.purchasePrice;
      }
    });

    const totalProfitLoss = totalCurrentValue - totalCostBasis;
    const profitLossPercentage = totalCostBasis > 0 ? (totalProfitLoss / totalCostBasis) * 100 : 0;

    return {
      totalCurrentValue,
      totalCostBasis,
      totalProfitLoss,
      profitLossPercentage,
    };
  };

  const summary = calculateSummary();

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">My Portfolio</h1>
      
      {portfolio.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Loader className="h-6 w-6 animate-spin" />
                ) : (
                  formatCurrency(summary.totalCurrentValue)
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(summary.totalCostBasis)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Profit/Loss
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                summary.totalProfitLoss >= 0 ? "text-crypto-positive" : "text-crypto-negative"
              }`}>
                {isLoading ? (
                  <Loader className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    {formatCurrency(summary.totalProfitLoss)}
                    <span className="text-sm ml-2">
                      ({summary.totalProfitLoss >= 0 ? "+" : ""}
                      {summary.profitLossPercentage.toFixed(2)}%)
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8 animate-spin text-primary/50" />
        </div>
      ) : (
        <PortfolioTable 
          portfolio={portfolio} 
          cryptoData={cryptocurrencies} 
          onRemove={handleRemoveFromPortfolio} 
        />
      )}
    </Layout>
  );
};

export default Portfolio;
