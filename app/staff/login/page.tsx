import { StaffLogin } from "@/components/staff-login";

export default function Page() {
    return (
        <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background overflow-hidden">
            {/* Aesthetic Background - Medical Style */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            <div className="w-full max-w-sm relative z-10">
                <StaffLogin />
            </div>
        </div>
    );
}
