# BST Frontend Project Report

## Overview

This is a **Vue 3 + TypeScript** frontend application for **BST LMS** (Learning Management System), specifically for "Bekobod Shahar 1 - son Texnikumi" (Bekobod City Technical School #1) in Uzbekistan.

---

## Technology Stack

### Core Framework
- **Vue.js 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript superset
- **Vite** - Fast build tool and dev server

### State Management
- **Pinia** - Vue store for state management

### Routing
- **Vue Router 4** - Client-side routing

### UI Components
- **Element Plus** - Vue 3 UI component library
- **Tailwind CSS 3.4** - Utility-first CSS framework

### Internationalization
- **vue-i18n 11** - Internationalization framework
- Supports **Uzbek (Latin)** and **Uzbek (Cyrillic)** scripts

### Form Handling
- **VeeValidate 4** - Form validation
- **Yup** - Schema validation

### HTTP Client
- **Axios** - HTTP requests with interceptors

---

## Project Structure

```
src/
├── assets/          # Static assets
├── components/
│   ├── common/      # Shared components (StatCard, LanguageSwitcher)
│   └── layout/      # Layout components (DashboardHeader)
├── composables/     # Vue composables (useAuth)
├── i18n/            # Internationalization config and locales
├── router/          # Vue Router configuration
├── stores/          # Pinia stores (auth, locale)
├── styles/          # Global styles (Tailwind, main.css)
├── types/           # TypeScript type definitions
│   ├── api.ts       # API response types
│   ├── auth.ts      # Auth types
│   └── user.ts      # User types
├── utils/           # Utility functions (api.ts)
├── views/           # Page components
│   ├── Home.vue     # Dashboard/Home page
│   └── auth/        # Auth pages (Login.vue)
├── App.vue          # Root component
└── main.ts          # App entry point
```

---

## Key Features

### 1. Authentication System
- Login page with email/password form
- Form validation (email format, password length)
- "Remember me" functionality
- Token-based authentication (localStorage/sessionStorage)
- Protected routes with navigation guards
- Logout functionality

### 2. Dashboard
- **Stats Cards**: Total courses, active students, assignments, attendance
- **Recent Activity**: Activity feed with mock data
- **Quick Actions**: Buttons for common operations

### 3. Navigation
- Responsive sidebar (collapsible on mobile)
- Menu items: Dashboard, Fanlar, Talabalar, O'qituvchilar, Topshiriqlar, Davomat, Kutibxona

### 4. Language Support
- Uzbek Latin (uz-Latn) - default
- Uzbek Cyrillic (uz-Cyrl)
- Language switcher component

### 5. Responsive Design
- Mobile-first approach
- Breakpoints: 640px (mobile), 768px (tablet), 1024px (desktop)

---

## API Integration

### Base Configuration
- **Base URL**: `http://localhost:8000/api` (configurable via `VITE_API_BASE_URL`)
- **Timeout**: 10 seconds
- **Auth Header**: Bearer token

### API Modules
- **authApi**: Login functionality (currently mock)
- **api**: Generic CRUD operations (get, post, put, delete)

### Interceptors
- **Request**: Attaches Authorization header
- **Response**: Handles 401 errors by redirecting to login

---

## Component Architecture

### Common Components
| Component | Purpose |
|-----------|---------|
| [`StatCard.vue`](src/components/common/StatCard.vue) | Display statistics with trend indicators |
| [`LanguageSwitcher.vue`](src/components/common/LanguageSwitcher.vue) | Switch between Uzbek scripts |

### Layout Components
| Component | Purpose |
|-----------|---------|
| [`DashboardHeader.vue`](src/components/layout/DashboardHeader.vue) | Header with greeting and language switcher |

---

## State Management (Pinia)

### Auth Store
- Manages user state, token, authentication status
- Handles login, logout, initialization

### Locale Store
- Manages current language preference
- Persists language selection to localStorage

---

## Form Validation

Login form validation rules:
- **Email**: Required, valid email format
- **Password**: Required, minimum 6 characters
- **Remember Me**: Optional checkbox

---

## Build & Development

### Scripts
```bash
npm run dev        # Start dev server (port 3000)
npm run build      # Build for production (with TypeScript check)
npm run preview    # Preview production build
npm run lint       # Lint and fix code
```

### ESLint Configuration
- Vue 3 + TypeScript support
- Auto-fix enabled

---

## Design System

### Color Palette
| Color | Usage |
|-------|-------|
| `#2563eb` (primary-600) | Primary actions, links |
| `#f9fafb` (neutral-50) | Page background |
| `#1f2933` (neutral-800) | Primary text |
| `#22c55e` (success) | Positive trends |
| `#f59e0b` (warning) | Warnings |
| `#ef4444` (danger) | Errors, negative trends |

### Typography
- Font: **Poppins** (Google Fonts)
- Responsive font sizes (mobile, tablet, desktop)

---

## Current Development Status

| Feature | Status |
|---------|--------|
| Authentication | ✅ Complete (mock API) |
| Dashboard | ✅ Complete (static data) |
| Language switching | ✅ Complete |
| Responsive layout | ✅ Complete |
| API integration | 🔶 Partial (mock authApi) |
| Routing | ✅ Complete |
| Form validation | ✅ Complete |

---

## Recommendations for Future Development

1. **API Integration**: Replace mock authApi with actual backend calls
2. **Additional Pages**: Implement views for Fanlar, Talabalar, O'qituvchilar, etc.
3. **User Profile**: Add profile management features
4. **API Error Handling**: Enhance error handling and toast notifications
5. **Loading States**: Add global loading indicators
6. **API Module Expansion**: Create dedicated API modules for each feature
7. **Testing**: Add unit and E2E tests
8. **Dark Mode**: Consider adding dark theme support
9. **Mobile App**: Could be extended to mobile via Ionic/Capacitor

---

## Project Metadata

| Property | Value |
|----------|-------|
| Name | bst-frontend |
| Version | 1.0.0 |
| Type | Module |
| Vue Version | 3.4.21 |
| TypeScript Version | 5.4.0 |
| Vite Version | 7.3.1 |
| Node.js Required | Latest LTS recommended |

---

## Summary

This is a well-structured Vue 3 frontend project for an LMS platform with:
- ✅ Modern tech stack (Vue 3, TypeScript, Vite, Pinia)
- ✅ Internationalization support (Uzbek)
- ✅ Responsive design
- ✅ Component-based architecture
- ✅ Form validation
- ✅ Authentication flow
- ✅ Clean code organization

The project is ready for backend integration and feature expansion.
