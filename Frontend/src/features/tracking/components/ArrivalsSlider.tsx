import React from 'react';
import { motion } from 'framer-motion';
import { useArrivalsToday } from '../hooks/useArrivalsToday';

export const ArrivalsSlider = () => {
    const { data: arrivals, isLoading } = useArrivalsToday();

    if (isLoading || !arrivals || arrivals.length === 0) {
        return null;
    }

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
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-bold text-emerald-600 mt-1 uppercase tracking-tighter">Live</span>
                </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {arrivals.map((parcel) => (
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
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100/50">
                <p className="text-[10px] text-slate-400 font-medium text-center italic">
                    Scroll to browse today's logistical intake.
                </p>
            </div>
        </motion.div>
    );
};
