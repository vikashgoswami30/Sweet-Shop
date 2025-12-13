import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { validateRequired, validatePrice, validateQuantity } from "../../services/utils/validation.js";import { sweetsAPI } from '../../services/api';

const CATEGORIES = ['candy', 'chocolate', 'pastry', 'chasni', 'barfi', 'ladoo', 'halwa', 'other'];

export const AddSweetModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    flavor: '',
    price: '',
    quantity: '',
    category: 'candy',
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    
    if (!validateRequired(formData.name)) {
      newErrors.name = 'Name is required';
    }
    
    if (!validateRequired(formData.flavor)) {
      newErrors.flavor = 'Flavor is required';
    }
    
    if (!validatePrice(formData.price)) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!validateQuantity(formData.quantity)) {
      newErrors.quantity = 'Quantity must be 0 or greater';
    }
    
    if (!image) {
      newErrors.image = 'Image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const data = new FormData();
      data.append('name', formData.name);
      data.append('flavor', formData.flavor);
      data.append('price', formData.price);
      data.append('quantity', formData.quantity);
      data.append('category', formData.category);
      data.append('sweetImage', image);

      await sweetsAPI.create(data);
      
      // Reset form
      setFormData({ name: '', flavor: '', price: '', quantity: '', category: 'candy' });
      setImage(null);
      
      onSuccess();
      onClose();
    } catch (error) {
      setErrors({ form: error.message || 'Failed to add sweet' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Sweet">
      {errors.form && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {errors.form}
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Gulab Jamun"
          error={errors.name}
          required
        />

        <Input
          label="Flavor"
          name="flavor"
          value={formData.flavor}
          onChange={handleChange}
          placeholder="Rose"
          error={errors.flavor}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="150"
            error={errors.price}
            required
          />

          <Input
            label="Quantity"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="50"
            error={errors.quantity}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={onClose}
            variant="secondary"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            className="flex-1"
          >
            {loading ? 'Adding...' : 'Add Sweet'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};