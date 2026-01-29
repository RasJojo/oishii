"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Lock,
    Mail,
    ArrowRight,
    Loader2,
    ShieldCheck,
    AlertCircle,
    Stethoscope,
    ChefHat,
    Terminal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function StaffLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const supabase = createClient();
            
            // Tentative de connexion réelle à Supabase
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (authError) {
                throw authError; // Lève l'erreur pour la catcher en bas
            }

            // Si connexion réussie, redirection basée sur l'email
            // (En attendant d'avoir les rôles dans la BDD)
            if (email.toLowerCase().includes("cuisine")) {
                router.push("/staff/kitchen/dashboard");
            } else {
                router.push("/staff/medical/dashboard");
            }

        } catch (err: any) {
            console.error("Login Check Failed:", err);
            // Message d'erreur convivial
            if (err.message === "Invalid login credentials") {
                setError("Email ou mot de passe incorrect.");
            } else {
                setError(err.message || "Erreur de connexion au serveur.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans">
            <div className="w-full max-w-[450px] space-y-8">
                {/* Logo / Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary bg-primary/5 text-primary mb-4">
                        <Terminal size={20} />
                        <span className="font-black tracking-[0.3em] text-sm">OISHII SYSTEMS</span>
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">Accès Personnel</h1>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Identification requise • Gateway v3.1</p>
                </div>

                <Card className="border-4 border-border bg-card shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.02)] rounded-none">
                    <CardHeader className="p-8 border-b-2 border-border bg-muted/20">
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={20} className="text-primary" />
                            <CardTitle className="text-lg font-black uppercase tracking-tight">Authentification</CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Identifiant Email</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="NOM.P@HOPITAL.FR"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-12 h-14 bg-muted/10 border-2 border-border font-bold uppercase tracking-tight rounded-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="pass" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mot de Passe</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <Input
                                        id="pass"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-12 h-14 bg-muted/10 border-2 border-border font-bold rounded-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div
                                    className="p-4 border-2 border-destructive bg-destructive/10 text-destructive text-xs font-black uppercase flex items-center gap-3"
                                    role="alert"
                                >
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-14 bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-xs rounded-none shadow-lg hover:translate-y-[-2px] active:translate-y-[0px] transition-all focus-visible:ring-4 focus-visible:ring-primary/40"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        VÉRIFICATION...
                                    </>
                                ) : (
                                    <>
                                        CONNEXION SYSTÈME
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="p-8 pt-0 flex flex-col gap-4">
                        <div className="w-full border-t-2 border-border pt-6 flex flex-col gap-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Pré-remplissage Démo (Nécessite compte actif)</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <Button
                                    variant="outline"
                                    className="h-10 text-[9px] font-black uppercase border-2 border-border rounded-none hover:bg-muted"
                                    onClick={() => {
                                        setEmail("med@hopital.fr");
                                        setPassword("password123"); 
                                    }}
                                >
                                    <Stethoscope size={14} className="mr-2" /> MÉDICAL
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-10 text-[9px] font-black uppercase border-2 border-border rounded-none hover:bg-muted"
                                    onClick={() => {
                                        setEmail("cuisine@hopital.fr");
                                        setPassword("password123");
                                    }}
                                >
                                    <ChefHat size={14} className="mr-2" /> CUISINE
                                </Button>
                            </div>
                        </div>
                    </CardFooter>
                </Card>

                <p className="text-center text-[9px] font-black uppercase tracking-[0.4em] opacity-30">
                    OISHII SYSTEMS • CRYPTO-SECURED • v3.1
                </p>
            </div>
        </div>
    );
}
