import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { headphones as staticHeadphones } from '../data/headphones';
import { headphonesService } from '../services/headphonesService';
import { useCart } from '../context/CartContext';

const Home = () => {
  const [allHeadphones, setAllHeadphones] = useState(staticHeadphones);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchAllHeadphones();
  }, []);

  const fetchAllHeadphones = async () => {
    try {
      // Get product from Firebase
      const firebaseHeadphones = await headphonesService.getAllHeadphones();
      
      // If Firebase is empty, populate it with static data
      if (firebaseHeadphones.length === 0) {
        // Show static data while we populate Firebase in the background
        const sortedStatic = [...staticHeadphones].sort((a, b) => a.price - b.price);
        setAllHeadphones(sortedStatic);
        
        // Populate Firebase with static data (without user association for public viewing)
        try {
          for (const headphone of staticHeadphones) {
            const { id, ...headphoneData } = headphone;
            await headphonesService.createHeadphone({
              ...headphoneData,
              userId: 'system', // System user for public products
              userEmail: 'system@soundhub.com',
              isPublic: true
            });
          }
          // Refresh to show Firebase data
          const updatedHeadphones = await headphonesService.getAllHeadphones();
          const sortedUpdated = [...updatedHeadphones].sort((a, b) => a.price - b.price);
          setAllHeadphones(sortedUpdated);
        } catch (populateError) {
          console.warn('Could not populate Firebase, using static data:', populateError);
        }
      } else {
        const sortedFirebase = [...firebaseHeadphones].sort((a, b) => a.price - b.price);
        setAllHeadphones(sortedFirebase);
      }
    } catch (error) {
      console.warn('Firebase access unavailable, using static data only:', error.message);
      // Fallback to static data if Firebase fails
      const sortedStatic = [...staticHeadphones].sort((a, b) => a.price - b.price);
      setAllHeadphones(sortedStatic);
    }
    setLoading(false);
  };

  const handleAddToCart = (headphone) => {
    addToCart(headphone);
    toast.success(`${headphone.name} added to cart!`, {
      duration: 2000,
      style: {
        maxWidth: '300px',
      },
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half text-warning"></i>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      {/* Hero Section */}
      <div className="bg-dark text-white py-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">Premium Headphones</h1>
          <p className="lead">Discover the perfect sound experience</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container py-5">
        <div className="row g-4">
          {allHeadphones.map(headphone => (
            <div key={headphone.id} className="col-lg-4 col-md-6">
              <div className="card h-100 shadow-sm border-0 product-card">
                <div className="position-relative overflow-hidden">
                  <Link to={`/product/${headphone.id}`}>
                    <img
                      src={headphone.image}
                      className="card-img-top"
                      alt={headphone.name}
                      style={{ height: '250px', objectFit: 'contain' }}
                    />
                  </Link>
                </div>
                
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate">{headphone.name}</h5>
                  <p className="text-muted small mb-2">{headphone.brand} • {headphone.category}</p>
                  
                  <div className="mb-2">
                    <div className="d-flex align-items-center">
                      <div className="me-2">
                        {renderStars(headphone.rating)}
                      </div>
                      <small className="text-muted">({headphone.rating})</small>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <span className="h4 text-success fw-bold">₹{headphone.price?.toLocaleString()}</span>
                  </div>
                  
                  <div className="mt-auto">
                    <button
                      className={`btn w-100 ${headphone.inStock ? 'btn-outline-dark' : 'btn-secondary'}`}
                      onClick={() => handleAddToCart(headphone)}
                      disabled={!headphone.inStock}
                    >
                      <i className="bi bi-cart-plus me-2"></i>
                      {headphone.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;