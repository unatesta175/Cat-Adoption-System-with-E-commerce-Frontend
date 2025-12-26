# 🎨 Purrfect Match - Frontend (Client)

React-based frontend application for the Purrfect Match cat adoption platform.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will start on `http://localhost:3000` with hot-reload enabled.

### Build for Production

```bash
npm run build
```

The production build will be created in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
client/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Navbar.jsx      # Navigation bar
│   │   ├── PetCard.jsx     # Cat card component
│   │   ├── Hero.jsx        # Hero section
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin dashboard pages
│   │   │   ├── AdminCats.jsx
│   │   │   ├── AdminProducts.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   └── AdminAdoptions.jsx
│   │   ├── Home.jsx        # Landing page
│   │   ├── Browse.jsx      # Browse cats page
│   │   ├── Shop.jsx        # Product shop page
│   │   ├── Cart.jsx        # Shopping cart
│   │   ├── Checkout.jsx    # Checkout page
│   │   └── ...
│   ├── context/            # React Context providers
│   │   ├── AuthContext.jsx # Authentication context
│   │   └── CartContext.jsx # Shopping cart context
│   ├── services/           # API service layer
│   │   └── api.js         # Axios API client
│   ├── utils/              # Utility functions
│   │   └── imageUtils.js  # Image handling utilities
│   ├── App.jsx             # Main app component
│   └── main.jsx           # Entry point
├── vite.config.js          # Vite configuration
└── package.json
```

## 🛠️ Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Stripe.js** - Payment processing
- **Font Awesome** - Icons

## 🔧 Configuration

### Vite Configuration

The `vite.config.js` file configures:
- Development server port (3000)
- Proxy settings for API requests (`/api` → backend)
- Proxy settings for static files (`/uploads` → backend)

### Environment Variables

Create a `.env` file in the `client/` directory if needed:

```env
# Example: Custom API URL (if not using proxy)
# VITE_API_URL=http://localhost:5001
```

## 📡 API Integration

The frontend communicates with the backend API through:

- **Base URL**: `/api` (proxied to `http://127.0.0.1:5001`)
- **API Client**: `src/services/api.js`
- **Endpoints**:
  - `/api/auth/*` - Authentication
  - `/api/cats/*` - Cat management
  - `/api/products/*` - Product management
  - `/api/orders/*` - Order processing
  - `/api/adoptions/*` - Adoption processing

## 🎨 Features

### User Features
- 🏠 **Home Page** - Landing page with hero section
- 🐱 **Browse Cats** - View available cats for adoption
- 🛍️ **Shop** - Browse and purchase pet products
- 🛒 **Shopping Cart** - Add/remove products, update quantities
- 💳 **Checkout** - Secure payment processing with Stripe
- 👤 **User Dashboard** - View orders and adoption history
- 🔐 **Authentication** - Register, login, logout

### Admin Features
- 📊 **Admin Dashboard** - Overview of platform statistics
- 🐾 **Cat Management** - Add, edit, delete cats
- 📦 **Product Management** - Manage product catalog
- 📋 **Order Management** - View and update orders
- 🏠 **Adoption Management** - Manage adoption requests

## 🎯 Key Components

### Context Providers

- **AuthContext** - Manages user authentication state
- **CartContext** - Manages shopping cart state

### Pages

- **Public Pages**: Home, Browse, Shop, Login, Register
- **Protected Pages**: Cart, Checkout, User Dashboard
- **Admin Pages**: Admin Dashboard, Cat/Product/Order/Adoption Management

## 🐛 Troubleshooting

### Images Not Loading

- Ensure backend server is running
- Check that images exist in `server/uploads/`
- Verify proxy configuration in `vite.config.js`
- Hard refresh browser (`Ctrl + Shift + R`)

### API Requests Failing

- Verify backend server is running on port 5001
- Check browser console for CORS errors
- Ensure you're logged in for protected routes
- Verify proxy target in `vite.config.js`

### Build Errors

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check Node.js version: `node --version` (should be v14+)

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🔒 Security Notes

- Never commit `.env` files with sensitive data
- API keys should be handled server-side
- User tokens are stored in localStorage (consider httpOnly cookies for production)

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Stripe.js Documentation](https://stripe.com/docs/stripe-js)

---

**Part of the Purrfect Match Platform** 🐱


