import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import CTASection from '../../components/common/CTASection';
import { capabilityService } from '../../services/capabilityService';
import { useSiteContext } from '../../context/SiteContext';
import { FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';
import images from '../../assets/images';

export const CapabilityDetails = () => {
  const { slug } = useParams();
  const [capability, setCapability] = useState(null);
  const { setConsultationModalOpen } = useSiteContext();

  useEffect(() => {
    capabilityService.getBySlug(slug).then((res) => setCapability(res));
  }, [slug]);

  if (!capability) return null;

  return (
    <div>
      <PageHero
        badge={capability.badge || 'Capability Detail'}
        title={capability.title}
        description={capability.desc}
        breadcrumbs={[
          { label: 'Capabilities', path: '/capabilities' },
          { label: capability.title },
        ]}
        image={images.sol1}
      />

      <section className="py-20 bg-[#f1f9ff] border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <SectionHeader
                badge="Capability Overview"
                title={`Enterprise Architecture for ${capability.title}`}
                center={false}
              />
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {capability.desc} Our solutions are custom-engineered for maximum resilience, seamless multi-site connectivity, and 99.9% uptime compliance.
              </p>

              <div className="pt-4 space-y-3">
                <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                  Key Deliverables & Technical Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {capability.features?.map((feat, idx) => (
                    <div
                      key={idx}
                      className="bg-[#f1f9ff]/60 border border-slate-800 p-3 rounded-lg flex items-center gap-2.5"
                    >
                      <FaCheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="text-xs font-semibold text-slate-200">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <Card className="p-8 space-y-6 bg-[#f1f9ff]/80 border-blue-500/30">
                <h3 className="text-xl font-bold text-white">Need a Customized Solution?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Our senior solution architects provide complete site evaluation, BOQ generation, and CAD coverage design.
                </p>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  icon={FaCalendarAlt}
                  onClick={() => setConsultationModalOpen(true)}
                >
                  Schedule Solution Audit
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default CapabilityDetails;
