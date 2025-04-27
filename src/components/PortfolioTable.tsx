
import React from "react";
import { Cryptocurrency, PortfolioItem, formatCurrency, formatPercentage, getPercentageClass } from "@/services/crypto-api";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PortfolioTableProps {
  portfolio: PortfolioItem[];
  cryptoData: Cryptocurrency[];
  onRemove: (id: string) => void;
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({
  portfolio,
  cryptoData,
  onRemove,
}) => {
  if (portfolio.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Your portfolio is empty. Add cryptocurrencies from the markets page.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-secondary">
            <th className="text-left py-3 pl-4">Asset</th>
            <th className="text-right py-3 px-4">Quantity</th>
            <th className="text-right py-3 px-4">Avg. Buy Price</th>
            <th className="text-right py-3 px-4">Current Price</th>
            <th className="text-right py-3 px-4">Current Value</th>
            <th className="text-right py-3 px-4">Profit/Loss</th>
            <th className="text-right py-3 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((item) => {
            const crypto = cryptoData.find((c) => c.id === item.id);
            
            if (!crypto) return null;
            
            const currentValue = item.quantity * crypto.current_price;
            const costBasis = item.quantity * item.purchasePrice;
            const profitLoss = currentValue - costBasis;
            const profitLossPercentage = (profitLoss / costBasis) * 100;

            return (
              <tr key={item.id} className="border-b border-secondary/50">
                <td className="py-4 pl-4">
                  <div className="flex items-center gap-3">
                    <img src={crypto.image} alt={crypto.name} className="w-6 h-6" />
                    <div>
                      <div className="font-medium">{crypto.name}</div>
                      <div className="text-sm text-muted-foreground">{crypto.symbol.toUpperCase()}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">{item.quantity}</td>
                <td className="py-4 px-4 text-right">{formatCurrency(item.purchasePrice)}</td>
                <td className="py-4 px-4 text-right">{formatCurrency(crypto.current_price)}</td>
                <td className="py-4 px-4 text-right">{formatCurrency(currentValue)}</td>
                <td className={`py-4 px-4 text-right ${getPercentageClass(profitLossPercentage)}`}>
                  <div>{formatCurrency(profitLoss)}</div>
                  <div className="text-sm">{formatPercentage(profitLossPercentage)}</div>
                </td>
                <td className="py-4 pr-4 text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onRemove(item.id)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioTable;
