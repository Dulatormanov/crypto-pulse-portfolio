import React, { useState } from "react";
import { askAiAssistant, Cryptocurrency } from "@/services/crypto-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "lucide-react";

interface CryptoAiAssistantProps {
  selectedCrypto?: Cryptocurrency;
}

const CryptoAiAssistant: React.FC<CryptoAiAssistantProps> = ({ selectedCrypto }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError("");
    setAnswer("");

    try {
      const response = await askAiAssistant(
        question, 
        selectedCrypto ? selectedCrypto.id : undefined
      );

      if (response.error) {
        setError(response.error);
      } else if (response.response) {
        setAnswer(response.response);
      } else {
        setError("Received an empty response from AI");
      }
    } catch (err) {
      setError("Failed to get response from AI");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Crypto AI Assistant</CardTitle>
        <CardDescription>
          Ask me anything about cryptocurrencies
          {selectedCrypto && ` - currently focused on ${selectedCrypto.name}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="E.g., Why did Bitcoin price increase last week?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isLoading}
              className="flex-grow"
            />
            <Button type="submit" disabled={isLoading || !question.trim()}>
              {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : "Ask"}
            </Button>
          </div>
        </form>

        {isLoading && (
          <div className="flex justify-center mt-6">
            <Loader className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}

        {answer && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <div className="whitespace-pre-line">{answer}</div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Powered by OpenAI
      </CardFooter>
    </Card>
  );
};

export default CryptoAiAssistant; 