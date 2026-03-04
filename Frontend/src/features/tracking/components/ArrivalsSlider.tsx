import React from 'react';
import { motion } from 'framer-motion';
import { useArrivalsToday } from '../hooks/useArrivalsToday';

export const ArrivalsSlider = () => {
    const { data: arrivals, isLoading } = useArrivalsToday();

    if (isLoading) {
        return (
            <div className="w-full h-32 bg-white/40 animate-pulse rounded-3xl border border-white/20" />
        );
    }

    const hasArrivals = arrivals && arrivals.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full h-fit bg-white/40 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl shadow-slate-200/20 p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block">Dispatcher Feed</span>
                    <h2 className="text-lg font-bold text-slate-800 font-serif mt-1">Today's Arrivals</h2>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`flex h-2 w-2 rounded-full ${hasArrivals ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                    <span className={`text-[8px] font-bold mt-1 uppercase tracking-tighter ${hasArrivals ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {hasArrivals ? 'Live' : 'Standby'}
                    </span>
                </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {hasArrivals ? (
                    arrivals.map((parcel) => (
                        <div
                            key={parcel.id}
                            className="bg-white/80 p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-primary/30 transition-all duration-300 group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-700 group-hover:text-primary transition-colors truncate max-w-[140px]">
                                        {parcel.student_name}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                                        {parcel.tracking_number}
                                    </span>
                                </div>
                                <span className="text-lg grayscale group-hover:grayscale-0 transition-all duration-300">
                                    📦
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-white/20 rounded-2xl border border-dashed border-slate-200">
                        <div className="text-2xl grayscale opacity-30">📭</div>
                        <div>
                            <p className="text-xs font-bold text-slate-500">No arrivals recorded yet</p>
                            <p className="text-[10px] text-slate-400 mt-1">Standby for incoming logistical updates.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100/50">
                <p className="text-[10px] text-slate-400 font-medium text-center italic">
                    {hasArrivals ? "Scroll to browse today's logistical intake." : "Systems monitoring real-time intake."}
                </p>
            </div>
        </motion.div>
    );
};
