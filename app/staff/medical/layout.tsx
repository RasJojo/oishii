"use client";

import { Stethoscope } from "lucide-react";
import { MedicalSidebar } from "@/components/staff/medical-sidebar";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MedicalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [doctorName, setDoctorName] = useState<string | null>(null);
  const [doctorService, setDoctorService] = useState<string>("Cardiologie");
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, service")
          .eq("id", user.id)
          .single();

        if (profile) {
          setDoctorName(profile.full_name || user.email?.split("@")[0].toUpperCase() || "MÉDECIN");
          if (profile.service) setDoctorService(profile.service);
        }
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b bg-card px-6 h-16 flex items-center shadow-sm">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-primary/20 bg-primary/5 text-primary">
              <Stethoscope size={24} />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight uppercase">
                Espace Médical
              </h1>
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                OISHII SYSTEMS
              </p>
            </div>
          </div>

          <Link href="/staff/medical/profile" className="flex items-center gap-3">
            <div
              className="text-right hidden sm:block hover:opacity-80 transition-opacity"
              aria-label="Voir mon profil"
            >
              <p className="text-xs font-black">{doctorName || "Médecin"}</p>
              <p className="text-[9px] text-muted-foreground font-bold uppercase">
                {doctorService}
              </p>
            </div>
            <div
              className="h-8 w-8 border border-primary/20 bg-primary/10 flex items-center justify-center text-primary font-black text-xs hover:bg-primary/20 transition-colors"
              aria-label="Voir mon profil"
            >
              {doctorName
                ? doctorName.split(" ").length > 1
                  ? `${doctorName.split(" ")[0][0]}${doctorName.split(" ")[1][0]}`
                  : doctorName.substring(0, 2).toUpperCase()
                : "DM"}
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1">
        <MedicalSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
