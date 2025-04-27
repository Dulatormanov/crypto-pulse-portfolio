import React from "react";
import { Cryptocurrency, Currency, formatCurrency, formatNumber, formatPercentage, getPercentageClass } from "@/services/crypto-api";

interface CryptoListItemProps {
  crypto: Cryptocurrency;
  currency: Currency;
  onClick?: () => void;
}

const CryptoListItem: React.FC<CryptoListItemProps> = ({ crypto, currency, onClick }) => {
  return (
    <tr className="crypto-row border-b border-secondary/50" onClick={onClick}>
      <td className="py-4 pl-4">
        <div className="flex items-center gap-3">
          <img src={crypto.image} alt={crypto.name} className="w-8 h-8" />
          <div>
            <div className="font-medium">{crypto.name}</div>
            <div className="text-sm text-muted-foreground">{crypto.symbol.toUpperCase()}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-right">{formatCurrency(crypto.current_price, currency)}</td>
      <td className={`py-4 px-4 text-right ${getPercentageClass(crypto.price_change_percentage_24h)}`}>
        {formatPercentage(crypto.price_change_percentage_24h)}
      </td>
      <td className="py-4 pr-4 text-right hidden md:table-cell">
        {formatCurrency(crypto.market_cap, currency)}
      </td>
    </tr>
  );
};

export default CryptoListItem;
