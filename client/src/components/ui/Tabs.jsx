import React, { useState } from 'react';
import { clsx } from 'clsx';

export const Tabs = ({ tabs = [], onChange }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
    if (onChange) onChange(index);
  };

  return (
    <div className="w-full">
      <div className="flex border-b border-slate-800 space-x-4">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => handleTabClick(idx)}
            className={clsx(
              'py-3 px-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer',
              activeTab === idx
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="py-6">{tabs[activeTab]?.content}</div>
    </div>
  );
};

export default Tabs;
