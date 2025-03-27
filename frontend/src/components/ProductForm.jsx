import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ProductForm = ({ products, setProducts, editingProduct, setEditingProduct }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', quantity: 0, supplier: '' });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        quantity: editingProduct.quantity,
        supplier: editingProduct.supplier,
      });
    } else {
      setFormData({ name: '', quantity: 0, supplier: '' });
    }
  }, [editingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const response = await axiosInstance.put(`/api/products/${editingProduct._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProducts(products.map((product) => (product._id === response.data._id ? response.data : product)));
      } else {
        const response = await axiosInstance.post('/api/products', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProducts([...products, response.data]);
      }
      setEditingProduct(null);
      setFormData({ name: '', quantity: 0, supplier: '' });
    } catch (error) {
      alert('Failed to save product.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Create Product'}</h1>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Quantity"
        min="0"
        value={formData.quantity}
        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        value={formData.supplier}
        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingProduct ? 'Update' : 'Create'}
      </button>
    </form>
  );
};

export default ProductForm;
