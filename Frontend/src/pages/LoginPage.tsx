import React from 'react';
import { motion } from 'framer-motion';
import { LoginForm } from '../features/dashboard/components/LoginForm';

export const LoginPage = () => {
    return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative background blobs */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-slate-200/60 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-6 relative z-10"
            >
                {/* Branding above form */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-slate-900 font-serif lowercase tracking-tighter">
                        byte<span className="text-primary italic">syntax</span>
                    </h1>
                    <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">
                        Administrative Portal
                    </p>
                </div>

                <LoginForm />

                <p className="text-center text-slate-400 text-xs">
                    Authorised access only. All activity is monitored and logged.
                </p>
            </motion.div>
        </div>
    );
};
