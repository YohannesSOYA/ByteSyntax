import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { useParcelTracking } from '../features/tracking/hooks/useParcelTracking';
import { useParcelCheckAll } from '../features/tracking/hooks/useParcelCheckAll';
import { usePublicStats } from '../features/tracking/hooks/usePublicStats';
import { QRCodeCanvas } from 'qrcode.react';
import type { ParcelRead } from '../features/dashboard/types/dashboard.types';

import { ArrivalsSlider } from '../features/tracking/components/ArrivalsSlider';

export const TrackingPage = () => {
    const { mutate: searchParcel, isPending: isSearchingOne } = useParcelTracking();
    const { mutate: searchAllParcels, isPending: isSearchingAll } = useParcelCheckAll();
    const { data: stats } = usePublicStats();

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

    const handleSearchAll = () => {
        searchAllParcels(
            {
                student_name: studentName,
                phone_number: phone,
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
    const isAllFormValid = studentName.trim().length > 0 && phone.trim().length >= 4;

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-x-hidden">
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>

            {/* Admin Portal Entry */}
            <div className="absolute top-6 right-6 z-20">
                <Link to="/admin">
                    <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm border-slate-200 text-slate-500 hover:text-primary">
                        Admin Portal Access
                    </Button>
                </Link>
            </div>

            <div className="w-full max-w-6xl z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                    {/* Left Column: Branding & Search */}
                    <div className="lg:col-span-7 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            {/* Branding */}
                            <div className="space-y-2">
                                <h1 className="text-5xl font-bold text-slate-900 font-serif lowercase tracking-tighter">
                                    byte<span className="text-primary italic">syntax</span>
                                </h1>
                                <p className="text-slate-500 font-medium">Precision Parcel Intelligence</p>
                            </div>

                            {/* Search Card */}
                            <Card className="p-8 space-y-6 shadow-2xl shadow-slate-200/60">
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

                                <div className="space-y-3">
                                    <Button
                                        className="w-full h-14 text-lg"
                                        onClick={handleSearch}
                                        isLoading={isSearchingOne}
                                        disabled={!isFormValid || isSearchingAll}
                                    >
                                        Initialize Retrieval
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full h-12 text-slate-600 border-slate-200 hover:bg-slate-50"
                                        onClick={handleSearchAll}
                                        isLoading={isSearchingAll}
                                        disabled={!isAllFormValid || isSearchingOne}
                                    >
                                        Check all my parcels
                                    </Button>
                                    <p className="text-[10px] text-center text-slate-400 font-medium uppercase tracking-widest">
                                        No suffix required for "Check all"
                                    </p>
                                </div>

                                {/* Today's Arrivals Summary Box (compact) */}
                                {stats && (
                                    <div className="pt-2 border-t border-slate-100">
                                        <div className="bg-slate-50/80 rounded-2xl p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-slate-100">
                                                    📦
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Arrivals Today</p>
                                                    <p className="text-sm font-bold text-slate-700 mt-0.5">Systems Initialized</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-black text-primary font-mono">{stats.arrived_today}</span>
                                                <span className="text-[10px] block text-emerald-500 font-bold uppercase tracking-tight">Active</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card>

                            {/* Results Section */}
                            <AnimatePresence mode="wait">
                                {resultStatus !== 'idle' && (
                                    <motion.div
                                        key={resultStatus}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
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
                                                        {parcel.status === 'Pending' && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: 0.2 }}
                                                                className="mt-6 p-4 bg-white rounded-2xl shadow-inner border border-emerald-100/50 flex flex-col items-center gap-3"
                                                            >
                                                                <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                                                                    <QRCodeCanvas
                                                                        value={`${window.location.origin}/admin/scan?id=${parcel.id}`}
                                                                        size={140}
                                                                        level="H"
                                                                        includeMargin={false}
                                                                        imageSettings={{
                                                                            src: "/logo-mini.png",
                                                                            x: undefined,
                                                                            y: undefined,
                                                                            height: 24,
                                                                            width: 24,
                                                                            excavate: true,
                                                                        }}
                                                                    />
                                                                </div>
                                                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                                                                    Scan for Collection
                                                                </p>
                                                            </motion.div>
                                                        )}
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
                        </motion.div>
                    </div>

                    {/* Right Column: Arrivals Sidebar */}
                    <div className="lg:col-span-5 h-full">
                        <ArrivalsSlider />
                    </div>
                </div>

                {/* Footer Quote */}
                <p className="text-center text-slate-400 text-sm italic mt-16">
                    "Transitioning logistical friction into systematic flow."
                </p>
            </div>
        </div>
    );
};
