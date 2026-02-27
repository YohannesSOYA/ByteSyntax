import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export const LoginForm = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [pin, setPin] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setHasError(false);

        const success = await login(username, pin);
        setIsLoading(false);
        if (success) {
            navigate('/admin/dashboard');
        } else {
            setHasError(true);
            setPin('');
        }
    };

    return (
        <motion.div
            animate={hasError ? { x: [0, -10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
        >
            <Card className="p-10 w-full max-w-md shadow-2xl shadow-slate-200/60">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 font-serif">
                        Admin <span className="text-primary italic">Access</span>
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 font-medium">
                        Restricted to authorised personnel only.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Admin Username"
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setHasError(false);
                        }}
                        error={hasError ? 'Authentication failed.' : undefined}
                    />
                    <Input
                        label="Administrator PIN"
                        type="password"
                        placeholder="Enter 4-digit PIN"
                        value={pin}
                        onChange={(e) => {
                            setPin(e.target.value);
                            setHasError(false);
                        }}
                        maxLength={4}
                        inputMode="numeric"
                        pattern="[0-9]*"
                    />

                    <Button
                        type="submit"
                        className="w-full h-12 text-base mt-2"
                        isLoading={isLoading}
                        disabled={pin.length < 4 || username.length === 0}
                    >
                        Authenticate
                    </Button>
                </form>

                {/* Subtle lock icon */}
                <AnimatePresence mode="wait">
                    {!hasError && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-center mt-6"
                        >
                            <span className="text-2xl opacity-20 select-none">🔒</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </motion.div>
    );
};
