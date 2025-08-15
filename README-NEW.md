# Pnar World Admin - Dictionary Management System

A modern React TypeScript application for managing Pnar-English dictionary entries.

## 🚀 Features

- **Modern Tech Stack**: React 19, TypeScript, Vite, Redux Toolkit
- **Dictionary Management**: Add, edit, delete, and search dictionary entries
- **Real-time Search**: Debounced search with instant results
- **Responsive Design**: Mobile-first design using Bulma CSS
- **Type Safety**: Full TypeScript support with strict typing
- **API Integration**: Modern API service layer with error handling
- **Accessibility**: WCAG compliant with proper ARIA attributes
- **State Management**: Redux Toolkit for predictable state updates

## 🛠️ Technology Stack

- **Frontend**: React 19.1.1, TypeScript 5.8.3
- **Build Tool**: Vite 7.1.2
- **State Management**: Redux Toolkit 2.8.2
- **Routing**: React Router DOM 7.8.0
- **Styling**: Bulma 1.0.4, Sass
- **Icons**: React Icons 5.5.0
- **Linting**: ESLint 9.33.0

## 📦 Project Structure

```
src/
├── api/                    # API layer
│   ├── services/          # API service modules
│   ├── endpoint.ts        # API endpoints
│   └── index.ts          # Core API utilities
├── components/            # Reusable components
├── hooks/                # Custom React hooks
├── models/               # TypeScript interfaces
├── pages/                # Page components
├── redux/                # Redux store and slices
├── routes/               # Route definitions
├── styles/               # Global styles
├── utils/                # Utility functions
├── app.config.ts         # App configuration
└── constants.ts          # App constants
```

## 🏗️ Architecture Highlights

### Modern API Layer

- **Service-based architecture** with dedicated API services
- **Error handling** with custom error classes
- **Type safety** with TypeScript interfaces
- **Centralized configuration** with environment variables

### Custom Hooks

- `useApi` - Generic API state management
- `useForm` - Form handling with validation
- `useStorage` - Local/session storage utilities

### Component Design

- **Functional components** with hooks
- **Accessibility first** with proper ARIA attributes
- **Responsive design** with mobile-first approach
- **Performance optimized** with React.memo and useMemo

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd pnar-world-admin-vite-react-ts
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
# Create .env file
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env
```

4. Start development server

```bash
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run preview` - Preview production build

## 🎯 Key Features

### Dictionary Management

- **Search and Filter**: Real-time search with debouncing
- **CRUD Operations**: Create, read, update, delete entries
- **Pagination**: Efficient data loading with pagination
- **Validation**: Form validation with error handling

### User Experience

- **Responsive Design**: Works on all device sizes
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Accessibility**: Screen reader compatible

### Developer Experience

- **TypeScript**: Full type safety
- **ESLint**: Code quality enforcement
- **Modern React**: Latest React patterns and hooks
- **Performance**: Optimized rendering and state updates

## 🔧 Configuration

### Environment Variables

```env
VITE_API_URL=http://localhost:8000/api/v1
```

### API Endpoints

The app connects to the following endpoints:

- `GET /dictionary` - Fetch dictionary entries
- `POST /dictionary` - Create new entry
- `PUT /dictionary/:id` - Update entry
- `DELETE /dictionary/:id` - Delete entry

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
