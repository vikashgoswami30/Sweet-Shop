import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/context/AuthContext.jsx';
import { validateEmail, validateRequired } from '../../services/utils/validation.js';
import { Button } from '../common/Button.jsx';
import { Input } from '../common/Input.jsx';

export const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }
    
    const passwordError = validateRequired(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    
    if (!validate()) return;

    try {
      setLoading(true);
      setErrors({});
      await login(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      const errorMessage = error?.response?.data?.message || error?.message || error;
      
      if (errorMessage.toLowerCase().includes('email')) {
        setErrors({ email: errorMessage });
      } else if (errorMessage.toLowerCase().includes('password') || errorMessage.toLowerCase().includes('credential')) {
        setErrors({ password: errorMessage });
      } else if (errorMessage.toLowerCase().includes('user') && errorMessage.toLowerCase().includes('not') && errorMessage.toLowerCase().includes('exist')) {
        setErrors({ email: 'User does not exist. Please check your email or register.' });
      } else {
        setErrors({ form: errorMessage });
      }
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
    if (errors.form) {
      setErrors(prev => ({ ...prev, form: '' }));
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-purple-600 mb-2">🍬 Sweet Shop</h1>
        <p className="text-gray-600">Welcome back! Please login to continue</p>
      </div>

      {errors.form && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold">Login Failed</p>
              <p className="text-sm">{errors.form}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          error={touched ? errors.email : ''}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={touched ? errors.password : ''}
          required
        />

        <Button
          type="submit"
          loading={loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="text-purple-600 hover:text-purple-700 font-medium"
        >
          Don't have an account? Register
        </button>
      </div>
    </div>
  );
};