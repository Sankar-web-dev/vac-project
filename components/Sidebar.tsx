import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Building, Users, AlertCircle, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  role: 'student' | 'warden';
}

export const Sidebar = ({ role }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const studentLinks = [
    { to: '/student', icon: Home, label: 'Dashboard' },
    { to: '/student/complaints', icon: AlertCircle, label: 'Complaints' },
    { to: '/student/room', icon: Building, label: 'Room Info' },
    { to: '/student/profile', icon: Users, label: 'Profile' },
  ];

  const wardenLinks = [
    { to: '/warden', icon: Home, label: 'Dashboard' },
    { to: '/warden/rooms', icon: Building, label: 'Rooms' },
    { to: '/warden/students', icon: Users, label: 'Students' },
    { to: '/warden/complaints', icon: AlertCircle, label: 'Complaints' },

  ];

  const links = role === 'student' ? studentLinks : wardenLinks;

  const isActive = (path: string) => {
    if (path === '/student' || path === '/warden') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
    setIsMobileOpen(false);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#e2e8f0]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#4f46e5] to-[#6366f1] rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-[#0a0a0a]">HMS</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.to);

          return (
            <Link
              key={link.to}
              href={link.to}
              onClick={() => setIsMobileOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-200
                ${active
                  ? 'bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white shadow-lg shadow-indigo-500/30'
                  : 'text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0a0a0a]'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="px-3 py-4 border-t border-[#e2e8f0]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0a0a0a] transition-all duration-200 w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-lg border border-[#e2e8f0]"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 h-screen bg-white border-r border-[#e2e8f0] flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-[#e2e8f0] flex flex-col z-40 animate-in slide-in-from-left duration-200">
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
};
