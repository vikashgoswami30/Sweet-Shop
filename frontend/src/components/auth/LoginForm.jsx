import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/context/AuthContext.jsx';
import { validateEmail, validateRequired } from '../../services/utils/validation.js';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!validateRequired(formData.password)) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      setLoading(true);
      await login(formData);
      navigate('/dashboard');
    } catch (error) {
      setErrors({ form: error.message || 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-purple-600 mb-2">🍬 Sweet Shop</h1>
        <p className="text-gray-600">Welcome back! Please login to continue</p>
      </div>

      {errors.form && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {errors.form}
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          error={errors.email}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.password}
          required
        />

        <Button
          onClick={handleSubmit}
          loading={loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/register')}
          className="text-purple-600 hover:text-purple-700 font-medium"
        >
          Don't have an account? Register
        </button>
      </div>
    </div>
  );
};