import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import ScrollToTop from '../components/common/ScrollToTop';
import WhatsAppChat from '../components/common/WhatsAppChat';
import Toast from '../components/ui/Toast';
import ConsultationFormModal from '../components/forms/ConsultationForm';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#262626] selection:bg-[#0470aa] selection:text-white font-poppins">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow pt-[104px]">
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
