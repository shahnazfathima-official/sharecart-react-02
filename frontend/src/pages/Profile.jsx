import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { Button, Card, Badge } from '../components/ui';
import {
  User,
  MapPin,
  Star,
  Settings,
  HelpCircle,
  LogOut,
  Crown,
  Package,
  ShoppingBag,
  MessageCircle,
  ChevronRight,
  Shield,
  CreditCard,
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { products, chats } = useProducts();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const userProducts = products.filter(p => p.sellerId === user?.id);
  const unreadMessages = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      icon: Package,
      label: 'My Listings',
      value: `${userProducts.length} active`,
      onClick: () => navigate('/my-products'),
    },
    {
      icon: ShoppingBag,
      label: 'Purchase History',
      value: 'View orders',
      onClick: () => {},
    },
    {
      icon: MessageCircle,
      label: 'Messages',
      value: unreadMessages > 0 ? `${unreadMessages} unread` : 'View all',
      onClick: () => navigate('/chat'),
    },
    {
      icon: Settings,
      label: 'Settings',
      value: 'Notifications, Privacy',
      onClick: () => {},
    },
    {
      icon: CreditCard,
      label: 'Payment Methods',
      value: 'Add payment',
      onClick: () => {},
    },
    {
      icon: Shield,
      label: 'Help & Support',
      value: 'FAQ, Contact us',
      onClick: () => {},
    },
  ];

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white pt-8 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Profile</h1>

          {/* Profile Card */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-bold border-2 border-white/30">
              {user?.shopName?.charAt(0) || <User className="w-10 h-10" />}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{user?.shopName || 'Guest User'}</h2>
              <p className="text-indigo-200">{user?.category || 'Vendor'}</p>
              <div className="flex items-center gap-1 mt-1 text-indigo-200 text-sm">
                <MapPin className="w-4 h-4" />
                {user?.location || 'Location not set'}
              </div>
            </div>
            <button className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 -mt-12">
        {/* Premium Banner */}
        {!user?.isPremium && (
          <Card className="mb-4 bg-gradient-to-br from-amber-400 to-orange-500 border-none text-white overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Upgrade to Premium</h3>
                <p className="text-white/90 text-sm">
                  Get featured listings, analytics, and priority support
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">₹499</p>
                <p className="text-white/80 text-sm">/month</p>
              </div>
              <Button variant="secondary" size="sm" className="ml-2">
                Upgrade
              </Button>
            </div>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card className="text-center" padding={true}>
            <Package className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{userProducts.length}</p>
            <p className="text-xs text-gray-500">Active Listings</p>
          </Card>
          <Card className="text-center" padding={true}>
            <ShoppingBag className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500">Sales</p>
          </Card>
          <Card className="text-center" padding={true}>
            <Star className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">--</p>
            <p className="text-xs text-gray-500">Rating</p>
          </Card>
        </div>

        {/* Menu Items */}
        <Card className="mb-4" padding={false}>
          <div className="divide-y divide-gray-100">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.value}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              );
            })}
          </div>
        </Card>

        {/* Account Info */}
        <Card className="mb-4" padding={true}>
          <h3 className="font-semibold text-gray-900 mb-4">Account Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Phone Number</span>
              <span className="font-medium text-gray-900">{user?.phoneNumber || 'Not set'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Business Type</span>
              <span className="font-medium text-gray-900">{user?.category || 'Not set'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Member Since</span>
              <span className="font-medium text-gray-900">
                {user?.id ? new Date(parseInt(user.id.split('-')[1])).toLocaleDateString('en-IN', {
                  month: 'long',
                  year: 'numeric',
                }) : 'Recently'}
              </span>
            </div>
          </div>
        </Card>

        {/* Logout Button */}
        <Button
          variant="danger"
          className="w-full"
          onClick={() => setShowLogoutConfirm(true)}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowLogoutConfirm(false)} />
            <Card className="relative max-w-sm w-full p-6 animate-scale-in">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Logout</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to logout? You will need to sign in again to access your account.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* App Version */}
        <p className="text-center text-sm text-gray-400 mt-6">
          ShareCart v1.0.0
        </p>
        <p className="text-center text-xs text-gray-400 mt-1">
          A Cloud Computing Project
        </p>
      </div>
    </div>
  );
};

export default Profile;
