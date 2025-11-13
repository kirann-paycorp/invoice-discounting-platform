# Invome React Dashboard - AI Coding Guide

## Architecture Overview

This is a React 18 + Vite invoicing admin dashboard with Redux state management and extensive UI components. The app follows a **route-based authentication pattern** where unauthenticated users see login/register routes while authenticated users access the full dashboard.

### Core Architecture Patterns

- **Authentication Flow**: `App.jsx` conditionally renders either auth routes or the main `<Index />` component based on Redux auth state
- **Centralized Routing**: All dashboard routes are defined in `src/jsx/index.jsx` as an array of objects with `{url, component}` structure
- **Layout System**: Uses `<MainLayout />` wrapper with `<Outlet />` for route rendering, includes persistent nav/footer
- **Theme Management**: Extensive theming via `ThemeContext.jsx` with 15+ color schemes, layout options, and responsive behavior

### Key Development Workflows

**Setup & Development:**
```bash
npm install                    # Install dependencies (595+ packages)
npm run dev                   # Start Vite dev server
npm run build                 # Production build
npm run preview               # Preview production build
```

**State Management Patterns:**
- Redux store in `src/store/store.js` combines: `auth`, `posts`, `sideMenu`, `todoReducers`
- Auth state manages login/logout with localStorage persistence via `src/services/AuthService.js`
- Firebase Authentication integration with Google Identity Toolkit
- Theme state managed separately via React Context

**Component Organization:**
- **Dashboard Components**: `src/jsx/components/Dashboard/` - Main business logic (invoices, wallet, transactions)
- **Bootstrap UI**: `src/jsx/components/bootstrap/` - Reusable UI components (alerts, buttons, modals)
- **Charts**: `src/jsx/components/charts/` - ApexCharts, ChartJS, Recharts integrations
- **Forms**: `src/jsx/components/Forms/` - Form validation, wizards, CKEditor integration
- **Layout**: `src/jsx/layouts/` - Navigation, header, footer, sidebar components

### Critical Development Notes

**Route Registration**: Add new routes to the `allroutes` array in `src/jsx/index.jsx`:
```javascript
{ url: "your-route", component: <YourComponent /> }
```

**Authentication Integration**: Components automatically check auth state via Redux. For protected actions, dispatch auth actions from `src/store/actions/AuthActions.js`

**Theme Customization**: Modify theme via `ThemeContext` - colors are CSS custom properties controlled by `data-primary`, `data-nav-headerbg` attributes on `<body>`

**Responsive Behavior**: Sidebar automatically switches to overlay mode on mobile (≤768px) and mini mode on tablet (768-1024px) via `ThemeContext` window resize handler

**Icon System**: Multiple icon libraries included:
- Bootstrap Icons: `src/assets/icons/bootstrap-icons/`
- Feather Icons: `src/assets/icons/feather/`
- Font Awesome: `src/assets/icons/font-awesome/`
- Custom Flaticon sets: `src/assets/icons/flaticon/`

### API Integration Patterns

**Axios Setup**: Use `src/services/AxiosInstance.js` for configured HTTP client
**Auth Service**: `src/services/AuthService.js` handles Firebase auth with token management and auto-logout timers
**Posts Service**: `src/services/PostsService.js` for content management operations

### Common Gotchas

1. **New Routes**: Must be added to `allroutes` array AND imported at file top in `src/jsx/index.jsx`
2. **Theme Changes**: Require both Context state updates AND DOM attribute changes on `<body>`
3. **Auth State**: Login/logout triggers full app re-render - ensure components handle auth state changes gracefully
4. **Sidebar Modes**: "icon-hover" mode requires special handling via `ChangeIconSidebar()` function
5. **Mobile Layout**: Automatic responsive behavior may conflict with manual sidebar settings

### Asset Management

- **Images**: `src/assets/images/` organized by type (avatar, card, product, etc.)
- **SCSS**: Main styles in `src/assets/scss/` with component-specific CSS in respective directories
- **Vendor Libraries**: Pre-configured in `src/assets/vendor/` (Bootstrap, DataTables, Swiper, etc.)

When adding features, follow the established patterns: create components in appropriate subdirectories, add routes to the central routing array, integrate with Redux for state management, and use ThemeContext for styling consistency.