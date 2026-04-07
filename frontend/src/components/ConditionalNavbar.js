'use client';

import { usePathname } from 'next/navigation';

export function ConditionalNavbar({ children }) {
    const pathname = usePathname();
    const isAdmin = pathname.includes('/admin');
    
    if (isAdmin) return null;
    return children;
}
