import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../../utils/constants';
import NavDropdown from './NavDropdown';

export const DesktopNav = () => {
  const location = useLocation();

  return (
    <nav className="hidden lg:flex items-center space-x-7">
      {NAV_LINKS.map((item, idx) => {
        if (item.dropdown) {
          return <NavDropdown key={idx} item={item} />;
        }

        const isActive = location.pathname === item.path;

        return (
          <Link
            key={idx}
            to={item.path}
            className={`text-sm font-medium transition-colors py-2 relative ${
              isActive
                ? 'text-[#0470aa] font-semibold'
                : 'text-[#000000] hover:text-[#0470aa]'
            }`}
          >
            {item.name}
            {isActive && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0470aa] rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default DesktopNav;
