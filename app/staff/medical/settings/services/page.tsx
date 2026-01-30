"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Building2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface HospitalService {
  id: number;
  name: string;
  created_at: string;
}

export default function ServicesSettingsPage() {
  const [services, setServices] = useState<HospitalService[]>([]);
  const [newServiceName, setNewServiceName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("hospital_services")
      .select("*")
      .order("name");

    if (data) {
      setServices(data);
    }
    setIsLoading(false);
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    setIsAdding(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("hospital_services")
      .insert({ name: newServiceName.trim() })
      .select()
      .single();

    if (data) {
      setServices([...services, data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewServiceName("");
    } else if (error) {
      console.error("Error adding service:", error);
      alert("Erreur lors de l'ajout du service.");
    }
    setIsAdding(false);
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) return;

    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase
      .from("hospital_services")
      .delete()
      .eq("id", id);

    if (!error) {
      setServices(services.filter((s) => s.id !== id));
    } else {
      console.error("Error deleting service:", error);
      alert("Erreur lors de la suppression du service.");
    }
    setDeletingId(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-primary/20 bg-primary/5 text-primary">
            <Building2 size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight">
              Services Hospitaliers
            </h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
              Configuration des services de l'établissement
            </p>
          </div>
        </div>
      </div>

      {/* Add Service Form */}
      <Card className="border border-border bg-card shadow-sm rounded-none">
        <CardContent className="p-6">
          <form onSubmit={handleAddService} className="flex gap-4">
            <Input
              placeholder="Nom du nouveau service..."
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              className="flex-1 h-11 text-sm font-bold bg-muted/20 border-border focus-visible:ring-1 focus-visible:ring-primary"
            />
            <Button
              type="submit"
              disabled={isAdding || !newServiceName.trim()}
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

      {/* Services List */}
      <Card className="border border-border bg-card shadow-sm rounded-none">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-muted-foreground" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground font-bold">
                Aucun service configuré
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {services.map((service) => (
                <li
                  key={service.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-muted/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 border border-border bg-muted/30 flex items-center justify-center font-black text-xs text-muted-foreground">
                      {service.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase tracking-tight">
                        {service.name}
                      </p>
                      <p className="text-[9px] text-muted-foreground/60 font-mono">
                        ID: {service.id}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteService(service.id)}
                    disabled={deletingId === service.id}
                    className="h-9 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    {deletingId === service.id ? (
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
          {services.length} service{services.length !== 1 ? "s" : ""} configuré
          {services.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
