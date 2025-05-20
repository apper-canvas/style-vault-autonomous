import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getIcon } from '../utils/iconUtils';
import { fetchCollections } from '../services/collectionService';
import { toast } from 'react-toastify';

const Collections = () => {
  const navigate = useNavigate();
  const ArrowLeftIcon = getIcon('arrow-left');
  
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchCollections()
      .then(data => {
        setCollections(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching collections:', err);
        setError('Failed to load collections. Please try again.');
        setLoading(false);
        toast.error('Failed to load collections');
      });
  }, []);

const CollectionCard = ({ collection }) => {
  const navigate = useNavigate();
  const ArrowRightIcon = getIcon('arrow-right');
  
  return (
    <motion.div 
      className="card card-hover overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={collection.image} 
          alt={collection.name} 
          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
          onError={(e) => { e.target.src = `https://placehold.co/800x600/F3F4F6/6c757d?text=${encodeURIComponent(collection.name)}`; }}
        />
        <div className="absolute top-4 right-4 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm text-surface-800 dark:text-surface-100 text-sm font-medium px-3 py-1 rounded-full">
          {collection.itemCount || 0} Items
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2">{collection.name}</h3>
        <p className="text-surface-600 dark:text-surface-400 text-sm mb-4">{collection.description}</p>
        <button 
          className="flex items-center font-medium text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors"
          onClick={() => navigate(`/collections/${collection.Id}`)}
        >
          Explore Collection <ArrowRightIcon className="ml-2 h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-surface-600 hover:text-primary mb-6"
          >
            <ArrowLeftIcon className="mr-2 h-5 w-5" /> Back to Home
          </button>
          <h1 className="text-3xl font-bold mb-3">Our Collections</h1>
          <p className="text-surface-600 dark:text-surface-400 max-w-3xl">
            Explore our carefully curated collections, designed to fit your lifestyle and express your unique personality. 
            Find the perfect pieces for every occasion, season, and style preference.
          </p>
        </div>
        
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
                fetchCollections()
                  .then(data => {
                    setCollections(data);
                    setLoading(false);
                  })
                  .catch(err => {
                    setError('Failed to load collections. Please try again.');
                    setLoading(false);
                  });
              }}
              className="text-sm underline mt-2"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map(collection => (
              <CollectionCard key={collection.Id} collection={collection} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;