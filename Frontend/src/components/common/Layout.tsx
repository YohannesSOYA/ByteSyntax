import React from 'react';
import { Sidebar } from '../../features/dashboard/components/Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-stone-50 flex">
            <Sidebar />
            {/* Main Content — offset by sidebar width */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};
