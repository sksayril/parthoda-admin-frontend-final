# Parthoda Admin Frontend

A modern, responsive admin dashboard built with React, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Secure Authentication** - JWT-based login with token management
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- 🚀 **TypeScript** - Full type safety and better development experience
- 📱 **Responsive** - Works seamlessly on desktop and mobile devices
- 🔔 **Toast Notifications** - User-friendly feedback system
- 🛡️ **Protected Routes** - Secure route access with authentication guards
- ⚡ **Fast Performance** - Optimized with Vite build tool

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icons
- **ESLint** - Code linting and formatting

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd parthoda-admin-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Create .env.local file
VITE_API_BASE_URL=http://localhost:3000/api
VITE_NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## API Integration

The application is configured to work with the following API endpoints:

### Authentication
- `POST /admin/admin/login` - Admin login
- `POST /admin/admin/logout` - Admin logout
- `POST /admin/admin/refresh` - Token refresh

### Demo Credentials
- **Email**: admin@example.com
- **Password**: admin123456

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard component
│   ├── Login.tsx        # Login form component
│   ├── ProtectedRoute.tsx # Route protection component
│   └── Toast.tsx        # Notification components
├── contexts/            # React contexts
│   ├── AuthContext.tsx  # Authentication state management
│   └── ToastContext.tsx # Toast notification management
├── services/            # API services
│   ├── api.ts          # HTTP client and API utilities
│   └── auth.ts         # Authentication service
├── config/             # Configuration files
│   ├── api.ts          # API configuration
│   └── environment.ts  # Environment configuration
├── utils/              # Utility functions
│   └── errorHandler.ts # Error handling utilities
└── App.tsx             # Main application component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000/api` |
| `VITE_NODE_ENV` | Environment mode | `development` |

## Authentication Flow

1. User enters credentials on login page
2. Credentials are sent to `/admin/admin/login` endpoint
3. On success, JWT token is stored in localStorage
4. Token is automatically included in subsequent API requests
5. Protected routes check authentication status
6. Logout clears token and redirects to login

## Error Handling

The application includes comprehensive error handling:

- **API Errors** - Proper HTTP status code handling
- **Network Errors** - Timeout and connection error handling
- **Validation Errors** - Form validation with user feedback
- **Toast Notifications** - User-friendly error messages

## Security Features

- JWT token storage in localStorage
- Automatic token inclusion in API requests
- Protected route access
- Input validation and sanitization
- Secure logout with token cleanup

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
