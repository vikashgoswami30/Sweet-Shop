import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal.jsx';
import { Button } from '../common/Button.jsx';
import { Input } from '../common/Input.jsx';
import { validateRequired, validatePrice, validateQuantity } from "../../services/utils/validation.js";
import { sweetsAPI } from '../../services/api.js';

const CATEGORIES = ['candy', 'chocolate', 'pastry', 'chasni', 'barfi', 'ladoo', 'halwa', 'other'];

export const EditSweetModal = ({ isOpen, onClose, onSuccess, sweet }) => {
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
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (sweet) {
      setFormData({
        name: sweet.name || '',
        flavor: sweet.flavor || '',
        price: sweet.price || '',
        quantity: sweet.quantity || '',
        category: sweet.category || 'candy',
      });
    }
  }, [sweet]);

  const validate = () => {
    const newErrors = {};
    
    const nameError = validateRequired(formData.name);
    if (nameError) {
      newErrors.name = nameError;
    }
    
    const flavorError = validateRequired(formData.flavor);
    if (flavorError) {
      newErrors.flavor = flavorError;
    }
    
    const priceError = validatePrice(formData.price);
    if (priceError) {
      newErrors.price = priceError;
    }
    
    const quantityError = validateQuantity(formData.quantity);
    if (quantityError) {
      newErrors.quantity = quantityError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setTouched(true);
    
    if (!validate()) return;

    try {
      setLoading(true);
      
      if (image) {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('flavor', formData.flavor);
        data.append('price', formData.price);
        data.append('quantity', formData.quantity);
        data.append('category', formData.category);
        data.append('sweetImage', image);

        await sweetsAPI.update(sweet._id, data);
      } else {
        await sweetsAPI.update(sweet._id, formData);
      }
      
      setImage(null);
      setTouched(false);
      setErrors({});
      
      onSuccess();
      onClose();
    } catch (error) {
      setErrors({ form: error.message || 'Failed to update sweet' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched && errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    if (touched && errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleClose = () => {
    setImage(null);
    setErrors({});
    setTouched(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Sweet">
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
          error={touched ? errors.name : ''}
          required
        />

        <Input
          label="Flavor"
          name="flavor"
          value={formData.flavor}
          onChange={handleChange}
          placeholder="Rose"
          error={touched ? errors.flavor : ''}
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
            error={touched ? errors.price : ''}
            required
          />

          <Input
            label="Quantity"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="50"
            error={touched ? errors.quantity : ''}
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
            Image <span className="text-gray-500">(optional - leave empty to keep current)</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          {image && <p className="mt-1 text-sm text-green-600">✓ {image.name}</p>}
          {!image && sweet?.sweetImage && (
            <p className="mt-1 text-sm text-gray-500">Current image will be kept</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleClose}
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
            {loading ? 'Updating...' : 'Update Sweet'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};