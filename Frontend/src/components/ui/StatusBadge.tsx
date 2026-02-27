import React from 'react';
import type { ParcelStatus } from '../../features/dashboard/types/dashboard.types';

const STATUS_CONFIG: Record<ParcelStatus, { label: string; classes: string }> = {
    Pending: { label: 'Ready', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    Collected: { label: 'Collected', classes: 'bg-slate-100  text-slate-500  border-slate-200' },
};

export const StatusBadge = ({ status }: { status: ParcelStatus }) => {
    const cfg = STATUS_CONFIG[status];
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.classes}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${status === 'Pending' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`} />
            {cfg.label}
        </span>
    );
};
