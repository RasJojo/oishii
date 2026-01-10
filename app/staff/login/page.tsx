import StaffLogin from "@/components/staff-login";
import { Terminal } from "lucide-react";

export default function Page() {
    return (
        <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background overflow-hidden font-sans">
            {/* Simple Industrial Background - High Contrast */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" aria-hidden="true">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(30deg,var(--primary)_1px,transparent_1px),linear-gradient(120deg,var(--primary)_1px,transparent_1px)] bg-[size:100px_100px]" />
            </div>

            <div className="w-full max-w-[450px] relative z-10">
                <StaffLogin />
            </div>

            {/* Accessibility Note */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.3em] opacity-20">
                Secure Terminal Session • OISHII V3.1
            </div>
        </div>
    );
}
