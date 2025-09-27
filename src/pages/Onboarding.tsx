import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Wallet, 
  Download, 
  Shield, 
  Eye, 
  EyeOff, 
  Copy, 
  Check,
  ArrowLeft,
  ArrowRight,
  AlertTriangle
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { generateMnemonic } from "bip39";
import { useToast } from "@/hooks/use-toast";

const Onboarding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<'create' | 'import'>(
    searchParams.get('mode') === 'import' ? 'import' : 'create'
  );
  const [mnemonic, setMnemonic] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [mnemonicCopied, setMnemonicCopied] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    if (mode === 'create' && step === 2 && !mnemonic) {
      const newMnemonic = generateMnemonic(128); // 12 words
      setMnemonic(newMnemonic);
    }
  }, [mode, step, mnemonic]);

  const handleCopyMnemonic = async () => {
    try {
      await navigator.clipboard.writeText(mnemonic);
      setMnemonicCopied(true);
      toast({
        title: "Phrase secrète copiée",
        description: "Sauvegardez-la dans un endroit sûr",
      });
      setTimeout(() => setMnemonicCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erreur de copie",
        description: "Veuillez copier manuellement",
        variant: "destructive"
      });
    }
  };

  const validatePassword = () => {
    if (password.length < 8) {
      toast({
        title: "Mot de passe trop court",
        description: "Minimum 8 caractères requis",
        variant: "destructive"
      });
      return false;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Mots de passe différents",
        description: "Veuillez vérifier la confirmation",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleComplete = () => {
    if (!validatePassword()) return;
    
    // TODO: Save wallet securely
    toast({
      title: "Wallet créé avec succès!",
      description: "Vous allez être redirigé vers votre dashboard",
    });
    
    setTimeout(() => {
      navigate("/wallet");
    }, 1500);
  };

  const renderStep1 = () => (
    <Card className="gradient-card border-primary/20 p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <Wallet className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Bienvenue dans CryptoWallet</h2>
        <p className="text-muted-foreground">Choisissez comment configurer votre wallet</p>
      </div>

      <div className="space-y-4">
        <Button
          size="lg"
          className={`w-full justify-start p-6 h-auto ${
            mode === 'create' ? 'bg-gradient-primary text-white' : 'variant-outline'
          }`}
          onClick={() => setMode('create')}
        >
          <Wallet className="w-6 h-6 mr-4" />
          <div className="text-left">
            <div className="font-semibold">Créer un nouveau wallet</div>
            <div className="text-sm opacity-80">Générer une nouvelle phrase secrète</div>
          </div>
        </Button>

        <Button
          size="lg"
          variant="outline"
          className={`w-full justify-start p-6 h-auto ${
            mode === 'import' ? 'bg-gradient-primary text-white border-primary' : ''
          }`}
          onClick={() => setMode('import')}
        >
          <Download className="w-6 h-6 mr-4" />
          <div className="text-left">
            <div className="font-semibold">Importer un wallet</div>
            <div className="text-sm opacity-80">Utiliser une phrase secrète existante</div>
          </div>
        </Button>
      </div>

      <Button 
        size="lg" 
        className="w-full mt-8 bg-gradient-primary text-white"
        onClick={() => setStep(2)}
      >
        Continuer
        <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="gradient-card border-primary/20 p-8 max-w-2xl mx-auto">
      {mode === 'create' ? (
        <div>
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Votre phrase secrète</h2>
            <p className="text-muted-foreground">
              Cette phrase permet de récupérer votre wallet. Gardez-la précieusement !
            </p>
          </div>

          <Alert className="mb-6 border-crypto-warning/50 bg-crypto-warning/10">
            <AlertTriangle className="h-4 w-4 text-crypto-warning" />
            <AlertDescription className="text-crypto-warning">
              <strong>Important :</strong> CryptoWallet ne peut pas récupérer cette phrase. 
              Si vous la perdez, vous perdez l'accès à vos fonds définitivement.
            </AlertDescription>
          </Alert>

          <div className="relative mb-6">
            <div className={`grid grid-cols-3 gap-3 p-6 rounded-lg bg-card border-2 transition-all ${
              showMnemonic ? 'border-primary/50' : 'border-muted'
            }`}>
              {mnemonic.split(' ').map((word, index) => (
                <div key={index} className="flex items-center gap-2 p-3 rounded bg-muted/50">
                  <span className="text-xs text-muted-foreground w-4">{index + 1}</span>
                  <span className={`font-mono ${showMnemonic ? '' : 'blur-sm select-none'}`}>
                    {word}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMnemonic(!showMnemonic)}
              >
                {showMnemonic ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showMnemonic ? 'Masquer' : 'Révéler'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyMnemonic}
                disabled={!showMnemonic}
              >
                {mnemonicCopied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {mnemonicCopied ? 'Copié' : 'Copier'}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-center mb-8">
            <Download className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Importer votre wallet</h2>
            <p className="text-muted-foreground">
              Entrez votre phrase secrète de 12 ou 24 mots
            </p>
          </div>

          <div className="mb-6">
            <Label htmlFor="mnemonic">Phrase secrète</Label>
            <Textarea
              id="mnemonic"
              placeholder="word1 word2 word3 ..."
              value={mnemonic}
              onChange={(e) => setMnemonic(e.target.value)}
              rows={4}
              className="mt-2 font-mono"
            />
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => setStep(1)}
          className="flex-1"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Retour
        </Button>
        <Button
          onClick={() => setStep(3)}
          disabled={!mnemonic.trim()}
          className="flex-1 bg-gradient-primary text-white"
        >
          Continuer
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </Card>
  );

  const renderStep3 = () => (
    <Card className="gradient-card border-primary/20 p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Sécurisez votre wallet</h2>
        <p className="text-muted-foreground">
          Créez un mot de passe pour chiffrer vos données localement
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 caractères"
            className="mt-2"
          />
        </div>
        
        <div>
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmer votre mot de passe"
            className="mt-2"
          />
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex items-start gap-3 mb-6">
        <input
          type="checkbox"
          id="terms"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          className="mt-1"
        />
        <Label htmlFor="terms" className="text-sm leading-6">
          Je comprends que CryptoWallet ne stocke pas mes clés privées et ne peut pas récupérer mon wallet si je perds ma phrase secrète ou mon mot de passe.
        </Label>
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => setStep(2)}
          className="flex-1"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Retour
        </Button>
        <Button
          onClick={handleComplete}
          disabled={!password || !confirmPassword || !acceptedTerms}
          className="flex-1 bg-gradient-primary text-white"
        >
          Créer le wallet
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto py-8">
        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {i}
                </div>
                {i < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    i < step ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default Onboarding;