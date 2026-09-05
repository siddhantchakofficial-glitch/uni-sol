import { FaWhatsapp } from 'react-icons/fa';
import { ENV } from '../../config/env';

export const WhatsAppChat = () => {
  const message = encodeURIComponent('Hello UniSpark Innovation, I would like to know more about your services.');

  return (
    <a
      href={`https://wa.me/${ENV.WHATSAPP_NUMBER}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with UniSpark Innovation on WhatsApp"
      title="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-green-600/30 transition-all duration-300 hover:scale-110 hover:bg-[#20bd5a] focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2"
    >
      <FaWhatsapp className="h-8 w-8" aria-hidden="true" />
    </a>
  );
};

export default WhatsAppChat;
