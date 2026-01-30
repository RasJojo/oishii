"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface Allergen {
  id: number;
  name: string;
  created_at: string;
}

export default function AllergensSettingsPage() {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [newAllergenName, setNewAllergenName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchAllergens();
  }, []);

  const fetchAllergens = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("allergens")
      .select("*")
      .order("name");

    if (data) {
      setAllergens(data);
    }
    setIsLoading(false);
  };

  const handleAddAllergen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllergenName.trim()) return;

    setIsAdding(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("allergens")
      .insert({ name: newAllergenName.trim() })
      .select()
      .single();

    if (data) {
      setAllergens([...allergens, data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewAllergenName("");
    } else if (error) {
      console.error("Error adding allergen:", error);
      alert("Erreur lors de l'ajout de l'allergène.");
    }
    setIsAdding(false);
  };

  const handleDeleteAllergen = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet allergène ?")) return;

    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase
      .from("allergens")
      .delete()
      .eq("id", id);

    if (!error) {
      setAllergens(allergens.filter((a) => a.id !== id));
    } else {
      console.error("Error deleting allergen:", error);
      alert("Erreur lors de la suppression. Cet allergène est peut-être utilisé par des patients ou des plats.");
    }
    setDeletingId(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-destructive/20 bg-destructive/5 text-destructive">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight">
              Allergènes
            </h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
              Gestion de la liste des allergènes reconnus
            </p>
          </div>
        </div>
      </div>

      {/* Add Allergen Form */}
      <Card className="border border-border bg-card shadow-sm rounded-none">
        <CardContent className="p-6">
          <form onSubmit={handleAddAllergen} className="flex gap-4">
            <Input
              placeholder="Nom du nouvel allergène..."
              value={newAllergenName}
              onChange={(e) => setNewAllergenName(e.target.value)}
              className="flex-1 h-11 text-sm font-bold bg-muted/20 border-border focus-visible:ring-1 focus-visible:ring-primary"
            />
            <Button
              type="submit"
              disabled={isAdding || !newAllergenName.trim()}
              className="h-11 px-6 font-black uppercase text-[10px] tracking-widest gap-2"
            >
              {isAdding ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              Ajouter
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Allergens List */}
      <Card className="border border-border bg-card shadow-sm rounded-none">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-muted-foreground" />
            </div>
          ) : allergens.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground font-bold">
                Aucun allergène configuré
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {allergens.map((allergen) => (
                <li
                  key={allergen.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-muted/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 border border-destructive/20 bg-destructive/5 flex items-center justify-center font-black text-xs text-destructive">
                      {allergen.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase tracking-tight">
                        {allergen.name}
                      </p>
                      <p className="text-[9px] text-muted-foreground/60 font-mono">
                        ID: {allergen.id}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAllergen(allergen.id)}
                    disabled={deletingId === allergen.id}
                    className="h-9 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    {deletingId === allergen.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="text-center">
        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">
          {allergens.length} allergène{allergens.length !== 1 ? "s" : ""} configuré
          {allergens.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
