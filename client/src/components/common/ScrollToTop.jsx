import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaChevronUp } from 'react-icons/fa';

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-24 right-6 z-40 p-3.5 rounded-xl bg-blue-600/90 text-white shadow-xl shadow-blue-600/30 hover:bg-blue-500 hover:scale-110 transition-all duration-300 border border-blue-400/30 cursor-pointer"
    >
      <FaChevronUp className="w-4 h-4" />
    </button>
  );
};

export default ScrollToTop;
