import React, { useState } from 'react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { leadService } from '../../services/leadService';
import { useSiteContext } from '../../context/SiteContext';
import { validateEmail, validateRequired, validatePhone } from '../../utils/validation';

export const ContactForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useSiteContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateRequired(formData.name)) newErrors.name = 'Full name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Valid email is required';
    if (!validatePhone(formData.phone)) newErrors.phone = 'Valid phone number is required';
    if (!validateRequired(formData.service)) newErrors.service = 'Please select a service interest';
    if (!validateRequired(formData.message)) newErrors.message = 'Please provide details of your requirement';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await leadService.submitContactForm(formData);
      showToast(res.message, 'success');
      setFormData({ name: '', email: '', phone: '', company: '', service: '', message: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      showToast('Failed to submit form. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name *"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />
        <Input
          label="Work Email *"
          type="email"
          name="email"
          placeholder="john@company.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Phone Number *"
          name="phone"
          placeholder="+91 98765 43210"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
        />
        <Input
          label="Company Name"
          name="company"
          placeholder="Enterprise Pvt Ltd"
          value={formData.company}
          onChange={handleChange}
        />
      </div>

      <Select
        label="Service Interest *"
        name="service"
        value={formData.service}
        onChange={handleChange}
        error={errors.service}
        placeholder="Select Primary Service Capability"
        options={[
          'CCTV & AI Video Analytics',
          'Biometric & Physical Access Control',
          'Fire Alarm & Life Safety Systems',
          'Perimeter Intrusion Detection',
          'System Integration & Command Center (PSIM)',
          'Annual Maintenance Contracts (AMC/PMC)',
          'International Talent & IT Consulting',
        ]}
      />

      <Textarea
        label="Project Scope / Details *"
        name="message"
        rows={4}
        placeholder="Briefly describe your site locations, timeline, or technical requirements..."
        value={formData.message}
        onChange={handleChange}
        error={errors.message}
      />

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
        {loading ? 'Submitting Request...' : 'Submit Consultation Request'}
      </Button>
    </form>
  );
};

export default ContactForm;
