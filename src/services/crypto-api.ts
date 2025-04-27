import { toast } from "sonner";

export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  circulating_supply: number;
  total_supply: number;
}

export interface PortfolioItem {
  id: string;
  quantity: number;
  purchasePrice: number;
}

export type Currency = "usd" | "eur" | "kzt";

// Backend API URL (change to your backend URL)
const BACKEND_API_URL = "http://localhost:8000/api";

// Fallback to direct CoinGecko API if backend is not available
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

// Default currency
export const DEFAULT_CURRENCY: Currency = "usd";

// Get user's preferred currency from localStorage or use default
export const getPreferredCurrency = (): Currency => {
  const saved = localStorage.getItem("preferredCurrency");
  return (saved as Currency) || DEFAULT_CURRENCY;
};

// Save user's preferred currency
export const savePreferredCurrency = (currency: Currency): void => {
  localStorage.setItem("preferredCurrency", currency);
};

export const fetchCryptocurrencies = async (currency: Currency = getPreferredCurrency()): Promise<Cryptocurrency[]> => {
  try {
    // Try to fetch from our backend first
    try {
      const response = await fetch(
        `${BACKEND_API_URL}/cryptocurrencies?currency=${currency}`
      );

      if (response.ok) {
        return await response.json();
      }
      
      // If backend fails, log the error but don't throw yet - we'll try the fallback
      console.warn("Backend API failed, falling back to CoinGecko direct API");
    } catch (backendError) {
      console.warn("Error connecting to backend, falling back to direct API:", backendError);
    }

    // Fallback to direct CoinGecko API
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h,7d`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch cryptocurrency data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching cryptocurrency data:", error);
    toast.error("Failed to fetch cryptocurrency data. Please try again later.");
    return [];
  }
};

// Currency formatting based on selected currency
export const formatCurrency = (amount: number, currency: Currency = getPreferredCurrency()): string => {
  const currencyConfig: Record<Currency, { code: string, digits: number }> = {
    usd: { code: "USD", digits: 2 },
    eur: { code: "EUR", digits: 2 },
    kzt: { code: "KZT", digits: 0 }
  };
  
  const config = currencyConfig[currency];
  const minDigits = amount >= 1 ? config.digits : 6;
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: config.code,
    minimumFractionDigits: minDigits
  }).format(amount);
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat("en-US").format(number);
};

export const formatPercentage = (percentage: number): string => {
  return `${percentage >= 0 ? "+" : ""}${percentage.toFixed(2)}%`;
};

export const getPercentageClass = (percentage: number): string => {
  return percentage >= 0 ? "text-crypto-positive" : "text-crypto-negative";
};

// Load portfolio from local storage
export const loadPortfolio = (): PortfolioItem[] => {
  const portfolioData = localStorage.getItem("cryptoPortfolio");
  return portfolioData ? JSON.parse(portfolioData) : [];
};

// Save portfolio to local storage
export const savePortfolio = (portfolio: PortfolioItem[]): void => {
  localStorage.setItem("cryptoPortfolio", JSON.stringify(portfolio));
};
