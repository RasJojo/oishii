"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ScanLine,
  ArrowRight,
  User,
  Terminal,
  ShieldCheck,
  Loader2,
  Hospital,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import { createClient } from "@/lib/supabase/client";
import { AlertCircle } from "lucide-react";

export default function PatientLoginPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!id.trim()) {
      setError("Veuillez entrer votre identifiant.");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // 1. Recherche par UUID exact
      let { data: patient, error: fetchError } = await supabase
        .from("patients")
        .select("id, last_name, first_name")
        .eq("id", id.trim())
        .single();

      // 2. Si pas trouvé par ID, recherche par Nom de Famille (insensible à la casse)
      if (!patient) {
        const { data: patientsByName } = await supabase
          .from("patients")
          .select("id, last_name, first_name")
          .ilike("last_name", id.trim())
          .limit(1); // On prend le premier pour l'instant (demo)

        if (patientsByName && patientsByName.length > 0) {
          patient = patientsByName[0];
        }
      }

      if (patient) {
        localStorage.setItem("currentPatientId", patient.id);
        // Petit délai UX pour montrer que ça valide
        setTimeout(() => {
          router.push("/patient/dashboard");
        }, 500);
      } else {
        setError("Dossier patient introuvable. Vérifiez votre saisie.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login Error", err);
      setError("Erreur de connexion au serveur.");
      setIsLoading(false);
    }
  };

  const handleScanQR = () => {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans">
      <main className="w-full max-w-[500px] space-y-10">
        {/* Header for Visually Impaired - Clear & Big */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-6 py-2 border-4 border-primary bg-primary text-primary-foreground mb-4">
            <Hospital size={24} />
            <span className="font-black tracking-[0.3em] text-sm uppercase">
              Portail Patient
            </span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tight leading-none text-foreground">
            Bienvenue chez <br />
            <span className="text-primary italic">OISHII</span>
          </h1>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">
            Votre alimentation personnalisée et sécurisée
          </p>
        </div>

        <Card className="border-[6px] border-border bg-card shadow-2xl rounded-none py-0">
          <CardHeader className="p-8 border-b-4 border-border bg-muted/20">
            <h2 className="flex items-center gap-4">
              <ScanLine size={32} className="text-primary animate-pulse" />
              <div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight">
                  Identification
                </CardTitle>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-1">
                  Approchez votre bracelet du lecteur
                </p>
              </div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-1">
                Scannez le QR Code sur le lit ou le bracelet
              </p>
            </h2>
          </CardHeader>

          <CardContent className="p-10">
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-4">
                <Label
                  htmlFor="patient-id"
                  className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                >
                  Nom de Famille ou Identifiant
                </Label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={24}
                  />
                  <Input
                    id="patient-id"
                    placeholder="EX: LEGRAND"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="pl-14 h-20 bg-muted/10 border-4 border-border text-2xl font-black uppercase placeholder:opacity-20 rounded-none focus-visible:ring-8 focus-visible:ring-primary/10"
                    aria-label="Entrez votre nom ou identifiant"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 border-2 border-destructive text-destructive flex items-center gap-3 font-bold uppercase text-xs animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-20 bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-md rounded-none shadow-xl hover:bg-primary/95 active:translate-y-1 transition-all focus-visible:ring-8 focus-visible:ring-primary/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-10 w-10 animate-spin" />
                ) : (
                  <>
                    Accéder à mon Menu
                    <ArrowRight className="ml-4 h-8 w-8" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="p-8 bg-muted/10 border-t-4 border-border flex justify-center">
            <div className="flex items-center gap-2 opacity-40 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck size={16} />
              Connexion Sécurisée • Oishii v3.1
            </div>
          </CardFooter>
        </Card>

        {/* Extra big button for users who can't see the card well */}
        <div className="text-center pt-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">
            Difficulté à voir ?
          </p>
          <Button
            variant="outline"
            className="h-12 border-2 border-border font-black uppercase text-[10px] rounded-none px-8"
          >
            Activer la synthèse vocale
          </Button>
        </div>
      </main>
    </div>
  );
}
