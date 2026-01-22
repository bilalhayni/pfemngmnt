# PFE Manager - Frontend

A comprehensive PFE (Final Year Project) management system built with React. This application enables students, professors, department heads, and administrators to manage final year projects efficiently.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Code Quality Improvements](#code-quality-improvements)
- [Development Guidelines](#development-guidelines)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Features

### Core Features
- **Role-based authentication** with JWT tokens
- **Multi-role dashboard** (Student, Professor, Chef de Département, Admin)
- **PFE project management** (Create, Read, Update, Delete)
- **Student application system** for PFE projects
- **Professor-student matching** workflow
- **Domain and prerequisite management**
- **Real-time statistics and analytics**
- **Responsive design** with Material-UI

### Recent Improvements ✨
- **Error Boundary** - Graceful error handling with user-friendly error pages
- **Code Splitting** - Lazy loading for improved performance
- **Loading States** - Better UX with loading indicators
- **PropTypes Validation** - Type checking for component props
- **Secure Cookies** - Enhanced security with secure and sameSite flags
- **Improved Auth Routes** - Centralized authentication using Context API
- **Environment Configuration** - Proper .env setup for different environments

## Tech Stack

### Core
- **React** 18.1.0 - UI library
- **React Router DOM** 6.3.0 - Client-side routing
- **React Context API** - State management

### UI & Styling
- **Material-UI** 5.8.0 - Component library
- **Emotion** - CSS-in-JS styling
- **SASS** - CSS preprocessor
- **CSS Variables** - Theming system

### Form Management
- **Formik** 2.2.9 - Form library
- **Yup** 0.32.11 - Schema validation

### HTTP & API
- **Axios** 0.27.2 - HTTP client
- **js-cookie** 3.0.1 - Cookie management

### Data Visualization
- **React ChartJS** 4.1.0 - Charts and graphs

### UI Enhancements
- **SweetAlert2** 11.4.28 - Beautiful alerts
- **React Toastify** 9.0.8 - Toast notifications
- **React Select** 5.3.2 - Advanced select dropdowns
- **Flatpickr** 4.6.13 - Date picker

### Type Safety
- **PropTypes** 15.8.1 - Runtime type checking

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** >= 14.x
- **npm** >= 6.x or **yarn** >= 1.22.x
- **Backend API** running on port 3001 (or configured port)

## Installation

1. **Clone the repository**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install PropTypes** (if not already installed)
   ```bash
   npm install prop-types
   ```

## Configuration

### Environment Variables

1. **Copy the example environment file**
   ```bash
   cp .env.example .env
   ```

2. **Configure the variables in `.env`**
   ```env
   # Backend API URL
   REACT_APP_API_URL=http://localhost:3001

   # App Configuration
   REACT_APP_NAME="PFE Manager"
   REACT_APP_VERSION=1.0.0

   # Environment (development, staging, production)
   NODE_ENV=development

   # Cookie Settings (set to true in production with HTTPS)
   REACT_APP_COOKIE_SECURE=false
   REACT_APP_COOKIE_SAME_SITE=lax

   # Session timeout in milliseconds (24 hours = 86400000)
   REACT_APP_SESSION_TIMEOUT=86400000
   ```

### Production Configuration

For production environments:
```env
NODE_ENV=production
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_COOKIE_SECURE=true
REACT_APP_COOKIE_SAME_SITE=strict
```

## Running the Application

### Development Mode
```bash
npm start
```
Opens the app at [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
```
Creates an optimized production build in the `build` folder

### Run Tests
```bash
npm test
```
Launches the test runner in interactive watch mode

## Project Structure

```
client/
├── public/                 # Static assets
│   ├── index.html
│   └── logo-fpn.svg
├── src/
│   ├── api/               # API endpoint configurations
│   ├── components/
│   │   ├── common/        # Reusable components
│   │   │   ├── DataTable.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── ...
│   │   ├── forms/         # Form components
│   │   ├── layout/        # Layout components
│   │   └── navigation/    # Navigation components
│   ├── context/           # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin pages
│   │   ├── professor/     # Professor pages
│   │   ├── student/       # Student pages
│   │   └── ...            # Chef Département pages
│   ├── routes/            # Route configurations & guards
│   ├── services/          # API service layer
│   │   └── api.js         # Axios instance & services
│   ├── styles/            # Global styles
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main app component
│   └── index.js           # Entry point
├── .env                   # Environment variables
├── .env.example           # Example environment file
├── package.json           # Dependencies
└── README.md             # This file
```

## User Roles

The application supports four user roles:

### 1. Student (Role: 2)
- Browse available PFE projects
- Apply to PFE projects
- View application status
- Access assigned PFE details
- Manage profile

**Routes:** `/student/*`

### 2. Professor (Role: 0)
- Create and manage PFE projects
- Review student applications
- Accept/reject student requests
- Track supervised students
- Manage profile

**Routes:** `/prof/*`

### 3. Chef de Département (Role: 1)
- Overview dashboard with statistics
- Manage professors and students
- Oversee all PFE projects
- Manage domains and prerequisites
- Handle student requests

**Routes:** `/`, `/professeurs`, `/etudiants`, etc.

### 4. Admin (Role: 3)
- System-wide statistics
- Activate/deactivate student accounts
- Manage professors and department heads
- Create user accounts
- Manage degree programs (filières)

**Routes:** `/admin/*`

## Code Quality Improvements

### ✅ Implemented Improvements

1. **Error Boundary**
   - Catches React errors gracefully
   - Shows user-friendly error page
   - Logs errors in development mode
   - Location: `src/components/common/ErrorBoundary.jsx`

2. **Loading Component**
   - Reusable loading spinner
   - Full-page and inline variants
   - Customizable size and message
   - Location: `src/components/common/Loading.jsx`

3. **Code Splitting**
   - Lazy loading with `React.lazy()`
   - Improved initial load time
   - Better bundle size management
   - Implemented in: `src/App.jsx`

4. **PropTypes Validation**
   - Runtime type checking
   - Better developer experience
   - Added to key components
   - Examples: `DataTable`, `StatCard`, `Loading`

5. **Secure Cookie Configuration**
   - Configurable `secure` flag
   - `sameSite` protection against CSRF
   - Environment-based configuration
   - Implemented in: `src/context/AuthContext.jsx`

6. **Improved Private Routes**
   - Uses AuthContext instead of direct cookie access
   - Centralized authentication logic
   - Loading states during auth check
   - DRY principle compliance
   - Location: `src/routes/`

7. **Environment Configuration**
   - `.env` and `.env.example` files
   - Configurable API URL
   - Cookie security settings
   - Environment-specific configs

### 🎯 Recommended Future Improvements

See `IMPROVEMENTS.md` for a detailed list of recommended improvements including:
- Unit and integration tests
- TypeScript migration
- PWA features
- Internationalization (i18n)
- Performance monitoring
- Accessibility enhancements
- And more...

## Development Guidelines

### Component Development

1. **Use functional components** with hooks
2. **Add PropTypes** to all components
3. **Follow naming conventions**:
   - PascalCase for components: `MyComponent.jsx`
   - camelCase for utilities: `myUtility.js`
   - CSS modules or BEM for styles

### Code Style

- Use ES6+ features
- Destructure props and state
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use async/await instead of promises

### Git Workflow

```bash
# Create a feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Push and create pull request
git push origin feature/my-feature
```

### Commit Message Convention

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Build process or auxiliary tools

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

### `npm run eject`
**⚠️ Warning:** This is a one-way operation. Ejects from Create React App configuration.

## Testing

### Current State
⚠️ **No tests currently implemented**

### Recommended Testing Strategy

1. **Unit Tests**
   - Test utility functions
   - Test custom hooks
   - Test individual components

2. **Integration Tests**
   - Test component interactions
   - Test form submissions
   - Test API service layer

3. **E2E Tests** (with Cypress or Playwright)
   - Test user workflows
   - Test authentication flow
   - Test critical user journeys

### Setting Up Tests

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Run tests
npm test
```

## Deployment

### Building for Production

```bash
# Create production build
npm run build

# The build folder is ready to be deployed
# You can serve it with a static file server
```

### Serving the Build

```bash
# Install serve globally
npm install -g serve

# Serve the build folder
serve -s build -l 3000
```

### Environment Configuration

Ensure production environment variables are set:
```env
NODE_ENV=production
REACT_APP_API_URL=https://your-production-api.com
REACT_APP_COOKIE_SECURE=true
REACT_APP_COOKIE_SAME_SITE=strict
```

### Deployment Platforms

- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **AWS S3 + CloudFront**
- **Docker**: See `Dockerfile` for containerized deployment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Review Guidelines

- Ensure code follows project conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass
- Keep PRs focused and small

## Troubleshooting

### Common Issues

**Issue:** `npm start` fails with port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Issue:** Dependencies not installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Issue:** Build fails
```bash
# Check Node version (should be >= 14.x)
node --version

# Update dependencies
npm update
```

## Support

For issues and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## License

This project is proprietary software. All rights reserved.

---

Built with ❤️ by the PFE Manager Team
