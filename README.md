# vDash

A modern web application for managing sites and users built with Laravel 12, Inertia.js 2, and React with TypeScript. vDash provides a seamless, single-page application experience with server-side rendering capabilities.

## 🚀 Features

- 🔐 User Authentication & Authorization
- 👥 User Management System
- 🌐 Site Management
- 🎨 Modern UI with Tailwind CSS
- 🔍 Real-time Search & Filtering
- 📊 Pagination & Sorting
- 🌙 Dark Mode Support
- 🔔 Toast Notifications with Sonner

## 🛠 Tech Stack

- **Backend:**
  - Laravel 12
  - PHP 8.4+
  - MySQL

- **Frontend:**
  - Inertia.js 2
  - React 19
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui Components
  - Sonner Toast Notifications
  - Tanstack Table

## 📋 Prerequisites

- PHP 8.2 or higher
- Node.js 20+ and npm/yarn
- Composer
- MySQL 8.0+ or PostgreSQL 13+

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vdash.git
cd vdash
```

2. Install PHP dependencies:
```bash
composer install
```

3. Install Node.js dependencies:
```bash
npm install
```

4. Copy the environment file and configure your database:
```bash
cp .env.example .env
```

5. Generate application key:
```bash
php artisan key:generate
```

6. Run database migrations:
```bash
php artisan migrate
```

7. Build frontend assets:
```bash
npm run build
```

## 🏃‍♂️ Development

1. Start the Laravel development server:
```bash
php artisan serve
```

2. Start the Vite development server:
```bash
npm run dev
```

## 🧪 Testing

Run PHP tests:
```bash
php artisan test
```

Run TypeScript/React tests:
```bash
npm run test
```

## 📦 Building for Production

1. Build frontend assets:
```bash
npm run build
```

2. Optimize Laravel:
```bash
php artisan optimize
```

## 🔧 Configuration

### Environment Variables

- `APP_NAME`: Application name
- `APP_ENV`: Application environment (local/production)
- `DB_CONNECTION`: Database connection type
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_DATABASE`: Database name
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password

## 🛡️ Security

- CSRF Protection
- XSS Prevention
- SQL Injection Protection
- Session Security
- Password Hashing

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- [Laravel](https://laravel.com)
- [Inertia.js](https://inertiajs.com)
- [React](https://reactjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/ui](https://ui.shadcn.com)
