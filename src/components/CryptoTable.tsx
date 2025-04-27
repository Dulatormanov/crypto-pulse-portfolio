import React from "react";
import { Cryptocurrency, Currency } from "@/services/crypto-api";
import CryptoListItem from "./CryptoListItem";
import { Loader } from "lucide-react";

interface CryptoTableProps {
  cryptocurrencies: Cryptocurrency[];
  isLoading: boolean;
  currency: Currency;
  onCryptoClick?: (crypto: Cryptocurrency) => void;
}

const CryptoTable: React.FC<CryptoTableProps> = ({
  cryptocurrencies,
  isLoading,
  currency,
  onCryptoClick
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="h-8 w-8 animate-spin text-primary/50" />
      </div>
    );
  }

  if (cryptocurrencies.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-muted-foreground">No cryptocurrencies found</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-secondary">
            <th className="text-left py-3 pl-4">Name</th>
            <th className="text-right py-3 px-4">Price</th>
            <th className="text-right py-3 px-4">24h Change</th>
            <th className="text-right py-3 pr-4 hidden md:table-cell">Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {cryptocurrencies.map((crypto) => (
            <CryptoListItem 
              key={crypto.id} 
              crypto={crypto} 
              currency={currency}
              onClick={() => onCryptoClick && onCryptoClick(crypto)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;
