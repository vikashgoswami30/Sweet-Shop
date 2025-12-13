import {RegisterForm} from '../components/auth/RegisterForm.jsx';

export const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};