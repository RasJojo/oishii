"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User, Mail, Shield, Stethoscope, Calendar, Clock, Edit2, Save, X } from "lucide-react";
import { updateProfileName } from "./actions";

const ProfilePage = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                setProfile({ ...profile, email: user.email });
                setEditedName(profile?.full_name || "");
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const handleSaveName = async () => {
        if (!profile?.id) return;

        setIsSaving(true);
        setError(null);

        const result = await updateProfileName(profile.id, editedName);

        if (result.success) {
            setProfile({ ...profile, full_name: editedName.trim() });
            setIsEditing(false);
            // Optionally show success message
            alert("Nom mis à jour avec succès !");
        } else {
            setError(result.error || "Une erreur s'est produite");
            alert(result.error || "Une erreur s'est produite");
        }

        setIsSaving(false);
    };

    const handleCancelEdit = () => {
        setEditedName(profile?.full_name || "");
        setIsEditing(false);
        setError(null);
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-background text-foreground font-sans items-center justify-center">
                <div className="animate-pulse space-y-4">
                    <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex flex-col min-h-screen bg-background text-foreground font-sans items-center justify-center">
                <Card className="border-2 border-destructive bg-destructive/5 p-8">
                    <p className="text-sm font-black uppercase text-destructive">Profil introuvable</p>
                </Card>
            </div>
        );
    }

    const initials = profile.full_name
        ? (profile.full_name.split(' ').length > 1
            ? `${profile.full_name.split(' ')[0][0]}${profile.full_name.split(' ')[1][0]}`
            : profile.full_name.substring(0, 2).toUpperCase())
        : "DM";

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            {/* Header */}
            <header className="sticky top-0 z-30 w-full border-b bg-card px-6 h-16 flex items-center shadow-sm">
                <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-3">
                        <div className="p-2 border border-primary/20 bg-primary/5 text-primary">
                            <User size={24} />
                        </div>
                        <div>
                            <h1 className="text-sm font-black tracking-tight uppercase">Mon Profil</h1>
                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">OISHII SYSTEMS</p>
                        </div>
                    </div>

                    <Button
                        onClick={() => router.push('/staff/medical/dashboard')}
                        variant="outline"
                        className="h-10 px-6 text-[10px] font-black uppercase tracking-[0.15em] border-border hover:bg-primary hover:text-white transition-all gap-2"
                    >
                        <ArrowLeft size={14} />
                        Retour au Dashboard
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-6">
                {/* Profile Header Card */}
                <Card className="border-2 border-border bg-card shadow-lg rounded-none overflow-hidden">
                    <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-background border-b-2 border-border"></div>
                    <CardContent className="p-8 -mt-16 relative">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                            <div className="h-32 w-32 border-4 border-card bg-primary/10 flex items-center justify-center font-black text-4xl text-primary shadow-xl">
                                {initials}
                            </div>
                            <div className="flex-1 space-y-2 pb-2">
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <Input
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            className="text-2xl font-black uppercase tracking-tight h-14 bg-muted/20 border-2 border-primary/30 focus-visible:ring-2 focus-visible:ring-primary"
                                            placeholder="Entrez votre nom"
                                            disabled={isSaving}
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleSaveName}
                                                disabled={isSaving}
                                                className="h-9 px-4 text-[10px] font-black uppercase tracking-[0.15em] gap-2"
                                            >
                                                <Save size={14} />
                                                {isSaving ? "Enregistrement..." : "Enregistrer"}
                                            </Button>
                                            <Button
                                                onClick={handleCancelEdit}
                                                disabled={isSaving}
                                                variant="outline"
                                                className="h-9 px-4 text-[10px] font-black uppercase tracking-[0.15em] gap-2"
                                            >
                                                <X size={14} />
                                                Annuler
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-3xl font-black uppercase tracking-tight">{profile.full_name || "Utilisateur"}</h2>
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
                                            aria-label="Modifier le nom"
                                        >
                                            <Edit2 size={16} />
                                        </Button>
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-2 items-center">
                                    <Badge variant="default" className="h-6 px-3 rounded-none font-black text-[10px] uppercase tracking-wider">
                                        {profile.role || "Staff"}
                                    </Badge>
                                    <Badge variant="outline" className="h-6 px-3 rounded-none font-bold text-[10px] uppercase border-primary/30 text-primary">
                                        Cardiologie
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <Card className="border border-border bg-card shadow-sm rounded-none">
                        <CardHeader className="border-b border-border bg-muted/10 pb-4">
                            <CardTitle className="text-sm font-black uppercase tracking-[0.15em] flex items-center gap-2">
                                <Mail size={16} className="text-primary" />
                                Informations de Contact
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email</p>
                                <p className="text-sm font-bold break-all">{profile.email || "Non renseigné"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nom Complet</p>
                                <p className="text-sm font-bold">{profile.full_name || "Non renseigné"}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Role & Permissions */}
                    <Card className="border border-border bg-card shadow-sm rounded-none">
                        <CardHeader className="border-b border-border bg-muted/10 pb-4">
                            <CardTitle className="text-sm font-black uppercase tracking-[0.15em] flex items-center gap-2">
                                <Shield size={16} className="text-primary" />
                                Rôle & Permissions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rôle</p>
                                <p className="text-sm font-bold uppercase">{profile.role || "Non défini"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Service</p>
                                <p className="text-sm font-bold">Cardiologie</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Niveau d'accès</p>
                                <Badge variant="default" className="h-7 px-3 rounded-none font-black text-[10px]">
                                    ACCÈS COMPLET
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Details */}
                    <Card className="border border-border bg-card shadow-sm rounded-none md:col-span-2">
                        <CardHeader className="border-b border-border bg-muted/10 pb-4">
                            <CardTitle className="text-sm font-black uppercase tracking-[0.15em] flex items-center gap-2">
                                <Stethoscope size={16} className="text-primary" />
                                Détails du Compte
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date de création</p>
                                    <p className="text-xs font-bold">
                                        {profile.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR') : "Non disponible"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Statut</p>
                                    <Badge variant="default" className="h-6 px-2 rounded-none font-black text-[9px] bg-green-600">
                                        ACTIF
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-8 border-t border-border flex flex-col items-center gap-2 bg-card">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">OISHII SYSTEMS • MEDICAL OPS v3.1</p>
                <div className="flex gap-4 opacity-20 text-[8px] font-bold uppercase tracking-widest">
                    <span>RGAA COMPLIANT</span>
                    <span>•</span>
                    <span>W3C ACCESSIBLE</span>
                </div>
            </footer>
        </div>
    );
};

export default ProfilePage;