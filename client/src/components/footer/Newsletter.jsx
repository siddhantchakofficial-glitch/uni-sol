import React, { useState } from 'react';
import { leadService } from '../../services/leadService';
import { useSiteContext } from '../../context/SiteContext';
import { validateEmail } from '../../utils/validation';
import Button from '../ui/Button';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useSiteContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await leadService.subscribeNewsletter(email);
      showToast(res.message, 'success');
      setEmail('');
    } catch (err) {
      showToast('Subscription failed. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
        Subscribe to Insights
      </h4>
      <p className="text-xs text-slate-400 leading-relaxed">
        Stay updated with modern security tech trends, AI video analytics, and enterprise IT best practices.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your work email"
          className="bg-[#f1f9ff] border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 flex-1"
        />
        <Button type="submit" variant="primary" size="sm" disabled={loading}>
          {loading ? '...' : 'Subscribe'}
        </Button>
      </form>
    </div>
  );
};

export default Newsletter;
