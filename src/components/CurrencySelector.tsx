import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Currency, getPreferredCurrency, savePreferredCurrency } from "@/services/crypto-api";

interface CurrencySelectorProps {
  onCurrencyChange: (currency: Currency) => void;
}

const currencies: { value: Currency; label: string }[] = [
  { value: "usd", label: "USD ($)" },
  { value: "eur", label: "EUR (€)" },
  { value: "kzt", label: "KZT (₸)" },
];

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ onCurrencyChange }) => {
  const handleCurrencyChange = (value: string) => {
    const currency = value as Currency;
    savePreferredCurrency(currency);
    onCurrencyChange(currency);
  };

  return (
    <div className="flex items-center">
      <span className="mr-2 text-sm font-medium">Currency:</span>
      <Select 
        defaultValue={getPreferredCurrency()} 
        onValueChange={handleCurrencyChange}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((currency) => (
            <SelectItem key={currency.value} value={currency.value}>
              {currency.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelector; 