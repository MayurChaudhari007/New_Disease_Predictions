import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, FileText, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const MobileNav = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Dash', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Predict', path: '/predict', icon: Stethoscope },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Profile', path: '/profile', icon: Settings },
  ];

  const cn = (...inputs) => twMerge(clsx(inputs));

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-40 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors',
                isActive 
                  ? 'text-primary-600' 
                  : 'text-slate-500 hover:text-slate-900'
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "fill-primary-50")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
