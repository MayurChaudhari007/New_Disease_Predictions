import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} MediPredict. All rights reserved.</p>
        <p className="mt-2 text-xs text-slate-400">
          Disclaimer: This system provides AI-based predictions and is not a replacement for professional medical advice.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
