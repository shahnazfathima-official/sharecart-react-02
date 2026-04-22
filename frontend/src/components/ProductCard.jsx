import React from 'react';
import { MapPin, Star, Clock } from 'lucide-react';
import Badge from './ui/Badge';
import { getExpiryInfo, calculateDiscount } from '../utils/mockData';

const ProductCard = ({ product, onClick }) => {
  const expiryInfo = getExpiryInfo(product.expiryDate);
  const discount = calculateDiscount(product.price, product.originalPrice);

  return (
    <div
      onClick={() => onClick(product)}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="danger" size="sm" className="shadow-lg">
            -{discount}%
          </Badge>
        </div>
        <div className="absolute bottom-2 left-2">
          <Badge
            variant={expiryInfo.color}
            size="sm"
            className="shadow-lg backdrop-blur-sm"
          >
            <Clock className="w-3 h-3 mr-1" />
            {expiryInfo.text}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500">{product.category}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-indigo-600">₹{product.price}</span>
          <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
          <span className="text-sm text-gray-500">/{product.unit}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>{product.quantity} {product.unit} available</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              {product.sellerName.charAt(0)}
            </div>
            <span className="text-sm font-medium text-gray-700">{product.sellerName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-gray-700">{product.sellerRating}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
          <MapPin className="w-3 h-3" />
          {product.location}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
