import { useState, useEffect, useRef, createContext } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store/userSlice';

// Create authentication context
export const AuthContext = createContext(null);
import { getIcon } from './utils/iconUtils';
import Home from './pages/Home';
import Collections from './pages/Collections';
import WomenProducts from './pages/WomenProducts';
import NotFound from './pages/NotFound';
import SearchResults from './pages/SearchResults';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';
import SearchBar from './components/SearchBar';
import { SearchProvider } from './context/SearchContext';
import 'react-toastify/dist/ReactToastify.css';

// Header component
const Header = ({ toggleDarkMode, darkMode }) => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get user data from Redux
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { logout } = useState(null);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  // Get icons as components
  const ShoppingBagIcon = getIcon('shopping-bag');
  const UserIcon = getIcon('user');
  const MoonIcon = getIcon('moon');
  const SunIcon = getIcon('sun');
  const SearchIcon = getIcon('search');
  const XIcon = getIcon('x');
  const MenuIcon = getIcon('menu');
  const HeartIcon = getIcon('heart');
  const SettingsIcon = getIcon('settings');
  const LogOutIcon = getIcon('log-out');
  const PhoneIcon = getIcon('phone');
  
  const [cartItemCount, setCartItemCount] = useState(0);

  // Fetch cart data when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    
    async function fetchCartData() {
      try {
        setIsLoading(true);
        const { ApperClient } = window.ApperSDK;
        const apperClient = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });
        
        // Fetch cart data for the authenticated user
        const response = await apperClient.fetchRecords('cart', {
          where: [{ fieldName: 'user', operator: 'ExactMatch', values: [user.id] }]
        });
        
        if (response && response.data && response.data.length > 0) {
          // Get cart items for the user's cart
          const cartId = response.data[0].Id;
          const cartItemsResponse = await apperClient.fetchRecords('cart_item1', {
            where: [{ fieldName: 'cart', operator: 'ExactMatch', values: [cartId] }]
          });
          
          if (cartItemsResponse && cartItemsResponse.data) {
            setCart(cartItemsResponse.data);
            setCartItemCount(cartItemsResponse.data.reduce((total, item) => total + item.quantity, 0));
          }
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCartData();
  }, [isAuthenticated, user]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileRef]);
  
  
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="text-2xl font-bold flex items-center gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              width="40"
              height="40"
              className="text-primary"
            >
              <rect width="100" height="100" rx="15" fill="currentColor" fillOpacity="0.1" />
              <path d="M25,30 L75,30 C80,30 85,35 85,40 L85,70 C85,75 80,80 75,80 L25,80 C20,80 15,75 15,70 L15,40 C15,35 20,30 25,30 Z" fill="none" stroke="currentColor" strokeWidth="4" />
              <circle cx="50" cy="38" r="4" fill="currentColor" />
              <path d="M50,38 L50,45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M30,45 L70,45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M35,45 L40,75 M65,45 L60,75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M40,75 L60,75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <span className="text-surface-800 dark:text-surface-100">
              StyleVault
            </span>
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
              <div className="relative" ref={profileRef}>
                <button 
                  className="p-2 text-surface-700 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light rounded-full relative"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <UserIcon size={20} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-primary to-secondary rounded-full border border-white dark:border-surface-800"></div>
                </button>
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-lg shadow-lg py-1 z-50 border border-surface-200 dark:border-surface-700">
                    <div className="px-4 py-2 border-b border-surface-200 dark:border-surface-700">
                      <p className="text-sm font-medium text-surface-900 dark:text-white">{isAuthenticated ? `${user.firstName || ''} ${user.lastName || ''}` : 'My Account'}</p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">{isAuthenticated ? user.email : 'Not logged in'}</p>
                    </div>
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700">
                      <SettingsIcon size={16} className="mr-2" />
                      Settings
                    </a>
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700">
                      <PhoneIcon size={16} className="mr-2" />
                      Contact
                    </a>
                    {isAuthenticated ? (
                      <>
                        <div className="border-t border-surface-200 dark:border-surface-700 my-1"></div>
                        <button 
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-surface-100 dark:hover:bg-surface-700"
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            logout();
                          }}
                        >
                          <LogOutIcon size={16} className="mr-2" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="border-t border-surface-200 dark:border-surface-700 my-1"></div>
                        <button 
                          className="flex w-full items-center px-4 py-2 text-sm text-primary dark:text-primary-light hover:bg-surface-100 dark:hover:bg-surface-700"
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            navigate('/login');
                          }}
                        >
                      <LogOutIcon size={16} className="mr-2" />
                          Login
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              
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
              {isMobileMenuOpen ? (
                <XIcon size={24} />
              ) : <MenuIcon size={24} />}
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
            <div className="flex items-center gap-2 mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                width="32"
                height="32"
                className="text-primary"
              >
                <rect width="100" height="100" rx="15" fill="currentColor" fillOpacity="0.1" />
                <path d="M25,30 L75,30 C80,30 85,35 85,40 L85,70 C85,75 80,80 75,80 L25,80 C20,80 15,75 15,70 L15,40 C15,35 20,30 25,30 Z" fill="none" stroke="currentColor" strokeWidth="4" />
                <circle cx="50" cy="38" r="4" fill="currentColor" />
                <path d="M50,38 L50,45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <path d="M30,45 L70,45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <path d="M35,45 L40,75 M65,45 L60,75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <path d="M40,75 L60,75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <h3 className="text-xl font-bold">StyleVault</h3>
            </div>
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

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Check for user preference
    const isDark = localStorage.getItem('darkMode') === 'true' || 
                  (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);
  
  // Initialize ApperUI for authentication 
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
            '/callback') || currentPath.includes('/error');
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
               ? `/signup?redirect=${currentPath}`
               : currentPath.includes('/login')
               ? `/login?redirect=${currentPath}`
               : '/login');
          } else if (redirectPath) {
            if (
              ![
                'error',
                'signup',
                'login',
                'callback'
              ].some((path) => currentPath.includes(path)))
              navigate(`/login?redirect=${redirectPath}`);
            else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
  }, [dispatch, navigate]);

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };
  
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
  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4 mx-auto"></div>
        <p className="text-lg text-surface-600 dark:text-surface-400">Initializing application...</p>
      </div>
    </div>;
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="flex flex-col min-h-screen">
        <SearchProvider>
          <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/women" element={<WomenProducts />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/callback" element={<Callback />} />
              <Route path="/error" element={<ErrorPage />} />
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
    </AuthContext.Provider>
  );