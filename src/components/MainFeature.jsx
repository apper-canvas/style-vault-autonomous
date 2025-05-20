import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

const MainFeature = ({ cart = [], setCart = () => {}, addToCart = () => {} }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvv: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  
  // Get icons
  const ShoppingBagIcon = getIcon('shopping-bag');
  const XIcon = getIcon('x');
  const PlusIcon = getIcon('plus');
  const MinusIcon = getIcon('minus');
  const TrashIcon = getIcon('trash-2');
  const ChevronRightIcon = getIcon('chevron-right');
  const ChevronLeftIcon = getIcon('chevron-left');
  const CreditCardIcon = getIcon('credit-card');
  const TruckIcon = getIcon('truck');
  const CheckCircleIcon = getIcon('check-circle');
  const ShieldIcon = getIcon('shield');
  const LockIcon = getIcon('lock');
  
  // Calculate cart totals
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = item.salePrice || item.price;
      return total + (price * item.quantity);
    }, 0);
  };
  
  const subtotal = calculateSubtotal();
  const shipping = subtotal > 100 ? 0 : 12.99;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;
  
  // Handle quantity changes
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCart(updatedCart);
  };
  
  // Remove item from cart
  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    toast.info("Item removed from cart");
  };
  
  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // Validate form based on current step
  const validateForm = () => {
    let errors = {};
    let isValid = true;
    
    if (checkoutStep === 1) {
      if (!formData.firstName.trim()) {
        errors.firstName = 'First name is required';
        isValid = false;
      }
      
      if (!formData.lastName.trim()) {
        errors.lastName = 'Last name is required';
        isValid = false;
      }
      
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Email is invalid';
        isValid = false;
      }
      
      if (!formData.address.trim()) {
        errors.address = 'Address is required';
        isValid = false;
      }
      
      if (!formData.city.trim()) {
        errors.city = 'City is required';
        isValid = false;
      }
      
      if (!formData.postalCode.trim()) {
        errors.postalCode = 'Postal code is required';
        isValid = false;
      }
      
      if (!formData.country.trim()) {
        errors.country = 'Country is required';
        isValid = false;
      }
    }
    
    if (checkoutStep === 2) {
      if (!formData.cardName.trim()) {
        errors.cardName = 'Name on card is required';
        isValid = false;
      }
      
      if (!formData.cardNumber.trim()) {
        errors.cardNumber = 'Card number is required';
        isValid = false;
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        errors.cardNumber = 'Card number must be 16 digits';
        isValid = false;
      }
      
      if (!formData.expDate.trim()) {
        errors.expDate = 'Expiration date is required';
        isValid = false;
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expDate)) {
        errors.expDate = 'Format must be MM/YY';
        isValid = false;
      }
      
      if (!formData.cvv.trim()) {
        errors.cvv = 'CVV is required';
        isValid = false;
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        errors.cvv = 'CVV must be 3 or 4 digits';
        isValid = false;
      }
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  // Handle next step
  const goToNextStep = () => {
    if (validateForm()) {
      setCheckoutStep(prevStep => prevStep + 1);
    }
  };
  
  // Handle previous step
  const goToPreviousStep = () => {
    setCheckoutStep(prevStep => prevStep - 1);
  };
  
  // Handle order submission
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsProcessing(true);
      
      // Simulate processing delay
      setTimeout(() => {
        setIsProcessing(false);
        setIsOrderComplete(true);
        toast.success("Order placed successfully!");
        
        // Clear cart after successful order
        setTimeout(() => {
          setCart([]);
          setIsCartOpen(false);
          setCheckoutStep(1);
          setIsOrderComplete(false);
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            address: '',
            city: '',
            postalCode: '',
            country: '',
            cardName: '',
            cardNumber: '',
            expDate: '',
            cvv: ''
          });
        }, 3000);
      }, 2000);
    }
  };
  
  // Close cart modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const cartModal = document.getElementById('cart-modal');
      if (isCartOpen && cartModal && !cartModal.contains(e.target) && e.target.id !== 'cart-toggle') {
        setIsCartOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartOpen]);
  
  // Disable body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCartOpen]);
  
  // Display recommendation products
  const recommendedProducts = [
    {
      id: 101,
      name: "White Sneakers",
      price: 69.99,
      image: "https://images.unsplash.com/photo-1622760807800-66cf1466fc08?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 102,
      name: "Cashmere Scarf",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1520201983891-1a7a33638ca2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 103,
      name: "Gold Hoop Earrings",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
    }
  ];
  
  // Format price
  const formatPrice = (price) => {
    return price.toFixed(2);
  };
  
  // Render shipping information form
  const renderShippingForm = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`form-input ${formErrors.firstName ? 'border-red-500' : ''}`}
          />
          {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`form-input ${formErrors.lastName ? 'border-red-500' : ''}`}
          />
          {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`form-input ${formErrors.email ? 'border-red-500' : ''}`}
        />
        {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className={`form-input ${formErrors.address ? 'border-red-500' : ''}`}
        />
        {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={`form-input ${formErrors.city ? 'border-red-500' : ''}`}
          />
          {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            className={`form-input ${formErrors.postalCode ? 'border-red-500' : ''}`}
          />
          {formErrors.postalCode && <p className="text-red-500 text-xs mt-1">{formErrors.postalCode}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className={`form-input ${formErrors.country ? 'border-red-500' : ''}`}
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="FR">France</option>
            <option value="DE">Germany</option>
          </select>
          {formErrors.country && <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>}
        </div>
      </div>
    </div>
  );
  
  // Render payment information form
  const renderPaymentForm = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
      
      <div className="flex items-center justify-between bg-surface-100 dark:bg-surface-800 p-3 rounded-lg mb-4">
        <div className="flex items-center">
          <ShieldIcon size={20} className="text-primary mr-2" />
          <span className="text-sm">Secure Payment</span>
        </div>
        <div className="flex items-center space-x-2">
          <img src="https://placehold.co/100x60/F3F4F6/5073b8?text=PayPal" alt="PayPal" className="h-6" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x60/F3F4F6/5073b8?text=PayPal"; }} />
          <img src="https://placehold.co/100x60/F3F4F6/1a1f71?text=Visa" alt="Visa" className="h-6" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x60/F3F4F6/1a1f71?text=Visa"; }} />
          <img src="https://placehold.co/100x60/F3F4F6/eb001b?text=MasterCard" alt="MasterCard" className="h-6" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x60/F3F4F6/eb001b?text=MasterCard"; }} />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Name on Card</label>
        <input
          type="text"
          name="cardName"
          value={formData.cardName}
          onChange={handleInputChange}
          className={`form-input ${formErrors.cardName ? 'border-red-500' : ''}`}
        />
        {formErrors.cardName && <p className="text-red-500 text-xs mt-1">{formErrors.cardName}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Card Number</label>
        <div className="relative">
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className={`form-input pl-10 ${formErrors.cardNumber ? 'border-red-500' : ''}`}
          />
          <CreditCardIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" />
        </div>
        {formErrors.cardNumber && <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Expiration Date</label>
          <input
            type="text"
            name="expDate"
            value={formData.expDate}
            onChange={handleInputChange}
            placeholder="MM/YY"
            maxLength={5}
            className={`form-input ${formErrors.expDate ? 'border-red-500' : ''}`}
          />
          {formErrors.expDate && <p className="text-red-500 text-xs mt-1">{formErrors.expDate}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">CVV</label>
          <div className="relative">
            <input
              type="text"
              name="cvv"
              value={formData.cvv}
              onChange={handleInputChange}
              placeholder="123"
              maxLength={4}
              className={`form-input pl-10 ${formErrors.cvv ? 'border-red-500' : ''}`}
            />
            <LockIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" />
          </div>
          {formErrors.cvv && <p className="text-red-500 text-xs mt-1">{formErrors.cvv}</p>}
        </div>
      </div>
    </div>
  );
  
  // Render order summary
  const renderOrderSummary = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      
      <div className="bg-surface-100 dark:bg-surface-800 p-4 rounded-lg">
        <div className="space-y-2 mb-4">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-sm">
                  {item.name} 
                  <span className="text-surface-600 dark:text-surface-400"> × {item.quantity}</span>
                </span>
              </div>
              <span>
                ${formatPrice((item.salePrice || item.price) * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        
        <div className="border-t border-surface-200 dark:border-surface-700 pt-3 space-y-2">
          <div className="flex justify-between">
            <span className="text-surface-600 dark:text-surface-400">Subtotal</span>
            <span>${formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-600 dark:text-surface-400">Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${formatPrice(shipping)}`}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-600 dark:text-surface-400">Tax</span>
            <span>${formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between font-semibold border-t border-surface-200 dark:border-surface-700 pt-2 mt-2">
            <span>Total</span>
            <span>${formatPrice(total)}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-surface-100 dark:bg-surface-800 p-4 rounded-lg">
        <div className="flex items-center">
          <TruckIcon size={18} className="text-green-500 mr-2" />
          <div>
            <p className="font-medium">Estimated Delivery</p>
            <p className="text-sm text-surface-600 dark:text-surface-400">
              {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render order completion message
  const renderOrderComplete = () => (
    <motion.div 
      className="text-center py-10"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 flex justify-center">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircleIcon size={40} className="text-green-600 dark:text-green-400" />
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-2">Order Confirmed!</h3>
      <p className="text-surface-600 dark:text-surface-400 mb-6">
        Thank you for your purchase. We've received your order and will begin processing it right away.
      </p>
      <p className="font-medium mb-4">
        Order #: <span className="font-bold">{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</span>
      </p>
      <p className="text-sm text-surface-600 dark:text-surface-400">
        A confirmation email has been sent to {formData.email}
      </p>
    </motion.div>
  );
  
  // Render checkout steps
  const renderCheckoutStep = () => {
    if (isOrderComplete) {
      return renderOrderComplete();
    }
    
    switch (checkoutStep) {
      case 1:
        return renderShippingForm();
      case 2:
        return renderPaymentForm();
      case 3:
        return renderOrderSummary();
      default:
        return null;
    }
  };
  
  // Render checkout navigation buttons
  const renderStepButtons = () => {
    if (isOrderComplete) {
      return (
        <button
          onClick={() => setIsCartOpen(false)}
          className="btn btn-primary w-full"
        >
          Continue Shopping
        </button>
      );
    }
    
    return (
      <div className="flex justify-between">
        {checkoutStep > 1 ? (
          <button
            onClick={goToPreviousStep}
            className="btn btn-ghost flex items-center"
          >
            <ChevronLeftIcon size={18} className="mr-1" />
            Back
          </button>
        ) : (
          <button
            onClick={() => setCheckoutStep(1)}
            className="btn btn-ghost"
          >
            Cancel
          </button>
        )}
        
        {checkoutStep < 3 ? (
          <button
            onClick={goToNextStep}
            className="btn btn-primary flex items-center"
          >
            Next
            <ChevronRightIcon size={18} className="ml-1" />
          </button>
        ) : (
          <button
            onClick={handleSubmitOrder}
            disabled={isProcessing}
            className="btn btn-primary"
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </button>
        )}
      </div>
    );
  };
  
  // Render step indicators
  const renderStepIndicators = () => {
    const steps = ['Shipping', 'Payment', 'Review'];
    
    return (
      <div className="flex items-center justify-center mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                checkoutStep > index + 1 
                  ? 'bg-green-500 text-white' 
                  : checkoutStep === index + 1 
                    ? 'bg-primary text-white' 
                    : 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400'
              }`}
            >
              {checkoutStep > index + 1 ? (
                <CheckCircleIcon size={16} />
              ) : (
                index + 1
              )}
            </div>
            <span 
              className={`text-xs font-medium ml-1 ${
                checkoutStep === index + 1 ? 'text-primary' : 'text-surface-600 dark:text-surface-400'
              }`}
            >
              {step}
            </span>
            
            {index < steps.length - 1 && (
              <div 
                className={`w-10 h-0.5 mx-1 ${
                  checkoutStep > index + 1 
                    ? 'bg-green-500' 
                    : 'bg-surface-200 dark:bg-surface-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };
  
  // Cart toggle button
  const cartToggleButton = (
    <button 
      id="cart-toggle"
      onClick={() => setIsCartOpen(true)}
      className="fixed z-40 bottom-6 right-6 p-4 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      aria-label="Open cart"
    >
      <ShoppingBagIcon size={24} />
      {cart.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
          {cart.reduce((total, item) => total + item.quantity, 0)}
        </span>
      )}
    </button>
  );
  
  return (
    <section id="cart" className="py-16 bg-surface-50 dark:bg-surface-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Your Shopping Cart</h2>
          <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
            Ready to checkout? Your selections are saved and waiting for you. View your items below and proceed to checkout when you're ready.
          </p>
        </div>
        
        <div className="flex justify-center">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="btn btn-primary px-8 py-3 flex items-center gap-2"
          >
            <ShoppingBagIcon size={20} />
            {cart.length > 0 ? 'View Cart Items' : 'Start Shopping'}
            {cart.length > 0 && (
              <span className="ml-2 bg-white text-primary text-sm rounded-full w-6 h-6 flex items-center justify-center">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
        
        {/* Cart Modal */}
        <AnimatePresence>
          {isCartOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-40"
              />
              
              <motion.div
                id="cart-modal"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] z-50 bg-white dark:bg-surface-900 shadow-xl flex flex-col overflow-hidden"
              >
                <div className="flex justify-between items-center border-b border-surface-200 dark:border-surface-700 p-4">
                  <h2 className="text-xl font-bold">
                    {checkoutStep === 1 && cart.length === 0 ? 'Your Cart is Empty' : 
                     checkoutStep === 1 ? 'Your Cart' : 
                     checkoutStep === 2 ? 'Payment Information' : 
                     checkoutStep === 3 ? 'Review Order' : 
                     'Order Complete'}
                  </h2>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white rounded-full"
                  >
                    <XIcon size={24} />
                  </button>
                </div>
                
                <div className="flex-grow overflow-y-auto">
                  {checkoutStep === 1 && cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <div className="w-24 h-24 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
                        <ShoppingBagIcon size={36} className="text-surface-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Your shopping cart is empty</h3>
                      <p className="text-surface-600 dark:text-surface-400 mb-6">
                        Looks like you haven't added any items to your cart yet.
                      </p>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="btn btn-primary"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : checkoutStep === 1 ? (
                    <div className="p-4">
                      <div className="space-y-4 mb-6">
                        {cart.map(item => (
                          <div 
                            key={item.id} 
                            className="flex border-b border-surface-100 dark:border-surface-800 pb-4"
                          >
                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                               onError={(e) => { e.target.src = `https://placehold.co/400x400/F3F4F6/6c757d?text=${encodeURIComponent(item.name)}`; }}
                              />
                            </div>
                            <div className="ml-4 flex-grow">
                              <div className="flex justify-between">
                                <h4 className="font-medium">{item.name}</h4>
                                <div>
                                  <span className="font-semibold">${formatPrice((item.salePrice || item.price) * item.quantity)}</span>
                                </div>
                              </div>
                              
                              <div className="text-surface-600 dark:text-surface-400 text-sm mb-2">
                                {item.subcategory && <span>{item.subcategory}</span>}
                                {item.colors && item.colors.length > 0 && (
                                  <span> • {item.colors[0]}</span>
                                )}
                              </div>
                              
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center">
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-8 h-8 flex items-center justify-center border border-surface-300 dark:border-surface-700 rounded-l-md"
                                  >
                                    <MinusIcon size={14} />
                                  </button>
                                  <span className="w-10 h-8 flex items-center justify-center border-t border-b border-surface-300 dark:border-surface-700 text-sm">
                                    {item.quantity}
                                  </span>
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center border border-surface-300 dark:border-surface-700 rounded-r-md"
                                  >
                                    <PlusIcon size={14} />
                                  </button>
                                </div>
                                
                                <button 
                                  onClick={() => removeItem(item.id)}
                                  className="text-surface-500 hover:text-secondary"
                                >
                                  <TrashIcon size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Cart Summary */}
                      <div className="bg-surface-100 dark:bg-surface-800 rounded-lg p-4 mb-6">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-surface-600 dark:text-surface-400">Subtotal</span>
                            <span>${formatPrice(subtotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-surface-600 dark:text-surface-400">Shipping</span>
                            <span>{shipping === 0 ? 'Free' : `$${formatPrice(shipping)}`}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-surface-600 dark:text-surface-400">Tax</span>
                            <span>${formatPrice(tax)}</span>
                          </div>
                          <div className="flex justify-between font-semibold border-t border-surface-200 dark:border-surface-700 pt-2 mt-2">
                            <span>Total</span>
                            <span>${formatPrice(total)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Recommended Products */}
                      <div className="mb-4">
                        <h3 className="text-lg font-medium mb-3">You might also like</h3>
                        <div className="grid grid-cols-3 gap-3">
                          {recommendedProducts.map(product => (
                            <div key={product.id} className="card overflow-hidden">
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full aspect-square object-cover"
                                onError={(e) => { e.target.src = `https://placehold.co/400x400/F3F4F6/6c757d?text=${encodeURIComponent(product.name)}`; }}
                              />
                              <div className="p-2">
                                <h4 className="text-sm font-medium line-clamp-1">{product.name}</h4>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-sm">${product.price}</span>
                                  <button 
                                    onClick={() => {
                                      const productToAdd = {
                                        ...product,
                                        quantity: 1
                                      };
                                      addToCart(productToAdd);
                                    }}
                                    className="text-primary hover:text-primary-dark"
                                  >
                                    <PlusIcon size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4">
                      {!isOrderComplete && renderStepIndicators()}
                      {renderCheckoutStep()}
                    </div>
                  )}
                </div>
                
                {/* Footer with action buttons */}
                <div className="border-t border-surface-200 dark:border-surface-700 p-4 bg-surface-50 dark:bg-surface-800">
                  {checkoutStep === 1 && cart.length > 0 ? (
                    <button
                      onClick={goToNextStep}
                      className="btn btn-primary w-full"
                    >
                      Proceed to Checkout
                    </button>
                  ) : checkoutStep > 1 && (
                    renderStepButtons()
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        
        {/* Fixed cart toggle */}
        {!isCartOpen && cartToggleButton}
      </div>
    </section>
  );
};

export default MainFeature;