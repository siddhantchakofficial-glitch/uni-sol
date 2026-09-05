import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';

export const NavDropdown = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative group py-2"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        to={item.path}
        className="flex items-center gap-1.5 text-sm font-medium text-[#000000] hover:text-[#0470aa] transition-colors py-1"
      >
        <span>{item.name}</span>
        <FaChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${
          isOpen ? 'rotate-180 text-[#0470aa]' : 'text-gray-400'
        }`} />
      </Link>

      {isOpen && (
        <div className="absolute top-full left-0 w-80 bg-white border border-gray-100 rounded-xl p-2 shadow-2xl z-50 animate-fade-in space-y-1">
          {item.dropdown.map((sub, idx) => (
            <Link
              key={idx}
              to={sub.path}
              className="block p-2.5 rounded-lg hover:bg-[#f4f8fb] transition-colors group/sub"
            >
              <div className="text-sm font-semibold text-[#000000] group-hover/sub:text-[#0470aa]">
                {sub.name}
              </div>
              {sub.desc && (
                <div className="text-xs text-[#6e6e6e] line-clamp-1 mt-0.5">
                  {sub.desc}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavDropdown;
