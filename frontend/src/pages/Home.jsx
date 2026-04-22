import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import SellerCard from '../components/SellerCard';
import { Button, Badge } from '../components/ui';
import { TrendingUp, MapPin, Star, ArrowRight, Zap, Filter, X } from 'lucide-react';
import { getExpiryInfo } from '../utils/mockData';

const Home = () => {
  const { categories, products, sellers, getProductsByCategory, searchProducts } = useProducts();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [freshness, setFreshness] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Filter products based on category, search, and freshness
  const filteredProducts = useMemo(() => {
    let result = selectedCategory === 'All'
      ? products
      : getProductsByCategory(selectedCategory);

    // Apply search
    if (searchQuery) {
      result = searchProducts(searchQuery);
    }

    // Apply freshness filter
    if (freshness !== 'All') {
      result = result.filter(p => {
        const expiry = getExpiryInfo(p.expiryDate);
        if (freshness === 'Fresh') return expiry.status === 'fresh';
        if (freshness === 'Moderately Fresh') return expiry.status === 'moderate';
        if (freshness === 'Near Expiry') return expiry.status === 'urgent' || expiry.status === 'soon';
        return true;
      });
    }

    return result;
  }, [selectedCategory, searchQuery, freshness, products, getProductsByCategory, searchProducts]);

  // Get urgent expiry products
  const urgentProducts = products
    .filter(p => {
      const expiry = getExpiryInfo(p.expiryDate);
      return expiry.status === 'urgent' || expiry.status === 'soon';
    })
    .slice(0, 4);

  // Top rated sellers
  const topSellers = [...sellers]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const hasActiveFilters = selectedCategory !== 'All' || searchQuery || freshness !== 'All';

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white pt-8 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Welcome to ShareCart
            </h1>
            <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
              Connect with vendors, reduce food waste, and save money on surplus food items
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search items, sellers, or categories..."
              className="shadow-xl"
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-lg mx-auto">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold">{products.length}+</p>
              <p className="text-indigo-200 text-sm">Active Listings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold">{sellers.length}+</p>
              <p className="text-indigo-200 text-sm">Verified Sellers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold">50%+</p>
              <p className="text-indigo-200 text-sm">Average Savings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-4 -mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={setSelectedCategory}
                  isSelected={selectedCategory === category.name}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="px-4 mt-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-gray-700 font-medium"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-semibold">
                  Active
                </span>
              )}
            </button>

            {/* Active Filter Badges */}
            {hasActiveFilters && (
              <div className="flex gap-2 flex-wrap">
                {searchQuery && (
                  <Badge variant="primary">
                    Search: {searchQuery}
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-1 hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {selectedCategory !== 'All' && (
                  <Badge variant="primary">
                    {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className="ml-1 hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {freshness !== 'All' && (
                  <Badge variant="primary">
                    {freshness}
                    <button
                      onClick={() => setFreshness('All')}
                      className="ml-1 hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Expanded Filter Panel */}
          {showFilters && (
            <div className="mt-4 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Freshness Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Freshness</h3>
                  <div className="space-y-3">
                    {['All', 'Fresh', 'Moderately Fresh', 'Near Expiry'].map((option) => (
                      <label key={option} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="freshness"
                          value={option}
                          checked={freshness === option}
                          onChange={(e) => setFreshness(e.target.value)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Category</h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {['All', 'Vegetables', 'Fruits', 'Bakery', 'Dairy', 'Grains', 'Food Items', 'Prepared Foods'].map((cat) => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value={cat}
                          checked={selectedCategory === cat}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                        />
                        <span className="text-gray-700">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedCategory('All');
                    setFreshness('All');
                    setSearchQuery('');
                  }}
                >
                  Clear All
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Urgent Listings Section */}
      {urgentProducts.length > 0 && (
        <section className="px-4 mt-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Expiring Soon</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {urgentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => {}}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Grid Section */}
      <section className="px-4 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {searchQuery ? `Search Results (${filteredProducts.length})` : `Available Products (${filteredProducts.length})`}
            </h2>
          </div>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No products found matching your filters</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setFreshness('All');
                  setSearchQuery('');
                }}
                className="text-indigo-600 font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Top Sellers Section */}
      <section className="px-4 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Top Rated Sellers</h2>
            </div>
            <Link
              to="/vendors"
              className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topSellers.map((seller) => (
              <SellerCard
                key={seller.id}
                seller={seller}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="px-4 mt-8 mb-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-8 text-center text-white shadow-xl shadow-indigo-500/30">
              <h2 className="text-2xl font-bold mb-2">Start Selling Today</h2>
              <p className="text-indigo-100 mb-6">
                List your surplus food items and connect with buyers in your area
              </p>
              <Link to="/signup">
                <Button variant="secondary" size="lg">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
