import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input, Select, Button, Card } from '../components/ui';
import { Store, MapPin, Phone, Utensils } from 'lucide-react';

const shopCategories = [
  { value: '', label: 'Select category' },
  { value: 'Grocery Store', label: 'Grocery Store' },
  { value: 'Farm', label: 'Farm / Agriculture' },
  { value: 'Bakery', label: 'Bakery' },
  { value: 'Supermarket', label: 'Supermarket' },
  { value: 'Restaurant', label: 'Restaurant' },
  { value: 'Dairy Farm', label: 'Dairy Farm' },
  { value: 'Food Processor', label: 'Food Processor' },
];

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    phoneNumber: '',
    shopName: '',
    city: '',
    area: '',
    category: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Enter a valid 10-digit phone number';
    }
    if (!formData.shopName.trim()) {
      newErrors.shopName = 'Shop name is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.area.trim()) {
      newErrors.area = 'Area is required';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      login({
        id: 'user-' + Date.now(),
        phoneNumber: formData.phoneNumber,
        shopName: formData.shopName,
        location: `${formData.area}, ${formData.city}`,
        city: formData.city,
        area: formData.area,
        category: formData.category,
        avatar: null,
        isPremium: false,
      });
      setIsLoading(false);
      navigate('/');
    }, 1000);
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
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Vendor Login
            </h2>
            <p className="text-sm text-gray-500">
              Access your account to list or purchase surplus food
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              placeholder="Enter 10-digit phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={errors.phoneNumber}
              icon={Phone}
            />

            <Input
              label="Shop / Business Name"
              name="shopName"
              type="text"
              placeholder="Enter your shop name"
              value={formData.shopName}
              onChange={handleChange}
              error={errors.shopName}
              icon={Store}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="City"
                name="city"
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
                icon={MapPin}
              />
              <Input
                label="Area"
                name="area"
                type="text"
                placeholder="Area"
                value={formData.area}
                onChange={handleChange}
                error={errors.area}
                icon={MapPin}
              />
            </div>

            <Select
              label="Business Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={shopCategories}
              error={errors.category}
              icon={Utensils}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              loading={isLoading}
            >
              {isLoading ? 'Accessing Account...' : 'Access Account'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              By continuing, you agree to our{' '}
              <a href="#" className="text-indigo-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-indigo-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center mb-2">
              <Store className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">List Surplus</p>
            <p className="text-xs text-gray-500">Sell near-expiry items</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mb-2">
              <Utensils className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Bulk Purchase</p>
            <p className="text-xs text-gray-500">Buy at discounted rates</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
