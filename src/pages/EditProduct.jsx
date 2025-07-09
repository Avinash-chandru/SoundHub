import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { headphonesService } from '../services/headphonesService';
import { headphones as staticHeadphones } from '../data/headphones';
import HeadphoneForm from '../components/HeadphoneForm';

const EditProduct = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const { id } = useParams();
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      // Get product from Firebase
      const firebaseHeadphones = await headphonesService.getAllHeadphones();
      const foundProduct = firebaseHeadphones.find(h => h.id === id);
      
      if (!foundProduct) {
        toast.error('Product not found.');
        navigate('/dashboard');
        return;
      }
      
      setProduct(foundProduct);
    } catch (error) {
      console.error('Error fetching Firebase products:', error);
      
      // Fallback: check if it's a static product that needs to be created in Firebase
      const numericId = parseInt(id);
      const staticProduct = staticHeadphones.find(h => h.id === numericId);
      
      if (staticProduct) {
        // Create the static product in Firebase first
        try {
          const createdProduct = await headphonesService.createHeadphone({
            ...staticProduct,
            userId: currentUser.uid,
            userEmail: currentUser.email
          });
          setProduct(createdProduct);
        } catch (createError) {
          console.error('Error creating product in Firebase:', createError);
          toast.error('Failed to load product. Please try again.');
          navigate('/dashboard');
        }
      } else {
        toast.error('Failed to load product. Please try again.');
        navigate('/dashboard');
      }
    }
    setFetchLoading(false);
  };

  const handleSubmit = async (formData) => {
    if (!isAdmin()) {
      toast.error('Only admin can edit products');
      return;
    }
    
    setLoading(true);
    const loadingToast = toast.loading('Updating product...');
    
    try {
      // Always update in Firebase
      await headphonesService.updateHeadphone(product.id, formData);
      
      toast.success('Product updated successfully!', {
        id: loadingToast,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating headphone:', error);
      toast.error('Failed to update product. Please try again.', {
        id: loadingToast,
      });
    }
    setLoading(false);
  };

  if (fetchLoading) {
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
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow">
              <div className="card-header bg-dark text-white">
                <h2 className="mb-0">
                  <i className="bi bi-pencil me-2"></i>Edit Product
                  <span className="badge bg-danger ms-2">ADMIN ONLY</span>
                </h2>
              </div>
              <div className="card-body p-4">
                <HeadphoneForm
                  initialData={product}
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

export default EditProduct;