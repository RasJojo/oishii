"use client";

import { useState } from "react";
import {
    Stethoscope,
    User,
    Search,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Plus,
    UserPlus,
    Settings2,
    Filter
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    MOCK_PATIENTS,
    Patient,
    ALLERGENS_LIST,
    DIETS_LIST
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function MedicalDashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
    const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

    // New patient form state
    const [newPatient, setNewPatient] = useState({
        firstName: "",
        lastName: "",
        room: "",
        service: "Cardiologie",
        allergies: [] as string[],
        dietaryRestrictions: [] as string[]
    });

    const filteredPatients = patients.filter(p => {
        const matchesSearch = `${p.firstName} ${p.lastName} ${p.id}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesService = selectedService ? p.service === selectedService : true;
        return matchesSearch && matchesService;
    });

    const services = Array.from(new Set(MOCK_PATIENTS.map(p => p.service)));

    const handleUpdatePatient = (patientId: string, updates: Partial<Patient>) => {
        setPatients(prev => prev.map(p => p.id === patientId ? { ...p, ...updates } : p));
    };

    const handleAddPatient = (e: React.FormEvent) => {
        e.preventDefault();
        const id = `PAT-${Math.floor(100 + Math.random() * 900)}`;
        const patient: Patient = {
            ...newPatient,
            id,
            status: "ADMITTED"
        };
        setPatients([patient, ...patients]);
        setNewPatient({ firstName: "", lastName: "", room: "", service: "Cardiologie", allergies: [], dietaryRestrictions: [] });
        setIsAddPatientOpen(false);
    };

    const toggleAllergy = (allergy: string) => {
        if (!editingPatient) return;
        const newAllergies = editingPatient.allergies.includes(allergy)
            ? editingPatient.allergies.filter(a => a !== allergy)
            : [...editingPatient.allergies, allergy];

        setEditingPatient({ ...editingPatient, allergies: newAllergies });
        handleUpdatePatient(editingPatient.id, { allergies: newAllergies });
    };

    const toggleDiet = (diet: string) => {
        if (!editingPatient) return;
        const newDiets = editingPatient.dietaryRestrictions.includes(diet)
            ? editingPatient.dietaryRestrictions.filter(d => d !== diet)
            : [...editingPatient.dietaryRestrictions, diet];

        setEditingPatient({ ...editingPatient, dietaryRestrictions: newDiets });
        handleUpdatePatient(editingPatient.id, { dietaryRestrictions: newDiets });
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans outline-none">
            {/* Header */}
            <header className="sticky top-0 z-30 w-full border-b bg-card px-6 h-16 flex items-center shadow-sm">
                <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-3">
                        <div className="p-2 border border-primary/20 bg-primary/5 text-primary">
                            <Stethoscope size={24} />
                        </div>
                        <div>
                            <h1 className="text-sm font-black tracking-tight uppercase">Espace Médical</h1>
                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">OISHII SYSTEMS</p>
                        </div>
                    </div>

                    <nav className="hidden lg:flex items-center gap-1 border border-border p-1 bg-muted/20" aria-label="Services">
                        <Button
                            variant={selectedService === null ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setSelectedService(null)}
                            className="text-[10px] h-7 font-black uppercase tracking-widest px-3 focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            Tous
                        </Button>
                        {services.map(service => (
                            <Button
                                key={service}
                                variant={selectedService === service ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setSelectedService(service)}
                                className="text-[10px] h-7 font-black uppercase tracking-widest px-3 focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                {service}
                            </Button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-black">Dr. Martin</p>
                            <p className="text-[9px] text-muted-foreground font-bold uppercase">Cardiologie</p>
                        </div>
                        <div className="h-8 w-8 border border-primary/20 bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                            DM
                        </div>
                    </div>
                </div>
            </header>

            <main id="main-content" className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Patients", val: patients.length, icon: User, color: "primary" },
                        { label: "Alertes", val: patients.filter(p => p.allergies.length > 0).length, icon: AlertTriangle, color: "destructive" },
                        { label: "En attente", val: patients.filter(p => p.status === "PENDING_SELECTION").length, icon: Clock, color: "secondary" },
                        { label: "Actifs", val: patients.filter(p => p.status === "ADMITTED").length, icon: CheckCircle2, color: "primary" }
                    ].map((stat, i) => (
                        <Card key={i} className="border border-border bg-card shadow-sm rounded-none">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className={cn("p-2 border", `bg-${stat.color}/10 text-${stat.color} border-${stat.color}/20`)}>
                                    <stat.icon size={16} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xl font-black leading-none">{stat.val}</p>
                                    <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">{stat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Action Bar */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input
                            placeholder="RECHERCHER UN PATIENT..."
                            aria-label="Rechercher un patient par nom ou identifiant"
                            className="pl-9 h-11 bg-card border-border focus-visible:ring-2 focus-visible:ring-primary/20 text-xs font-bold uppercase"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-11 w-full sm:w-auto px-8 border border-primary uppercase font-black text-[10px] tracking-[0.2em] gap-2 shadow-sm focus-visible:ring-2 focus-visible:ring-primary">
                                <UserPlus size={16} />
                                Admission Patient
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-card border-2 border-border p-8 rounded-none shadow-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader className="mb-6">
                                <DialogTitle className="text-2xl font-black uppercase tracking-tight">Nouvelle Admission</DialogTitle>
                                <DialogDescription className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Enregistrez les informations du patient.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddPatient} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Prénom</Label>
                                        <Input id="firstName" value={newPatient.firstName} onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })} required className="h-10 text-sm font-bold bg-muted/20 border-border focus-visible:ring-1 focus-visible:ring-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nom de famille</Label>
                                        <Input id="lastName" value={newPatient.lastName} onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })} required className="h-10 text-sm font-bold bg-muted/20 border-border focus-visible:ring-1 focus-visible:ring-primary" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="room" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Chambre</Label>
                                        <Input id="room" value={newPatient.room} onChange={(e) => setNewPatient({ ...newPatient, room: e.target.value })} required className="h-10 text-sm font-bold bg-muted/20 border-border focus-visible:ring-1 focus-visible:ring-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="service" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Service</Label>
                                        <Select value={newPatient.service} onValueChange={(v) => setNewPatient({ ...newPatient, service: v })}>
                                            <SelectTrigger className="h-10 font-bold text-sm bg-muted/20 border-border">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="border-border">
                                                {services.map(s => <SelectItem key={s} value={s} className="font-bold text-xs">{s.toUpperCase()}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Allergies Multi-Select */}
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Allergies</Label>
                                    <div className="grid grid-cols-2 gap-2 p-4 bg-muted/20 border border-border rounded-none max-h-48 overflow-y-auto">
                                        {ALLERGENS_LIST.map((allergen) => (
                                            <label key={allergen} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-none">
                                                <input
                                                    type="checkbox"
                                                    checked={newPatient.allergies.includes(allergen)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setNewPatient({ ...newPatient, allergies: [...newPatient.allergies, allergen] });
                                                        } else {
                                                            setNewPatient({ ...newPatient, allergies: newPatient.allergies.filter(a => a !== allergen) });
                                                        }
                                                    }}
                                                    className="w-4 h-4 accent-primary"
                                                />
                                                <span className="text-xs font-bold">{allergen}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Dietary Restrictions Multi-Select */}
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Régimes Alimentaires</Label>
                                    <div className="grid grid-cols-2 gap-2 p-4 bg-muted/20 border border-border rounded-none">
                                        {DIETS_LIST.map((diet) => (
                                            <label key={diet} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-none">
                                                <input
                                                    type="checkbox"
                                                    checked={newPatient.dietaryRestrictions.includes(diet)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setNewPatient({ ...newPatient, dietaryRestrictions: [...newPatient.dietaryRestrictions, diet] });
                                                        } else {
                                                            setNewPatient({ ...newPatient, dietaryRestrictions: newPatient.dietaryRestrictions.filter(d => d !== diet) });
                                                        }
                                                    }}
                                                    className="w-4 h-4 accent-primary"
                                                />
                                                <span className="text-xs font-bold">{diet}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-12 font-black uppercase tracking-[0.2em] text-[10px] mt-2">Valider l'Admission</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Table */}
                <Card className="border border-border bg-card shadow-sm rounded-none overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/30 border-b border-border">
                                <TableRow>
                                    <TableHead scope="col" className="font-black uppercase text-[10px] py-5 tracking-[0.1em] text-muted-foreground pl-6">Information Patient</TableHead>
                                    <TableHead scope="col" className="font-black uppercase text-[10px] py-5 tracking-[0.1em] text-muted-foreground">Localisation</TableHead>
                                    <TableHead scope="col" className="font-black uppercase text-[10px] py-5 tracking-[0.1em] text-muted-foreground">Restrictions / Allergies</TableHead>
                                    <TableHead scope="col" className="font-black uppercase text-[10px] py-5 tracking-[0.1em] text-muted-foreground text-right pr-8">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPatients.map((patient) => (
                                    <TableRow key={patient.id} className="border-b border-border/50 hover:bg-muted/5 group">
                                        <TableCell className="py-4 pl-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 border border-border bg-muted/50 flex items-center justify-center font-black text-xs text-muted-foreground">
                                                    {patient.firstName[0]}{patient.lastName[0]}
                                                </div>
                                                <div>
                                                    <p className="font-black text-xs uppercase tracking-tight">{patient.lastName} {patient.firstName}</p>
                                                    <p className="text-[9px] font-mono text-muted-foreground/60 uppercase">ID: {patient.id}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest">CH. {patient.room}</p>
                                                <Badge variant="outline" className="text-[8px] font-bold uppercase rounded-none px-1 border-border bg-muted/30">{patient.service}</Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {patient.allergies.length > 0 ? (
                                                    patient.allergies.map(a => (
                                                        <span key={a} className="text-[9px] font-black uppercase px-2 py-0.5 border border-destructive/20 bg-destructive/5 text-destructive">
                                                            {a}
                                                        </span>
                                                    ))
                                                ) : patient.dietaryRestrictions.length > 0 ? (
                                                    patient.dietaryRestrictions.map(d => (
                                                        <span key={d} className="text-[9px] font-black uppercase px-2 py-0.5 border border-primary/20 bg-primary/5 text-primary">
                                                            {d}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-[9px] font-bold text-muted-foreground/40 italic uppercase">Aucune restriction</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-right pr-8">
                                            <Sheet>
                                                <SheetTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setEditingPatient(patient)}
                                                        className="h-9 px-6 text-[9px] font-black uppercase tracking-[0.1em] border-border hover:bg-primary hover:text-white transition-all focus-visible:ring-2 focus-visible:ring-primary"
                                                    >
                                                        Configurer
                                                    </Button>
                                                </SheetTrigger>
                                                <SheetContent className="bg-card border-l-2 border-border shadow-2xl p-0 w-[400px]">
                                                    <SheetHeader className="p-8 border-b border-border bg-muted/10">
                                                        <div className="flex items-center gap-5">
                                                            <div className="h-14 w-14 border-2 border-border bg-background flex items-center justify-center font-black text-xl text-primary">
                                                                {patient.firstName[0]}{patient.lastName[0]}
                                                            </div>
                                                            <div>
                                                                <SheetTitle className="text-xl font-black uppercase tracking-tight">{patient.lastName} {patient.firstName}</SheetTitle>
                                                                <SheetDescription className="text-[10px] font-mono uppercase font-black text-muted-foreground mt-1">ID: {patient.id} • CHAMBRE {patient.room}</SheetDescription>
                                                            </div>
                                                        </div>
                                                    </SheetHeader>

                                                    <div className="p-8 space-y-10 h-[calc(100vh-180px)] overflow-y-auto scrollbar-thin">
                                                        <section className="space-y-4">
                                                            <div className="flex items-center justify-between border-b border-border pb-2">
                                                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-destructive flex items-center gap-2">
                                                                    <AlertTriangle size={14} /> Allergies
                                                                </h3>
                                                                <Badge variant="destructive" className="h-5 px-1.5 rounded-none font-black text-[9px]">{editingPatient?.allergies.length}</Badge>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                {ALLERGENS_LIST.map(allergy => (
                                                                    <label
                                                                        key={allergy}
                                                                        htmlFor={`allergy-${allergy}`}
                                                                        className={cn(
                                                                            "flex items-center space-x-2 border p-3 cursor-pointer transition-colors group focus-within:ring-2 focus-within:ring-primary",
                                                                            editingPatient?.allergies.includes(allergy)
                                                                                ? "border-destructive/40 bg-destructive/5"
                                                                                : "border-border bg-muted/10 hover:border-destructive/20"
                                                                        )}
                                                                    >
                                                                        <Checkbox
                                                                            id={`allergy-${allergy}`}
                                                                            checked={editingPatient?.allergies.includes(allergy)}
                                                                            onCheckedChange={() => toggleAllergy(allergy)}
                                                                            className="border-border data-[state=checked]:bg-destructive data-[state=checked]:border-destructive"
                                                                        />
                                                                        <span className="text-[10px] font-black uppercase cursor-pointer flex-1">{allergy}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </section>

                                                        <section className="space-y-4">
                                                            <div className="flex items-center justify-between border-b border-border pb-2">
                                                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                                                    <Plus size={14} /> Régimes
                                                                </h3>
                                                                <Badge variant="outline" className="h-5 px-1.5 rounded-none border-primary text-primary font-black text-[9px]">{editingPatient?.dietaryRestrictions.length}</Badge>
                                                            </div>
                                                            <div className="space-y-2">
                                                                {DIETS_LIST.map(diet => (
                                                                    <label
                                                                        key={diet}
                                                                        htmlFor={`diet-${diet}`}
                                                                        className={cn(
                                                                            "flex items-center space-x-3 border p-4 cursor-pointer transition-colors group focus-within:ring-2 focus-within:ring-primary",
                                                                            editingPatient?.dietaryRestrictions.includes(diet)
                                                                                ? "border-primary bg-primary/5"
                                                                                : "border-border bg-muted/10 hover:border-primary/40"
                                                                        )}
                                                                    >
                                                                        <Checkbox
                                                                            id={`diet-${diet}`}
                                                                            checked={editingPatient?.dietaryRestrictions.includes(diet)}
                                                                            onCheckedChange={() => toggleDiet(diet)}
                                                                            className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                                        />
                                                                        <span className="text-[11px] font-black uppercase cursor-pointer flex-1">{diet}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </section>
                                                    </div>

                                                    <div className="absolute bottom-8 left-8 right-8">
                                                        <Button className="w-full h-14 font-black uppercase tracking-[0.2em] text-[11px] shadow-xl border-2 border-primary">
                                                            Enregistrer le Profil
                                                        </Button>
                                                    </div>
                                                </SheetContent>
                                            </Sheet>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </main>

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
}
