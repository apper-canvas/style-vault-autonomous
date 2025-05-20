import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { searchProducts } from '../services/productService';
import { toast } from 'react-toastify';

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Function to perform search
  const performSearch = useCallback((query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;

    // Use the product service to search
    searchProducts(query)
      .then(results => {
      
      const results = initialProducts.filter(product => {
      })
      .catch(error => {
        console.error('Search error:', error);
        toast.error('Search failed. Please try again.');
        setIsSearching(false);
      });
        const descriptionMatch = product.description.toLowerCase().includes(normalizedQuery);
        const categoryMatch = product.category.toLowerCase().includes(normalizedQuery);
        const subcategoryMatch = product.subcategory.toLowerCase().includes(normalizedQuery);
        const tagsMatch = product.tags && product.tags.some(tag => 
          tag.toLowerCase().includes(normalizedQuery)
        );
        
        return nameMatch || descriptionMatch || categoryMatch || subcategoryMatch || tagsMatch;
      });
      
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  }, []);
  
  // Debounced search
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);
    
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, performSearch]);
  
  // Method to clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };
  
  const value = {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    showResults,
    setShowResults,
    clearSearch,
    performSearch
  };
  
  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;