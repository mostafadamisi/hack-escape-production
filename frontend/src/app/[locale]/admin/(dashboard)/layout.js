import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="admin-dashboard-container">
      <Sidebar />
      <div className="admin-main-wrapper">
        <Header />
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
