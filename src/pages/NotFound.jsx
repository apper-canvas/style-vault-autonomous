import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const NotFound = () => {
  const HomeIcon = getIcon('home');
  const AlertTriangleIcon = getIcon('alert-triangle');

  return (
    <motion.div 
      className="flex items-center justify-center min-h-[70vh] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.5,
              type: "spring",
              stiffness: 200
            }}
          >
            <AlertTriangleIcon size={80} className="text-secondary" />
          </motion.div>
        </div>
        
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-4"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          404
        </motion.h1>
        
        <motion.h2 
          className="text-2xl md:text-3xl font-semibold mb-4"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Page Not Found
        </motion.h2>
        
        <motion.p 
          className="text-surface-600 dark:text-surface-400 mb-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Sorry, we couldn't find the page you were looking for. It might have been moved, 
          deleted, or perhaps never existed in the first place.
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link 
            to="/" 
            className="btn btn-primary inline-flex items-center px-6 py-3"
          >
            <HomeIcon size={18} className="mr-2" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFound;