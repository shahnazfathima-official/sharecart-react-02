import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockProducts, mockSellers, mockCategories, mockChats } from '../utils/mockData';

const ProductContext = createContext(null);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, vendorsRes] = await Promise.all([
          fetch('http://localhost:5000/products'),
          fetch('http://localhost:5000/vendors')
        ]);
        
        if (productsRes.ok && vendorsRes.ok) {
           const fetchedProducts = await productsRes.json();
           const fetchedVendors = await vendorsRes.json();
           
           const mappedProducts = fetchedProducts.map(fp => ({
                 id: fp.id.toString(),
                 name: fp.name,
                 price: parseFloat(fp.price),
                 originalPrice: Math.round(fp.price * 1.5),
                 quantity: fp.quantity,
                 sellerId: fp.auth_id ? fp.auth_id.toString() : fp.vendor_id.toString(),
                 sellerName: fp.vendor_name || 'Store',
                 sellerRating: 4.5,
                 verified: true,
                 expiryDate: fp.expiry_date,
                 category: 'Vegetables', // Default mock fallback
                 image: fp.image_url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
                 condition: 'Good',
                 location: fp.shop_name || 'City Store',
                 unit: 'items'
           }));

           const mappedSellers = fetchedVendors.map(fv => ({
              id: fv.id.toString(),
              name: fv.name,
              type: 'Store',
              rating: 4.8,
              verified: true,
              location: fv.location,
              image: fv.avatar_url || 'https://images.unsplash.com/photo-1542838132-92b535c33f0c?w=400&h=400&fit=crop'
           }));

           setProducts(mappedProducts);
           setSellers(mappedSellers);
        } else {
           const errData = await productsRes.json().catch(() => ({}));
           alert("Supabase Database connection failed! Check your backend terminal.\nError: " + (errData.error || "Unknown"));
        }
      } catch (err) {
        console.error("Error connecting to backend:", err);
        alert("Failed to reach Node backend server. Is it running on port 5000?");
      } finally {
        setCategories(mockCategories);
        setChats(mockChats);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const addProduct = async (product) => {
    try {
        const res = await fetch('http://localhost:5000/products', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                 name: product.name,
                 quantity: product.quantity || 1,
                 price: product.price,
                 expiry_date: product.expiryDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
                 vendor_id: null,
                 seller_name: product.sellerName || 'Cake shop',
                 location: product.location || 'Local Store',
                 image_url: product.image,
                 vendor_avatar: product.sellerAvatar,
                 auth_id: product.sellerId, // Supabase UI passes user.id UUID here
                 is_surplus: true
             })
        });
        if (res.ok) {
             const fp = await res.json();
             const newProduct = { ...product, id: fp.id.toString(), createdAt: fp.created_at };
             setProducts([newProduct, ...products]);
             return newProduct;
        } else {
             const errData = await res.json().catch(() => ({}));
             alert("Failed to save product: " + (errData.error || "Database connection time out"));
             return null;
        }
    } catch(err) {
        console.error("Error adding product:", err);
        alert("Failed to reach server. Please check your backend connection.");
        return null;
    }
  };

  const updateProduct = (id, updates) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = async (id) => {
    try {
       await fetch(`http://localhost:5000/products/${id}`, { method: 'DELETE' });
    } catch (err) {
       console.error("Error deleting product:", err);
    }
    setProducts(products.filter(p => p.id !== id));
  };

  const getProductById = (id) => {
    return products.find(p => p.id === id);
  };

  const getSellerById = (id) => {
    return sellers.find(s => s.id === id);
  };

  const getProductsBySeller = (sellerId) => {
    return products.filter(p => p.sellerId === sellerId);
  };

  const getProductsByCategory = (category) => {
    if (category === 'All') return products;
    return products.filter(p => p.category === category);
  };

  const searchProducts = (query) => {
    const lowerQuery = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.sellerName.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    );
  };

  const sendMessage = (chatId, message) => {
    setChats(chats.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, { ...message, timestamp: new Date().toISOString() }],
          lastMessage: message.text,
          lastMessageTime: new Date().toISOString(),
        };
      }
      return chat;
    }));
  };

  const value = {
    products,
    sellers,
    categories,
    chats,
    selectedProduct,
    isLoading,
    setSelectedProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getSellerById,
    getProductsBySeller,
    getProductsByCategory,
    searchProducts,
    sendMessage,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export { ProductProvider };
export default ProductContext;
