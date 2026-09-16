import React from 'react';
import { ShieldCheck } from 'lucide-react';
import CtaSection from '../components/CtaSection';

export default function TermsPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      
      <section className="relative py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950 border border-blue-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>TERMS OF SERVICE</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white">Terms & Conditions</h1>
          <p className="text-xs text-slate-400">Last updated: July 2026 • UniSpark Innovation Security Systems & Equipment Trading L.L.C</p>
        </div>
      </section>

      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-slate-300 text-sm leading-relaxed">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          
          <div>
            <h2 className="text-xl font-bold text-white mb-2">1. Scope of Commercial Agreement</h2>
            <p>
              These Terms and Conditions govern all equipment supply, physical installation projects, system integrations, and Annual Maintenance Contracts (AMC/PMC) executed by UniSpark Innovation Security Systems & Equipment Trading L.L.C within the United Arab Emirates.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">2. Engineering & Installation Standards</h2>
            <p>
              All physical installations, cabling conduits, camera mounts, and biometric panel configurations are conducted in accordance with UAE Civil Defence, SIRA, and municipal engineering directives. System sign-offs and NOC handovers are subject to joint customer verification.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">3. Hardware Warranty & Maintenance SLAs</h2>
            <p>
              Hardware supplied carries manufacturer warranties (OEM). Preventive maintenance visits and emergency call-out SLA response times are strictly governed by individual contracted AMC/PMC agreements.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">4. Jurisdiction</h2>
            <p>
              These terms are governed by the laws and regulations of Dubai and the Federal Laws of the United Arab Emirates.
            </p>
          </div>

        </div>
      </section>

      <CtaSection />
    </div>
  );
}
