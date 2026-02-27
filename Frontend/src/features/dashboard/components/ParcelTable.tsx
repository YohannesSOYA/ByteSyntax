import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ParcelRead, ParcelStatus } from '../types/dashboard.types';
import { useParcels } from '../hooks/useParcels';
import { Button } from '../../../components/ui/Button';

import { StatusBadge } from '../../../components/ui/StatusBadge';

type SortField = 'student_name' | 'arrived_at' | 'status';

export const ParcelTable = () => {
    const { parcels, isLoading, isError, collectParcel, isCollecting } = useParcels();
    const [sortField, setSortField] = useState<SortField>('arrived_at');
    const [sortAsc, setSortAsc] = useState(false);
    const [filterStatus, setFilterStatus] = useState<ParcelStatus | 'all'>('all');

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    const sorted = [...parcels]
        .filter(p => filterStatus === 'all' || p.status === filterStatus)
        .sort((a, b) => {
            const aVal = String(a[sortField] || '');
            const bVal = String(b[sortField] || '');
            const cmp = aVal.localeCompare(bVal);
            return sortAsc ? cmp : -cmp;
        });

    const SortIcon = ({ field }: { field: SortField }) => (
        <span className={`inline-block ml-1 transition-opacity ${sortField === field ? 'opacity-100' : 'opacity-30'}`}>
            {sortField === field && sortAsc ? '↑' : '↓'}
        </span>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            id="parcels"
            className="bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/40 overflow-hidden"
        >
            {/* Table Header Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-5 border-b border-slate-100 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 font-serif">Parcel Registry</h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{sorted.length} entries displayed</p>
                </div>
                {/* Status Filter */}
                <div className="flex items-center gap-2">
                    {(['all', 'Pending', 'Collected'] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 capitalize
                                ${filterStatus === s
                                    ? 'bg-primary text-white border-primary shadow-sm'
                                    : 'bg-stone-50 text-slate-500 border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            {s === 'Pending' ? 'Ready' : s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto min-h-[300px]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin h-8 w-8 text-primary border-2 border-primary border-t-transparent rounded-full" />
                    </div>
                ) : isError ? (
                    <div className="flex items-center justify-center h-64 text-rose-500">
                        Failed to load parcels from backend.
                    </div>
                ) : sorted.length === 0 ? (
                    <div className="flex items-center justify-center h-64 text-slate-400">
                        No parcels found for this filter.
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                <th className="text-left px-6 py-3">
                                    <button onClick={() => handleSort('student_name')} className="hover:text-slate-600 transition-colors">
                                        Recipient <SortIcon field="student_name" />
                                    </button>
                                </th>
                                <th className="text-left px-6 py-3">Tracking ID</th>
                                <th className="text-left px-6 py-3">
                                    <button onClick={() => handleSort('status')} className="hover:text-slate-600 transition-colors">
                                        Status <SortIcon field="status" />
                                    </button>
                                </th>
                                <th className="text-left px-6 py-3">Location / Note</th>
                                <th className="text-left px-6 py-3">
                                    <button onClick={() => handleSort('arrived_at')} className="hover:text-slate-600 transition-colors">
                                        Date <SortIcon field="arrived_at" />
                                    </button>
                                </th>
                                <th className="text-right px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence>
                                {sorted.map((parcel, i) => (
                                    <motion.tr
                                        key={parcel.id}
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="hover:bg-stone-50/70 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-800">{parcel.student_name}</td>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500 tracking-wider">
                                            <div className="flex flex-col">
                                                <span>{parcel.tracking_number}</span>
                                                {parcel.courier_name && <span className="text-[10px] uppercase text-primary mt-0.5">{parcel.courier_name}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><StatusBadge status={parcel.status} /></td>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{parcel.notes || '-'}</td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(parcel.arrived_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {parcel.status === 'Pending' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
                                                    onClick={() => collectParcel(parcel.id)}
                                                    disabled={isCollecting}
                                                >
                                                    Collect
                                                </Button>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                )}
            </div>
        </motion.div>
    );
};
