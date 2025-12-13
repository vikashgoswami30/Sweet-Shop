import { LoginForm } from '../components/auth/LoginForm.jsx';
export const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};