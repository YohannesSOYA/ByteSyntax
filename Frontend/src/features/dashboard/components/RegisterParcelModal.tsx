import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { useParcels } from '../hooks/useParcels';

interface RegisterParcelModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const RegisterParcelModal = ({ isOpen, onClose }: RegisterParcelModalProps) => {
    const { createParcel, isCreating } = useParcels();
    const [formData, setFormData] = useState({
        student_name: '',
        phone_number: '',
        tracking_number: '',
        courier_name: '',
        storage_location: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createParcel(formData, {
            onSuccess: () => {
                onClose();
                setFormData({
                    student_name: '',
                    phone_number: '',
                    tracking_number: '',
                    courier_name: '',
                    storage_location: '',
                    notes: '',
                });
            },
        });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="w-full max-w-lg"
                >
                    <Card className="p-8 shadow-2xl border-white/20">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-slate-900 font-serif lowercase">
                                register<span className="text-primary italic">parcel</span>
                            </h3>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recipient Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        value={formData.student_name}
                                        onChange={e => setFormData({ ...formData, student_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="e.g. 60123456789"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        value={formData.phone_number}
                                        onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tracking Number</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter Tracking ID"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono"
                                    value={formData.tracking_number}
                                    onChange={e => setFormData({ ...formData, tracking_number: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Courier Service</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. J&T, PosLaju"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        value={formData.courier_name}
                                        onChange={e => setFormData({ ...formData, courier_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Storage Location</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Rack A-1"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        value={formData.storage_location}
                                        onChange={e => setFormData({ ...formData, storage_location: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Notes (Optional)</label>
                                <textarea
                                    placeholder="Any additional details..."
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none h-20"
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="flex-1 h-12"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isCreating}
                                    className="flex-1 h-12 shadow-lg shadow-primary/20"
                                >
                                    {isCreating ? 'Registering...' : 'Confirm Entry'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
