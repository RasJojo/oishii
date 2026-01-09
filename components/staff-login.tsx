"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stethoscope, UtensilsCrossed, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { MOCK_STAFF_ACCOUNTS } from "@/lib/mock-data";

export function StaffLogin({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // Simulation de détection de rôle
        setTimeout(() => {
            setIsLoading(false);

            const account = MOCK_STAFF_ACCOUNTS.find(acc => acc.email.toLowerCase() === email.toLowerCase());

            if (account) {
                if (account.role === "MEDICAL") {
                    router.push("/staff/medical/dashboard");
                } else if (account.role === "KITCHEN") {
                    router.push("/staff/kitchen/dashboard");
                }
            } else {
                // Pour la démo, on accepte tout mais par défaut on va sur médical
                // sauf si l'email contient "cuisine"
                if (email.toLowerCase().includes("cuisine")) {
                    router.push("/staff/kitchen/dashboard");
                } else {
                    router.push("/staff/medical/dashboard");
                }
            }
        }, 1200);
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden border-none shadow-2xl bg-card/50 backdrop-blur-md">
                <CardHeader className="space-y-1 text-center pb-8 border-b border-muted/50">
                    <div className="flex justify-center gap-4 mb-4" aria-hidden="true">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                            <Stethoscope size={24} />
                        </div>
                        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                            <UtensilsCrossed size={24} />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Espace Personnel Staff</CardTitle>
                    <div className="flex justify-center pt-1">
                        <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase tracking-widest border border-yellow-500/20">
                            Démo : med@hopital.fr ou cuisine@hopital.fr
                        </span>
                    </div>
                    <CardDescription className="pt-2">
                        Accès réservé aux équipes Médicales et Cuisine
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div
                                role="alert"
                                className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2 font-medium"
                            >
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="staff-email">Email professionnel</Label>
                            <Input
                                id="staff-email"
                                type="email"
                                placeholder="ex: med@hopital.fr"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-11 bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20"
                                required
                                aria-required="true"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="staff-password">Mot de passe</Label>
                                <Link
                                    href="/staff/forgot-password"
                                    className="text-xs text-primary hover:underline"
                                    aria-label="Réinitialiser mon mot de passe"
                                >
                                    Oublié ?
                                </Link>
                            </div>
                            <Input
                                id="staff-password"
                                type="password"
                                className="h-11 bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20"
                                required
                                aria-required="true"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                            disabled={isLoading}
                        >
                            {isLoading ? "Vérification..." : "Accéder au Dashboard"}
                        </Button>
                    </form>
                </CardContent>
                <nav className="p-4 bg-muted/10 text-center" aria-label="Liens alternatifs">
                    <Link
                        href="/patient"
                        className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1 font-medium"
                    >
                        Vous êtes un patient ? <ArrowRight size={12} aria-hidden="true" />
                    </Link>
                </nav>
            </Card>

            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest opacity-50" aria-label="Sécurité">
                <ShieldCheck size={12} aria-hidden="true" />
                Connexion Sécurisée AES-256
            </div>
        </div>
    );
}
