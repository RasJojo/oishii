"use client";

import { useState } from "react";
import {
    Search,
    Stethoscope,
    Filter,
    ChevronRight,
    AlertTriangle,
    User,
    Settings2,
    CheckCircle2,
    Clock,
    Plus,
    UserPlus
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
    SheetFooter,
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
import { MOCK_PATIENTS, ALLERGENS_LIST, DIETS_LIST, Patient } from "@/lib/mock-data";
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
        service: "Cardiologie"
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
            allergies: [],
            dietaryRestrictions: [],
            status: "ADMITTED"
        };
        setPatients([patient, ...patients]);
        setNewPatient({ firstName: "", lastName: "", room: "", service: "Cardiologie" });
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
        <div className="flex flex-col min-h-screen bg-muted/30">
            {/* Header */}
            <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-md px-6">
                <div className="flex h-16 items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                            <Stethoscope size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Espace Médical</h1>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Gestion Nutritionnelle</p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4 bg-muted/50 p-1 rounded-xl border border-border/50">
                        <Button
                            variant={selectedService === null ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setSelectedService(null)}
                            className="rounded-lg text-xs font-semibold"
                        >
                            Tous les services
                        </Button>
                        {services.map(service => (
                            <Button
                                key={service}
                                variant={selectedService === service ? "secondary" : "ghost"}
                                size="sm"
                                onClick={() => setSelectedService(service)}
                                className="rounded-lg text-xs font-semibold text-muted-foreground"
                            >
                                {service}
                            </Button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold">Dr. Martin</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase">Service Cardiologie</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 font-bold">
                            DM
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
                {/* Stats Preview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-card/50 backdrop-blur-sm border-none shadow-sm overflow-hidden">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-2xl font-black">{patients.length}</p>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Patients suivis</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur-sm border-none shadow-sm overflow-hidden">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <p className="text-2xl font-black">{patients.filter(p => p.allergies.length > 0).length}</p>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Avec Allergies</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur-sm border-none shadow-sm overflow-hidden">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-2xl font-black">{patients.filter(p => p.status === "PENDING_SELECTION").length}</p>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Repas en attente</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur-sm border-none shadow-sm overflow-hidden">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-green-500/10 text-green-500">
                                <CheckCircle2 size={20} />
                            </div>
                            <div>
                                <p className="text-2xl font-black">{patients.filter(p => p.status === "ADMITTED").length}</p>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Actifs ce jour</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Table */}
                <Card className="border-none shadow-xl shadow-blue-500/5 bg-card/50 backdrop-blur-md overflow-hidden rounded-3xl">
                    <CardHeader className="border-b border-muted/50 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <CardTitle className="text-xl font-bold">Liste des Patients</CardTitle>
                            <CardDescription>Consultez et gérez les restrictions alimentaires par patient</CardDescription>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <Input
                                    placeholder="Rechercher..."
                                    className="pl-10 h-11 bg-muted/30 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-blue-500/20"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    aria-label="Rechercher un patient"
                                />
                            </div>

                            <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
                                <DialogTrigger asChild>
                                    <Button className="h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 font-bold gap-2">
                                        <UserPlus size={18} />
                                        <span className="hidden sm:inline">Admettre Patient</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black">Nouvelle Admission</DialogTitle>
                                        <DialogDescription>Enregistrez un nouveau patient pour son suivi nutritionnel.</DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleAddPatient} className="space-y-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName" className="font-bold">Prénom</Label>
                                                <Input
                                                    id="firstName"
                                                    placeholder="Jean"
                                                    className="rounded-xl bg-muted/30 border-none"
                                                    value={newPatient.firstName}
                                                    onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName" className="font-bold">Nom</Label>
                                                <Input
                                                    id="lastName"
                                                    placeholder="Dupont"
                                                    className="rounded-xl bg-muted/30 border-none"
                                                    value={newPatient.lastName}
                                                    onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="room" className="font-bold">Chambre</Label>
                                                <Input
                                                    id="room"
                                                    placeholder="102"
                                                    className="rounded-xl bg-muted/30 border-none"
                                                    value={newPatient.room}
                                                    onChange={(e) => setNewPatient({ ...newPatient, room: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="service" className="font-bold">Service</Label>
                                                <Select
                                                    value={newPatient.service}
                                                    onValueChange={(v) => setNewPatient({ ...newPatient, service: v })}
                                                >
                                                    <SelectTrigger className="rounded-xl bg-muted/30 border-none">
                                                        <SelectValue placeholder="Cardiologie" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        {services.map(s => (
                                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                                        ))}
                                                        <SelectItem value="Urgences">Urgences</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <DialogFooter className="pt-4">
                                            <Button type="submit" className="w-full h-12 rounded-2xl bg-blue-600 font-bold shadow-xl shadow-blue-500/20">
                                                Confirmer l'admission
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="hover:bg-transparent border-none">
                                        <TableHead className="w-[300px] font-bold py-4">Patient</TableHead>
                                        <TableHead className="font-bold">Localisation</TableHead>
                                        <TableHead className="font-bold">Allergies</TableHead>
                                        <TableHead className="font-bold">Régime</TableHead>
                                        <TableHead className="text-right py-4 pr-6 font-bold font-bold">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPatients.length > 0 ? (
                                        filteredPatients.map((patient) => (
                                            <TableRow key={patient.id} className="group hover:bg-muted/20 transition-colors border-muted/30">
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center font-bold text-muted-foreground">
                                                            {patient.firstName[0]}{patient.lastName[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold leading-none">{patient.lastName} {patient.firstName}</p>
                                                            <p className="text-[10px] font-mono text-muted-foreground mt-1">{patient.id}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-semibold">Chambre {patient.room}</p>
                                                        <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-tighter h-5 px-1 bg-muted/50 border-none">
                                                            {patient.service}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {patient.allergies.length > 0 ? (
                                                            patient.allergies.map(a => (
                                                                <Badge key={a} variant="destructive" className="text-[10px] font-bold h-6 rounded-lg shadow-sm shadow-destructive/20 border-none">
                                                                    {a}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground italic">Aucune</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {patient.dietaryRestrictions.length > 0 ? (
                                                            patient.dietaryRestrictions.map(d => (
                                                                <Badge key={d} className="text-[10px] font-bold h-6 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-none shadow-none">
                                                                    {d}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <Badge variant="outline" className="text-[10px] font-bold h-6 rounded-lg bg-green-500/5 text-green-600 border-green-200">
                                                                Normal
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <Sheet>
                                                        <SheetTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setEditingPatient(patient)}
                                                                className="rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-all h-9"
                                                            >
                                                                Modifier
                                                                <Settings2 className="ml-2 h-4 w-4" aria-hidden="true" />
                                                            </Button>
                                                        </SheetTrigger>
                                                        <SheetContent side="right" className="sm:max-w-md bg-background/95 backdrop-blur-md border-none shadow-2xl">
                                                            <SheetHeader className="pb-6 border-b border-muted/50">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-black">
                                                                        {patient.firstName[0]}{patient.lastName[0]}
                                                                    </div>
                                                                    <div>
                                                                        <SheetTitle className="text-2xl font-black">{patient.firstName} {patient.lastName}</SheetTitle>
                                                                        <SheetDescription className="font-mono text-xs">ID: {patient.id} • Ch. {patient.room}</SheetDescription>
                                                                    </div>
                                                                </div>
                                                            </SheetHeader>

                                                            <div className="py-8 space-y-8 h-[calc(100vh-200px)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-muted">
                                                                <section>
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <h3 className="text-sm font-black uppercase tracking-widest text-destructive flex items-center gap-2">
                                                                            <AlertTriangle size={16} />
                                                                            Allergies Connues
                                                                        </h3>
                                                                        <Badge variant="destructive" className="h-5 text-[10px]">{editingPatient?.allergies.length}</Badge>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        {ALLERGENS_LIST.map(allergy => (
                                                                            <div key={allergy} className="flex items-center space-x-2 bg-muted/20 p-2 rounded-xl border border-transparent hover:border-destructive/20 transition-all">
                                                                                <Checkbox
                                                                                    id={`allergy-${allergy}`}
                                                                                    checked={editingPatient?.allergies.includes(allergy)}
                                                                                    onCheckedChange={() => toggleAllergy(allergy)}
                                                                                />
                                                                                <Label htmlFor={`allergy-${allergy}`} className="text-xs font-bold cursor-pointer">{allergy}</Label>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </section>

                                                                <section>
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                                                                            <Plus size={16} />
                                                                            Régimes Thérapeutiques
                                                                        </h3>
                                                                    </div>
                                                                    <div className="grid grid-cols-1 gap-2">
                                                                        {DIETS_LIST.map(diet => (
                                                                            <div key={diet} className="flex items-center space-x-2 bg-muted/20 p-3 rounded-xl border border-transparent hover:border-blue-500/20 transition-all cursor-pointer">
                                                                                <Checkbox
                                                                                    id={`diet-${diet}`}
                                                                                    checked={editingPatient?.dietaryRestrictions.includes(diet)}
                                                                                    onCheckedChange={() => toggleDiet(diet)}
                                                                                />
                                                                                <Label htmlFor={`diet-${diet}`} className="text-sm font-bold flex-1 cursor-pointer">{diet}</Label>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </section>
                                                            </div>

                                                            <SheetFooter className="absolute bottom-6 left-6 right-6">
                                                                <Button className="w-full h-12 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95">
                                                                    Enregistrer les modifications
                                                                </Button>
                                                            </SheetFooter>
                                                        </SheetContent>
                                                    </Sheet>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-48 text-center text-muted-foreground italic">
                                                Aucun patient ne correspond à votre recherche.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </main>

            <footer className="p-6 text-center text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] opacity-50">
                OISHII SYSTEMS • MEDICAL DASHBOARD v2.1 • 2026
            </footer>
        </div>
    );
}
