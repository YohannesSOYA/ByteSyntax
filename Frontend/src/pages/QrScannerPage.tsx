import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useParcels } from '../features/dashboard/hooks/useParcels';
import { Layout } from '../components/common/Layout';

export const QrScannerPage = () => {
    const navigate = useNavigate();
    const { collectParcel, isCollecting } = useParcels();
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        // Check for ID in URL (from scanning with external camera)
        const params = new URLSearchParams(window.location.search);
        const urlId = params.get('id');
        if (urlId) {
            const idInt = parseInt(urlId);
            if (!isNaN(idInt)) {
                handleCollection(idInt);
            }
        }

        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            },
            /* verbose= */ false
        );

        const onScanSuccess = (decodedText: string) => {
            // Handle both legacy "bs-parcel:ID" and new "http://.../admin/scan?id=ID"
            let parcelId: number | null = null;

            if (decodedText.startsWith('bs-parcel:')) {
                parcelId = parseInt(decodedText.split(':')[1]);
            } else if (decodedText.includes('?id=')) {
                try {
                    const url = new URL(decodedText);
                    const idParam = url.searchParams.get('id');
                    if (idParam) parcelId = parseInt(idParam);
                } catch (e) {
                    // Not a valid URL, ignore
                }
            }

            if (parcelId && !isNaN(parcelId)) {
                scanner.clear().catch(console.error);
                handleCollection(parcelId);
            } else {
                setError("This is not a valid ByteSyntax parcel QR code.");
            }
        };

        const onScanFailure = (error: any) => {
            // console.warn(`Scan error: ${error}`);
        };

        scanner.render(onScanSuccess, onScanFailure);

        return () => {
            scanner.clear().catch(err => console.error("Failed to clear scanner", err));
        };
    }, []);

    const handleCollection = (id: number) => {
        setScanResult(`ID: ${id}`);
        collectParcel(id, {
            onSuccess: () => {
                setIsSuccess(true);
            },
            onError: (err: any) => {
                setError(err.message || "Failed to mark parcel as collected.");
            }
        });
    };

    const resetScanner = () => {
        window.location.reload(); // Simplest way to re-initialize the scanner cleanly
    };

    return (
        <Layout>
            <div className="max-w-md mx-auto space-y-6 flex flex-col items-center">
                <div className="text-center space-y-2 w-full">
                    <h2 className="text-3xl font-bold text-slate-900 font-serif lowercase">
                        parcel<span className="text-primary italic">scanner</span>
                    </h2>
                    <p className="text-slate-500 font-medium">Scan recipient QR to confirm collection</p>
                </div>

                <AnimatePresence mode="wait">
                    {!scanResult && !error ? (
                        <motion.div
                            key="scanner"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full aspect-square bg-slate-100 rounded-3xl overflow-hidden border-2 border-slate-200 shadow-xl"
                        >
                            <div id="reader" className="w-full h-full"></div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full"
                        >
                            <Card className={`p-8 text-center space-y-6 ${isSuccess ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                                <div className={`h-20 w-20 mx-auto rounded-full flex items-center justify-center text-white text-4xl shadow-lg ${isSuccess ? 'bg-emerald-500 shadow-emerald-200' : 'bg-rose-500 shadow-rose-200'}`}>
                                    {isSuccess ? '✓' : '!'}
                                </div>

                                <div className="space-y-2">
                                    <h3 className={`text-2xl font-bold font-serif ${isSuccess ? 'text-emerald-900' : 'text-rose-900'}`}>
                                        {isSuccess ? 'Collection Confirmed' : 'Verification Failed'}
                                    </h3>
                                    <p className={`font-medium ${isSuccess ? 'text-emerald-700' : 'text-rose-700'}`}>
                                        {isSuccess
                                            ? 'The parcel has been successfully updated in the registry.'
                                            : error || 'An unexpected error occurred during scanning.'}
                                    </p>
                                    <div className="text-xs font-mono opacity-50">
                                        {scanResult}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Button
                                        onClick={resetScanner}
                                        className="w-full h-12"
                                    >
                                        Scan Another
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate('/admin/dashboard')}
                                        className="w-full h-12"
                                    >
                                        Return to Registry
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-widest pt-4">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Camera Feed Active
                </div>
            </div>
        </Layout>
    );
};
