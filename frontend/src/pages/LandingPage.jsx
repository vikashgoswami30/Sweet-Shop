import { useNavigate } from 'react-router-dom';
import { UserCircle, ShieldCheck } from 'lucide-react';
import { Button } from '../components/common/Button.jsx';

export const LandingPage = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    navigate('/register', { state: { role } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-purple-600 mb-4">🍬 Sweet Shop</h1>
          <p className="text-xl text-gray-600">Welcome! Please select your role to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div 
            onClick={() => handleRoleSelection('user')}
            className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl border-4 border-transparent hover:border-purple-400"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-100 p-6 rounded-full mb-6">
                <UserCircle size={64} className="text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Customer</h2>
              <p className="text-gray-600 mb-6">
                Browse and purchase delicious sweets from our collection
              </p>
              <ul className="text-left space-y-2 mb-8">
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  View all sweets
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Purchase sweets
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Track order history
                </li>
              </ul>
              <Button 
                onClick={() => handleRoleSelection('user')}
                variant="primary" 
                size="lg"
                className="w-full"
              >
                Continue as Customer
              </Button>
            </div>
          </div>

          <div 
            onClick={() => handleRoleSelection('admin')}
            className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl border-4 border-transparent hover:border-indigo-400"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-indigo-100 p-6 rounded-full mb-6">
                <ShieldCheck size={64} className="text-indigo-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Admin</h2>
              <p className="text-gray-600 mb-6">
                Manage inventory, add new sweets, and control the shop
              </p>
              <ul className="text-left space-y-2 mb-8">
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Add & edit sweets
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Manage inventory
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  Delete products
                </li>
              </ul>
              <Button 
                onClick={() => handleRoleSelection('admin')}
                variant="primary" 
                size="lg"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Continue as Admin
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-purple-600 hover:text-purple-700 font-semibold underline"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};