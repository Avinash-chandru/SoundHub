import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ToastProvider from './components/ToastProvider'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import Dashboard from './pages/Dashboard'
import AddProduct from './pages/AddProduct'
import EditProduct from './pages/EditProduct'

function App() {
  return (
    <AuthProvider>
      <ToastProvider />
      <div className="App d-flex flex-column min-vh-100">
        <Navigation />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={
              <ProtectedRoute adminOnly={true}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/add-product" element={
              <ProtectedRoute adminOnly={true}>
                <AddProduct />
              </ProtectedRoute>
            } />
            <Route path="/edit-product/:id" element={
              <ProtectedRoute adminOnly={true}>
                <EditProduct />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App