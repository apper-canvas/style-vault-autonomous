import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getIcon } from '../utils/iconUtils';
import { toast } from 'react-toastify';

// Sample women's products data
const womenProducts = [
  {
    id: 1,
    name: "Elegant Floral Summer Dress",
    category: "clothing",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviews: 127,
    description: "A beautiful floral summer dress with a flowy silhouette, perfect for warm days and special occasions.",
    colors: ["Pink", "Blue", "White"],
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 2,
    name: "High-Waisted Slim Fit Jeans",
    category: "clothing",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    reviews: 214,
    description: "Classic high-waisted jeans with a slim fit design, offering both comfort and style for everyday wear.",
    colors: ["Blue", "Black", "Light Blue"],
    sizes: ["24", "25", "26", "27", "28", "29", "30", "31", "32"]
  },
  {
    id: 3,
    name: "Oversized Knit Sweater",
    category: "clothing",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    reviews: 89,
    description: "A cozy oversized knit sweater that provides warmth and comfort without sacrificing style.",
    colors: ["Cream", "Gray", "Burgundy"],
    sizes: ["S", "M", "L"]
  },
  {
    id: 4,
    name: "Tailored Blazer",
    category: "clothing",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviews: 76,
    description: "A sophisticated tailored blazer that adds a touch of professionalism to any outfit.",
    colors: ["Black", "Navy", "Beige"],
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 5,
    name: "Vintage Leather Watch",
    category: "watches",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviews: 58,
    description: "A timeless vintage-inspired leather watch that adds sophistication to any outfit.",
    colors: ["Brown", "Black"],
    features: ["Water Resistant", "Genuine Leather"]
  },
  {
    id: 6,
    name: "Minimalist Gold Watch",
    category: "watches",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1609587312208-cea54be969e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviews: 92,
    description: "An elegant minimalist gold watch with a sleek design, perfect for everyday wear.",
    colors: ["Gold", "Rose Gold", "Silver"],
    features: ["Sapphire Glass", "Japanese Movement"]
  },
  {
    id: 7,
    name: "Silk Button-Up Blouse",
    category: "clothing",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1603217192634-61068e4d4bf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.4,
    reviews: 103,
    description: "A luxurious silk button-up blouse that transitions perfectly from office to evening events.",
    colors: ["White", "Black", "Blush Pink"],
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 8,
    name: "Digital Smart Watch",
    category: "watches",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1617043786394-ae546b6c4b04?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviews: 217,
    description: "A feature-packed smart watch that helps you stay connected and track your fitness goals.",
    colors: ["Black", "White", "Pink"],
    features: ["Heart Rate Monitor", "Sleep Tracking", "Water Resistant"]
  }
];

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
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [sortBy, setSortBy] = useState('recommended');
  
  const FilterIcon = getIcon('filter');
  const ArrowLeftIcon = getIcon('arrow-left');
  
  // Initialize products on component mount
  useEffect(() => {
    setProducts(womenProducts);
    setFilteredProducts(womenProducts);
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
    // Here you would typically dispatch to a cart state
    console.log('Added to cart:', product);
    // Toast notification handled in the ProductCard component
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WomenProducts;