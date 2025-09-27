import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Copy, Share, Check, QrCode as QrCodeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Receive = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  // Mock wallet address
  const walletAddress = "0x742d35Cc6635C0532925a3b8D7Bc9A5C17E65f2A";

  // Generate QR code (simplified version - in real app, use a QR library)
  const generateQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple placeholder QR code pattern
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // QR pattern (simplified)
    ctx.fillStyle = '#000000';
    const cellSize = size / 25;
    
    // Create a simple pattern
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        if ((i + j) % 3 === 0 || (i * j) % 7 === 0) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
      }
    }
    
    // Corner squares
    const cornerSize = cellSize * 7;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, cornerSize, cornerSize);
    ctx.fillRect(size - cornerSize, 0, cornerSize, cornerSize);
    ctx.fillRect(0, size - cornerSize, cornerSize, cornerSize);
    
    ctx.fillStyle = '#ffffff';
    const innerSize = cellSize * 5;
    const offset = cellSize;
    ctx.fillRect(offset, offset, innerSize, innerSize);
    ctx.fillRect(size - cornerSize + offset, offset, innerSize, innerSize);
    ctx.fillRect(offset, size - cornerSize + offset, innerSize, innerSize);
    
    ctx.fillStyle = '#000000';
    const centerSize = cellSize * 3;
    const centerOffset = cellSize * 2;
    ctx.fillRect(centerOffset, centerOffset, centerSize, centerSize);
    ctx.fillRect(size - cornerSize + centerOffset, centerOffset, centerSize, centerSize);
    ctx.fillRect(centerOffset, size - cornerSize + centerOffset, centerSize, centerSize);
  };

  useState(() => {
    setTimeout(generateQRCode, 100);
  });

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      toast({
        title: "Adresse copiée",
        description: "L'adresse a été copiée dans le presse-papier",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erreur de copie",
        description: "Impossible de copier l'adresse",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Mon adresse crypto',
      text: `Envoyez-moi des cryptos à cette adresse: ${walletAddress}`,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(walletAddress);
        toast({
          title: "Adresse copiée",
          description: "L'adresse a été copiée pour partage",
        });
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const generatePaymentRequest = () => {
    let request = walletAddress;
    const params = new URLSearchParams();
    
    if (amount) params.append('amount', amount);
    if (memo) params.append('message', memo);
    
    if (params.toString()) {
      request += '?' + params.toString();
    }
    
    return request;
  };

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
            <h1 className="text-xl font-bold">Recevoir des crypto</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* QR Code Card */}
          <Card className="gradient-card border-primary/20 p-6 text-center">
            <div className="mb-4">
              <QrCodeIcon className="w-8 h-8 text-primary mx-auto mb-2" />
              <h2 className="text-xl font-bold">Votre adresse de réception</h2>
              <p className="text-muted-foreground text-sm">
                Scannez le QR code ou copiez l'adresse ci-dessous
              </p>
            </div>

            {/* QR Code */}
            <div className="bg-white p-4 rounded-lg mb-4 inline-block shadow-sm">
              <canvas
                ref={canvasRef}
                className="block"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>

            {/* Address */}
            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="font-mono text-sm break-all">{walletAddress}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCopyAddress}
                  className="flex-1"
                  variant="outline"
                >
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Copié' : 'Copier'}
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                >
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Payment Request */}
          <Card className="gradient-card border-primary/20 p-6">
            <h3 className="text-lg font-semibold mb-4">Demande de paiement (optionnel)</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Montant demandé</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="memo">Message (optionnel)</Label>
                <Input
                  id="memo"
                  placeholder="Pour quoi est ce paiement..."
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="mt-2"
                />
              </div>

              {(amount || memo) && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Lien de demande de paiement:</p>
                  <p className="font-mono text-xs break-all">{generatePaymentRequest()}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Important Notice */}
          <Card className="border-crypto-warning/50 bg-crypto-warning/10 p-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-crypto-warning font-medium">
                ⚠️ Important
              </p>
              <p className="text-xs text-crypto-warning">
                Envoyez uniquement des tokens compatibles Ethereum (ETH, ERC-20) à cette adresse. 
                Les autres cryptomonnaies seront définitivement perdues.
              </p>
            </div>
          </Card>

          {/* Network Info */}
          <div className="text-center text-muted-foreground text-sm">
            <p>Cette adresse fonctionne sur:</p>
            <p className="font-medium">Ethereum • Arbitrum • Optimism • Base • Polygon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receive;