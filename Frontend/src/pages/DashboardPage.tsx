import { useLocation, Navigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/ui/Button';
import { AnalyticsCards } from '../features/dashboard/components/AnalyticsCards';
import { ParcelTable } from '../features/dashboard/components/ParcelTable';
import { SettingsPanel } from '../features/dashboard/components/SettingsPanel';
import { RegisterParcelModal } from '../features/dashboard/components/RegisterParcelModal';
import { useAuth } from '../features/dashboard/hooks/useAuth';

export const DashboardPage = () => {
    const { isAuthenticated, user } = useAuth();
    const { hash } = useLocation();
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    // Auth guard — redirect unauthenticated users
    if (!isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    const activeTab = hash === '#parcels' ? 'parcels' : hash === '#settings' ? 'settings' : 'overview';

    const now = new Date();
    const greeting =
        now.getHours() < 12 ? 'Good morning' :
            now.getHours() < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <Layout>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-8 max-w-6xl mx-auto"
            >
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <motion.h2
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl font-bold text-slate-900 font-serif"
                        >
                            {greeting}, <span className="text-primary">{user?.name ?? 'Admin'}</span>
                        </motion.h2>
                        <motion.p
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.15 }}
                            className="text-slate-400 font-medium mt-1"
                        >
                            {activeTab === 'settings' ? 'Manage your administrator profile details.' : "Here's your operational overview for today."}
                        </motion.p>
                    </div>

                    {activeTab !== 'settings' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex gap-3"
                        >
                            <Button
                                variant="outline"
                                onClick={() => setIsRegisterModalOpen(true)}
                                className="h-12 px-6 flex items-center gap-2 border-slate-200"
                            >
                                <span className="text-xl">+</span>
                                <span>Register</span>
                            </Button>
                            <Link to="/admin/scan">
                                <Button className="h-12 px-8 flex items-center gap-2 shadow-lg shadow-primary/20">
                                    <span className="text-xl">⛶</span>
                                    <span>Scan Entry</span>
                                </Button>
                            </Link>
                        </motion.div>
                    )}
                </div>

                <RegisterParcelModal
                    isOpen={isRegisterModalOpen}
                    onClose={() => setIsRegisterModalOpen(false)}
                />

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            <AnalyticsCards />
                            <ParcelTable />
                        </motion.div>
                    )}

                    {activeTab === 'parcels' && (
                        <motion.div
                            key="parcels"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ParcelTable />
                        </motion.div>
                    )}

                    {activeTab === 'settings' && (
                        <motion.div
                            key="settings"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <SettingsPanel />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </Layout>
    );
};
