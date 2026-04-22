import React from 'react';
import { Star, MapPin, CheckCircle } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const SellerCard = ({ seller, onClick }) => {
  const { getProductsBySeller } = useProducts();
  const productCount = seller ? getProductsBySeller(seller.id).length : 0;
  return (
    <div
      onClick={() => onClick(seller)}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
    >
      {/* Banner */}
      <div className="h-24 bg-gradient-to-br from-indigo-400 to-purple-500 relative overflow-hidden">
        <img
          src={seller.banner}
          alt={seller.name}
          className="w-full h-full object-cover mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative -mt-10">
            <img
              src={seller.image}
              alt={seller.name}
              className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
            />
            {seller.verified && (
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-white">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 pt-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {seller.name}
            </h3>
            <p className="text-sm text-gray-500">{seller.type}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium text-gray-700">{seller.rating}</span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-500">{seller.totalSales} sales</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 mt-3 text-sm text-gray-500">
          <MapPin className="w-4 h-4" />
          {seller.location}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="text-center">
            <p className="text-xs text-gray-400">Response Rate</p>
            <p className="text-sm font-semibold text-gray-700">{seller.responseRate}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Response Time</p>
            <p className="text-sm font-semibold text-gray-700">{seller.responseTime}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Products</p>
            <p className="text-sm font-semibold text-gray-700">{productCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerCard;
