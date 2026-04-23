import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input, Button, Card } from '../components/ui';
import { Phone, Lock } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      console.error(error);
      setErrors({ email: error.message });
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ShareCart</h1>
          <p className="text-gray-600">B2B Surplus Food Marketplace</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl" padding={true}>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Vendor Login
            </h2>
            <p className="text-sm text-gray-500">
              Access your account to manage listings and purchases
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={Phone}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={Lock}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              loading={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
