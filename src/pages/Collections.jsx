import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getIcon } from '../utils/iconUtils';

const collections = [
  {
    id: 1,
    name: "Summer Essentials",
    description: "Light, breathable pieces perfect for warm weather and sunny days.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    count: 24
  },
  {
    id: 2,
    name: "Autumn Layers",
    description: "Versatile pieces for layering during the transitional seasons.",
    image: "https://images.unsplash.com/photo-1520367288098-6d718e30e763?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    count: 18
  },
  {
    id: 3,
    name: "Workwear Edit",
    description: "Professional attire that combines comfort and sophistication.",
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    count: 15
  },
  {
    id: 4,
    name: "Casual Weekend",
    description: "Comfortable, stylish pieces for your days off.",
    image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    count: 20
  },
  {
    id: 5,
    name: "Evening Elegance",
    description: "Sophisticated options for special occasions and night events.",
    image: "https://images.unsplash.com/photo-1553545985-1e0d8781d5db?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    count: 12
  },
  {
    id: 6,
    name: "Sustainable Edit",
    description: "Eco-friendly fashion made with sustainable materials and ethical practices.",
    image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    count: 16
  }
];

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
          {collection.count} Items
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2">{collection.name}</h3>
        <p className="text-surface-600 dark:text-surface-400 text-sm mb-4">{collection.description}</p>
        <button 
          className="flex items-center font-medium text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors"
          onClick={() => navigate('/')}
        >
          Explore Collection <ArrowRightIcon className="ml-2 h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

const Collections = () => {
  const navigate = useNavigate();
  const ArrowLeftIcon = getIcon('arrow-left');
  
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map(collection => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;