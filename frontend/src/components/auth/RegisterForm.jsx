import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../services/context/AuthContext.jsx';
import { validateEmail, validatePassword, validateRequired } from '../../services/utils/validation.js';
import { Button } from '../common/Button.jsx';
import { Input } from '../common/Input.jsx';

export const RegisterForm = () => {
  const location = useLocation();
  const selectedRole = location.state?.role || 'user';
  
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: selectedRole,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    
    const fullNameError = validateRequired(formData.fullName);
    if (fullNameError) {
      newErrors.fullName = fullNameError;
    }
    
    const usernameError = validateRequired(formData.username);
    if (usernameError) {
      newErrors.username = usernameError;
    }
    
    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }
    
    const passwordError = validatePassword(formData.password);
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
      await register(formData);
      
      alert(`✅ Registration successful as ${formData.role}! Please login.`);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      
      const errorMessage = error?.response?.data?.message || error?.message || error;
      
      if (errorMessage.toLowerCase().includes('username') && errorMessage.toLowerCase().includes('exist')) {
        setErrors({ username: 'Username already taken. Please choose another.' });
      } else if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('exist')) {
        setErrors({ email: 'Email already registered. Please login or use another email.' });
      } else if (errorMessage.toLowerCase().includes('username')) {
        setErrors({ username: errorMessage });
      } else if (errorMessage.toLowerCase().includes('email')) {
        setErrors({ email: errorMessage });
      } else if (errorMessage.toLowerCase().includes('password')) {
        setErrors({ password: errorMessage });
      } else if (errorMessage.toLowerCase().includes('fullname') || errorMessage.toLowerCase().includes('full name')) {
        setErrors({ fullName: errorMessage });
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
        <p className="text-gray-600">Create your account as {formData.role === 'admin' ? 'Admin' : 'Customer'}</p>
        <div className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-semibold ${
          formData.role === 'admin' 
            ? 'bg-indigo-100 text-indigo-700' 
            : 'bg-purple-100 text-purple-700'
        }`}>
          Registering as: {formData.role === 'admin' ? '🛡️ Admin' : '👤 Customer'}
        </div>
      </div>

      {errors.form && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold">Registration Failed</p>
              <p className="text-sm">{errors.form}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="John Doe"
          error={touched ? errors.fullName : ''}
          required
        />

        <Input
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="johndoe"
          error={touched ? errors.username : ''}
          required
        />

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
          {loading ? 'Registering...' : `Register as ${formData.role === 'admin' ? 'Admin' : 'Customer'}`}
        </Button>
      </form>

      <div className="mt-6 text-center space-y-2">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-purple-600 hover:text-purple-700 font-medium block w-full"
        >
          Already have an account? Login
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Change role
        </button>
      </div>
    </div>
  );
};