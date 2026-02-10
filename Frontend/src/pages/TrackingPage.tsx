import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

export const TrackingPage = () => {
    const [trackingId, setTrackingId] = useState('');
    const [phone, setPhone] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [status, setStatus] = useState<'idle' | 'not_found' | 'ready' | 'collected'>('idle');

    const handleSearch = () => {
        setIsSearching(true);
        // Simulate API call
        setTimeout(() => {
            setIsSearching(false);
            if (trackingId.includes('123')) {
                setStatus('ready');
            } else {
                setStatus('not_found');
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 md:p-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg space-y-8"
            >
                {/* Branding */}
                <div className="text-center space-y-2">
                    <h1 className="text-5xl font-bold text-slate-900 font-serif lowercase tracking-tighter">
                        byte<span className="text-primary italic">syntax</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Precision Parcel Intelligence</p>
                </div>

                {/* Search Card */}
                <Card className="p-8 space-y-6 shadow-2xl shadow-slate-200/60 transition-all duration-500">
                    <div className="space-y-4">
                        <Input
                            label="Verification Identifier"
                            placeholder="Enter Name or Tracking ID"
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value)}
                        />
                        <Input
                            label="Contact Confirmation"
                            placeholder="Last 4 digits of Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            maxLength={4}
                        />
                    </div>

                    <Button
                        className="w-full h-14 text-lg"
                        onClick={handleSearch}
                        isLoading={isSearching}
                        disabled={!trackingId || phone.length < 4}
                    >
                        Initialize Retrieval
                    </Button>
                </Card>

                {/* Results Section */}
                <AnimatePresence mode="wait">
                    {status !== 'idle' && (
                        <motion.div
                            key={status}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {status === 'ready' ? (
                                <Card glass className="bg-emerald-50/50 border-emerald-200 text-center p-8">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="h-16 w-16 bg-emerald-500 rounded-full flex items-center justify-center text-white text-3xl shadow-lg shadow-emerald-200">
                                            ✓
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-emerald-900 font-serif">Consignment Ready</h3>
                                            <p className="text-emerald-700 font-medium">Your parcel is processed and awaiting collection.</p>
                                        </div>
                                        <div className="text-xs font-mono text-emerald-600 bg-white/50 px-3 py-1 rounded-full border border-emerald-100 mt-2">
                                            LOC: A-402 | REF: {trackingId}
                                        </div>
                                    </div>
                                </Card>
                            ) : (
                                <Card glass className="bg-rose-50/50 border-rose-200 text-center p-8">
                                    <h3 className="text-xl font-bold text-rose-900 font-serif">Identifier Mismatch</h3>
                                    <p className="text-rose-700 font-medium opacity-80">We couldn't verify this parcel with the provided credentials.</p>
                                </Card>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Quote */}
                <p className="text-center text-slate-400 text-sm italic">
                    "Transitioning logistical friction into systematic flow."
                </p>
            </motion.div>
        </div>
    );
};
