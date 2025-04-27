
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

const API_URL = "https://api.coingecko.com/api/v3";

export const fetchCryptocurrencies = async (): Promise<Cryptocurrency[]> => {
  try {
    const response = await fetch(
      `${API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h,7d`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch cryptocurrency data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching cryptocurrency data:", error);
    toast.error("Failed to fetch cryptocurrency data. Please try again later.");
    return [];
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: amount >= 1 ? 2 : 6
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
