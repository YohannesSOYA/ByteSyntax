import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { TrackingPage } from './pages/TrackingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { QrScannerPage } from './pages/QrScannerPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    {/* Public: Parcel Tracking */}
                    <Route path="/" element={<TrackingPage />} />

                    {/* Admin: Auth */}
                    <Route path="/admin" element={<LoginPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />

                    {/* Admin: Dashboard (auth-guarded inside DashboardPage) */}
                    <Route path="/admin/dashboard" element={<DashboardPage />} />
                    <Route path="/admin/scan" element={<QrScannerPage />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
