import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input, Select, Button, Card } from '../components/ui';
import { Phone, Lock, Store, MapPin, User, Upload, AlertCircle } from 'lucide-react';

const businessTypes = [
  { value: '', label: 'Select business type' },
  { value: 'Vegetables', label: 'Vegetables' },
  { value: 'Fruits', label: 'Fruits' },
  { value: 'Bakery', label: 'Bakery' },
  { value: 'Dairy', label: 'Dairy' },
  { value: 'Grains', label: 'Grains' },
  { value: 'Others', label: 'Others' },
];

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    shopName: '',
    ownerName: '',
    city: '',
    area: '',
    businessType: '',
    password: '',
    confirmPassword: '',
  });
  const [shopImage, setShopImage] = useState(null);
  const [shopImagePreview, setShopImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.shopName.trim()) {
      newErrors.shopName = 'Shop name is required';
    }
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.area.trim()) {
      newErrors.area = 'Area is required';
    }
    if (!formData.businessType) {
      newErrors.businessType = 'Please select a business type';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!shopImage) {
      newErrors.shopImage = 'Shop image is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setShopImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setShopImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      if (errors.shopImage) {
        setErrors(prev => ({ ...prev, shopImage: '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await signup(formData.email, formData.password, {
        shopName: formData.shopName,
        ownerName: formData.ownerName,
        location: `${formData.area}, ${formData.city}`,
        city: formData.city,
        area: formData.area,
        businessType: formData.businessType,
        avatar: shopImagePreview,
      });
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="w-full max-w-2xl mx-auto">
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

        {/* Signup Card */}
        <Card className="shadow-xl" padding={true}>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Create Your Shop
            </h2>
            <p className="text-sm text-gray-500">
              Register your business to start selling surplus food items
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Shop Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop Image <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="shopImage"
                />
                <label
                  htmlFor="shopImage"
                  className={`
                    flex flex-col items-center justify-center w-full h-32 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all
                    ${
                      shopImagePreview
                        ? 'border-emerald-300 bg-emerald-50'
                        : errors.shopImage
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }
                  `}
                >
                  {shopImagePreview ? (
                    <div className="text-center">
                      <img
                        src={shopImagePreview}
                        alt="Shop preview"
                        className="h-16 w-16 object-cover rounded-lg mx-auto mb-2"
                      />
                      <p className="text-sm text-gray-600">Click to change image</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-700">
                        Click to upload shop image
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>
              {errors.shopImage && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.shopImage}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="example@domain.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={User}
              />

              <Input
                label="Owner Name"
                name="ownerName"
                type="text"
                placeholder="Your full name"
                value={formData.ownerName}
                onChange={handleChange}
                error={errors.ownerName}
                icon={User}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Shop Name"
                name="shopName"
                type="text"
                placeholder="Your business name"
                value={formData.shopName}
                onChange={handleChange}
                error={errors.shopName}
                icon={Store}
              />

              <Select
                label="Business Type"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                options={businessTypes}
                error={errors.businessType}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="City"
                name="city"
                type="text"
                placeholder="Your city"
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
                icon={MapPin}
              />

              <Input
                label="Area"
                name="area"
                type="text"
                placeholder="Your area"
                value={formData.area}
                onChange={handleChange}
                error={errors.area}
                icon={MapPin}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={Lock}
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                icon={Lock}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              loading={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
