import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui';

const Vendors = () => {
  const { sellers } = useProducts();

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white pt-8 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">All Vendors</h1>
          <p className="text-indigo-100 text-lg">
            Discover our network of verified sellers offering quality surplus food items
          </p>
          <div className="mt-4 flex items-center gap-2 text-indigo-100">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-semibold">
              {sellers.length}
            </div>
            <span>Active Vendors</span>
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellers.map((seller) => (
              <div
                key={seller.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group"
              >
                {/* Shop Banner/Image */}
                <div className="relative overflow-hidden bg-gray-200 h-48">
                  {seller.image ? (
                    <img
                      src={seller.image}
                      alt={seller.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center">
                      <span className="text-indigo-600 text-6xl font-bold opacity-50">
                        {seller.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  {seller.verified && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      ✓ Verified
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {seller.name}
                  </h3>
                  <p className="text-sm text-indigo-600 font-medium mb-3">
                    {seller.type}
                  </p>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    {seller.location}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-gray-900">{seller.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {seller.totalSales} orders
                    </span>
                  </div>

                  {/* Response Info */}
                  <div className="bg-gray-50 rounded-xl p-3 mb-4 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Response Rate: <strong>{seller.responseRate}</strong></span>
                      <span>Avg Response: <strong>{seller.responseTime}</strong></span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {seller.description}
                  </p>

                  {/* Action Button */}
                  <Link
                    to={`/sellers/${seller.id}`}
                    className="w-full inline-block"
                  >
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      View Shop
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Vendors;
