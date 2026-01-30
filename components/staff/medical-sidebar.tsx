"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Building2,
  AlertTriangle,
  Settings,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  description?: string;
}

const navItems: NavItem[] = [
  {
    href: "/staff/medical/dashboard",
    label: "Patients",
    icon: Users,
    description: "Gestion des patients",
  },
  {
    href: "/staff/medical/settings/services",
    label: "Services",
    icon: Building2,
    description: "Services hospitaliers",
  },
  {
    href: "/staff/medical/settings/allergens",
    label: "Allergènes",
    icon: AlertTriangle,
    description: "Liste des allergènes",
  },
];

export function MedicalSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col shrink-0">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Settings size={16} className="text-muted-foreground" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Navigation
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 border transition-all group",
                isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-transparent hover:border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "p-2 border transition-colors",
                  isActive
                    ? "border-primary/30 bg-primary/10"
                    : "border-border bg-muted/30 group-hover:border-primary/20 group-hover:bg-primary/5"
                )}
              >
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-[11px] font-black uppercase tracking-wider",
                    isActive ? "text-primary" : ""
                  )}
                >
                  {item.label}
                </p>
                {item.description && (
                  <p className="text-[9px] text-muted-foreground/60 truncate">
                    {item.description}
                  </p>
                )}
              </div>
              <ChevronRight
                size={14}
                className={cn(
                  "transition-transform",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground/40 group-hover:translate-x-0.5"
                )}
              />
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/40 text-center">
          Espace Médical
        </p>
      </div>
    </aside>
  );
}
