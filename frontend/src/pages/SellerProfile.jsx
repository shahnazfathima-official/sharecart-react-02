import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { Button, Badge } from '../components/ui';
import {
  MapPin,
  Star,
  CheckCircle,
  Package,
  TrendingUp,
  MessageCircle,
  ArrowLeft,
  Clock,
  Award,
} from 'lucide-react';

const SellerProfile = () => {
  const { id } = useParams();
  const { getSellerById, getProductsBySeller } = useProducts();

  const seller = getSellerById(id);
  const sellerProducts = seller ? getProductsBySeller(id) : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Seller Not Found</h2>
          <p className="text-gray-500 mb-4">This seller may have been removed</p>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header Banner */}
      <div className="relative h-48 bg-gradient-to-br from-indigo-400 to-purple-500 overflow-hidden">
        <img
          src={seller.banner}
          alt={seller.name}
          className="w-full h-full object-cover mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Section */}
      <div className="px-4 -mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={seller.image}
                  alt={seller.name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md"
                />
                {seller.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1.5 border-4 border-white">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">{seller.name}</h1>
                  {seller.verified && (
                    <Badge variant="success" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-gray-500 mb-2">{seller.type}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-gray-900">{seller.rating}</span>
                    <span className="text-gray-400">({seller.totalSales} sales)</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    {seller.location}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="secondary" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Contact
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-600">{seller.description}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Package className="w-5 h-5 text-indigo-600" />
                  <p className="text-xs text-gray-500">Active Listings</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{sellerProducts.length}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <p className="text-xs text-gray-500">Total Sales</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{seller.totalSales}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <p className="text-xs text-gray-500">Response Time</p>
                </div>
                <p className="text-lg font-bold text-gray-900">{seller.responseTime}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Award className="w-5 h-5 text-purple-600" />
                  <p className="text-xs text-gray-500">Response Rate</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{seller.responseRate}</p>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {seller.name}'s Products
              </h2>
              <span className="text-sm text-gray-500">
                {sellerProducts.length} items
              </span>
            </div>

            {sellerProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sellerProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No products available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
