import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { FaCheckCircle, FaHome } from 'react-icons/fa';

export const ThankYou = () => {
  return (
    <div className="min-h-screen bg-[#f1f9ff] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
        <FaCheckCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-white">Thank You for Reaching Out!</h1>
      <p className="text-slate-400 max-w-md text-sm leading-relaxed">
        Your consultation request has been successfully recorded. A senior solution engineer will review your specifications and contact you within 24 hours.
      </p>
      <Link to="/">
        <Button variant="primary" size="md" icon={FaHome}>
          Return to Homepage
        </Button>
      </Link>
    </div>
  );
};

export default ThankYou;
