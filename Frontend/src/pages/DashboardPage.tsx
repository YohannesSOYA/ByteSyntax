import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '../components/common/Layout';
import { AnalyticsCards } from '../features/dashboard/components/AnalyticsCards';
import { ParcelTable } from '../features/dashboard/components/ParcelTable';
import { useAuth } from '../features/dashboard/hooks/useAuth';

export const DashboardPage = () => {
    const { isAuthenticated, user } = useAuth();

    // Auth guard — redirect unauthenticated users
    if (!isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

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
                        Here's your operational overview for today.
                    </motion.p>
                </div>

                {/* Analytics Stat Tiles */}
                <AnalyticsCards />

                {/* Parcel Registry Table */}
                <ParcelTable />
            </motion.div>
        </Layout>
    );
};
