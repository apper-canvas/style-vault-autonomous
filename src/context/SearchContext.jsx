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

    }
    
    setIsSearching(true);
    
    // Use the product service to search
    searchProducts(query)
      .then(apiResults => {
        // Process the search results
        const normalizedQuery = query.toLowerCase();
        
        const processedResults = apiResults.filter(product => {
          const nameMatch = product.Name.toLowerCase().includes(normalizedQuery);
          const descriptionMatch = product.description && product.description.toLowerCase().includes(normalizedQuery);
          const categoryMatch = product.category && product.category.toLowerCase().includes(normalizedQuery);
          const tagsMatch = product.Tags && product.Tags.some(tag => 
            tag.toLowerCase().includes(normalizedQuery)
          );
          
          return nameMatch || descriptionMatch || categoryMatch || tagsMatch;
        });
        
        setSearchResults(processedResults);
        setIsSearching(false);
      })
      .catch(error => {
        console.error('Search error:', error);
        toast.error('Search failed. Please try again.');
        setIsSearching(false);
      });
      setIsSearching(false);
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