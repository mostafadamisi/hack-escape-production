'use client';
import { AuthProvider } from "@/components/admin/AuthContext";
import "./admin-theme.css";

export default function AdminLayout({ children }) {
  // Now nested inside [locale]/layout.js, so we don't need <html> or <body>
  return (
    <AuthProvider>
      <div className="min-h-screen admin-shell">
        {children}
      </div>
    </AuthProvider>
  );
}
