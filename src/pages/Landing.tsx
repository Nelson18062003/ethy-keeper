import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, Shield, Zap, Globe, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const features = [
    {
      icon: Shield,
      title: "Sécurité maximale",
      description: "Chiffrement AES-256 local, vos clés ne quittent jamais votre appareil"
    },
    {
      icon: Zap,
      title: "Lightning fast",
      description: "Transactions rapides sur Ethereum et tous les L2 majeurs"
    },
    {
      icon: Globe,
      title: "Multi-chaînes", 
      description: "Ethereum, Arbitrum, Optimism, Base, Polygon et plus"
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10" />
      
      {/* Animated background shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-crypto-accent/20 rounded-full blur-xl animate-pulse delay-1000" />
      
      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="relative">
              <Wallet className="w-12 h-12 text-primary" />
              <Sparkles className="w-6 h-6 text-crypto-accent absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CryptoWallet
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Votre wallet Ethereum non-custodial. Simple, sécurisé, décentralisé.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-white border-0"
              onClick={() => navigate("/onboarding")}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Commencer
              <ArrowRight className={`ml-2 w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary/50 hover:bg-primary/10 transition-smooth"
              onClick={() => navigate("/onboarding?mode=import")}
            >
              Importer un wallet
            </Button>
          </div>
        </header>

        {/* Features */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="gradient-card border-primary/20 p-8 hover:shadow-crypto transition-all duration-300 hover:-translate-y-1"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-3 text-center">{feature.title}</h3>
              <p className="text-muted-foreground text-center">{feature.description}</p>
            </Card>
          ))}
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="gradient-card border-primary/20 p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Prenez le contrôle de vos crypto</h2>
            <p className="text-muted-foreground mb-6">
              Avec CryptoWallet, vous êtes la seule personne à avoir accès à vos fonds. 
              Pas de tiers de confiance, pas de risque de hack centralisé.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-white"
              onClick={() => navigate("/onboarding")}
            >
              Créer mon wallet maintenant
            </Button>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Landing;