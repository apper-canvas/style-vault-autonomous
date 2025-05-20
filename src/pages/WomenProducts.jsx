import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getIcon } from '../utils/iconUtils';
import { toast } from 'react-toastify';
import { fetchProducts } from '../services/productService';
import { addToCart } from '../services/cartService';
import { addToWishlist, isInWishlist } from '../services/wishlistService';

const ProductCard = ({ product, onAddToCart }) => {
  const StarIcon = getIcon('star');
  const ShoppingBagIcon = getIcon('shopping-bag');
  const HeartIcon = getIcon('heart');
  
  return (
    <motion.div 
      className="card card-hover overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="relative h-64 overflow-hidden group">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = `https://placehold.co/800x600/F3F4F6/6c757d?text=${encodeURIComponent(product.name)}`; }}
        />
        <div className="absolute top-0 right-0 p-3">
          <button className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-full p-2 text-surface-700 dark:text-surface-300 hover:text-primary transition-colors">
            <HeartIcon size={20} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            className="w-full btn btn-primary flex items-center justify-center"
            onClick={() => {
              onAddToCart(product);
              toast.success(`${product.name} added to cart!`);
            }}
          >
            <ShoppingBagIcon size={18} className="mr-2" /> Add to Cart
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between mb-1">
          <p className="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wide font-medium">
            {product.category}
          </p>
          <div className="flex items-center text-xs">
            <StarIcon size={14} className="text-yellow-500 mr-1" />
            <span>{product.rating} ({product.reviews})</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-1 line-clamp-1">{product.name}</h3>
        <p className="font-medium text-primary">${product.price.toFixed(2)}</p>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {product.colors && product.colors.map((color, idx) => (
            <span key={idx} className="text-xs px-2 py-1 bg-surface-100 dark:bg-surface-800 rounded-full">
              {color}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const WomenProducts = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [sortBy, setSortBy] = useState('recommended');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const FilterIcon = getIcon('filter');
  const ArrowLeftIcon = getIcon('arrow-left');
  
  useEffect(() => {
    setLoading(true);
    // Fetch women's products
    fetchProducts({ category: 'Women' })
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
        setLoading(false);
        toast.error('Failed to load products');
      });
  }, []);
  
  // When sort or filter changes, update filtered products
  useEffect(() => {
    if (products.length === 0) return;
  }, []);
  
  // Handle filtering and sorting
  useEffect(() => {
    let results = [...products];
    
    // Apply category filter
    if (activeCategory !== 'all') {
      results = results.filter(product => product.category === activeCategory);
    }
    
    // Apply price range filter
    results = results.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply sorting
    if (sortBy === 'price-low-high') {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      results.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    }
    
    setFilteredProducts(results);
  }, [activeCategory, priceRange, sortBy, products]);
  
  const handleAddToCart = (product) => {
    // Add to cart
    if (isAuthenticated && user) {
      addToCart(user.id, product.Id, 1)
        .then(() => {
          toast.success(`${product.Name} added to your cart!`);
        })
        .catch(error => {
          console.error('Error adding to cart:', error);
          toast.error('Could not add to cart. Please try again.');
        });
    } else {
      // Just show the toast for anonymous users
      toast.success(`${product.Name} added to cart!`);
      // Optionally redirect to login
      setTimeout(() => {
        navigate('/login?redirect=/women');
      }, 1500);
    }
  };
  
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-surface-600 hover:text-primary mb-6"
        >
          <ArrowLeftIcon className="mr-2 h-5 w-5" /> Back to Home
        </button>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Women's Collection</h1>
          <p className="text-surface-600 dark:text-surface-400">
            Discover our latest women's clothing and watches, designed for style and comfort.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="card p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-lg">Filters</h3>
                <FilterIcon size={20} className="text-surface-500" />
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium mb-3">Categories</h4>
                <div className="space-y-2">
                  <button 
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeCategory === 'all' ? 'bg-primary/10 text-primary' : 'hover:bg-surface-100 dark:hover:bg-surface-800'}`}
                    onClick={() => setActiveCategory('all')}
                  >
                    All Products
                  </button>
                  <button 
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeCategory === 'clothing' ? 'bg-primary/10 text-primary' : 'hover:bg-surface-100 dark:hover:bg-surface-800'}`}
                    onClick={() => setActiveCategory('clothing')}
                  >
                    Clothing
                  </button>
                  <button 
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeCategory === 'watches' ? 'bg-primary/10 text-primary' : 'hover:bg-surface-100 dark:hover:bg-surface-800'}`}
                    onClick={() => setActiveCategory('watches')}
                  >
                    Watches
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="300"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-sm text-surface-500">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg my-6">
                <p>{error}</p>
                <button
                  onClick={() => {
                    setLoading(true);
                    setError(null);
                    fetchProducts({ category: 'Women' })
                      .then(data => {
                        setProducts(data);
                        setFilteredProducts(data);
                        setLoading(false);
                      })
                      .catch(err => {
                        setError('Failed to load products. Please try again.');
                        setLoading(false);
                      });
                  }}
                  className="text-sm underline mt-2"
                >
                  Try again
                </button>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.Id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl mb-4">No products found</p>
                <p className="text-surface-600 dark:text-surface-400 mb-6">Try adjusting your filters to find what you're looking for.</p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setPriceRange([0, 300]);
                    setSortBy('recommended');
                  }}
                  className="btn btn-primary"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WomenProducts;