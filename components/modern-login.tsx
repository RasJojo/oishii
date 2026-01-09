"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, User, ScanLine, ArrowRight, Camera, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

export function ModernLogin({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [identifier, setIdentifier] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const html5QrCode = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        return () => {
            if (html5QrCode.current && html5QrCode.current.isScanning) {
                html5QrCode.current.stop().catch(console.error);
            }
        };
    }, []);

    const requestPermissionAndStart = async () => {
        setError(null);
        setIsScanning(true);

        try {
            // 1. Force Browser Permission Dialog
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            // Stop the test stream immediately
            stream.getTracks().forEach(track => track.stop());
            setHasPermission(true);

            // 2. Small delay to ensure the DOM element #reader is mounted
            setTimeout(async () => {
                try {
                    const scanner = new Html5Qrcode("reader");
                    html5QrCode.current = scanner;

                    const config = {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0
                    };

                    // Try back camera first, then fall back to any available camera
                    try {
                        await scanner.start(
                            { facingMode: "environment" },
                            config,
                            onScanSuccess,
                            onScanFailure
                        );
                    } catch (e) {
                        console.warn("Back camera fail, trying default camera...");
                        await scanner.start(
                            { facingMode: "user" },
                            config,
                            onScanSuccess,
                            onScanFailure
                        );
                    }
                } catch (err: any) {
                    setError(`Erreur d'initialisation : ${err.message || err}`);
                    setIsScanning(false);
                }
            }, 300);

        } catch (err: any) {
            console.error("Permission denied:", err);
            setHasPermission(false);
            setError("Accès caméra refusé. Veuillez autoriser l'accès dans les réglages de votre navigateur.");
            setIsScanning(false);
        }
    };

    const onScanSuccess = (decodedText: string) => {
        setScanResult(decodedText);
        setIsLoading(true);
        if (html5QrCode.current) {
            html5QrCode.current.stop().then(() => setIsScanning(false));
        }
        setTimeout(() => {
            setIsLoading(false);
            // Logic for backend redirect here
        }, 1500);
    };

    const onScanFailure = () => {
        // Silent fail during scan cycles
    };

    const stopScanner = async () => {
        if (html5QrCode.current && html5QrCode.current.isScanning) {
            try {
                await html5QrCode.current.stop();
                setIsScanning(false);
            } catch (err) {
                console.error("Failed to stop", err);
            }
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden border-none shadow-2xl bg-card/50 backdrop-blur-md">
                <CardHeader className="space-y-1 text-center pb-8 border-b border-muted/50">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                            <ScanLine size={32} />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight">OISHII</CardTitle>
                    <CardDescription className="text-muted-foreground/80">
                        Portail Patient
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                    <Tabs defaultValue="qr" className="w-full" onValueChange={() => stopScanner()}>
                        <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-xl">
                            <TabsTrigger value="qr" className="rounded-lg">QR Code</TabsTrigger>
                            <TabsTrigger value="id" className="rounded-lg">Identifiant</TabsTrigger>
                        </TabsList>

                        <TabsContent value="qr" className="space-y-6">
                            <div className="min-h-[280px] flex flex-col items-center justify-center">
                                {error && (
                                    <div className="mb-6 p-4 rounded-2xl bg-destructive/10 text-destructive text-center space-y-3">
                                        <div className="flex items-center justify-center gap-2 font-semibold">
                                            <AlertCircle size={18} />
                                            Oops!
                                        </div>
                                        <p className="text-xs leading-relaxed">{error}</p>
                                        <Button variant="ghost" size="sm" onClick={requestPermissionAndStart} className="h-8 text-xs underline">
                                            <RefreshCw size={12} className="mr-2" /> Réessayer
                                        </Button>
                                    </div>
                                )}

                                {!isScanning && !scanResult && !isLoading && !error && (
                                    <Button
                                        variant="outline"
                                        onClick={requestPermissionAndStart}
                                        className="h-48 w-full max-w-[240px] rounded-3xl border-2 border-dashed flex flex-col gap-4 group hover:border-primary/50 bg-muted/20 border-muted-foreground/20"
                                    >
                                        <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                            <Camera size={40} />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-sm font-bold block">Scanner mon bracelet</span>
                                            <span className="text-[10px] text-muted-foreground block">Appuyez pour activer la caméra</span>
                                        </div>
                                    </Button>
                                )}

                                {(isScanning || isLoading) && (
                                    <div className="relative aspect-square w-full max-w-[280px] mx-auto rounded-3xl overflow-hidden border-2 border-primary/20 bg-black shadow-2xl">
                                        <div id="reader" className="w-full h-full"></div>

                                        {isLoading && (
                                            <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center backdrop-blur-sm z-20">
                                                <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                                                <p className="text-sm font-bold">Patient identifié...</p>
                                            </div>
                                        )}

                                        {!isLoading && (
                                            <>
                                                <div className="absolute top-4 right-4 z-30">
                                                    <Button variant="ghost" size="icon" onClick={stopScanner} className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/80">
                                                        <XCircle size={20} />
                                                    </Button>
                                                </div>
                                                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-primary/80 shadow-[0_0_15px_var(--primary)] animate-[scan_3s_ease-in-out_infinite] z-10" />
                                            </>
                                        )}
                                    </div>
                                )}

                                {scanResult && !isLoading && (
                                    <div className="text-center space-y-4 py-8">
                                        <div className="h-16 w-16 mx-auto rounded-full bg-green-500/10 text-green-500 flex items-center justify-center animate-bounce">
                                            <ScanLine size={32} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold">Détection réussie</h3>
                                            <p className="text-xs text-muted-foreground">ID: {scanResult}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="id" className="space-y-6">
                            <form onSubmit={(e) => { e.preventDefault(); setIsLoading(true); }} className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-widest text-muted-foreground ml-1">Identifiant Personnel</Label>
                                    <Input
                                        placeholder="Ex: 882-991"
                                        className="h-14 bg-muted/30 border-none rounded-xl text-lg font-mono text-center tracking-widest"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/20" disabled={isLoading || !identifier}>
                                    {isLoading ? "Connexion..." : "Accéder à ma planification"}
                                    {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
