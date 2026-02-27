import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { useParcelTracking } from '../features/tracking/hooks/useParcelTracking';
import type { ParcelRead } from '../features/dashboard/types/dashboard.types';

export const TrackingPage = () => {
    const { mutate: searchParcel, isPending } = useParcelTracking();

    const [studentName, setStudentName] = useState('');
    const [phone, setPhone] = useState('');
    const [suffix, setSuffix] = useState('');

    const [resultStatus, setResultStatus] = useState<'idle' | 'not_found' | 'found'>('idle');
    const [parcels, setParcels] = useState<ParcelRead[]>([]);

    const handleSearch = () => {
        searchParcel(
            {
                student_name: studentName,
                phone_number: phone,
                tracking_suffix: suffix,
            },
            {
                onSuccess: (data) => {
                    if (data && data.length > 0) {
                        setParcels(data);
                        setResultStatus('found');
                    } else {
                        setParcels([]);
                        setResultStatus('not_found');
                    }
                },
                onError: () => {
                    setParcels([]);
                    setResultStatus('not_found');
                }
            }
        );
    };

    const isFormValid = studentName.trim().length > 0 && phone.trim().length >= 4 && suffix.trim().length === 4;

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
                            label="Recipient Name"
                            placeholder="Enter full name"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                        />
                        <div className="flex gap-4">
                            <Input
                                label="Phone Number"
                                placeholder="E.g. 0123456789"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <Input
                                label="Tracking Suffix"
                                placeholder="Last 4 chars"
                                value={suffix}
                                onChange={(e) => setSuffix(e.target.value)}
                                maxLength={4}
                            />
                        </div>
                    </div>

                    <Button
                        className="w-full h-14 text-lg"
                        onClick={handleSearch}
                        isLoading={isPending}
                        disabled={!isFormValid}
                    >
                        Initialize Retrieval
                    </Button>
                </Card>

                {/* Results Section */}
                <AnimatePresence mode="wait">
                    {resultStatus !== 'idle' && (
                        <motion.div
                            key={resultStatus}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            {resultStatus === 'found' ? (
                                parcels.map((parcel) => (
                                    <Card key={parcel.id} glass className={`border text-center p-8 ${parcel.status === 'Pending'
                                            ? 'bg-emerald-50/50 border-emerald-200'
                                            : 'bg-slate-100/50 border-slate-200'
                                        }`}>
                                        <div className="flex flex-col items-center gap-4">
                                            <div className={`h-16 w-16 rounded-full flex items-center justify-center text-white text-3xl shadow-lg ${parcel.status === 'Pending' ? 'bg-emerald-500 shadow-emerald-200' : 'bg-slate-400 shadow-slate-200'
                                                }`}>
                                                ✓
                                            </div>
                                            <div>
                                                <h3 className={`text-2xl font-bold font-serif ${parcel.status === 'Pending' ? 'text-emerald-900' : 'text-slate-700'
                                                    }`}>
                                                    {parcel.status === 'Pending' ? 'Consignment Ready' : 'Already Collected'}
                                                </h3>
                                                <p className={`font-medium ${parcel.status === 'Pending' ? 'text-emerald-700' : 'text-slate-500'
                                                    }`}>
                                                    {parcel.status === 'Pending'
                                                        ? 'Your parcel is processed and awaiting collection.'
                                                        : `Collected on ${new Date(parcel.collected_at!).toLocaleDateString()}`}
                                                </p>
                                            </div>
                                            <div className={`text-xs font-mono bg-white/50 px-3 py-1 rounded-full border mt-2 ${parcel.status === 'Pending' ? 'text-emerald-600 border-emerald-100' : 'text-slate-500 border-slate-200'
                                                }`}>
                                                LOC: {parcel.notes || '-'} | REF: {parcel.tracking_number}
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <Card glass className="bg-rose-50/50 border-rose-200 text-center p-8">
                                    <h3 className="text-xl font-bold text-rose-900 font-serif">Identifier Mismatch</h3>
                                    <p className="text-rose-700 font-medium opacity-80">We couldn't verify any active parcels with these credentials.</p>
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
