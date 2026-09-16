import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../../utils/constants';
import NavDropdown from './NavDropdown';
import { useSiteContext } from '../../context/SiteContext';

/*
 * Desktop navigation — CMS-driven via the existing menus API
 * (menus.header items, including `children` dropdowns). Falls back to the
 * built-in NAV_LINKS when the API returns nothing, so the navbar renders
 * identically out of the box.
 */
export const DesktopNav = () => {
  const location = useLocation();
  const { menus } = useSiteContext();

  // Map CMS menu items (Menu model shape: label/url/children) onto the
  // nav-item shape the existing components already consume.
  const cmsItems = (Array.isArray(menus?.header) && menus.header.length > 0
    ? menus.header
        .filter((m) => m && m.label && m.visible !== false && m.label.trim().toLowerCase() !== 'contact' && m.url !== '/contact')
        .map((m) => {
          const fallbackDropdown = NAV_LINKS.find(
            (n) => n.name?.toLowerCase() === m.label?.toLowerCase() || n.path === m.url
          )?.dropdown;
          return {
            name: m.label,
            path: m.url || '#',
            dropdown: Array.isArray(m.children) && m.children.length > 0
              ? m.children.map((c) => ({ name: c.label, path: c.url, desc: c.desc }))
              : fallbackDropdown,
          };
        })
    : NAV_LINKS
  ).filter((item) => item && item.name?.trim().toLowerCase() !== 'contact' && item.path !== '/contact');

  return (
    <nav className="hidden lg:flex items-center space-x-7">
      {cmsItems.map((item, idx) => {
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
