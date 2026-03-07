import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { dashboardApi } from '../features/dashboard/api/dashboardApi';

export const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            navigate('/admin');
        }
    }, [token, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await dashboardApi.resetPassword(token!, password);
            setIsSuccess(true);
            setTimeout(() => {
                navigate('/admin');
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password. The link might be expired.');
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
                        Security Portal
                    </p>
                </div>

                <Card className="p-10 shadow-2xl shadow-slate-200/60">
                    {!isSuccess ? (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 font-serif">
                                    New <span className="text-primary italic">Password</span>
                                </h2>
                                <p className="text-slate-500 text-sm mt-1 font-medium">
                                    Create a secure password for your account.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <Input
                                        label="New Password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                        required
                                    />
                                    <Input
                                        label="Confirm Password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>

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
                                    Reset Password
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center space-y-6 py-4">
                            <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-3xl">
                                Success 🎉
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-slate-900 font-serif">Password Updated</h2>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                    Your password has been successfully reset. Redirecting you to login...
                                </p>
                            </div>
                            <Button
                                className="w-full h-12"
                                onClick={() => navigate('/admin')}
                            >
                                Login Now
                            </Button>
                        </div>
                    )}
                </Card>
            </motion.div>
        </div>
    );
};
