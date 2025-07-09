import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { currentUser, logout, isAdmin, userRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-dark" to="/">
          <i className="bi bi-headphones me-2"></i>
          SoundHub
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav ms-auto">
            <Link to="/" className="nav-link text-dark">
              <i className="bi bi-house me-1"></i>Home
            </Link>
            <Link to="/cart" className="nav-link text-dark me-3">
              <i className="bi bi-cart me-1"></i>Cart
            </Link>
            
            {currentUser ? (
              <div className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle text-dark"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-1"></i>
                  {currentUser.displayName || currentUser.email}
                  <span className={`badge ms-2 ${isAdmin() ? 'bg-danger' : 'bg-secondary'}`}>
                    {userRole.toUpperCase()}
                  </span>
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {isAdmin() ? (
                    <>
                      <li>
                        <Link className="dropdown-item" to="/dashboard">
                          <i className="bi bi-speedometer2 me-2"></i>Admin Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/add-product">
                          <i className="bi bi-plus-circle me-2"></i>Add Product
                        </Link>
                      </li>
                    </>
                  ) : (
                    <li>
                      <span className="dropdown-item-text text-muted">
                        <i className="bi bi-info-circle me-2"></i>Guest Account
                      </span>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="nav-link text-dark me-2">
                  <i className="bi bi-box-arrow-in-right me-1"></i>Login
                </Link>
                <Link to="/signup" className="btn btn-dark btn-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;