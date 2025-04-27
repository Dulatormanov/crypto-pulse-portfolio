import React, { useState } from "react";
import { askAiAssistant, Cryptocurrency } from "@/services/crypto-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, X, MessageSquare, Minimize, Maximize } from "lucide-react";

interface FloatingAiAssistantProps {
  selectedCrypto?: Cryptocurrency;
}

const FloatingAiAssistant: React.FC<FloatingAiAssistantProps> = ({ selectedCrypto }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

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

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    if (!isVisible) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isVisible ? (
        <Button
          onClick={toggleVisibility}
          className="rounded-full w-12 h-12 flex items-center justify-center bg-primary hover:bg-primary/90 shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      ) : (
        <div className={`transition-all duration-200 ${isMinimized ? 'w-auto' : 'w-80'}`}>
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center">
                <CardTitle className="text-sm font-medium">
                  {isMinimized ? "AI Assistant" : "Crypto AI Assistant"}
                </CardTitle>
                {selectedCrypto && !isMinimized && (
                  <CardDescription className="ml-2 text-xs">
                    {selectedCrypto.name}
                  </CardDescription>
                )}
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={toggleMinimize}
                >
                  {isMinimized ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={toggleVisibility}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            {!isMinimized && (
              <>
                <CardContent className="p-3 pt-0">
                  <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Ask about crypto..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        disabled={isLoading}
                        className="flex-grow text-sm h-8"
                      />
                      <Button 
                        type="submit" 
                        disabled={isLoading || !question.trim()} 
                        size="sm"
                        className="h-8"
                      >
                        {isLoading ? <Loader className="h-3 w-3 animate-spin" /> : "Ask"}
                      </Button>
                    </div>
                  </form>

                  {isLoading && (
                    <div className="flex justify-center mt-3">
                      <Loader className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  )}

                  {error && (
                    <div className="mt-2 p-2 bg-destructive/10 text-destructive rounded-md text-xs">
                      {error}
                    </div>
                  )}

                  {answer && (
                    <div className="mt-2 p-2 bg-muted rounded-md max-h-60 overflow-y-auto">
                      <div className="whitespace-pre-line text-xs">{answer}</div>
                    </div>
                  )}
                </CardContent>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default FloatingAiAssistant; 