import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { getIcon } from '../utils/iconUtils';

const SearchBar = ({ className = '', onSearchComplete = () => {} }) => {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const { 
    searchQuery, 
    setSearchQuery, 
    searchResults, 
    isSearching, 
    showResults,
    setShowResults,
    clearSearch 
  } = useSearch();
  
  const SearchIcon = getIcon('search');
  const LoaderIcon = getIcon('loader');
  const XIcon = getIcon('x');
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowResults]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim()) {
      setShowResults(true);
    }
  };
  
  // View full search results
  const viewAllResults = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
      onSearchComplete();
    }
  };
  
  // Navigate to product
  const goToProduct = (productId) => {
    navigate(`/product/${productId}`);
    setShowResults(false);
    onSearchComplete();
  };
  
  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => searchQuery.trim() && setShowResults(true)}
          className="form-input pl-10 pr-10 w-full"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500">
          <SearchIcon size={18} />
        </div>
        {searchQuery && (
          <button 
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-500 hover:text-surface-700"
          >
            <XIcon size={18} />
          </button>
        )}
      </div>
      
      {showResults && (
        <div className="absolute z-20 mt-1 w-full bg-white dark:bg-surface-800 shadow-lg rounded-lg overflow-hidden border border-surface-200 dark:border-surface-700">
          {isSearching ? (
            <div className="p-4 text-center text-surface-500">
              <LoaderIcon size={24} className="mx-auto animate-spin" />
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              <div className="max-h-80 overflow-y-auto">
                {searchResults.slice(0, 5).map(product => (
                  <div key={product.id} onClick={() => goToProduct(product.id)} className="p-3 hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-surface-500">{product.category} • ${(product.salePrice || product.price).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div onClick={viewAllResults} className="text-center p-2 bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 cursor-pointer text-primary font-medium">
                View all {searchResults.length} results
              </div>
            </div>
          ) : searchQuery.trim() && <div className="p-4 text-center text-surface-500">No products found</div>}
        </div>
      )}
    </div>
  );
};

export default SearchBar;