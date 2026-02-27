import React from 'react';
import { motion } from 'framer-motion';
import { useDashboardStats } from '../hooks/useDashboardStats';

interface StatTileProps {
    label: string;
    value: number | string;
    icon: React.ReactNode;
    accentClass: string;
    bgClass: string;
    delay?: number;
    isLoading?: boolean;
}

const StatTile = ({ label, value, icon, accentClass, bgClass, delay = 0, isLoading }: StatTileProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay, ease: 'easeOut' }}
        whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300 } }}
        className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg shadow-slate-200/40 flex items-center gap-5"
    >
        <div className={`p-4 rounded-2xl ${bgClass} flex-shrink-0`}>
            <div className={accentClass}>{icon}</div>
        </div>
        <div>
            {isLoading ? (
                <div className="h-9 w-16 bg-slate-200 animate-pulse rounded-md" />
            ) : (
                <p className="text-3xl font-bold text-slate-900 font-serif leading-none">{value}</p>
            )}
            <p className="text-sm text-slate-500 font-medium mt-1">{label}</p>
        </div>
    </motion.div>
);

export const AnalyticsCards = () => {
    const { data: stats, isLoading } = useDashboardStats();

    const tiles = [
        {
            label: 'Total Active (Est.)',
            value: (stats?.pending_parcels || 0) + (stats?.collected_today || 0),
            accentClass: 'text-primary',
            bgClass: 'bg-orange-50',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m16 4l-8 4-8-4" />
                </svg>
            ),
        },
        {
            label: 'Awaiting Collection',
            value: stats?.pending_parcels ?? 0,
            accentClass: 'text-amber-600',
            bgClass: 'bg-amber-50',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: 'Collected Today',
            value: stats?.collected_today ?? 0,
            accentClass: 'text-success',
            bgClass: 'bg-emerald-50',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: 'Arrived Today',
            value: stats?.arrived_today ?? 0,
            accentClass: 'text-blue-600',
            bgClass: 'bg-blue-50',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {tiles.map((tile, i) => (
                <StatTile key={tile.label} {...tile} delay={i * 0.08} isLoading={isLoading} />
            ))}
        </div>
    );
};
