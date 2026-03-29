import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useParcels } from '../features/dashboard/hooks/useParcels';
import { Layout } from '../components/common/Layout';

export const QrScannerPage = () => {
    const navigate = useNavigate();
    const { collectParcel } = useParcels();
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    
    // Camera states
    const [cameras, setCameras] = useState<{ id: string, label: string }[]>([]);
    const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
    const [isScannerStarted, setIsScannerStarted] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        // 1. Initial Load: Get Cameras
        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length > 0) {
                setCameras(devices.map(d => ({ id: d.id, label: d.label })));
                // Try to find back camera as default if possible
                const backCameraIndex = devices.findIndex(d => 
                    d.label.toLowerCase().includes('back') || 
                    d.label.toLowerCase().includes('rear') || 
                    d.label.toLowerCase().includes('environment')
                );
                setCurrentCameraIndex(backCameraIndex !== -1 ? backCameraIndex : 0);
            } else {
                setError("No cameras found on this device.");
            }
        }).catch(err => {
            console.error("Error getting cameras", err);
            setError("Camera permission denied or not available.");
        });

        // Check for ID in URL (from scanning with external camera)
        const params = new URLSearchParams(window.location.search);
        const urlId = params.get('id');
        if (urlId) {
            const idInt = parseInt(urlId);
            if (!isNaN(idInt)) {
                handleCollection(idInt);
            }
        }

        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(err => console.error("Failed to stop scanner", err));
            }
        };
    }, []);

    useEffect(() => {
        // Start scanner when camera is selected or changed
        if (cameras.length > 0 && !scanResult && !error) {
            startScanner(cameras[currentCameraIndex].id);
        }
    }, [cameras, currentCameraIndex, scanResult, error]);

    const startScanner = async (cameraId: string) => {
        try {
            if (scannerRef.current && scannerRef.current.isScanning) {
                await scannerRef.current.stop();
            }
            
            const html5QrCode = new Html5Qrcode("reader");
            scannerRef.current = html5QrCode;
            
            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            };

            await html5QrCode.start(
                cameraId,
                config,
                (decodedText) => onScanSuccess(decodedText),
                (errorMessage) => { /* ignore failures */ }
            );
            setIsScannerStarted(true);
        } catch (err) {
            console.error("Failed to start scanner", err);
            setError("Could not start camera. Please check permissions.");
        }
    };

    const onScanSuccess = (decodedText: string) => {
        let parcelId: number | null = null;

        if (decodedText.startsWith('bs-parcel:')) {
            parcelId = parseInt(decodedText.split(':')[1]);
        } else if (decodedText.includes('?id=')) {
            try {
                const url = new URL(decodedText);
                const idParam = url.searchParams.get('id');
                if (idParam) parcelId = parseInt(idParam);
            } catch (e) { /* ignore */ }
        }

        if (parcelId && !isNaN(parcelId)) {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(console.error);
                setIsScannerStarted(false);
            }
            handleCollection(parcelId);
        } else {
            setError("This is not a valid ByteSyntax parcel QR code.");
        }
    };

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

    const toggleCamera = () => {
        if (cameras.length > 1) {
            setCurrentCameraIndex((prev) => (prev + 1) % cameras.length);
        }
    };

    const resetScanner = () => {
        setScanResult(null);
        setError(null);
        setIsSuccess(false);
    };

    return (
        <Layout>
            <div className="max-w-md mx-auto space-y-6 flex flex-col items-center pb-20">
                <div className="text-center space-y-2 w-full pt-4">
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight font-serif lowercase">
                        parcel<span className="text-primary italic">scanner</span>
                    </h2>
                    <p className="text-slate-500 font-medium">Scan recipient QR to confirm collection</p>
                </div>

                <AnimatePresence mode="wait">
                    {!scanResult && !error ? (
                        <motion.div
                            key="scanner-container"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full space-y-4"
                        >
                            <div className="relative aspect-square bg-slate-100 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl ring-1 ring-slate-200">
                                <div id="reader" className="w-full h-full object-cover"></div>
                                
                                {/* Overlay Decoration */}
                                <div className="absolute inset-0 border-[40px] border-black/10 pointer-events-none"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-primary/50 rounded-2xl pointer-events-none animate-pulse"></div>
                                
                                {!isScannerStarted && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm">
                                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                                    </div>
                                )}
                            </div>

                            {cameras.length > 1 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-center"
                                >
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={toggleCamera}
                                        className="bg-white/80 backdrop-blur-md border-slate-200 hover:border-primary text-slate-700 font-bold px-8 shadow-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Switch Camera
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full"
                        >
                            <Card className={`p-10 text-center space-y-6 rounded-[3rem] border-none shadow-2xl relative overflow-hidden ${isSuccess ? 'bg-white' : 'bg-rose-50'}`}>
                                {isSuccess && (
                                    <div className="absolute top-0 inset-x-0 h-2 bg-emerald-500"></div>
                                )}
                                
                                <div className={`h-24 w-24 mx-auto rounded-3xl flex items-center justify-center text-white text-5xl shadow-2xl transform rotate-3 ${isSuccess ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-200' : 'bg-gradient-to-br from-rose-400 to-rose-600 shadow-rose-200'}`}>
                                    {isSuccess ? '✓' : '!'}
                                </div>

                                <div className="space-y-3">
                                    <h3 className={`text-3xl font-black tracking-tight font-serif ${isSuccess ? 'text-slate-900' : 'text-rose-900'}`}>
                                        {isSuccess ? 'Confirmed!' : 'Scan Error'}
                                    </h3>
                                    <p className={`font-medium leading-relaxed ${isSuccess ? 'text-slate-500' : 'text-rose-700/80'}`}>
                                        {isSuccess
                                            ? 'Great! The parcel collection has been officially recorded.'
                                            : error || 'This QR code doesn\'t look like a valid ByteSyntax parcel.'}
                                    </p>
                                    <div className="inline-block px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">
                                        ID {scanResult?.split(':')[1].trim() || 'UNKNOWN'}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 pt-4">
                                    <Button
                                        onClick={resetScanner}
                                        className="w-full h-14 text-lg rounded-2xl shadow-xl shadow-primary/30"
                                    >
                                        Scan Next
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate('/admin/dashboard')}
                                        className="w-full h-14 text-lg rounded-2xl border-slate-100"
                                    >
                                        Back to Dashboard
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex flex-col items-center gap-2 pt-6">
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200 animate-pulse"></span>
                        Secure Scanner Active
                    </div>
                </div>
            </div>
        </Layout>
    );
};
