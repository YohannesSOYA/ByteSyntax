import React from 'react';
import { Sidebar } from '../../features/dashboard/components/Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
            <div className="hidden md:block">
                <Sidebar />
            </div>
            {/* Main Content — offset by sidebar width on desktop */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};
