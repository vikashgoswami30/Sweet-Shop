import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/context/AuthContext.jsx';
import { validateEmail, validatePassword, validateRequired } from '../../services/utils/validation.js';
import { Button } from '../common/Button.jsx';
import { Input } from '../common/Input.jsx';

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    
    if (!validateRequired(formData.fullName)) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!validateRequired(formData.username)) {
      newErrors.username = 'Username is required';
    }
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      setLoading(true);
      await register(formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      setErrors({ form: error.message || 'Registration failed' });
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

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-purple-600 mb-2"> Sweet Shop</h1>
        <p className="text-gray-600">Create your account</p>
      </div>

      {errors.form && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {errors.form}
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="John Doe"
          error={errors.fullName}
          required
        />

        <Input
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="johndoe"
          error={errors.username}
          required
        />

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
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/login')}
          className="text-purple-600 hover:text-purple-700 font-medium"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
};