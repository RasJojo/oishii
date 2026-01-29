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
  Hospital
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function PatientLoginPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulation d'identification par bracelet
    localStorage.setItem("currentPatientId", id);
    setTimeout(() => {
      router.push("/patient/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans">
      <div className="w-full max-w-[500px] space-y-10">
        {/* Header for Visually Impaired - Clear & Big */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-6 py-2 border-4 border-primary bg-primary text-primary-foreground mb-4">
            <Hospital size={24} />
            <span className="font-black tracking-[0.3em] text-sm uppercase">Portail Patient</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tight leading-none text-foreground">
            Bienvenue chez <br />
            <span className="text-primary italic">OISHII</span>
          </h1>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">
            Votre alimentation personnalisée et sécurisée
          </p>
        </div>

        <Card className="border-[6px] border-border bg-card shadow-2xl rounded-none">
          <CardHeader className="p-8 border-b-4 border-border bg-muted/20">
            <div className="flex items-center gap-4">
              <ScanLine size={32} className="text-primary animate-pulse" />
              <div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight">Identification</CardTitle>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-1">Approchez votre bracelet du lecteur</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-10">
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="patient-id" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Numéro ID ou Scan Manuel</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={24} />
                  <Input
                    id="patient-id"
                    placeholder="EX: PAT-452"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="pl-14 h-20 bg-muted/10 border-4 border-border text-2xl font-black uppercase placeholder:opacity-20 rounded-none focus-visible:ring-8 focus-visible:ring-primary/10"
                    aria-label="Entrez votre identifiant patient"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-20 bg-primary text-primary-foreground font-black uppercase tracking-[0.3em] text-lg rounded-none shadow-xl hover:bg-primary/95 active:translate-y-1 transition-all focus-visible:ring-8 focus-visible:ring-primary/20"
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
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">Difficulté à voir ?</p>
          <Button variant="outline" className="h-12 border-2 border-border font-black uppercase text-[10px] rounded-none px-8">
            Activer la synthèse vocale
          </Button>
        </div>
      </div>
    </div>
  );
}
