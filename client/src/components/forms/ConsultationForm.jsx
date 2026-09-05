import React from 'react';
import Dialog from '../ui/Dialog';
import ContactForm from './ContactForm';
import { useSiteContext } from '../../context/SiteContext';

export const ConsultationFormModal = () => {
  const { consultationModalOpen, setConsultationModalOpen } = useSiteContext();

  return (
    <Dialog
      isOpen={consultationModalOpen}
      onClose={() => setConsultationModalOpen(false)}
      title="Schedule Enterprise Consultation"
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-400">
          Connect with UniSpark Innovation's principal solution architects for a customized project evaluation.
        </p>
        <ContactForm onSuccess={() => setConsultationModalOpen(false)} />
      </div>
    </Dialog>
  );
};

export default ConsultationFormModal;
