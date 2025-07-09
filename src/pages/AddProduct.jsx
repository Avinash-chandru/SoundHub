import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { headphonesService } from '../services/headphonesService';
import HeadphoneForm from '../components/HeadphoneForm';

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    if (!isAdmin()) {
      toast.error('Only admin can create products');
      return;
    }
    
    setLoading(true);
    const loadingToast = toast.loading('Creating product...');
    
    try {
      console.log('Creating product with data:', formData);
      console.log('Current user:', currentUser);
      
      if (!currentUser) {
        toast.error('You must be logged in to create a product', {
          id: loadingToast,
        });
        throw new Error('You must be logged in to create a product');
      }
      
      await headphonesService.createHeadphone({
        ...formData,
        userId: currentUser.uid,
        userEmail: currentUser.email
      });
      console.log('Product created successfully');
      
      toast.success('Product created successfully!', {
        id: loadingToast,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating headphone:', error);
      
      // More specific error messages
      let errorMessage = 'Failed to create product. ';
      if (error.code === 'permission-denied') {
        errorMessage += 'You do not have permission to create products.';
      } else if (error.code === 'unavailable') {
        errorMessage += 'Service is temporarily unavailable. Please try again.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      
      toast.error(errorMessage, {
        id: loadingToast,
      });
    }
    setLoading(false);
  };

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow">
              <div className="card-header bg-dark text-white">
                <h2 className="mb-0">
                  <i className="bi bi-plus-circle me-2"></i>Add New Product
                  <span className="badge bg-danger ms-2">ADMIN ONLY</span>
                </h2>
              </div>
              <div className="card-body p-4">
                <HeadphoneForm
                  onSubmit={handleSubmit}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;