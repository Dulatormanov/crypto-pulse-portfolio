import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cryptocurrency, Currency, formatCurrency } from "@/services/crypto-api";

interface AddToPortfolioDialogProps {
  crypto?: Cryptocurrency;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (id: string, quantity: number, purchasePrice: number) => void;
  currency: Currency;
}

const AddToPortfolioDialog: React.FC<AddToPortfolioDialogProps> = ({
  crypto,
  isOpen,
  onClose,
  onAdd,
  currency
}) => {
  const [quantity, setQuantity] = useState<string>("");
  const [purchasePrice, setPurchasePrice] = useState<string>("");

  // Reset form when dialog opens with a new crypto
  useEffect(() => {
    if (isOpen && crypto) {
      setQuantity("");
      setPurchasePrice(crypto.current_price.toString());
    }
  }, [isOpen, crypto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crypto) return;
    
    const parsedQuantity = parseFloat(quantity);
    const parsedPrice = parseFloat(purchasePrice);
    
    if (isNaN(parsedQuantity) || parsedQuantity <= 0 || isNaN(parsedPrice) || parsedPrice < 0) {
      return;
    }
    
    onAdd(crypto.id, parsedQuantity, parsedPrice);
    onClose();
  };

  if (!crypto) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <img src={crypto.image} alt={crypto.name} className="w-6 h-6" />
            Add {crypto.name} to Portfolio
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0.00"
                className="col-span-3"
                required
                min="0"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Purchase Price
              </Label>
              <Input
                id="price"
                type="number"
                step="any"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder={crypto.current_price.toString()}
                className="col-span-3"
                required
                min="0"
              />
            </div>
            {quantity && purchasePrice && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Total Cost</Label>
                <div className="col-span-3">
                  {formatCurrency(parseFloat(quantity) * parseFloat(purchasePrice), currency)}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add to Portfolio</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddToPortfolioDialog;
