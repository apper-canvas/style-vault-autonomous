import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { getIcon } from './utils/iconUtils';
import Home from './pages/Home';
import Collections from './pages/Collections';
import WomenProducts from './pages/WomenProducts';
import NotFound from './pages/NotFound';
import SearchResults from './pages/SearchResults';
import SearchBar from './components/SearchBar';
import { SearchProvider } from './context/SearchContext';

// Header component
const Header = ({ toggleDarkMode, darkMode }) => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  
  // Get icons as components
  const ShoppingBagIcon = getIcon('shopping-bag');
  const UserIcon = getIcon('user');
  const MoonIcon = getIcon('moon');
  const SunIcon = getIcon('sun');
  const SearchIcon = getIcon('search');
  const HeartIcon = getIcon('heart');
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
            <span className="text-3xl">
              <ShoppingBagIcon size={28} className="text-primary" />
            </span>
            <span>StyleVault</span>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/women" className="text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light font-medium">Women</a>
            <a href="#" className="text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light font-medium">Men</a>
            <a href="#" className="text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light font-medium">Accessories</a>
            <a href="#" className="text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light font-medium">New Arrivals</a>
            <a href="#" className="text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light font-medium">Sale</a>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center">
            {/* Search for desktop */}
            <div className="hidden md:block mr-4 w-64">
              <SearchBar />
            </div>
            
            {/* Search icon for mobile - expands search on click */}
            <button 
              className="md:hidden p-2 text-surface-700 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light rounded-full"
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            >
              <SearchIcon size={20} />
            </button>

            {/* Other action buttons with proper spacing */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-surface-700 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light rounded-full">
              <UserIcon size={20} />
            </button>
            
            <button className="p-2 text-surface-700 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light rounded-full">
              <HeartIcon size={20} />
            </button>

            <button 
              onClick={toggleDarkMode} 
              className="p-2 text-surface-700 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light rounded-full"
            >
              {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
            </button>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-surface-700 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light rounded-full relative"
            >
              <ShoppingBagIcon size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-surface-700 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light rounded-full"
            >
              {isMobileMenuOpen 
                ? <>{getIcon('x')({ size: 24 })}</>
                : <>{getIcon('menu')({ size: 24 })}</>}
            </button>
          </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-surface-200 dark:border-surface-800 mt-3">
            <nav className="flex flex-col space-y-4">
              <a href="/women" className="text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light font-medium">Women</a>
              <a href="#" className="text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light font-medium">Men</a>
              <a href="#" className="text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light font-medium">Accessories</a>
              <a href="#" className="text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light font-medium">New Arrivals</a>
              <a href="#" className="text-surface-800 dark:text-surface-100 hover:text-primary dark:hover:text-primary-light font-medium">Sale</a>
            </nav>
          </div>
        )}
        
        {/* Mobile expanded search */}
        {isSearchExpanded && (
          <div className="md:hidden pt-3 pb-2">
            <SearchBar 
              onSearchComplete={() => setIsSearchExpanded(false)}
            />
          </div>
        )}
      </div>
    </header>
  );
};

// Footer component
const Footer = () => {
  const FacebookIcon = getIcon('facebook');
  const InstagramIcon = getIcon('instagram');
  const TwitterIcon = getIcon('twitter');
  const YoutubeIcon = getIcon('youtube');
  
  return (
    <footer className="bg-surface-900 text-surface-100 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">StyleVault</h3>
            <p className="text-surface-300 mb-4">Your destination for premium fashion and style.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-surface-300 hover:text-white transition-colors">
                <FacebookIcon size={20} />
              </a>
              <a href="#" className="text-surface-300 hover:text-white transition-colors">
                <InstagramIcon size={20} />
              </a>
              <a href="#" className="text-surface-300 hover:text-white transition-colors">
                <TwitterIcon size={20} />
              </a>
              <a href="#" className="text-surface-300 hover:text-white transition-colors">
                <YoutubeIcon size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-surface-300">
              <li><a href="/women" className="hover:text-white transition-colors">Women</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Men</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accessories</a></li>
              <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sale</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-surface-300">
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-surface-300 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-surface-800 border border-surface-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-surface-800 mt-10 pt-6 text-center text-surface-400 text-sm">
          <p>&copy; {new Date().getFullYear()} StyleVault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    // Check for user preference
    const isDark = localStorage.getItem('darkMode') === 'true' || 
                  (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);
  
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <SearchProvider>
        <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/women" element={<WomenProducts />} />
            <Route path="/search" element={<SearchResults />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <Footer />
      
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />
      </SearchProvider>
    </div>
  );
}

export default App;