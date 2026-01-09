import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScanLine, Stethoscope, UtensilsCrossed, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background overflow-hidden font-sans">
      {/* Background Decor - Decorative: aria-hidden */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full flex justify-center border-b border-border/50 backdrop-blur-md h-16">
        <nav className="w-full max-w-5xl flex justify-between items-center px-6" aria-label="Navigation principale">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary" aria-hidden="true">
              <ScanLine size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">OISHII</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/staff/login">
              <Button variant="ghost" size="sm" className="rounded-xl text-xs font-semibold">
                Accès Personnel Staff
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Système Intelligent de Restauration Hospitalière
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1]">
            L'excellence nutritionnelle <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
              au service du patient
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Connectez les soins médicaux et la cuisine pour offrir une expérience alimentaire personnalisée, sûre et savoureuse.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/patient">
              <Button size="lg" className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 text-base">
                Espace Patient (Accès Bracelet)
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full max-w-5xl">
          <section className="p-8 rounded-3xl bg-card/30 border border-border/50 backdrop-blur-sm text-center space-y-4 hover:bg-card/50 transition-colors group">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform" aria-hidden="true">
              <Stethoscope size={24} />
            </div>
            <h2 className="font-bold text-xl">Pôle Médical</h2>
            <p className="text-sm text-muted-foreground">Gestion des allergies et restrictions alimentaires en temps réel pour chaque patient.</p>
          </section>
          <section className="p-8 rounded-3xl bg-card/30 border border-border/50 backdrop-blur-sm text-center space-y-4 hover:bg-card/50 transition-colors group">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform" aria-hidden="true">
              <UtensilsCrossed size={24} />
            </div>
            <h2 className="font-bold text-xl">Service Cuisine</h2>
            <p className="text-sm text-muted-foreground">Planification automatisée des menus et contrôle strict des allergènes en production.</p>
          </section>
          <section className="p-8 rounded-3xl bg-card/30 border border-border/50 backdrop-blur-sm text-center space-y-4 hover:bg-card/50 transition-colors group">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform" aria-hidden="true">
              <ScanLine size={24} />
            </div>
            <h2 className="font-bold text-xl">Liberté Patient</h2>
            <p className="text-sm text-muted-foreground">Choix simplifié des repas via bracelet connecté ou identifiant court sécurisé.</p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-border/50 text-center text-xs text-muted-foreground uppercase tracking-widest opacity-60">
        <p>© 2026 OISHII SYSTEMS • Conçu pour l'excellence hospitalière</p>
      </footer>
    </div>
  );
}
