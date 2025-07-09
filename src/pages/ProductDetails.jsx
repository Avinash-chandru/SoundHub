import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { headphones as staticHeadphones } from '../data/headphones';
import { headphonesService } from '../services/headphonesService';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      // First check static headphones
      let foundProduct = staticHeadphones.find(h => h.id === parseInt(id));
      
      if (!foundProduct) {
        // If not found in static data, check Firebase
        const firebaseHeadphones = await headphonesService.getAllHeadphones();
        foundProduct = firebaseHeadphones.find(h => h.id === id);
      }
      
      setProduct(foundProduct);
    } catch (error) {
      console.error('Error fetching product:', error);
      // Fallback to static data only
      const foundProduct = staticHeadphones.find(h => h.id === parseInt(id));
      setProduct(foundProduct);
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    addToCart(product);
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

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning">
          <h4>Product Not Found</h4>
          <p>The product you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary">Back to Store</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-4">
        <Link to="/" className="btn btn-outline-secondary mb-4">
          <i className="bi bi-arrow-left me-2"></i>Back to Store
        </Link>
        
        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow">
              <img
                src={product.image}
                alt={product.name}
                className="card-img"
                style={{ height: '400px', objectFit: 'contain' }}
              />
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className="card border-0 shadow h-100">
              <div className="card-body p-4">
                <div className="mb-3">
                  <span className="badge bg-secondary mb-2">{product.brand}</span>
                  <h1 className="h2 mb-0">{product.name}</h1>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-muted">({product.rating} out of 5)</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className="h3 text-success fw-bold">₹{product.price?.toLocaleString()}</span>
                  <span className="ms-3 badge bg-light text-dark">{product.category}</span>
                </div>
                
                <p className="text-muted mb-4">{product.description}</p>
                
                {product.features && product.features.length > 0 && (
                  <div className="mb-4">
                    <h5 className="mb-3">Key Features</h5>
                    <div className="row">
                      {product.features.map((feature, index) => (
                        <div key={index} className="col-12 mb-2">
                          <div className="d-flex align-items-center">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            <span>{feature}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {product.specifications && (
                  <div className="mb-4">
                    <h5 className="mb-3">Specifications</h5>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <tbody>
                          {Object.entries(product.specifications).map(([key, value]) => (
                            <tr key={key}>
                              <td className="fw-semibold text-muted" style={{ width: '40%' }}>{key}</td>
                              <td>{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="d-grid">
                  <button
                    className={`btn btn-lg ${product.inStock ? 'btn-dark' : 'btn-secondary'}`}
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;