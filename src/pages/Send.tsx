import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Send as SendIcon, AlertTriangle, QrCode, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Send = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("ETH");
  const [gasPrice, setGasPrice] = useState("medium");
  const [memo, setMemo] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  const tokens = [
    { symbol: "ETH", name: "Ethereum", balance: "1.2547", decimals: 18 },
    { symbol: "USDC", name: "USD Coin", balance: "150.00", decimals: 6 },
    { symbol: "UNI", name: "Uniswap", balance: "45.7", decimals: 18 },
  ];

  const gasPrices = {
    slow: { price: "20", time: "~5 min", cost: "$2.15" },
    medium: { price: "25", time: "~2 min", cost: "$2.69" },
    fast: { price: "35", time: "~30 sec", cost: "$3.76" }
  };

  const selectedTokenData = tokens.find(t => t.symbol === selectedToken);
  const gasData = gasPrices[gasPrice as keyof typeof gasPrices];

  const validateAddress = (address: string) => {
    return address.length === 42 && address.startsWith('0x');
  };

  const validateAmount = (amount: string) => {
    const numAmount = parseFloat(amount);
    return numAmount > 0 && selectedTokenData && numAmount <= parseFloat(selectedTokenData.balance);
  };

  const canProceed = () => {
    return validateAddress(recipientAddress) && validateAmount(amount);
  };

  const handlePreview = () => {
    if (!canProceed()) {
      toast({
        title: "Données invalides",
        description: "Vérifiez l'adresse et le montant",
        variant: "destructive"
      });
      return;
    }
    setIsPreview(true);
  };

  const handleSend = () => {
    // TODO: Implement actual transaction
    toast({
      title: "Transaction envoyée!",
      description: "Votre transaction est en cours de traitement",
    });
    navigate("/wallet");
  };

  if (isPreview) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPreview(false)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <h1 className="text-xl font-bold">Confirmer la transaction</h1>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <Card className="gradient-card border-primary/20 p-6 max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                <SendIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Confirmer l'envoi</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-lg bg-muted/50">
                <span className="text-muted-foreground">Montant</span>
                <span className="font-bold text-lg">{amount} {selectedToken}</span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-lg bg-muted/50">
                <span className="text-muted-foreground">Vers</span>
                <span className="font-mono text-sm">{recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}</span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-lg bg-muted/50">
                <span className="text-muted-foreground">Frais de réseau</span>
                <div className="text-right">
                  <div className="font-medium">{gasData.cost}</div>
                  <div className="text-xs text-muted-foreground">{gasData.time}</div>
                </div>
              </div>

              {memo && (
                <div className="flex justify-between items-start p-4 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground">Note</span>
                  <span className="text-sm text-right max-w-[200px]">{memo}</span>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold">Total à débiter</span>
              <span className="font-bold text-lg">
                {(parseFloat(amount) + (selectedToken === 'ETH' ? parseFloat(gasData.price) / 1000000000 : 0)).toFixed(6)} {selectedToken}
              </span>
            </div>

            <Alert className="mb-6 border-crypto-warning/50 bg-crypto-warning/10">
              <AlertTriangle className="h-4 w-4 text-crypto-warning" />
              <AlertDescription className="text-crypto-warning">
                Cette transaction est irréversible. Vérifiez bien l'adresse de destination.
              </AlertDescription>
            </Alert>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setIsPreview(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSend}
                className="flex-1 bg-gradient-primary text-white"
              >
                Confirmer l'envoi
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/wallet")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-xl font-bold">Envoyer</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Card className="gradient-card border-primary/20 p-6 max-w-md mx-auto">
          <div className="space-y-6">
            {/* Token Selection */}
            <div>
              <Label htmlFor="token">Token à envoyer</Label>
              <Select value={selectedToken} onValueChange={setSelectedToken}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      <div className="flex items-center justify-between w-full">
                        <span>{token.symbol} - {token.name}</span>
                        <span className="text-muted-foreground ml-4">
                          Solde: {token.balance}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Recipient Address */}
            <div>
              <Label htmlFor="recipient">Adresse de destination</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="recipient"
                  placeholder="0x..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className={`font-mono ${
                    recipientAddress && !validateAddress(recipientAddress) 
                      ? 'border-destructive' 
                      : ''
                  }`}
                />
                <Button variant="outline" size="sm">
                  <QrCode className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4" />
                </Button>
              </div>
              {recipientAddress && !validateAddress(recipientAddress) && (
                <p className="text-sm text-destructive mt-1">
                  Adresse Ethereum invalide
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="amount">Montant</Label>
                {selectedTokenData && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAmount(selectedTokenData.balance)}
                    className="text-xs"
                  >
                    Max: {selectedTokenData.balance}
                  </Button>
                )}
              </div>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`mt-2 ${
                  amount && !validateAmount(amount) 
                    ? 'border-destructive' 
                    : ''
                }`}
              />
              {amount && !validateAmount(amount) && (
                <p className="text-sm text-destructive mt-1">
                  {parseFloat(amount) <= 0 
                    ? 'Le montant doit être supérieur à 0'
                    : 'Solde insuffisant'
                  }
                </p>
              )}
            </div>

            {/* Gas Price */}
            <div>
              <Label>Vitesse de transaction</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {Object.entries(gasPrices).map(([key, data]) => (
                  <Button
                    key={key}
                    variant={gasPrice === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGasPrice(key)}
                    className="flex-col h-16 text-xs"
                  >
                    <span className="capitalize font-medium">{key}</span>
                    <span className="text-muted-foreground">{data.time}</span>
                    <span>{data.cost}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Memo */}
            <div>
              <Label htmlFor="memo">Note (optionnel)</Label>
              <Input
                id="memo"
                placeholder="Ajouter une note..."
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="mt-2"
              />
            </div>

            <Button
              onClick={handlePreview}
              disabled={!canProceed()}
              className="w-full bg-gradient-primary text-white"
              size="lg"
            >
              Prévisualiser la transaction
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Send;