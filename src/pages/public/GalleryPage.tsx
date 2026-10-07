import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, Eye } from 'lucide-react';
import { api } from '../../services/api.ts';
import { GalleryItem } from '../../types/index.ts';

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getGallery()
      .then(res => {
        if (res.gallery) setItems(res.gallery);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const categories = ['ALL', ...Array.from(new Set(items.map(i => i.category)))];
  const filtered = selectedCategory === 'ALL' ? items : items.filter(i => i.category === selectedCategory);

  return (
    <div className="space-y-16 pb-20">
      <div className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Campus Visuals
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Photo Gallery
          </h1>
          <p className="text-base text-slate-300 max-w-2xl">
            A glimpse into academic life, state-of-the-art laboratories, cultural events, sports meets, and convocation ceremonies.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Category Filter */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Photographs' : cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(n => <div key={n} className="h-64 bg-slate-100 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setActivePhoto(item)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="h-60 overflow-hidden relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-3 rounded-full bg-white/90 text-slate-900 shadow-lg">
                      <Eye className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-[10px] font-semibold text-white">
                    {item.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-1">{item.title}</h3>
                  {item.caption && <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{item.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
          >
            <div className="relative max-h-[75vh] flex items-center justify-center bg-black">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>
            <div className="p-5 text-white flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm sm:text-base">{activePhoto.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{activePhoto.caption || activePhoto.category}</p>
              </div>
              <button
                onClick={() => setActivePhoto(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
