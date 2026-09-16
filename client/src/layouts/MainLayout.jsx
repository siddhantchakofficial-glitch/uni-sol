import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import ScrollToTop from '../components/common/ScrollToTop';
import WhatsAppChat from '../components/common/WhatsAppChat';
import Toast from '../components/ui/Toast';
import ConsultationFormModal from '../components/forms/ConsultationForm';
import images from '../assets/images';

export const MainLayout = () => {
  return (
    <div className="site-shell relative min-h-screen flex flex-col text-[#262626] selection:bg-[#0470aa] selection:text-white font-poppins">
      {/* Static page-wide backdrop — fixed so it never scrolls with content.
          A dimmed site image; section bands above it are slightly translucent
          (see index.css .site-shell rules) so the backdrop stays faintly
          visible in the pale regions of every page. Admin pages use a
          separate layout and are unaffected. */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <img
          src={images.hero}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/75 to-white/90" />
      </div>

      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow pt-[104px]">
        <Outlet />
      </main>

      {/* Global Interactive Modal */}
      <ConsultationFormModal />

      {/* Toast Notification Container */}
      <Toast />

      {/* Scroll to top floating button */}
      <ScrollToTop />

      {/* WhatsApp chat shortcut */}
      <WhatsAppChat />

      {/* Footer — kept above the fixed backdrop layer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
