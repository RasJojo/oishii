"use client";

import { useState } from "react";
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
import { Stethoscope, UtensilsCrossed, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export function StaffLogin({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1500);
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden border-none shadow-2xl bg-card/50 backdrop-blur-md">
                <CardHeader className="space-y-1 text-center pb-8 border-b border-muted/50">
                    <div className="flex justify-center gap-4 mb-4">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                            <Stethoscope size={24} />
                        </div>
                        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                            <UtensilsCrossed size={24} />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Espace Personnel</CardTitle>
                    <div className="flex justify-center pt-1">
                        <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase tracking-widest border border-yellow-500/20">
                            Interface Front-end Uniquement
                        </span>
                    </div>
                    <CardDescription className="pt-2">
                        Accès réservé aux équipes Médicales et Cuisine
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="staff-email">Email professionnel</Label>
                            <Input
                                id="staff-email"
                                type="email"
                                placeholder="nom@hopital.fr"
                                className="h-11 bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="staff-password">Mot de passe</Label>
                                <Link href="#" className="text-xs text-primary hover:underline">Oublié ?</Link>
                            </div>
                            <Input
                                id="staff-password"
                                type="password"
                                className="h-11 bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20"
                            disabled={isLoading}
                        >
                            {isLoading ? "Vérification..." : "Accéder au Dashboard"}
                        </Button>
                    </form>
                </CardContent>
                <div className="p-4 bg-muted/10 text-center">
                    <Link href="/auth/login" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1">
                        Vous êtes un patient ? <ArrowRight size={12} />
                    </Link>
                </div>
            </Card>

            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest opacity-50">
                <ShieldCheck size={12} />
                Connexion Sécurisée AES-256
            </div>
        </div>
    );
}
