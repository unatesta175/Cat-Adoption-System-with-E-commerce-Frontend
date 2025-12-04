import React, { useState, useEffect } from 'react';
import { catsAPI, adoptionsAPI, ordersAPI, productsAPI } from '../services/api';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [cats, setCats] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [catForm, setCatForm] = useState({
    name: '',
    breed: '',
    age: '',
    gender: 'male',
    description: '',
    adoptionFee: '',
    energyLevel: 'moderate',
    maintenanceLevel: 'moderate',
    goodWithKids: false,
    personality: 'social'
  });
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'food',
    stock: '',
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [catsRes, adoptionsRes, ordersRes, productsRes] = await Promise.all([
        catsAPI.getAllCats(),
        adoptionsAPI.getAllRequests(),
        ordersAPI.getAllOrders(),
        productsAPI.getAllProducts()
      ]);
      setCats(catsRes.data);
      setAdoptions(adoptionsRes.data);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCatForm({
      ...catForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleCatSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', catForm.name);
      formData.append('breed', catForm.breed);
      formData.append('age', catForm.age);
      formData.append('gender', catForm.gender);
      formData.append('description', catForm.description);
      formData.append('adoptionFee', catForm.adoptionFee || '0');
      formData.append('traits', JSON.stringify({
        energyLevel: catForm.energyLevel,
        maintenanceLevel: catForm.maintenanceLevel,
        goodWithKids: catForm.goodWithKids,
        personality: catForm.personality
      }));

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editingCat) {
        await catsAPI.updateCat(editingCat._id, formData);
      } else {
        await catsAPI.createCat(formData);
      }

      setShowCatModal(false);
      setEditingCat(null);
      resetForm();
      loadDashboardData();
    } catch (error) {
      console.error('Error saving cat:', error);
      alert('Failed to save cat. Please try again.');
    }
  };

  const handleEditCat = (cat) => {
    setEditingCat(cat);
    setCatForm({
      name: cat.name,
      breed: cat.breed,
      age: cat.age,
      gender: cat.gender,
      description: cat.description,
      adoptionFee: cat.adoptionFee || '',
      energyLevel: cat.traits.energyLevel,
      maintenanceLevel: cat.traits.maintenanceLevel,
      goodWithKids: cat.traits.goodWithKids,
      personality: cat.traits.personality
    });
    setShowCatModal(true);
  };

  const handleDeleteCat = async (id) => {
    if (window.confirm('Are you sure you want to delete this cat?')) {
      try {
        await catsAPI.deleteCat(id);
        loadDashboardData();
      } catch (error) {
        console.error('Error deleting cat:', error);
        alert('Failed to delete cat.');
      }
    }
  };

  const handleAdoptionStatus = async (id, status) => {
    try {
      await adoptionsAPI.updateStatus(id, status);
      loadDashboardData();
    } catch (error) {
      console.error('Error updating adoption status:', error);
      alert('Failed to update status.');
    }
  };

  const handleOrderStatus = async (id, status) => {
    try {
      await ordersAPI.updateOrderStatus(id, status);
      loadDashboardData();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status.');
    }
  };

  const handleProductInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm({
      ...productForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', productForm.price);
      formData.append('category', productForm.category);
      formData.append('stock', productForm.stock);
      formData.append('isActive', productForm.isActive);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editingProduct) {
        await productsAPI.updateProduct(editingProduct._id, formData);
      } else {
        await productsAPI.createProduct(formData);
      }

      setShowProductModal(false);
      setEditingProduct(null);
      resetProductForm();
      loadDashboardData();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      isActive: product.isActive
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.deleteProduct(id);
        loadDashboardData();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product.');
      }
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'food',
      stock: '',
      isActive: true
    });
    setImageFile(null);
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    resetProductForm();
    setShowProductModal(true);
  };

  const resetForm = () => {
    setCatForm({
      name: '',
      breed: '',
      age: '',
      gender: 'male',
      description: '',
      adoptionFee: '',
      energyLevel: 'moderate',
      maintenanceLevel: 'moderate',
      goodWithKids: false,
      personality: 'social'
    });
    setImageFile(null);
  };

  const openAddModal = () => {
    setEditingCat(null);
    resetForm();
    setShowCatModal(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard py-5">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1><i className="fas fa-user-shield"></i> Admin Dashboard</h1>
            <p>Manage cats, products, adoptions and orders</p>
          </div>
          <div className="admin-header-buttons">
            <button className="btn btn-primary" onClick={openAddModal}>
              <i className="fas fa-plus"></i> Add Cat
            </button>
            <button className="btn btn-success" onClick={openAddProductModal}>
              <i className="fas fa-plus"></i> Add Product
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="stats-grid">
          <div className="stat-card card">
            <div className="stat-icon">
              <i className="fas fa-cat"></i>
            </div>
            <div className="stat-info">
              <h3>{cats.length}</h3>
              <p>Available Cats</p>
            </div>
          </div>
          <div className="stat-card card">
            <div className="stat-icon">
              <i className="fas fa-heart"></i>
            </div>
            <div className="stat-info">
              <h3>{adoptions.length}</h3>
              <p>Total Adoptions</p>
            </div>
          </div>
          <div className="stat-card card">
            <div className="stat-icon">
              <i className="fas fa-shopping-bag"></i>
            </div>
            <div className="stat-info">
              <h3>{products.length}</h3>
              <p>Products</p>
            </div>
          </div>
          <div className="stat-card card">
            <div className="stat-icon">
              <i className="fas fa-box"></i>
            </div>
            <div className="stat-info">
              <h3>{orders.filter(o => o.status === 'pending' || o.status === 'processing').length}</h3>
              <p>Active Orders</p>
            </div>
          </div>
        </div>

        {/* Cats Management */}
        <div className="admin-section card">
          <h2><i className="fas fa-paw"></i> Manage Cats</h2>
          <div className="cats-table">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Breed</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Personality</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cats.map(cat => (
                  <tr key={cat._id}>
                    <td>
                      <img 
                        src={`/uploads/${cat.image}`} 
                        alt={cat.name}
                        className="cat-thumb"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/50/9b5de5/ffffff?text=Cat';
                        }}
                      />
                    </td>
                    <td><strong>{cat.name}</strong></td>
                    <td>{cat.breed}</td>
                    <td>{cat.age}y</td>
                    <td className="capitalize">{cat.gender}</td>
                    <td className="capitalize">{cat.traits.personality}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon btn-edit"
                          onClick={() => handleEditCat(cat)}
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn-icon btn-delete"
                          onClick={() => handleDeleteCat(cat._id)}
                          title="Delete"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Orders Management */}
        <div className="admin-section card">
          <h2><i className="fas fa-shopping-cart"></i> Orders Management</h2>
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td><strong>#{order._id.slice(-8).toUpperCase()}</strong></td>
                    <td>
                      <div>
                        <strong>{order.user.name}</strong>
                        <br />
                        <small>{order.user.email}</small>
                      </div>
                    </td>
                    <td>{order.items.length} items</td>
                    <td><strong>RM{order.totalAmount.toFixed(2)}</strong></td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge status-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <select 
                        className="status-select"
                        value={order.status}
                        onChange={(e) => handleOrderStatus(order._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Products Management */}
        <div className="admin-section card">
          <h2><i className="fas fa-box"></i> Products Management</h2>
          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td>
                      <img 
                        src={`/uploads/${product.image}`} 
                        alt={product.name}
                        className="cat-thumb"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/50/9b5de5/ffffff?text=Product';
                        }}
                      />
                    </td>
                    <td><strong>{product.name}</strong></td>
                    <td className="capitalize">{product.category}</td>
                    <td><strong>RM{product.price.toFixed(2)}</strong></td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={`status-badge ${product.isActive ? 'status-approved' : 'status-rejected'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon btn-edit"
                          onClick={() => handleEditProduct(product)}
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn-icon btn-delete"
                          onClick={() => handleDeleteProduct(product._id)}
                          title="Delete"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Adoptions Management */}
        <div className="admin-section card">
          <h2><i className="fas fa-heart"></i> Cat Adoptions</h2>
          <div className="adoptions-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Cat</th>
                  <th>Adoption Fee</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {adoptions.map(adoption => (
                  <tr key={adoption._id}>
                    <td>
                      <div>
                        <strong>{adoption.userId.name}</strong>
                        <br />
                        <small>{adoption.userId.email}</small>
                      </div>
                    </td>
                    <td><strong>{adoption.catId.name}</strong></td>
                    <td><strong>RM{adoption.adoptionFee?.toFixed(2) || '0.00'}</strong></td>
                    <td>{new Date(adoption.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge status-${adoption.status}`}>
                        {adoption.status}
                      </span>
                    </td>
                    <td>
                      <select 
                        className="status-select"
                        value={adoption.status}
                        onChange={(e) => handleAdoptionStatus(adoption._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Form Modal */}
        <Modal 
          isOpen={showProductModal} 
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
            resetProductForm();
          }}
          title={editingProduct ? 'Edit Product' : 'Add New Product'}
        >
          <form onSubmit={handleProductSubmit}>
            <FormInput
              label="Name"
              type="text"
              name="name"
              value={productForm.name}
              onChange={handleProductInputChange}
              required
            />

            <FormInput
              label="Description"
              type="textarea"
              name="description"
              value={productForm.description}
              onChange={handleProductInputChange}
              required
            />

            <FormInput
              label="Price"
              type="number"
              name="price"
              value={productForm.price}
              onChange={handleProductInputChange}
              step="0.01"
              required
            />

            <FormInput
              label="Category"
              type="select"
              name="category"
              value={productForm.category}
              onChange={handleProductInputChange}
              options={[
                { value: 'food', label: 'Food' },
                { value: 'toys', label: 'Toys' },
                { value: 'accessories', label: 'Accessories' },
                { value: 'grooming', label: 'Grooming' },
                { value: 'health', label: 'Health' },
                { value: 'furniture', label: 'Furniture' }
              ]}
              required
            />

            <FormInput
              label="Stock"
              type="number"
              name="stock"
              value={productForm.stock}
              onChange={handleProductInputChange}
              required
            />

            <FormInput
              label="Active"
              type="checkbox"
              name="isActive"
              value={productForm.isActive}
              onChange={handleProductInputChange}
            />

            <div className="form-group">
              <label className="form-label">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="form-input"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </form>
        </Modal>

        {/* Cat Form Modal */}
        <Modal 
          isOpen={showCatModal} 
          onClose={() => {
            setShowCatModal(false);
            setEditingCat(null);
            resetForm();
          }}
          title={editingCat ? 'Edit Cat' : 'Add New Cat'}
        >
          <form onSubmit={handleCatSubmit}>
            <FormInput
              label="Name"
              type="text"
              name="name"
              value={catForm.name}
              onChange={handleInputChange}
              required
            />

            <FormInput
              label="Breed"
              type="text"
              name="breed"
              value={catForm.breed}
              onChange={handleInputChange}
              required
            />

            <FormInput
              label="Age (years)"
              type="number"
              name="age"
              value={catForm.age}
              onChange={handleInputChange}
              required
            />

            <FormInput
              label="Gender"
              type="select"
              name="gender"
              value={catForm.gender}
              onChange={handleInputChange}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' }
              ]}
              required
            />

            <FormInput
              label="Description"
              type="textarea"
              name="description"
              value={catForm.description}
              onChange={handleInputChange}
              required
            />

            <FormInput
              label="Adoption Fee (RM)"
              type="number"
              name="adoptionFee"
              value={catForm.adoptionFee}
              onChange={handleInputChange}
              step="0.01"
              required
            />

            <FormInput
              label="Energy Level"
              type="select"
              name="energyLevel"
              value={catForm.energyLevel}
              onChange={handleInputChange}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'moderate', label: 'Moderate' },
                { value: 'high', label: 'High' }
              ]}
              required
            />

            <FormInput
              label="Maintenance Level"
              type="select"
              name="maintenanceLevel"
              value={catForm.maintenanceLevel}
              onChange={handleInputChange}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'moderate', label: 'Moderate' },
                { value: 'high', label: 'High' }
              ]}
              required
            />

            <FormInput
              label="Personality"
              type="select"
              name="personality"
              value={catForm.personality}
              onChange={handleInputChange}
              options={[
                { value: 'playful', label: 'Playful' },
                { value: 'calm', label: 'Calm' },
                { value: 'independent', label: 'Independent' },
                { value: 'social', label: 'Social' }
              ]}
              required
            />

            <FormInput
              label="Good with Kids"
              type="checkbox"
              name="goodWithKids"
              value={catForm.goodWithKids}
              onChange={handleInputChange}
            />

            <div className="form-group">
              <label className="form-label">Cat Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="form-input"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              {editingCat ? 'Update Cat' : 'Add Cat'}
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;

