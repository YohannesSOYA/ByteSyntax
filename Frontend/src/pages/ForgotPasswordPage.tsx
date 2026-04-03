import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { dashboardApi } from '../features/dashboard/api/dashboardApi';

export const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await dashboardApi.forgotPassword(email);
            setIsSent(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-stone-50 to-stone-100">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-slate-900 font-serif tracking-tighter">
                        Byte<span className="text-primary italic">Syntax</span>
                    </h1>
                    <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">
                        Password Recovery
                    </p>
                </div>

                <Card className="p-10 shadow-2xl shadow-slate-200/60">
                    {!isSent ? (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 font-serif">
                                    Forgot <span className="text-primary italic">Password?</span>
                                </h2>
                                <p className="text-slate-500 text-sm mt-1 font-medium">
                                    Enter your registered email address to receive a reset link.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Input
                                    label="Registered Email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    required
                                />

                                {error && (
                                    <p className="text-alert text-xs font-medium bg-rose-50 p-3 rounded-xl">
                                        {error}
                                    </p>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full h-12 text-base"
                                    isLoading={isLoading}
                                >
                                    Send Reset Link
                                </Button>

                                <div className="text-center">
                                    <Link
                                        to="/admin"
                                        className="text-sm font-medium text-slate-400 hover:text-primary transition-colors"
                                    >
                                        Back to Login
                                    </Link>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center space-y-6 py-4">
                            <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-3xl text-emerald-500">📧</span>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-slate-900 font-serif">Check your email</h2>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                    We've sent a password reset link to <span className="text-slate-900 font-bold">{email}</span> if it's in our system.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full h-12"
                                onClick={() => navigate('/admin')}
                            >
                                Return to Login
                            </Button>
                        </div>
                    )}
                </Card>
            </motion.div>
        </div>
    );
};
