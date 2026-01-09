import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScanLine, Stethoscope, UtensilsCrossed, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* Background Decor - Simple and non-distracting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/2 opacity-[0.03] border-l border-b border-primary/10 -rotate-12 translate-x-1/4 -translate-y-1/4" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full border-b border-border bg-card h-16 flex items-center shadow-xs">
        <nav className="w-full max-w-7xl mx-auto flex justify-between items-center px-6" aria-label="Menu principal">
          <div className="flex items-center gap-3">
            <div className="p-1.5 border-2 border-primary bg-primary/10 text-primary" aria-hidden="true">
              <ScanLine size={18} />
            </div>
            <span className="font-black text-xl tracking-[0.2em] uppercase">OISHII</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/staff/login">
              <Button variant="outline" size="sm" className="h-9 px-6 border-border font-black text-[10px] uppercase tracking-widest rounded-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary">
                Espace Personnel
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-12 md:py-24 max-w-7xl mx-auto w-full">
        <div className="space-y-8 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
            <Zap size={14} className="animate-pulse" />
            Système Centralisé de Restauration Hospitalière
          </div>

          <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[1.05] uppercase">
            L'excellence nutritionnelle <br />
            <span className="text-primary">au service du patient</span>
          </h1>

          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            Synchronisez les prescriptions médicales et la production culinaire pour garantir sécurité et satisfaction à chaque repas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
            <Link href="/patient" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-14 px-10 border-2 border-primary bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-xs shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-[0px] transition-all rounded-none focus-visible:ring-4 focus-visible:ring-primary/30">
                Accès Portail Patient
                <ArrowRight className="ml-3 h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid - Solid & Accessible */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-24 border-2 border-border bg-border shadow-xl">
          <section className="p-10 bg-card flex flex-col items-center text-center space-y-4 hover:bg-muted/30 transition-colors border-r border-border md:border-r last:border-r-0">
            <div className="w-14 h-14 border border-blue-500/20 bg-blue-500/10 text-blue-600 flex items-center justify-center mb-2" aria-hidden="true">
              <Stethoscope size={28} />
            </div>
            <h2 className="font-black text-base uppercase tracking-widest">Contrôle Médical</h2>
            <p className="text-xs font-bold leading-loose text-muted-foreground uppercase opacity-80">Gestion des pathologies et allergies critiques en temps réel.</p>
          </section>

          <section className="p-10 bg-card flex flex-col items-center text-center space-y-4 hover:bg-muted/30 transition-colors border-r border-border md:border-r last:border-r-0">
            <div className="w-14 h-14 border border-orange-500/20 bg-orange-500/10 text-orange-600 flex items-center justify-center mb-2" aria-hidden="true">
              <UtensilsCrossed size={28} />
            </div>
            <h2 className="font-black text-base uppercase tracking-widest">Cuisine Centrale</h2>
            <p className="text-xs font-bold leading-loose text-muted-foreground uppercase opacity-80">Optimisation de la production et traçabilité des ingrédients.</p>
          </section>

          <section className="p-10 bg-card flex flex-col items-center text-center space-y-4 hover:bg-muted/30 transition-colors">
            <div className="w-14 h-14 border border-primary/20 bg-primary/10 text-primary flex items-center justify-center mb-2" aria-hidden="true">
              <ScanLine size={28} />
            </div>
            <h2 className="font-black text-base uppercase tracking-widest">Interface Patient</h2>
            <p className="text-xs font-bold leading-loose text-muted-foreground uppercase opacity-80">Personnalisation des menus via QR code ou identifiant unique.</p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-border bg-card flex flex-col items-center gap-4">
        <div className="flex items-center gap-6 opacity-40">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">ISO 27001 SECURE</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">RGAA COMPLIANT</span>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.5em] opacity-30 mt-4 leading-loose">
          OISHII SYSTEMS • EXCELLENCE OPERATIONNELLE • © 2026
        </p>
      </footer>
    </div>
  );
}
