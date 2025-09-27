import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Send, 
  QrCode, 
  Plus, 
  Eye, 
  EyeOff, 
  Copy, 
  ExternalLink,
  RefreshCw,
  Settings,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet as WalletIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Wallet = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [showBalance, setShowBalance] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data - à remplacer par de vraies données
  const walletAddress = "0x742d35Cc6635C0532925a3b8D7Bc9A5C17E65f2A";
  const ethBalance = "1.2547";
  const totalValue = "2,847.32";

  const tokens = [
    { symbol: "ETH", name: "Ethereum", balance: "1.2547", value: "$2,234.17", change: "+5.2%" },
    { symbol: "USDC", name: "USD Coin", balance: "150.00", value: "$150.00", change: "0%" },
    { symbol: "UNI", name: "Uniswap", balance: "45.7", value: "$463.15", change: "-2.1%" },
  ];

  const recentTransactions = [
    {
      type: "send",
      token: "ETH",
      amount: "0.15",
      to: "0x123...abc",
      hash: "0xabc123...",
      status: "confirmed",
      timestamp: "Il y a 2h"
    },
    {
      type: "receive", 
      token: "USDC",
      amount: "100.00",
      from: "0x456...def",
      hash: "0xdef456...",
      status: "confirmed",
      timestamp: "Il y a 1j"
    },
  ];

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      toast({
        title: "Adresse copiée",
        description: "L'adresse du wallet a été copiée dans le presse-papier",
      });
    } catch (err) {
      toast({
        title: "Erreur de copie",
        description: "Impossible de copier l'adresse",
        variant: "destructive"
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Soldes mis à jour",
        description: "Les données ont été synchronisées",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <WalletIcon className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Mon Wallet</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyAddress}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/settings")}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Balance Card */}
        <Card className="gradient-card border-primary/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Solde total</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="h-8 w-8 p-0"
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {showBalance ? `$${totalValue}` : "••••••"}
            </div>
            <div className="text-muted-foreground">
              {showBalance ? `${ethBalance} ETH` : "•••••• ETH"}
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <Button
              variant="outline"
              className="flex-col h-20 gap-2"
              onClick={() => navigate("/receive")}
            >
              <QrCode className="w-6 h-6" />
              <span>Recevoir</span>
            </Button>
            <Button
              variant="outline"
              className="flex-col h-20 gap-2"
              onClick={() => navigate("/send")}
            >
              <Send className="w-6 h-6" />
              <span>Envoyer</span>
            </Button>
            <Button
              variant="outline"
              className="flex-col h-20 gap-2"
            >
              <Plus className="w-6 h-6" />
              <span>Ajouter</span>
            </Button>
          </div>
        </Card>

        {/* Tokens */}
        <Card className="gradient-card border-primary/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Mes tokens</h2>
            <Button variant="ghost" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>

          <div className="space-y-3">
            {tokens.map((token, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                    {token.symbol.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-sm text-muted-foreground">{token.name}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium">
                    {showBalance ? token.balance : "••••••"} {token.symbol}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    {showBalance ? token.value : "••••••"}
                    <Badge 
                      variant={token.change.startsWith('+') ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {token.change}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className="gradient-card border-primary/20 p-6">
          <h2 className="text-lg font-semibold mb-4">Transactions récentes</h2>
          
          <div className="space-y-3">
            {recentTransactions.map((tx, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'send' ? 'bg-destructive/20 text-destructive' : 'bg-crypto-success/20 text-crypto-success'
                  }`}>
                    {tx.type === 'send' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-medium">
                      {tx.type === 'send' ? 'Envoyé' : 'Reçu'} {tx.amount} {tx.token}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tx.type === 'send' ? `Vers ${tx.to}` : `De ${tx.from}`}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">{tx.timestamp}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Wallet;