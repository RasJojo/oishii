"use client";

import { useState, useEffect } from "react";
import {
    Utensils,
    ArrowLeft,
    CheckCircle2,
    AlertTriangle,
    Info,
    ChevronRight,
    Search,
    User,
    LogOut,
    Coffee,
    Sun,
    Moon,
    Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_PATIENTS, MOCK_DISHES, Dish, Patient } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function PatientDashboard() {
    // Demo: Jean Dupont (MOCK_PATIENTS[0])
    const patient = MOCK_PATIENTS[0];
    const [selectedMeal, setSelectedMeal] = useState("Déjeuner");
    const [selections, setSelections] = useState<Record<string, Dish | null>>({
        "ENTREE": null,
        "PLAT": null,
        "DESSERT": null
    });

    const categories = ["ENTREE", "PLAT", "DESSERT"];

    // Filter dishes based on availability in the current menu and patient's allergies
    // For demo, we assume the menu is the same as the full list but filtered by category
    const getFilteredDishes = (category: string) => {
        return MOCK_DISHES.filter(dish => {
            if (dish.category !== category) return false;

            // Filter out dishes with patient's allergens
            const hasAllergen = dish.allergens.some(a => patient.allergies.includes(a));
            return !hasAllergen;
        });
    };

    const handleSelect = (category: string, dish: Dish) => {
        setSelections({ ...selections, [category]: dish });
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            {/* Header - High Contrast */}
            <header className="sticky top-0 z-30 w-full border-b-4 border-primary bg-card px-6 py-4 shadow-md">
                <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 border-4 border-primary bg-primary text-primary-foreground flex items-center justify-center font-black text-2xl">
                            {patient.firstName[0]}
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tight">Bonjour, {patient.firstName}</h1>
                            <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest leading-none mt-1">
                                Chambre {patient.room} • {patient.service}
                            </p>
                        </div>
                    </div>
                    <Link href="/patient">
                        <Button variant="outline" size="icon" className="h-12 w-12 border-2 border-border font-black rounded-none shadow-sm focus-visible:ring-4 focus-visible:ring-primary">
                            <LogOut size={24} />
                            <span className="sr-only">Se déconnecter</span>
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="p-6 max-w-4xl mx-auto w-full space-y-10 pb-32">
                {/* Health Alerts Summary - Very visible */}
                {patient.allergies.length > 0 && (
                    <section className="border-4 border-destructive bg-destructive/5 p-6 space-y-3" aria-labelledby="alerts-title">
                        <h2 id="alerts-title" className="text-destructive font-black uppercase text-sm flex items-center gap-2 tracking-widest">
                            <AlertTriangle size={20} /> Attention : Vos Restrictions
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {patient.allergies.map(a => (
                                <Badge key={a} variant="destructive" className="rounded-none px-3 py-1 font-black text-xs uppercase border-none">
                                    Sans {a}
                                </Badge>
                            ))}
                            {patient.dietaryRestrictions.map(d => (
                                <Badge key={d} variant="outline" className="rounded-none px-3 py-1 font-black text-xs uppercase border-destructive text-destructive bg-white">
                                    Régime {d}
                                </Badge>
                            ))}
                        </div>
                    </section>
                )}

                {/* Meal Selection Tabs - Large touch/click areas */}
                <div className="space-y-4">
                    <h2 className="text-lg font-black uppercase tracking-widest border-b-2 border-border pb-2">Choisissez votre Menu</h2>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { name: "Petit Déjeuner", icon: Coffee },
                            { name: "Déjeuner", icon: Sun },
                            { name: "Dîner", icon: Moon }
                        ].map(m => (
                            <Button
                                key={m.name}
                                onClick={() => setSelectedMeal(m.name)}
                                variant={selectedMeal === m.name ? "default" : "outline"}
                                className={cn(
                                    "h-20 flex flex-col gap-2 rounded-none border-2 font-black uppercase text-[10px] tracking-widest",
                                    selectedMeal === m.name ? "border-primary shadow-lg" : "border-border"
                                )}
                            >
                                <m.icon size={24} />
                                {m.name}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Categories Flow */}
                <div className="space-y-12">
                    {categories.map((cat) => {
                        const availableDishes = getFilteredDishes(cat);
                        return (
                            <section key={cat} className="space-y-6" aria-labelledby={`title-${cat}`}>
                                <h3 id={`title-${cat}`} className="text-xl font-black uppercase border-l-8 border-primary pl-4 tracking-tighter">
                                    Votre {cat.toLowerCase()}
                                </h3>

                                <div className="grid grid-cols-1 gap-4">
                                    {availableDishes.length > 0 ? (
                                        availableDishes.map((dish) => {
                                            const isSelected = selections[cat]?.id === dish.id;
                                            return (
                                                <button
                                                    key={dish.id}
                                                    onClick={() => handleSelect(cat, dish)}
                                                    className={cn(
                                                        "group text-left p-6 border-2 transition-all flex items-center justify-between focus-visible:ring-4 focus-visible:ring-primary focus-visible:outline-none",
                                                        isSelected
                                                            ? "border-primary bg-primary/5 shadow-md"
                                                            : "border-border hover:border-primary/50"
                                                    )}
                                                >
                                                    <div className="space-y-1 flex-1">
                                                        <p className="text-xl font-black uppercase group-hover:text-primary transition-colors">{dish.name}</p>
                                                        <div className="flex gap-4">
                                                            <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground uppercase">
                                                                <Clock size={14} /> 12:30
                                                            </div>
                                                            <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground uppercase">
                                                                <Info size={14} /> {dish.nutritionalInfo.calories} KCAL
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={cn(
                                                        "h-10 w-10 border-2 flex items-center justify-center transition-colors",
                                                        isSelected ? "border-primary bg-primary text-white" : "border-border bg-white"
                                                    )}>
                                                        {isSelected && <CheckCircle2 size={24} />}
                                                    </div>
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <div className="p-8 border-2 border-dashed border-border bg-muted/20 text-center space-y-2">
                                            <p className="font-black uppercase text-sm opacity-40">Aucune option compatible disponible</p>
                                            <p className="text-xs font-bold text-muted-foreground italic">Contactez le service diététique</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </main>

            {/* Bottom Bar - Always stays on top */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-card border-t-4 border-border shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] flex justify-center">
                <div className="max-w-4xl w-full">
                    <Button
                        className="w-full h-16 font-black uppercase tracking-[0.2em] text-sm shadow-xl flex gap-3 focus-visible:ring-4 focus-visible:ring-primary rounded-none"
                        disabled={!selections["PLAT"]}
                    >
                        Valider mon Choix de Repas
                        <ChevronRight size={24} />
                    </Button>
                </div>
            </div>

            {/* Accessibility Footer Extra */}
            <footer className="p-10 text-center opacity-20 text-[10px] uppercase font-black tracking-widest bg-muted/20">
                Interface Adaptée • Contraste Élevé • Accessible Screen Reader
            </footer>
        </div>
    );
}
