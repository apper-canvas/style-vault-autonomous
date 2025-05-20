import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { getIcon } from '../utils/iconUtils';
import { toast } from 'react-toastify';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { performSearch, searchResults, isSearching } = useSearch();
  
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [filterCategory, setFilterCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 });
  const [filteredResults, setFilteredResults] = useState([]);
  
  // Icons
  const SearchIcon = getIcon('search');
  const FilterIcon = getIcon('filter');
  const LoaderIcon = getIcon('loader');
  const HeartIcon = getIcon('heart');
  const ShoppingBagIcon = getIcon('shopping-bag');
  const StarIcon = getIcon('star');
  
  // Get query param from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('q') || '';
    setQuery(searchQuery);
    
    if (searchQuery) {
      performSearch(searchQuery);
    }
  }, [location.search, performSearch]);
  
  // Update filtered results based on filters
  useEffect(() => {
    let results = [...searchResults];
    
    // Apply category filter
    if (filterCategory !== 'all') {
      results = results.filter(product => product.category === filterCategory);
    }
    
    // Apply price filter
    results = results.filter(product => {
      const price = product.salePrice || product.price;
      return price >= priceRange.min && price <= priceRange.max;
    });
    
    // Apply sorting
    if (sortBy === 'price-low') {
      results.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortBy === 'price-high') {
      results.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sortBy === 'rating') {
      results.sort((a, b) => b.averageRating - a.averageRating);
    }
    
    setFilteredResults(results);
  }, [searchResults, sortBy, filterCategory, priceRange]);
  
  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      performSearch(query);
    }
  };
  
  // Add to cart function
  const addToCart = (product) => {
    toast.success(`${product.name} added to cart!`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-surface-600 dark:text-surface-400">
          {filteredResults.length} products found for "{query}"
        </p>
        
        {/* Search form */}
        <form onSubmit={handleSearch} className="mt-4 max-w-2xl">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="form-input pl-10 pr-4 py-3 w-full"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500">
              <SearchIcon size={20} />
            </span>
            <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-primary py-1">
              Search
            </button>
          </div>
        </form>
      </div>
      
      {/* Filters and sorting */}
      <div className="bg-surface-100 dark:bg-surface-800 rounded-lg p-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FilterIcon size={20} className="text-primary" />
            <span className="font-medium">Filters:</span>
            
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="form-input py-1"
            >
              <option value="all">All Categories</option>
              <option value="Women">Women</option>
              <option value="Men">Men</option>
              <option value="Accessories">Accessories</option>
            </select>
            
            <div className="hidden md:flex items-center gap-2 ml-4">
              <span className="text-sm">Price:</span>
              <input 
                type="number" 
                min="0" 
                max={priceRange.max}
                value={priceRange.min}
                onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                className="form-input py-1 w-20"
              />
              <span>-</span>
              <input 
                type="number" 
                min={priceRange.min}
                value={priceRange.max}
                onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                className="form-input py-1 w-20"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm mr-2">Sort by:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input py-1"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Search results */}
      {isSearching ? (
        <div className="flex justify-center items-center py-12">
          <LoaderIcon size={40} className="animate-spin text-primary" />
        </div>
      ) : filteredResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResults.map(product => (
            <div key={product.id} className="card card-hover group cursor-pointer">
              <div className="relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-64 object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.target.src = `https://placehold.co/800x600/F3F4F6/6c757d?text=${encodeURIComponent(product.name)}`; }}
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => addToCart(product)}
                      className="p-3 bg-white/90 rounded-full text-surface-900 hover:bg-primary hover:text-white transition-colors"
                    >
                      <ShoppingBagIcon size={18} />
                    </button>
                    <button className="p-3 bg-white/90 rounded-full text-surface-900 hover:bg-primary hover:text-white transition-colors">
                      <HeartIcon size={18} />
                    </button>
                  </div>
                </div>
                
                {product.salePrice && (
                  <div className="absolute top-4 left-4 bg-secondary text-white text-xs font-bold px-2 py-1 rounded">
                    SALE
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <div className="flex items-center">
                    <StarIcon size={16} className="text-accent" />
                    <span className="ml-1 text-sm">{product.averageRating}</span>
                  </div>
                </div>
                
                <p className="text-surface-600 dark:text-surface-400 text-sm mb-3">{product.category} • {product.subcategory}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {product.salePrice ? (
                      <>
                        <span className="text-secondary font-semibold">${product.salePrice.toFixed(2)}</span>
                        <span className="ml-2 text-surface-500 line-through text-sm">${product.price.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="font-semibold">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="text-xs text-surface-500">
                    {product.inventory < 10 ? `Only ${product.inventory} left` : "In Stock"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl mb-4">No products found for "{query}"</p>
          <p className="text-surface-600 dark:text-surface-400 mb-6">Try adjusting your search or filter to find what you're looking for.</p>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;