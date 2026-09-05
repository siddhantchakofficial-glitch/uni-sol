import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/common/PageHero';
import Card from '../../components/ui/Card';
import CTASection from '../../components/common/CTASection';
import { FaGlobe, FaUsers, FaShieldAlt, FaUserCheck, FaBriefcase, FaFileInvoiceDollar, FaLaptopCode, FaPaperPlane, FaArrowRight } from 'react-icons/fa';

export const International = () => {
  const subservices = [
    { name: 'Technology & Security', path: '/international/technology-security', icon: FaShieldAlt, desc: 'Cross-border technology delivery and security infrastructure deployment.' },
    { name: 'Workforce Solutions', path: '/international/workforce', icon: FaUsers, desc: 'Global talent sourcing, technical staffing, and specialized workforce provisioning.' },
    { name: 'Security Infrastructure', path: '/international/security-infrastructure', icon: FaGlobe, desc: 'Multi-site security design and compliance governance across regions.' },
    { name: 'HR Solutions', path: '/international/hr-solutions', icon: FaUserCheck, desc: 'Comprehensive HR consulting and global employee lifecycle management.' },
    { name: 'HR Advisory Services', path: '/international/hr-advisory', icon: FaBriefcase, desc: 'Strategic HR policy advisory, talent retention, and compensation structuring.' },
    { name: 'Payroll & Compliance', path: '/international/payroll-compliance', icon: FaFileInvoiceDollar, desc: 'Multi-country payroll processing, tax compliance, and regulatory reporting.' },
    { name: 'HRMS Platform', path: '/international/hrms', icon: FaLaptopCode, desc: 'Cloud-native Human Resource Management System for global organizations.' },
    { name: 'Workforce Deployment', path: '/international/workforce-deployment', icon: FaPaperPlane, desc: 'Rapid international workforce mobilization and visa/immigration logistics.' },
  ];

  return (
    <div>
      <PageHero
        badge="Global Operations"
        title="International Services & Workforce Consulting"
        description="Delivering global IT technology, specialized technical workforce, HR solutions, and cross-border security deployment across India, UAE, and international markets."
        breadcrumbs={[{ label: 'International' }]}
        image="/src/assets/images/pr-bg.jpg"
      />

      <section className="py-20 bg-[#f1f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {subservices.map((sub, idx) => {
              const Icon = sub.icon;
              return (
                <Card key={idx} className="flex flex-col justify-between h-full group">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{sub.desc}</p>
                  </div>
                  <div className="pt-6">
                    <Link
                      to={sub.path}
                      className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider group-hover:translate-x-1 transition-transform"
                    >
                      <span>Learn More</span>
                      <FaArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default International;
