import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/UIFeedback';
import { fetchProducts } from '../services/api';

const CATEGORIES = ['All', 'Men', 'Kids', 'Shoes', 'Accessories'];
const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' }
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All';
  const currentSort = searchParams.get('sort') || 'featured';
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchProducts({
          category: currentCategory,
          sort: currentSort,
          search: searchQuery
        });
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentCategory, currentSort, searchQuery]);

  const handleCategoryChange = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    setSearchParams(params);
  };

  const handleSortChange = (sort) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sort);
    setSearchParams(params);
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title & Controls Header */}
      <div className="border-b border-black/10 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#FF5500] font-bold">Catalog</span>
          <h1 className="text-3xl sm:text-4xl font-light uppercase tracking-tight text-black">
            {searchQuery ? `Results for "${searchQuery}"` : currentCategory === 'All' ? 'Complete Collection' : `${currentCategory} Collection`}
          </h1>
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="mt-2 text-xs uppercase tracking-wider font-semibold text-black/60 hover:text-black flex items-center gap-1"
            >
              <X size={14} /> Clear Search Filter
            </button>
          )}
        </div>

        {/* Desktop Category Filter & Sorting */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="hidden md:flex items-center gap-1 bg-black/5 p-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 text-xs uppercase font-semibold tracking-wider transition-colors ${
                  currentCategory === cat || (cat === 'All' && !searchParams.get('category'))
                    ? 'bg-black text-white'
                    : 'text-black/70 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-black/60 hidden sm:inline">Sort:</span>
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-transparent border border-black/20 text-xs font-semibold uppercase tracking-wider px-3 py-2 focus:outline-none focus:border-[#FF5500]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-3 py-2 border border-black/20 text-xs uppercase font-semibold tracking-wider"
          >
            <SlidersHorizontal size={14} />
            <span>Categories</span>
          </button>
        </div>
      </div>

      {/* Mobile Category Sheet */}
      {mobileFilterOpen && (
        <div className="md:hidden mb-6 p-4 bg-black/5 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                handleCategoryChange(cat);
                setMobileFilterOpen(false);
              }}
              className={`px-3 py-1.5 text-xs uppercase font-semibold tracking-wider ${
                currentCategory === cat || (cat === 'All' && !searchParams.get('category'))
                  ? 'bg-black text-white'
                  : 'bg-white text-black border border-black/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Products Grid or Empty State */}
      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : products.length === 0 ? (
        <div className="py-24 text-center space-y-4">
          <p className="text-lg font-light text-black/60 uppercase tracking-widest">
            No products match the selected filters.
          </p>
          <button
            onClick={() => {
              setSearchParams({});
            }}
            className="px-6 py-2.5 bg-black text-white text-xs uppercase font-bold tracking-widest hover:bg-[#FF5500] transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
