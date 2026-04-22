import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Select, Card } from '../components/ui';
import {
  Package,
  Scale,
  Calendar,
  Tag,
  Info,
  CheckCircle,
  ArrowRight,
  Upload,
  AlertCircle,
} from 'lucide-react';

const categories = [
  { value: '', label: 'Select category' },
  { value: 'Vegetables', label: 'Vegetables' },
  { value: 'Fruits', label: 'Fruits' },
  { value: 'Bakery', label: 'Bakery' },
  { value: 'Dairy', label: 'Dairy' },
  { value: 'Grains', label: 'Grains' },
  { value: 'Prepared Foods', label: 'Prepared Foods' },
];

const units = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'liters', label: 'Liters (L)' },
  { value: 'ml', label: 'Milliliters (mL)' },
  { value: 'units', label: 'Units' },
  { value: 'boxes', label: 'Boxes' },
  { value: 'packs', label: 'Packs' },
];

const storageTypes = [
  { value: 'Room Temperature', label: 'Room Temperature' },
  { value: 'Refrigerated', label: 'Refrigerated' },
  { value: 'Frozen', label: 'Frozen' },
  { value: 'Dry Storage', label: 'Dry Storage' },
];

const CreateListing = () => {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [productImage, setProductImage] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: 'kg',
    price: '',
    originalPrice: '',
    expiryDate: '',
    description: '',
    storageType: 'Room Temperature',
    minOrderQuantity: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProductImage(file);

    const reader = new FileReader();
    reader.onloadend = () => setProductImagePreview(reader.result);
    reader.readAsDataURL(file);

    setErrors((prev) => ({ ...prev, productImage: '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const nextStep = () => {
    const newErrors = {};
    if (step === 1) {
       if (!formData.name.trim()) newErrors.name = 'Required';
       if (!formData.category) newErrors.category = 'Required';
       if (!productImage) newErrors.productImage = 'Image required';
       if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
       }
    }
    if (step === 2) {
       if (!formData.quantity || Number(formData.quantity) <= 0) newErrors.quantity = 'Invalid quantity';
       if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Invalid price';
       if (!formData.originalPrice || Number(formData.originalPrice) <= Number(formData.price)) newErrors.originalPrice = 'Must be higher than price';
       if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
       }
    }
    setErrors({});
    setStep((s) => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate step 3 before submitting
    const newErrors = {};
    if (!formData.expiryDate) newErrors.expiryDate = 'Required';
    if (!formData.description.trim()) newErrors.description = 'Required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      await addProduct({
        ...formData,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        sellerId: user?.id,
        sellerName: user?.shopName,
        image: productImagePreview,
        available: true,
        createdAt: new Date().toISOString(),
      });
      navigate('/my-products');
    } catch(err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="pb-20">
      <div className="bg-indigo-600 text-white p-6 text-center">
        <h1 className="text-2xl font-bold">Create Listing</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">

            {step === 1 && (
              <>
                <Input name="name" label="Product Name" value={formData.name} onChange={handleChange} error={errors.name} />
                <Select name="category" label="Category" value={formData.category} onChange={handleChange} options={categories} />

                <input type="file" onChange={handleImageChange} />
                {errors.productImage && <p className="text-red-500 text-sm">{errors.productImage}</p>}
              </>
            )}

            {step === 2 && (
              <>
                <Input name="quantity" label="Quantity" type="number" value={formData.quantity} onChange={handleChange} error={errors.quantity} />
                <Input name="price" label="Price" type="number" value={formData.price} onChange={handleChange} error={errors.price} />
                <Input name="originalPrice" label="Original Price" type="number" value={formData.originalPrice} onChange={handleChange} error={errors.originalPrice} />
              </>
            )}

            {step === 3 && (
              <>
                <Input name="expiryDate" type="date" label="Expiry Date" value={formData.expiryDate} onChange={handleChange} error={errors.expiryDate} />
                <div className="flex flex-col gap-1">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={`w-full border p-2 rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Description"
                  />
                  {errors.description && <span className="text-red-500 text-sm mt-1">{errors.description}</span>}
                </div>
              </>
            )}

            <div className="flex gap-2">
              {step > 1 && (
                <Button type="button" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}

              {step < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" loading={isLoading}>
                  Submit
                </Button>
              )}
            </div>

          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateListing;