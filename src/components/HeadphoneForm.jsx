import { useState, useEffect } from 'react';

const HeadphoneForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    brand: '',
    category: 'Wireless',
    description: '',
    features: [''],
    specifications: {
      'Driver Unit': '',
      'Frequency Response': '',
      'Battery Life': '',
      'Weight': '',
      'Connectivity': ''
    },
    inStock: true,
    rating: 4.0
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        features: initialData.features || [''],
        specifications: {
          'Driver Unit': '',
          'Frequency Response': '',
          'Battery Life': '',
          'Weight': '',
          'Connectivity': '',
          ...initialData.specifications
        }
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSpecificationChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        features: newFeatures
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedData = {
      ...formData,
      price: parseInt(formData.price),
      rating: parseFloat(formData.rating),
      features: formData.features.filter(feature => feature.trim() !== '')
    };
    onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Product Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="brand" className="form-label">Brand</label>
            <input
              type="text"
              className="form-control"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="price" className="form-label">Price (₹)</label>
            <input
              type="number"
              className="form-control"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              className="form-select"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="Wireless">Wireless</option>
              <option value="Wired">Wired</option>
              <option value="Gaming">Gaming</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="rating" className="form-label">Rating</label>
            <input
              type="number"
              className="form-control"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="1"
              max="5"
              step="0.1"
              required
            />
          </div>

          <div className="mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="inStock"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="inStock">
                In Stock
              </label>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="image" className="form-label">Image URL</label>
            <input
              type="url"
              className="form-control"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Features</label>
            {formData.features.map((feature, index) => (
              <div key={index} className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder="Enter feature"
                />
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => removeFeature(index)}
                  disabled={formData.features.length === 1}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={addFeature}
            >
              <i className="bi bi-plus"></i> Add Feature
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h5>Specifications</h5>
        <div className="row">
          {Object.entries(formData.specifications).map(([key, value]) => (
            <div key={key} className="col-md-6 mb-3">
              <label className="form-label">{key}</label>
              <input
                type="text"
                className="form-control"
                value={value}
                onChange={(e) => handleSpecificationChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="d-grid">
        <button
          type="submit"
          className="btn btn-dark btn-lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Saving...
            </>
          ) : (
            initialData ? 'Update Product' : 'Create Product'
          )}
        </button>
      </div>
    </form>
  );
};

export default HeadphoneForm;