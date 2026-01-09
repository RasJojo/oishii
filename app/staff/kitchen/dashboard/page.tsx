"use client";

import { useState } from "react";
import {
    UtensilsCrossed,
    ChefHat,
    Search,
    AlertCircle,
    CheckCircle2,
    Clock,
    Download,
    Filter,
    Flame,
    LayoutGrid,
    List,
    CookingPot
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { MOCK_PATIENTS, MOCK_DISHES, Patient, Dish } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function KitchenDashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    const totalMeals = MOCK_PATIENTS.length;
    const preparedMeals = MOCK_PATIENTS.filter(p => p.status === "ADMITTED").length;
    const progress = (preparedMeals / totalMeals) * 100;

    return (
        <div className="flex flex-col min-h-screen bg-muted/30">
            {/* Header */}
            <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-md px-6">
                <div className="flex h-16 items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600">
                            <ChefHat size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Espace Cuisine</h1>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Production Alimentaire</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold">Chef Bernard</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Cuisine Centrale</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 font-bold">
                            CB
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
                {/* Production Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 border-none shadow-xl shadow-orange-500/5 bg-card/50 backdrop-blur-md rounded-3xl overflow-hidden">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold">Progression de la Production</CardTitle>
                                <Badge className="bg-orange-500/10 text-orange-600 border-none px-3 h-6 text-[10px] font-black uppercase tracking-widest">Déjeuner</Badge>
                            </div>
                            <CardDescription>État actuel de la préparation des plateaux repas</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="flex items-center gap-2"><CookingPot size={16} className="text-orange-500" /> Plateaux préparés</span>
                                    <span>{preparedMeals} / {totalMeals}</span>
                                </div>
                                <Progress value={progress} className="h-3 bg-muted/50 transition-all [&>div]:bg-orange-500 shadow-inner" />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Entrées</p>
                                    <p className="text-2xl font-black">124</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Plats Chauds</p>
                                    <p className="text-2xl font-black text-orange-500">108</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Desserts</p>
                                    <p className="text-2xl font-black">112</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Spéciaux</p>
                                    <p className="text-2xl font-black text-blue-500">32</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-red-500/5 bg-red-500/5 backdrop-blur-md rounded-3xl border-l-4 border-l-red-500">
                        <CardHeader className="pb-0">
                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-red-600">
                                <AlertCircle size={20} />
                                Alertes Critiques
                            </CardTitle>
                            <CardDescription>Restrictions médicales de dernière minute</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            {MOCK_PATIENTS.filter(p => p.allergies.length > 0).slice(0, 2).map(p => (
                                <div key={p.id} className="p-3 rounded-2xl bg-white/50 dark:bg-black/20 border border-red-200/50 dark:border-red-900/20 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <p className="text-xs font-black">{p.lastName} (Ch. {p.room})</p>
                                        <Badge variant="destructive" className="h-4 text-[8px] font-black uppercase">Urgent</Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {p.allergies.map(a => (
                                            <span key={a} className="text-[9px] font-bold text-red-600 uppercase px-1.5 py-0.5 bg-red-100 rounded-md">{a}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-xs font-bold text-red-600 hover:bg-red-500/10 rounded-xl">
                                Voir toutes les alertes (12)
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabbed Content: Preparation or Inventory */}
                <Tabs defaultValue="production" className="w-full">
                    <div className="flex items-center justify-between mb-4">
                        <TabsList className="bg-muted/50 p-1 rounded-2xl border border-border/50">
                            <TabsTrigger value="production" className="rounded-xl px-6 text-xs font-bold data-[state=active]:bg-orange-500 data-[state=active]:text-white">Production</TabsTrigger>
                            <TabsTrigger value="recipes" className="rounded-xl px-6 text-xs font-bold data-[state=active]:bg-orange-500 data-[state=active]:text-white">Fiches Recettes</TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-2">
                            <div className="relative w-64 hidden md:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <Input
                                    placeholder="Chercher une recette..."
                                    className="pl-9 h-10 bg-muted/50 border-none rounded-xl text-xs"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="sm" className="rounded-xl h-10 gap-2 font-bold text-xs bg-background/50">
                                <Download size={16} /> Export
                            </Button>
                        </div>
                    </div>

                    <TabsContent value="production" className="mt-0">
                        <Card className="border-none shadow-xl shadow-orange-500/5 bg-card/50 backdrop-blur-md rounded-3xl overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/20">
                                    <TableRow className="border-none">
                                        <TableHead className="py-4 pl-6 font-black uppercase text-[10px] tracking-widest text-muted-foreground">Plat / Recette</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Catégorie</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground text-center">Quantité</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Allergènes Présents</TableHead>
                                        <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground text-right pr-6">Statut</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MOCK_DISHES.map((dish) => (
                                        <TableRow key={dish.id} className="group hover:bg-orange-500/[0.02] border-muted/30">
                                            <TableCell className="py-5 pl-6">
                                                <div>
                                                    <p className="font-bold text-sm tracking-tight">{dish.name}</p>
                                                    <p className="text-[10px] font-mono text-muted-foreground uppercase">{dish.id}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="h-5 text-[9px] font-bold uppercase tracking-widest bg-muted/50 border-none">
                                                    {dish.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="text-lg font-black italic">24</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {dish.allergens.length > 0 ? (
                                                        dish.allergens.map(a => (
                                                            <span key={a} className="px-1.5 py-0.5 rounded-md bg-muted text-[9px] font-bold text-muted-foreground uppercase">{a}</span>
                                                        ))
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-green-600 uppercase flex items-center gap-1">
                                                            <CheckCircle2 size={10} /> Sans Allergène
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button variant="ghost" size="sm" className="rounded-xl h-8 text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">
                                                    <List className="mr-2 h-3 w-3" /> Étiquettes
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </TabsContent>

                    <TabsContent value="recipes">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {MOCK_DISHES.map(dish => (
                                <Card key={dish.id} className="border-none shadow-lg bg-card/50 overflow-hidden group hover:scale-[1.02] transition-transform">
                                    <div className="h-32 bg-muted relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        <Badge className="absolute top-3 right-3 bg-white/80 backdrop-blur-md text-black hover:bg-white/90 border-none text-[9px] font-black">
                                            {dish.nutritionalInfo.calories} KCAL
                                        </Badge>
                                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-white/20 backdrop-blur-md text-white">
                                                <Flame size={14} />
                                            </div>
                                            <span className="text-white font-black text-xs uppercase tracking-tighter">Fiche {dish.id}</span>
                                        </div>
                                    </div>
                                    <CardContent className="p-4 space-y-3">
                                        <h3 className="font-bold text-sm tracking-tight">{dish.name}</h3>
                                        <div className="grid grid-cols-3 gap-2 py-2">
                                            <div className="text-center p-1.5 rounded-xl bg-blue-500/5">
                                                <p className="text-[8px] font-black uppercase text-blue-600/60 leading-none">Prot</p>
                                                <p className="text-xs font-black">{dish.nutritionalInfo.protein}g</p>
                                            </div>
                                            <div className="text-center p-1.5 rounded-xl bg-orange-500/5">
                                                <p className="text-[8px] font-black uppercase text-orange-600/60 leading-none">Gluc</p>
                                                <p className="text-xs font-black">{dish.nutritionalInfo.carbs}g</p>
                                            </div>
                                            <div className="text-center p-1.5 rounded-xl bg-amber-500/5">
                                                <p className="text-[8px] font-black uppercase text-amber-600/60 leading-none">Lip</p>
                                                <p className="text-xs font-black">{dish.nutritionalInfo.fat}g</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </main>

            <footer className="p-8 text-center text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em] opacity-30">
                OISHII SYSTEMS • KITCHEN OPS v2.0 • FORWARD THINKING
            </footer>
        </div>
    );
}
