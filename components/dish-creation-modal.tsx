"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, X, AlertTriangle, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dish, Ingredient, ALLERGENS_LIST, detectAllergensFromIngredients } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// Interface for DB Ingredient
interface DBIngredient {
    id: string;
    name: string;
    description?: string;
    allergen_id?: string | null;
    default_unit: string;
}

// Interface for Allergen
interface AllergenRef {
    id: string;
    name: string;
}

interface DishCreationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (dish: Partial<Dish>) => void;
}

export function DishCreationModal({ open, onOpenChange, onSubmit }: DishCreationModalProps) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState<"ENTREE" | "PLAT" | "DESSERT">("PLAT");
    const [description, setDescription] = useState("");
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [calories, setCalories] = useState(0);
    const [protein, setProtein] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [fat, setFat] = useState(0);
    
    // DB State
    const [ingredientsCatalog, setIngredientsCatalog] = useState<DBIngredient[]>([]);
    const [allergensList, setAllergensList] = useState<AllergenRef[]>([]);

    // Fetch Reference Data (Ingredients & Allergens)
    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();
            
            // 1. Fetch Allergens (ID + Name)
            const { data: allergensData } = await supabase.from('allergens').select('id, name');
            if (allergensData) {
                setAllergensList(allergensData);
            }

            // 2. Fetch Ingredients
            const { data: ingredientsData } = await supabase.from('ingredients').select('*');
            if (ingredientsData) {
                setIngredientsCatalog(ingredientsData);
            }
        };
        if (open) {
            fetchData();
        }
    }, [open]);

    // État pour le nouvel ingrédient en cours d'ajout
    const [newIngredient, setNewIngredient] = useState<Partial<Ingredient>>({
        name: "",
        quantity: 0,
        unit: "g",
        allergen: undefined
    });

    // Suggestions d'ingrédients
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    const suggestions = useMemo(() => {
        if (!newIngredient.name || newIngredient.name.length < 2) return [];
        return ingredientsCatalog.filter(ing => 
            ing.name.toLowerCase().includes(newIngredient.name!.toLowerCase())
        ).slice(0, 5).map(ing => ({
            ...ing,
            allergen: allergensList.find(a => a.id === ing.allergen_id)?.name
        }));
    }, [newIngredient.name, ingredientsCatalog, allergensList]);

    const handleSelectSuggestion = (suggestion: DBIngredient & { allergen?: string }) => {
        setNewIngredient({
            ...newIngredient,
            name: suggestion.name,
            unit: suggestion.default_unit,
            allergen: suggestion.allergen
        });
        setShowSuggestions(false);
    };

    const handleAddIngredient = () => {
        if (newIngredient.name && newIngredient.quantity && newIngredient.unit) {
            setIngredients([...ingredients, {
                name: newIngredient.name!,
                quantity: newIngredient.quantity!,
                unit: newIngredient.unit!,
                allergen: newIngredient.allergen
            }]);
            setNewIngredient({ name: "", quantity: 0, unit: "g", allergen: undefined });
        }
    };

    const handleRemoveIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Détection automatique des allergènes depuis les ingrédients
        const detectedAllergens = detectAllergensFromIngredients(ingredients);

        const dish: Partial<Dish> = {
            name,
            category,
            description,
            ingredients,
            allergens: detectedAllergens,
            nutritionalInfo: {
                calories,
                protein,
                carbs,
                fat
            }
        };

        onSubmit(dish);
        
        // Reset form
        setName("");
        setCategory("PLAT");
        setDescription("");
        setIngredients([]);
        setCalories(0);
        setProtein(0);
        setCarbs(0);
        setFat(0);
        onOpenChange(false);
    };

    // Grouper les ingrédients par allergène pour l'affichage
    const ingredientsByAllergen = ingredients.reduce((acc, ingredient) => {
        const key = ingredient.allergen || "Sans allergène";
        if (!acc[key]) acc[key] = [];
        acc[key].push(ingredient);
        return acc;
    }, {} as Record<string, Ingredient[]>);

    const detectedAllergens = detectAllergensFromIngredients(ingredients);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl bg-card border-2 border-border p-8 rounded-none shadow-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-black uppercase tracking-tight">Création Recette</DialogTitle>
                    <DialogDescription className="text-xs font-bold uppercase text-muted-foreground tracking-widest">
                        Enregistrez un nouveau plat. Utilisez la base d'ingrédients pour la détection automatique.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informations de base */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dishName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                Nom du Plat
                            </Label>
                            <Input
                                id="dishName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="h-10 text-sm font-bold bg-muted/20 border-border focus-visible:ring-1 focus-visible:ring-orange-600 rounded-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Catégorie</Label>
                            <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                                <SelectTrigger className="h-10 font-bold text-sm bg-muted/20 border-border rounded-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border-border">
                                    <SelectItem value="ENTREE" className="font-bold text-xs">ENTRÉE</SelectItem>
                                    <SelectItem value="PLAT" className="font-bold text-xs">PLAT</SelectItem>
                                    <SelectItem value="DESSERT" className="font-bold text-xs">DESSERT</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[60px] text-sm font-bold bg-muted/20 border-border focus-visible:ring-1 focus-visible:ring-orange-600 rounded-none"
                            placeholder="Décrivez le plat..."
                        />
                    </div>

                    {/* Ajout d'ingrédients */}
                    <div className="space-y-3 border-2 border-border p-4 bg-muted/5 z-20 overflow-visible relative">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Ingrédients
                        </Label>
                        
                        {/* Formulaire d'ajout d'ingrédient */}
                        <div className="grid grid-cols-12 gap-2 relative items-end">
                            <div className="col-span-4 relative">
                                <Label htmlFor="ingredient-search" className="sr-only">Rechercher un ingrédient</Label>
                                <Input
                                    id="ingredient-search"
                                    placeholder="Rechercher un ingrédient..."
                                    value={newIngredient.name}
                                    onChange={(e) => {
                                        setNewIngredient({ ...newIngredient, name: e.target.value });
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    // onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    className="h-9 text-xs font-bold bg-background border-border rounded-none"
                                />
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute bottom-full left-0 w-full bg-card border border-border shadow-lg z-50 mb-1 max-h-40 overflow-y-auto">
                                        {suggestions.map((suggestion) => (
                                            <div
                                                key={suggestion.name}
                                                className="p-2 hover:bg-muted cursor-pointer text-xs font-bold flex justify-between items-center"
                                                onClick={() => handleSelectSuggestion(suggestion)}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSelectSuggestion(suggestion)}
                                            >
                                                <span>{suggestion.name}</span>
                                                {suggestion.allergen && (
                                                    <span className="text-[9px] bg-red-100 text-red-600 px-1 py-0.5 rounded">{suggestion.allergen}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor="ingredient-qty" className="sr-only">Quantité</Label>
                                <Input
                                    id="ingredient-qty"
                                    type="number"
                                    placeholder="Qté"
                                    value={newIngredient.quantity || ""}
                                    onChange={(e) => setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) || 0 })}
                                    className="h-9 text-xs font-bold bg-background border-border rounded-none"
                                />
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor="ingredient-unit" className="sr-only">Unité</Label>
                                <Select value={newIngredient.unit} onValueChange={(v) => setNewIngredient({ ...newIngredient, unit: v })}>
                                    <SelectTrigger id="ingredient-unit" className="h-9 text-xs font-bold bg-background border-border rounded-none" aria-label="Unité">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="g">g</SelectItem>
                                        <SelectItem value="ml">ml</SelectItem>
                                        <SelectItem value="pièce">pièce</SelectItem>
                                        <SelectItem value="c. à soupe">c. à soupe</SelectItem>
                                        <SelectItem value="tranche">tranche</SelectItem>
                                        <SelectItem value="sachet">sachet</SelectItem>
                                        <SelectItem value="gousse">gousse</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-3">
                                <Label htmlFor="ingredient-allergen" className="sr-only">Allergène (optionnel)</Label>
                                <Select 
                                    value={newIngredient.allergen || "none"} 
                                    onValueChange={(v) => {
                                        setNewIngredient({ ...newIngredient, allergen: v === "none" ? undefined : v })
                                    }}
                                >
                                    <SelectTrigger id="ingredient-allergen" className={cn("h-9 text-xs font-bold border-border rounded-none", newIngredient.allergen ? "bg-red-50 border-red-200 text-red-700" : "bg-background")} aria-label="Allergène">
                                        <SelectValue placeholder="Allergène" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60">
                                        <SelectItem value="none" className="text-xs opacity-50">Aucun</SelectItem>
                                        {allergensList.map(allergen => (
                                            <SelectItem key={allergen.id} value={allergen.name} className="text-xs">{allergen.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-1">
                                <Button
                                    type="button"
                                    onClick={handleAddIngredient}
                                    className="h-9 w-full bg-orange-600 hover:bg-orange-700 rounded-none"
                                    size="icon"
                                    aria-label="Ajouter l'ingrédient"
                                >
                                    <Plus size={16} />
                                </Button>
                            </div>
                        </div>

                        {/* Liste des ingrédients groupés par allergène */}
                        {Object.keys(ingredientsByAllergen).length > 0 && (
                            <div className="space-y-3 mt-4">
                                {Object.entries(ingredientsByAllergen).map(([allergen, items]) => (
                                    <div key={allergen} className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            {allergen !== "Sans allergène" && <AlertTriangle size={14} className="text-orange-600" />}
                                            <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                                {allergen}
                                            </h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {items.map((ingredient, idx) => {
                                                const globalIndex = ingredients.indexOf(ingredient);
                                                return (
                                                    <div
                                                        key={globalIndex}
                                                        className="flex items-center justify-between p-2 bg-background border border-border text-xs font-bold group hover:border-orange-600"
                                                    >
                                                        <span className="truncate">
                                                            {ingredient.name} - {ingredient.quantity}{ingredient.unit}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveIngredient(globalIndex)}
                                                            className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Allergènes détectés */}
                        {detectedAllergens.length > 0 && (
                            <div className="mt-4 p-3 bg-orange-600/10 border border-orange-600/30">
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                                    Allergènes détectés automatiquement :
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {detectedAllergens.map(allergen => (
                                        <Badge key={allergen} variant="destructive" className="rounded-none text-xs">
                                            {allergen}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Informations nutritionnelles */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Informations Nutritionnelles
                        </Label>
                        <div className="grid grid-cols-4 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="calories" className="text-[9px] font-bold uppercase text-muted-foreground">Calories</Label>
                                <Input
                                    id="calories"
                                    type="number"
                                    value={calories}
                                    onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
                                    className="h-9 font-bold bg-muted/20 border-border rounded-none text-xs"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="protein" className="text-[9px] font-bold uppercase text-muted-foreground">Protéines (g)</Label>
                                <Input
                                    id="protein"
                                    type="number"
                                    value={protein}
                                    onChange={(e) => setProtein(parseInt(e.target.value) || 0)}
                                    className="h-9 font-bold bg-muted/20 border-border rounded-none text-xs"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="carbs" className="text-[9px] font-bold uppercase text-muted-foreground">Glucides (g)</Label>
                                <Input
                                    id="carbs"
                                    type="number"
                                    value={carbs}
                                    onChange={(e) => setCarbs(parseInt(e.target.value) || 0)}
                                    className="h-9 font-bold bg-muted/20 border-border rounded-none text-xs"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="fat" className="text-[9px] font-bold uppercase text-muted-foreground">Lipides (g)</Label>
                                <Input
                                    id="fat"
                                    type="number"
                                    value={fat}
                                    onChange={(e) => setFat(parseInt(e.target.value) || 0)}
                                    className="h-9 font-bold bg-muted/20 border-border rounded-none text-xs"
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-orange-600 hover:bg-orange-700 font-black uppercase tracking-[0.2em] text-[10px] rounded-none shadow-xl"
                    >
                        Ajouter au Répertoire
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
