import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui';

const Products = () => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { user } = useAuth();

  // Filter only current user's products
  const myProducts = products.filter(
    (p) => p.sellerId === user?.id || p.sellerName === user?.shopName
  );

  const handleEditProduct = (productId) => {
    console.log('Edit product:', productId);
  };

  const handleDeleteProduct = (productId) => {
    console.log('Delete product:', productId);
  };

  const handleCreateNew = () => {
    navigate('/create');
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white pt-8 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                My Products
              </h1>
              <p className="text-indigo-100">
                Manage your listings
              </p>
            </div>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleCreateNew}
              className="flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Listing
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-2xl font-bold">{myProducts.length}</p>
              <p className="text-indigo-200 text-sm">Listings</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {myProducts.reduce((sum, p) => sum + p.quantity, 0)}
              </p>
              <p className="text-indigo-200 text-sm">Quantity</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                ₹{myProducts.reduce((sum, p) => sum + p.price * p.quantity, 0)}
              </p>
              <p className="text-indigo-200 text-sm">Total Value</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {myProducts.filter((p) => p.available).length}
              </p>
              <p className="text-indigo-200 text-sm">Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {myProducts.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {myProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.category}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          ₹{product.price}
                        </p>
                      </td>

                      {/* Quantity */}
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.quantity} {product.unit}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            product.available
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.available ? 'Available' : 'Sold Out'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleEditProduct(product.id)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <AlertCircle className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                No Products Yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first listing to get started
              </p>
              <Button onClick={handleCreateNew}>
                Create Listing
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;