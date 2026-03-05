export type ParcelStatus = 'pending' | 'collected';

export interface ParcelRead {
    id: number;
    student_name: string;
    phone_number: string;
    tracking_number: string;
    courier_name: string | null;
    arrived_at: string;
    status: ParcelStatus;
    collected_at: string | null;
    collected_by_name: string | null;
    notes: string | null;
}

export interface AuthState {
    isAuthenticated: boolean;
    token?: string;
    user?: {
        name: string;
    };
}

export interface AdminRead {
    id: number;
    username: string;
    full_name: string;
    is_active: boolean;
    created_at: string;
}

export interface AdminUpdate {
    username?: string;
    full_name?: string;
    password?: string;
}

export interface DashboardStats {
    pending_parcels: number;
    collected_today: number;
    arrived_today: number;
    timestamp?: string;
}

export interface Token {
    access_token: string;
    token_type: string;
}
