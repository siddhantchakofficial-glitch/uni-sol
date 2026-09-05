import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { FaHome } from 'react-icons/fa';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#f1f9ff] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
        404
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Page Not Found</h1>
      <p className="text-slate-400 max-w-md text-sm">
        The page you are looking for does not exist or has been moved to another location.
      </p>
      <Link to="/">
        <Button variant="primary" size="md" icon={FaHome}>
          Back to Homepage
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
