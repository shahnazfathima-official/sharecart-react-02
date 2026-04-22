import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { Button, Badge, Modal } from '../components/ui';
import {
  Clock,
  MapPin,
  Star,
  CheckCircle,
  Package,
  Tag,
  Thermometer,
  MessageCircle,
  ShoppingCart,
  ArrowLeft,
  Share2,
  Heart,
} from 'lucide-react';
import { getExpiryInfo, calculateDiscount } from '../utils/mockData';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, getSellerById } = useProducts();
  const { isAuthenticated } = useAuth();
  const [showNegotiateModal, setShowNegotiateModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [negotiationPrice, setNegotiationPrice] = useState('');

  const product = getProductById(id);
  const seller = product ? getSellerById(product.sellerId) : null;
  const expiryInfo = product ? getExpiryInfo(product.expiryDate) : null;
  const discount = product ? calculateDiscount(product.price, product.originalPrice) : 0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-4">This product may have been removed or sold</p>
          <Button onClick={() => navigate('/products')}>Browse Products</Button>
        </div>
      </div>
    );
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    alert('Purchase flow would be implemented here. This would integrate with the backend payment system.');
  };

  const handleNegotiate = () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    setShowNegotiateModal(true);
  };

  const submitNegotiation = () => {
    alert(`Negotiation request of ₹${negotiationPrice} sent to seller!`);
    setShowNegotiateModal(false);
    setNegotiationPrice('');
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white pt-6 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-indigo-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-3">
                <Badge variant="purple" className="bg-white/20 text-white">
                  {product.category}
                </Badge>
                <Badge variant={expiryInfo.color} className="bg-white/20 text-white">
                  <Clock className="w-3 h-3 mr-1" />
                  {expiryInfo.text}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full ${isLiked ? 'bg-red-500' : 'bg-white/20'} hover:scale-110 transition-all`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : 'text-white'}`} />
              </button>
              <button className="p-2 rounded-full bg-white/20 hover:scale-110 transition-all">
                <Share2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Product Image */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium text-gray-900">{product.category}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Quantity Available</p>
                    <p className="font-medium text-gray-900">
                      {product.quantity} {product.unit}
                      {product.minOrderQuantity && (
                        <span className="text-sm text-gray-500 ml-2">
                          (Min order: {product.minOrderQuantity} {product.unit})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Thermometer className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Storage Type</p>
                    <p className="font-medium text-gray-900">{product.storageType}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Expiry Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(product.expiryDate).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <Badge variant={expiryInfo.color} className="mt-1">
                      {expiryInfo.text}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">{product.location}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-indigo-50 rounded-xl">
                <h3 className="font-semibold text-indigo-900 mb-2">Description</h3>
                <p className="text-indigo-700">{product.description}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Price Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sticky top-20">
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-indigo-600">₹{product.price}</span>
                  <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                </div>
                <Badge variant="danger" className="mt-2">
                  Save {discount}%
                </Badge>
                <p className="text-sm text-gray-500 mt-2">per {product.unit}</p>
              </div>

              <div className="space-y-2">
                <Button variant="success" size="lg" className="w-full" onClick={handleBuyNow}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Now
                </Button>
                <Button variant="secondary" size="lg" className="w-full" onClick={handleNegotiate}>
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Negotiate Price
                </Button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Views</span>
                  <span className="font-medium text-gray-900">{product.views}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-500">Condition</span>
                  <Badge variant="success">{product.condition}</Badge>
                </div>
              </div>
            </div>

            {/* Seller Card */}
            {seller && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Seller Information</h3>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={seller.image}
                    alt={seller.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{seller.name}</p>
                      {seller.verified && (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{seller.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-gray-900">{seller.rating}</span>
                  <span className="text-gray-400 mx-1">•</span>
                  <span className="text-sm text-gray-500">{seller.totalSales} sales</span>
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                  <MapPin className="w-4 h-4" />
                  {seller.location}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Response Rate</p>
                    <p className="font-semibold text-gray-900">{seller.responseRate}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Response Time</p>
                    <p className="font-semibold text-gray-900">{seller.responseTime}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Negotiate Modal */}
      <Modal
        isOpen={showNegotiateModal}
        onClose={() => setShowNegotiateModal(false)}
        title="Negotiate Price"
        size="sm"
      >
        <div className="space-y-4">
          <div className="bg-indigo-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-indigo-700">Current Price</span>
              <span className="font-semibold text-indigo-900">₹{product.price}/{product.unit}</span>
            </div>
            <p className="text-xs text-indigo-600">
              Sellers are often open to negotiation for bulk orders
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Your Offer (₹/{product.unit})
            </label>
            <input
              type="number"
              value={negotiationPrice}
              onChange={(e) => setNegotiationPrice(e.target.value)}
              placeholder={`Enter amount (e.g., ${Math.floor(product.price * 0.8)})`}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowNegotiateModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={submitNegotiation}
              disabled={!negotiationPrice}
            >
              Send Offer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductDetail;
