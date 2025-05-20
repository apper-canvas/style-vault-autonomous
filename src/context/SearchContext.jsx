import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { initialProducts } from '../data/products';

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
    }
    
    setIsSearching(true);
    
    // Using setTimeout to simulate API call
    setTimeout(() => {
      const normalizedQuery = query.toLowerCase().trim();
      
      const results = initialProducts.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(normalizedQuery);
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