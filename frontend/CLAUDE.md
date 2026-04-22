# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ShareCart is a B2B surplus food marketplace web application built with Vite + React. It connects vendors who have near-expiry food items with buyers looking for discounted bulk purchases.

**Tech Stack**: Vite 5, React 18, TailwindCSS v4, React Router DOM v7, Lucide React icons

**Important**: This is a web application (runs in browser), NOT React Native. The user may have referred to it as React Native but it uses Vite as the build tool.

---

## Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## Architecture

### State Management (Context API)

Two main context providers wrap the app in `App.jsx`:
- **AuthContext** (`src/context/AuthContext.jsx`): Manages user authentication state, persisted to localStorage
- **ProductContext** (`src/context/ProductContext.jsx`): Manages products, sellers, categories, and chat messages with mock data

### Routing Structure (`src/App.jsx`)

Routes are protected with `ProtectedRoute` wrapper that redirects unauthenticated users to `/auth`. Public routes (like `/auth`) redirect authenticated users to `/`.

**Routes**:
- `/auth` - Login/Signup page (public)
- `/` - Home page (protected)
- `/products` - Browse products (protected)
- `/products/:id` - Product detail (protected)
- `/sellers/:id` - Seller profile (protected)
- `/create` - Create new listing (protected)
- `/chat` - Chat/messages (protected)
- `/profile` - User profile (protected)

### Data Flow

Mock data in `src/utils/mockData.jsx` simulates backend responses. ProductContext initializes with this data after a 500ms delay (simulating API call). Auth state persists to localStorage and restores on page load.

### Folder Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI primitives (Button, Input, Card, Modal, Badge, Select)
│   ├── Navbar.jsx    # Top navigation bar
│   ├── Sidebar.jsx   # Mobile sidebar menu
│   ├── SearchBar.jsx # Search input component
│   ├── ProductCard.jsx
│   ├── CategoryCard.jsx
│   ├── SellerCard.jsx
│   └── MenuIcon.jsx
├── context/
│   ├── AuthContext.jsx    # Auth state + login/logout/updateUser
│   └── ProductContext.jsx # Products/sellers/chats CRUD operations
├── pages/
│   ├── Home.jsx          # Dashboard with categories, products, sellers
│   ├── Auth.jsx          # Login form (phone + shop details)
│   ├── Products.jsx      # Product listing with filters
│   ├── ProductDetail.jsx # Single product view + negotiate/buy
│   ├── SellerProfile.jsx # Seller info + their products
│   ├── CreateListing.jsx # Multi-step form to create product
│   ├── Chat.jsx          # Message list + conversation view
│   └── Profile.jsx       # User profile + settings
├── utils/
│   └── mockData.jsx      # Mock products, sellers, categories, chats + helpers
├── App.jsx               # Main app with routing
├── main.jsx              # Entry point
└── index.css             # Global styles + Tailwind imports
```

---

## Known Bug

**`src/components/SellerCard.jsx` line 71**: Products count is hardcoded as `12` instead of using dynamic data from the seller object. The mock seller objects don't have a `productCount` field, so this should either use `sellerProducts.length` from ProductContext or be added to the mock data.

---

## Design System

### UI Components (`src/components/ui/`)

All UI components accept standard props:
- **Button**: `variant` (primary/secondary/success/danger/ghost/outline), `size` (sm/md/lg/xl), `loading`, `disabled`
- **Input**: `label`, `error`, `icon`, `helperText`
- **Card**: `padding` (boolean), `hover`, `onClick`
- **Badge**: `variant` (default/primary/success/warning/danger/purple/teal), `size` (sm/md/lg)
- **Select**: Same as Input
- **Modal**: `isOpen`, `onClose`, `title`, `size` (sm/md/lg/xl/full)

### Color Palette

Primary gradient: `from-indigo-600 to-violet-600`
- Success: `emerald-500 to teal-500`
- Warning: `amber-100 to amber-700`
- Danger: `red-100 to red-700`

### TailwindCSS Version

This project uses TailwindCSS v4 with the `@tailwindcss/vite` plugin. The `tailwind.config.js` extends the default theme but Tailwind v4 uses CSS-based configuration rather than JS config in some cases.

---

## Mock Data Structure

### Products
```js
{
  id, name, category, quantity, unit, price, originalPrice,
  sellerId, sellerName, sellerRating, verified, expiryDate,
  description, image, condition, storageType, minOrderQuantity,
  available, views, location
}
```

### Sellers
```js
{
  id, name, type, rating, totalSales, verified, location,
  image, banner, description, joinedDate, responseRate, responseTime
}
```

### Chats
```js
{
  id, participantId, participantName, participantImage,
  lastMessage, lastMessageTime, unreadCount, messages[]
}
```

---

## Environment

- **Node.js**: v18+ recommended (project uses ES modules with `"type": "module"`)
- **Package Manager**: npm (lock file present)
- **Browser**: Modern browsers with ES6+ support
