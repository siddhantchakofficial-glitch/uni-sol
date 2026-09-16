import React, { useState } from 'react';
import { Package, Search, Filter, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { productsData } from '../data/productsData';
import CtaSection from '../components/CtaSection';

export default function ProductsPage({ onOpenEnquiry }) {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(productsData.map((p) => p.category))];

  const filteredProducts = productsData.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Banner */}
      <section className="relative py-20 bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950 border border-blue-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Package className="w-4 h-4 text-cyan-400" />
            <span>SECURITY & NETWORKING HARDWARE CATALOG</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            {i18n.language === 'hi' ? t('pages.productsPage.title') : 'Our Premium Hardware Ecosystem'}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            {i18n.language === 'hi' ? t('pages.productsPage.subtitle') : 'Deploy industry-certified physical security equipment, surveillance units, and network components engineered for zero-latency operations and resilient enterprise workloads.'}
          </p>
        </div>
      </section>

      {/* Filter and Catalog Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
          
          {/* Search Box */}
          <div className="relative flex-grow max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search hardware (e.g. CCTV, Access Control, Routers)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 transition text-sm"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-glow'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-slate-900/50 rounded-3xl border border-slate-800">
            <Package className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Hardware Found</h3>
            <p className="text-xs text-slate-400">Try adjusting your search criteria or category filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-lg group"
              >
                <div className="space-y-4">
                  {/* Image */}
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center p-2">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover rounded-xl transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      {product.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1 group-hover:text-cyan-300 transition">
                      {product.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {product.desc}
                  </p>

                  <ul className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    {product.specs.map((spec, idx) => (
                      <li key={idx} className="text-[11px] text-slate-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => onOpenEnquiry(`Quotation for ${product.title}`)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-glow"
                  >
                    <span>{t('nav.enquireNow')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </section>

      <CtaSection onOpenEnquiry={onOpenEnquiry} />
    </div>
  );
}
