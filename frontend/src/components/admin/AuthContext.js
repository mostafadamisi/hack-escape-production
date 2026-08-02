'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { auth } from '@/lib/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const locale = params?.locale || 'en';

    useEffect(() => {
        const currentUser = auth.getUser();
        if (currentUser && auth.isAuthenticated()) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await auth.login(email, password);
        setUser({
            name: data.name,
            email: data.email,
            role: data.role
        });
        router.push(`/${locale}/admin`);
        return data;
    };

    const logout = () => {
        auth.logout();
        setUser(null);
        router.push(`/${locale}/admin/login`);
    };

    // Protect admin routes
    useEffect(() => {
        const isAdminRoute = pathname.includes('/admin');
        const isLoginRoute = pathname.includes('/admin/login');

        if (!loading && isAdminRoute && !isLoginRoute) {
            if (!auth.isAuthenticated()) {
                router.push(`/${locale}/admin/login`);
            }
        }
        if (!loading && isLoginRoute && auth.isAuthenticated()) {
            router.push(`/${locale}/admin`);
        }
    }, [pathname, loading, router, locale]);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
