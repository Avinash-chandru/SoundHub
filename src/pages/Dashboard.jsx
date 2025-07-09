import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { headphonesService } from '../services/headphonesService';
import { headphones as staticHeadphones } from '../data/headphones';

const Dashboard = () => {
  const { currentUser, isAdmin } = useAuth();
  const [allHeadphones, setAllHeadphones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllHeadphones();
  }, [currentUser]);

  const fetchAllHeadphones = async () => {
    try {
      const firebaseHeadphones = await headphonesService.getAllHeadphones();
      // Only show Firebase headphones
      setAllHeadphones(firebaseHeadphones);
    } catch (error) {
      console.warn('Firebase access unavailable, using static data only:', error.message);
      // Fallback to static data if Firebase fails
      setAllHeadphones(staticHeadphones);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!isAdmin()) {
      toast.error('Only admin can delete products');
      return;
    }
    
    // Show loading toast
    const loadingToast = toast.loading('Deleting product...');
    
    try {
      // Delete from Firebase
      await headphonesService.deleteHeadphone(id);
      setAllHeadphones(prev => prev.filter(item => item.id !== id));
      
      // Success toast
      toast.success('Product deleted successfully!', {
        id: loadingToast,
      });
    } catch (error) {
      console.error('Error deleting headphone:', error);
      
      // Error toast
      toast.error('Failed to delete product. Please try again.', {
        id: loadingToast,
      });
    }
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
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1>
              <i className="bi bi-shield-check text-danger me-2"></i>
              Admin Dashboard
            </h1>
            <p className="text-muted">
              Welcome back, <strong>{currentUser?.displayName || currentUser?.email}</strong>
              <span className="badge bg-danger ms-2">ADMIN</span>
            </p>
          </div>
          <Link to="/add-product" className="btn btn-dark">
            <i className="bi bi-plus-circle me-2"></i>Add New Product
          </Link>
        </div>

        {allHeadphones.length === 0 ? (
          <div className="text-center py-5">
            <div className="card border-0 shadow">
              <div className="card-body p-5">
                <i className="bi bi-headphones display-1 text-muted mb-4"></i>
                <h3>No Products Yet</h3>
                <p className="text-muted mb-4">Start by adding your first headphone product</p>
                <Link to="/add-product" className="btn btn-dark">
                  <i className="bi bi-plus-circle me-2"></i>Add Your First Product
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {allHeadphones.map(headphone => (
              <div key={headphone.id} className="col-lg-4 col-md-6">
                <div className="card h-100 shadow-sm border-0">
                  <img
                    src={headphone.image}
                    className="card-img-top"
                    alt={headphone.name}
                    style={{ height: '200px', objectFit: 'contain' }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{headphone.name}</h5>
                    <p className="text-muted small">{headphone.brand} • {headphone.category}</p>
                    <p className="text-success fw-bold">₹{headphone.price?.toLocaleString()}</p>
                    <div className="mt-auto">
                      <div className="d-flex gap-2">
                        <Link
                          to={`/edit-product/${headphone.id}`}
                          className="btn btn-outline-primary btn-sm flex-fill"
                        >
                          <i className="bi bi-pencil me-1"></i>Edit
                        </Link>
                        <button
                          className="btn btn-outline-danger btn-sm flex-fill"
                          onClick={() => {
                            toast((t) => (
                              <div className="d-flex align-items-center">
                                <div className="me-3">
                                  <i className="bi bi-exclamation-triangle text-warning me-2"></i>
                                  <span>Delete "{headphone.name}"?</span>
                                </div>
                                <div>
                                  <button
                                    className="btn btn-sm btn-danger me-2"
                                    onClick={() => {
                                      toast.dismiss(t.id);
                                      handleDelete(headphone.id);
                                    }}
                                  >
                                    Delete
                                  </button>
                                  <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => toast.dismiss(t.id)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ), {
                              duration: Infinity,
                              style: {
                                background: '#fff',
                                color: '#333',
                                border: '1px solid #dee2e6',
                                borderRadius: '8px',
                                padding: '16px',
                                minWidth: '350px',
                              },
                            });
                          }}
                        >
                          <i className="bi bi-trash me-1"></i>Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;