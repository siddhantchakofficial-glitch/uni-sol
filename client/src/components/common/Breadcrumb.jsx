import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight, FaHome } from 'react-icons/fa';

export const Breadcrumb = ({ items = [], className = '' }) => {
  return (
    <nav className={`flex items-center space-x-2 text-xs text-slate-400 ${className}`}>
      <Link to="/" className="flex items-center gap-1 hover:text-blue-400 transition-colors">
        <FaHome className="w-3 h-3 text-slate-500" />
        <span>Home</span>
      </Link>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <FaChevronRight className="w-2.5 h-2.5 text-slate-600" />
          {item.path ? (
            <Link to={item.path} className="hover:text-blue-400 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-200 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
