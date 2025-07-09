import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    toast.success(`Thank you for your order! Your items will be delivered soon. Order total: ₹${getCartTotal().toLocaleString()}`, {
      duration: 5000,
      style: {
        maxWidth: '400px',
      },
    });
    clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-light min-vh-100">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <div className="card border-0 shadow">
                <div className="card-body p-5">
                  <i className="bi bi-cart-x display-1 text-muted mb-4"></i>
                  <h2 className="mb-3">Your cart is empty</h2>
                  <p className="text-muted mb-4">Start shopping to add items to your cart</p>
                  <Link to="/" className="btn btn-dark btn-lg">
                    <i className="bi bi-shop me-2"></i>Start Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-4">
        <div className="row">
          <div className="col-lg-8">
            <div className="card border-0 shadow mb-4">
              <div className="card-header bg-white border-0 py-3">
                <h2 className="mb-0">Shopping Cart</h2>
              </div>
              <div className="card-body p-0">
                {cartItems.map((item, index) => (
                  <div key={item.id} className={`p-4 ${index !== cartItems.length - 1 ? 'border-bottom' : ''}`}>
                    <div className="row align-items-center">
                      <div className="col-md-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded"
                          style={{ height: '100px', width: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <div className="col-md-5">
                        <h5 className="mb-1">{item.name}</h5>
                        <p className="text-muted mb-2">{item.brand}</p>
                        <span className="text-success fw-bold">₹{item.price.toLocaleString()}</span>
                      </div>
                      <div className="col-md-2">
                        <div className="d-flex align-items-center justify-content-center">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <span className="mx-3 fw-bold">{item.quantity}</span>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="col-md-2 text-end">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card border-0 shadow sticky-top">
              <div className="card-header bg-dark text-white">
                <h5 className="mb-0">Order Summary</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                  <span>Items ({cartItems.reduce((total, item) => total + item.quantity, 0)})</span>
                  <span>₹{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <strong>Total</strong>
                  <strong className="text-success">₹{getCartTotal().toLocaleString()}</strong>
                </div>
                
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-success btn-lg"
                    onClick={handleCheckout}
                  >
                    <i className="bi bi-credit-card me-2"></i>Checkout
                  </button>
                  <button 
                    className="btn btn-outline-danger" 
                    onClick={clearCart}
                  >
                    <i className="bi bi-trash me-2"></i>Clear Cart
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

export default Cart;