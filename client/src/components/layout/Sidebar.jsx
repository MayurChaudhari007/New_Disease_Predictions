import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, FileText, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'New Prediction', path: '/predict', icon: Stethoscope },
    { label: 'My Reports', path: '/reports', icon: FileText },
    { label: 'Profile Settings', path: '/profile', icon: Settings },
  ];

  const cn = (...inputs) => twMerge(clsx(inputs));

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar Drawer */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
      <div className="p-6">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Menu
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen && setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium text-sm',
                  isActive 
                    ? 'bg-primary-600 text-white' 
                    : 'hover:bg-slate-800 hover:text-white'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-6">
         {/* Footer items or settings can go here */}
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
