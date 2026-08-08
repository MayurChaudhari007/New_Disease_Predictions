import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Activity, Menu, X, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const { token, user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-2">
            {toggleSidebar && token && (
              <button 
                onClick={toggleSidebar} 
                className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-md"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            <Link to={token ? "/dashboard" : "/"} className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary-600" />
              <span className="font-bold text-xl text-slate-900 tracking-tight">MediPredict</span>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {!token && (
              <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                About
              </Link>
            )}
            {token ? (
              <>
                <Link to="/profile" className="text-sm font-medium text-slate-600 hover:text-primary-600 flex items-center gap-2">
                  <UserIcon className="h-4 w-4" /> Hello, {user?.name}
                </Link>
                <button 
                  onClick={logout}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4 border-l pl-6 border-slate-200">
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            {token ? (
              <button 
                onClick={logout}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-md"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            ) : (
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-md"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Only for public pages) */}
      {!token && isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white shadow-lg animate-in slide-in-from-top-2">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link 
              to="/" 
              className="block px-3 py-3 text-base font-medium text-slate-900 hover:bg-slate-50 rounded-md"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-3 text-base font-medium text-slate-900 hover:bg-slate-50 rounded-md"
            >
              About
            </Link>
            <div className="border-t border-slate-100 my-2 pt-2"></div>
            <Link 
              to="/login" 
              className="block px-3 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-md"
            >
              Log in
            </Link>
            <Link 
              to="/register" 
              className="block mt-2 text-center w-full btn-primary"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
