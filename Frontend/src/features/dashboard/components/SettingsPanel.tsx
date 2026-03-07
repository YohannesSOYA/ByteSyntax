import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { dashboardApi } from '../api/dashboardApi';

export const SettingsPanel = () => {
    const { user } = useAuth();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await dashboardApi.getProfile();
                setFullName(profile.full_name || '');
                setEmail(profile.email || '');
            } catch (err) {
                console.error("Failed to fetch profile", err);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage(null);
        try {
            await dashboardApi.updateProfile({
                full_name: fullName,
                email: email || undefined,
                password: password || undefined
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setPassword('');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 max-w-4xl"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Section */}
                <Card className="p-8 space-y-4 border-slate-100 shadow-lg shadow-slate-200/40">
                    <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                            {user?.name?.[0].toUpperCase() || 'A'}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 font-serif">Admin Profile</h3>
                            <p className="text-xs text-slate-400 font-medium font-mono uppercase tracking-widest">Active Session</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-4 pt-2">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 focus:border-primary outline-none transition-all text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                placeholder="For password recovery"
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 focus:border-primary outline-none transition-all text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Update Password</label>
                            <input
                                type="password"
                                placeholder="Leave blank to keep current"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 focus:border-primary outline-none transition-all text-sm"
                            />
                        </div>

                        {message && (
                            <p className={`text-xs font-medium ${message.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {message.text}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={isUpdating}
                            className="w-full h-10 text-xs shadow-md shadow-primary/10"
                        >
                            {isUpdating ? 'Saving...' : 'Save Profile'}
                        </Button>
                    </form>
                </Card>

                {/* System Info */}
                <Card className="p-8 space-y-4 border-slate-100 shadow-lg shadow-slate-200/40">
                    <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xl font-bold">
                            ⚙
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 font-serif">System State</h3>
                            <p className="text-xs text-slate-400 font-medium font-mono uppercase tracking-widest">Environment v1.0</p>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">Service Status</span>
                            <span className="flex items-center gap-1.5 text-emerald-500 font-semibold">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Operational
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-mono">
                            <span className="text-slate-500">API Latency</span>
                            <span className="text-slate-400 opacity-60">~12ms</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-mono">
                            <span className="text-slate-500">DB Connection</span>
                            <span className="text-emerald-500/80">Encrypted / Active</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Portal Settings (Placeholder for future expansion) */}
            <Card className="p-8 border-dashed border-2 border-slate-200 bg-slate-50/50">
                <div className="text-center space-y-2 py-4">
                    <div className="text-3xl grayscale opacity-30 select-none">🔒</div>
                    <h4 className="font-bold text-slate-400 font-serif lowercase italic">Advanced configurations locked</h4>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">To modify system parameters or notification templates, please contact the lead developer for ByteSyntax integration.</p>
                </div>
            </Card>
        </motion.div>
    );
};

