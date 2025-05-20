import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

// Sample product data
const initialProducts = [
  {
    id: 1,
    name: "Classic White Tee",
    description: "Essential white t-shirt made from 100% organic cotton",
    price: 29.99,
    salePrice: null,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Women",
    subcategory: "Tops",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White"],
    inventory: 45,
    tags: ["Basic", "Essential", "Cotton"],
    averageRating: 4.7,
    featured: true
  },
  {
    id: 2,
    name: "Slim Fit Jeans",
    description: "Dark wash denim jeans with a modern slim fit design",
    price: 79.99,
    salePrice: 59.99,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Men",
    subcategory: "Pants",
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["Dark Blue"],
    inventory: 23,
    tags: ["Denim", "Casual", "Slim Fit"],
    averageRating: 4.3,
    featured: true
  },
  {
    id: 3,
    name: "Oversized Wool Sweater",
    description: "Cozy oversized sweater in luxurious merino wool",
    price: 89.99,
    salePrice: null,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Women",
    subcategory: "Knitwear",
    sizes: ["S", "M", "L"],
    colors: ["Beige", "Grey", "Black"],
    inventory: 17,
    tags: ["Cozy", "Winter", "Wool"],
    averageRating: 4.9,
    featured: true
  },
  {
    id: 4,
    name: "Leather Crossbody Bag",
    description: "Handcrafted leather crossbody bag with adjustable strap",
    price: 149.99,
    salePrice: 119.99,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    subcategory: "Bags",
    sizes: ["One Size"],
    colors: ["Brown", "Black", "Tan"],
    inventory: 9,
    tags: ["Leather", "Handmade", "Luxury"],
    averageRating: 4.8,
    featured: true
  },
  {
    id: 5,
    name: "Linen Blazer",
    description: "Lightweight linen blazer perfect for summer occasions",
    price: 129.99,
    salePrice: null,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Men",
    subcategory: "Jackets",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Beige", "Navy", "Light Blue"],
    inventory: 12,
    tags: ["Linen", "Summer", "Formal"],
    averageRating: 4.5,
    featured: false
  },
  {
    id: 6,
    name: "Silk Scarf",
    description: "Elegant silk scarf with a vibrant abstract pattern",
    price: 49.99,
    salePrice: null,
    image: "https://images.unsplash.com/photo-1583292650898-7d22cd67a8e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    subcategory: "Scarves",
    sizes: ["One Size"],
    colors: ["Multi"],
    inventory: 31,
    tags: ["Silk", "Colorful", "Luxury"],
    averageRating: 4.6,
    featured: false
  },
  {
    id: 7,
    name: "Floral Maxi Dress",
    description: "Flowing maxi dress with an elegant floral print",
    price: 99.99,
    salePrice: 79.99,
    image: "https://images.unsplash.com/photo-1600153202684-ca2b2e600c5a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Women",
    subcategory: "Dresses",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Blue", "Pink"],
    inventory: 8,
    tags: ["Floral", "Summer", "Elegant"],
    averageRating: 4.7,
    featured: true
  },
  {
    id: 8,
    name: "Minimalist Watch",
    description: "Clean, modern timepiece with a genuine leather strap",
    price: 159.99,
    salePrice: null,
    image: "https://images.unsplash.com/photo-1549972574-8e3e1ed6a347?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    subcategory: "Watches",
    sizes: ["One Size"],
    colors: ["Silver/Brown", "Black/Black"],
    inventory: 14,
    tags: ["Minimalist", "Timeless", "Leather"],
    averageRating: 4.8,
    featured: true
  }
];

// Product component
const ProductCard = ({ product, addToCart }) => {
  const StarIcon = getIcon('star');
  const ShoppingBagIcon = getIcon('shopping-bag');
  const HeartIcon = getIcon('heart');
  
  return (
    <motion.div 
      className="card card-hover group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-64 object-cover object-center transition-transform duration-500 group-hover:scale-105"
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
    </motion.div>
  );
};

// Hero Section component
const HeroSection = () => {
  return (
    <section className="relative">
      <div className="h-[70vh] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
          alt="Fashion hero" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-xl">
              <motion.h1 
                className="text-white font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Summer Collection 2024
              </motion.h1>
              <motion.p 
                className="text-white/90 text-lg mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Discover the latest trends and styles for the season. Elevate your wardrobe with our curated selection of premium fashion essentials.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <a href="#featured" className="btn btn-primary px-6 py-3">Shop Now</a>
                <a href="#collection" className="btn btn-outline border-white text-white hover:bg-white/20 hover:text-white px-6 py-3">View Collection</a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Featured categories component
const CategorySection = () => {
  const categories = [
    {
      name: "Women",
      image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Men",
      image: "https://images.unsplash.com/photo-1536766820879-059fec98ec0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Accessories",
      image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    }
  ];
  
  return (
    <section className="py-16 bg-surface-100 dark:bg-surface-800/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop By Category</h2>
          <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
            Browse our curated collections and find the perfect style for every occasion.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div 
              key={index}
              className="relative rounded-xl overflow-hidden aspect-[3/4] group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-6">
                <div className="w-full">
                  <h3 className="text-white text-2xl font-bold mb-2">{category.name}</h3>
                  <div className="h-0.5 w-0 bg-white group-hover:w-24 transition-all duration-300 mb-4"></div>
                  <button className="text-white font-medium flex items-center">
                    Shop Now
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main Home component
const Home = () => {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleProducts, setVisibleProducts] = useState(8);
  
  // Add to cart functionality
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      const updatedCart = cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    toast.success(`${product.name} added to cart!`);
  };
  
  // Filter products by category
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    // Reset visible products count when changing category
    setVisibleProducts(8);
  };
  
  // Load more products
  const loadMoreProducts = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setVisibleProducts(prev => prev + 4);
      setLoading(false);
    }, 800);
  };
  
  // Filter products based on active category
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(product => product.category === activeCategory || product.subcategory === activeCategory);
  
  // Categories for filter
  const categories = ['All', 'Women', 'Men', 'Accessories'];
  
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Category Section */}
      <CategorySection />
      
      {/* Featured Products */}
      <section id="featured" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-surface-600 dark:text-surface-400">
                Discover our carefully selected products for this season
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    activeCategory === category 
                      ? 'bg-primary text-white' 
                      : 'bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-200 hover:bg-surface-300 dark:hover:bg-surface-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.slice(0, visibleProducts).map(product => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
          
          {visibleProducts < filteredProducts.length && (
            <div className="mt-12 text-center">
              <button 
                onClick={loadMoreProducts}
                className="btn btn-outline px-8 py-3"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More Products'}
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Main Feature - Shopping Cart */}
      <MainFeature addToCart={addToCart} cart={cart} setCart={setCart} />
      
      {/* Newsletter Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
            <p className="mb-8 opacity-90">
              Subscribe to our newsletter and be the first to know about new collections, 
              exclusive offers, and fashion tips.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-3 rounded-lg text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-light"
              />
              <button type="submit" className="px-6 py-3 bg-white text-primary font-medium rounded-lg hover:bg-surface-100 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;