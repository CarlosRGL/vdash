# vDash Copilot Instructions

## Project Architecture

**vDash** is a Laravel 12 + Inertia.js 2 + React 19 application for site and user management. It uses:

- **Backend**: Laravel 12 (PHP 8.4+) with MySQL, Spatie Laravel Permission, Laravel Ticket
- **Frontend**: React 19 + TypeScript + Inertia.js 2 SSR + Tailwind CSS 4 + shadcn/ui
- **Testing**: Pest 3 with Feature/Unit tests
- **Tooling**: Laravel Pint (formatting), ESLint + Prettier, Vite bundling

## Key Conventions

### Backend Structure

- Models use `SoftDeletes` and `HasFactory` (see `app/Models/Site.php`)
- Controllers follow resourceful routing patterns with nested resources for related entities
- Routes group by auth middleware in `routes/web.php`, separate auth routes in `routes/auth.php`
- Database uses enum columns for constrained values (`type`, `team` in sites table)

### Frontend Architecture

- **Entry Point**: `resources/js/app.tsx` with Inertia + SSR setup
- **Page Structure**: `resources/js/pages/{entity}/{action}.tsx` (e.g., `sites/index.tsx`)
- **Components**: `resources/js/components/` with shadcn/ui in `/ui` subfolder
- **Layouts**: `resources/js/layouts/` for shared page structures
- **Path Aliases**: `@/` prefix for all imports (defined in `tsconfig.json`)

### Data Flow Patterns

- **Inertia Pages**: Receive props from Laravel controllers, use `<Head>` for page titles
- **Forms**: Use Inertia's `useForm` hook with Laravel validation
- **Navigation**: Ziggy route helper available globally as `route()` function
- **Styling**: Tailwind 4 + CSS variables, dark mode via `use-appearance` hook

## Development Workflows

### Essential Commands

```bash
# Development
bun run dev              # Start Vite dev server
composer run dev         # Alternative via Composer

# Building
bun run build           # Production build
bun run build:ssr       # Build with SSR

# Code Quality
bun run lint            # ESLint + auto-fix
bun run format          # Prettier formatting
./vendor/bin/pint       # Laravel Pint PHP formatting

# Testing
./vendor/bin/pest       # Run Pest tests
```

### File Generation Patterns

- **Controllers**: Follow resource pattern with nested relationships (e.g., `SiteCredentialController`)
- **Models**: Include relationships, use factories for testing
- **Pages**: Match Laravel route structure in `resources/js/pages/`
- **Components**: Reuse shadcn/ui components, check existing before creating new

## Project-Specific Patterns

### Site Management Domain

- **Core Models**: `Site`, `SiteCredential`, `SiteContract` with User relationships
- **Routing**: Nested resources like `sites/{site}/credentials` for related entities
- **Permissions**: Uses Spatie Laravel Permission package for authorization

### Frontend Component Structure

- **App Shell**: `app-shell.tsx` with sidebar navigation and main content area
- **Navigation**: `nav-main.tsx` for primary navigation, `nav-user.tsx` for user menu
- **Icons**: Uses Lucide React icons via `icon.tsx` wrapper component
- **Flash Messages**: `flash-message.tsx` for Laravel session flash data

### Database & Testing

- **Factories**: All models have factories in `database/factories/`
- **Migrations**: Include enum constraints and foreign key relationships
- **Tests**: Feature tests in `tests/Feature/` organized by domain (Auth, Settings)
- **Database**: Uses `RefreshDatabase` trait for test isolation

## Critical Integration Points

### Inertia.js Configuration

- SSR enabled with `resources/js/ssr.jsx`
- Global route helper via Ziggy integration
- Automatic page resolution from `pages/` directory

### Tailwind CSS 4 Setup

- Uses `@tailwindcss/vite` plugin
- CSS variables for theming in `resources/css/app.css`
- Component-level styling with shadcn/ui patterns

### Authentication Flow

- Laravel Breeze-style auth with Inertia pages
- Protected routes use `auth` middleware group
- Settings pages for profile/password management

Remember: Always check existing patterns in similar files before creating new ones. Follow the established shadcn/ui + Tailwind component patterns for UI consistency.
