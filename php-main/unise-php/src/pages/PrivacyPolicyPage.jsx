import React from 'react';
import { ShieldCheck } from 'lucide-react';
import CtaSection from '../components/CtaSection';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      
      <section className="relative py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950 border border-blue-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>LEGAL DOCUMENTATION</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white">Privacy Policy</h1>
          <p className="text-xs text-slate-400">Last updated: July 2026 • UniSpark Innovation Security Systems & Equipment Trading L.L.C</p>
        </div>
      </section>

      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-slate-300 text-sm leading-relaxed">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          
          <div>
            <h2 className="text-xl font-bold text-white mb-2">1. Overview & Data Protection</h2>
            <p>
              UniSpark Innovation Security Systems & Equipment Trading L.L.C ("UniSpark", "we", "us", "our") values your personal and commercial data privacy. This Privacy Policy details our operational practices regarding the collection, transmission, storage, and processing of technical project details, contact specifications, and website analytics in compliance with UAE Data Protection Regulations.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">2. Information Collection</h2>
            <p>
              When you submit site survey requests, product quotation forms, or email technical enquiries, we collect information including your full name, corporate email address, contact phone number, company identity, physical site Emirate location, and project scope parameters.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">3. Utilization of Collected Data</h2>
            <p>
              Collected technical specifications are strictly used to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-slate-400">
              <li>Prepare physical security layout blueprints and CAD engineering designs.</li>
              <li>Dispatch certified security technicians for on-site assessments across the UAE.</li>
              <li>Fulfill statutory regulatory submissions required by Civil Defence or SIRA authorities.</li>
              <li>Manage SLA emergency dispatches and preventive maintenance schedules.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">4. Third-Party Sharing & Compliance</h2>
            <p>
              UniSpark does not sell, lease, or monetize customer data. Information may only be shared with designated government entities (such as SIRA or Civil Defence) when mandatory for regulatory compliance, NOC certification, or security licensing approval.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">5. Data Retention & Contact</h2>
            <p>
              Client records and system maintenance logs are stored on encrypted servers. For data privacy inquiries or record update requests, contact our compliance officer at <a href="mailto:info@unisparkinnovation.com" className="text-cyan-400 hover:underline">info@unisparkinnovation.com</a>.
            </p>
          </div>

        </div>
      </section>

      <CtaSection />
    </div>
  );
}
