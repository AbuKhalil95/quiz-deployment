# Quizzes

A modern quiz management application built with Laravel, Inertia.js, and React. This application provides a comprehensive platform for creating, managing, and taking quizzes with role-based access control.

## Features

-   **Role-Based Access Control**: Three user roles (Admin, Teacher, Student) with appropriate permissions
-   **Quiz Management**: Create, edit, and manage quizzes with multiple modes (by subject, mixed bag, timed)
-   **Question Management**: Create multiple-choice questions with 4 options, assign tags, and organize by subject
-   **Quiz Attempts**: Track and review student quiz attempts
-   **Tag System**: Organize questions with tags for better categorization
-   **Modern UI**: Built with React, Tailwind CSS, and Radix UI components
-   **Real-time Updates**: Hot Module Replacement (HMR) for instant frontend updates during development

## Tech Stack

### Backend

-   **Laravel 11**: PHP framework
-   **MySQL**: Database
-   **Redis**: Caching and session storage

### Frontend

-   **Inertia.js**: Server-driven single-page applications
-   **React 19**: UI library
-   **TypeScript**: Type safety
-   **Tailwind CSS**: Utility-first CSS framework
-   **Radix UI**: Accessible component primitives
-   **Vite**: Build tool and dev server

## Prerequisites

-   **PHP 8.2+**
-   **Composer**
-   **Node.js 18+** and npm
-   **MySQL 8.0+** (or PostgreSQL)
-   **Redis** (optional, for caching)
-   **Docker & Docker Compose** (optional, for containerized setup)

## Installation

### Option 1: Docker Setup (Recommended)

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd Quizzes
    ```

2. **Start Docker containers:**

    ```bash
    docker-compose up -d
    ```

3. **Install PHP dependencies:**

    ```bash
    docker-compose exec app composer install
    ```

4. **Install Node dependencies:**

    ```bash
    docker-compose exec app npm install
    ```

5. **Set up environment:**

    ```bash
    docker-compose exec app cp .env.example .env
    docker-compose exec app php artisan key:generate
    ```

6. **Run migrations:**

    ```bash
    docker-compose exec app php artisan migrate
    ```

7. **Seed the database (optional):**

    ```bash
    docker-compose exec app php artisan db:seed
    ```

8. **Set permissions:**

    ```bash
    docker-compose exec app chmod -R 775 storage bootstrap/cache
    docker-compose exec app chown -R www-data:www-data storage bootstrap/cache
    ```

9. **Build frontend assets:**

    ```bash
    docker-compose exec app npm run build
    ```

10. **Access the application:**
    - Application: http://localhost:8000

For more Docker-specific commands and information, see [docker/README.md](docker/README.md).

### Option 2: Local Development (Non-Docker)

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd Quizzes
    ```

2. **Install PHP dependencies:**

    ```bash
    composer install
    ```

3. **Install Node dependencies:**

    ```bash
    npm install
    ```

4. **Set up environment:**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5. **Configure database in `.env`:**

    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=quizzes
    DB_USERNAME=your_username
    DB_PASSWORD=your_password
    ```

6. **Run migrations:**

    ```bash
    php artisan migrate
    ```

7. **Seed the database (optional):**

    ```bash
    php artisan db:seed
    ```

8. **Start development servers:**

    You have two options:

    **Option A: Use Laravel's dev script (runs everything concurrently):**

    ```bash
    composer run dev
    ```

    **Option B: Run servers separately (recommended for debugging):**

    **Terminal 1 - Laravel:**

    ```bash
    php artisan serve
    ```

    **Terminal 2 - Vite (frontend assets):**

    ```bash
    npm run dev
    ```

9. **Access the application:**
    - Application: http://localhost:8000
    - Vite HMR: http://localhost:5173 (handled automatically)

## Default Login Credentials

After running the database seeder, you can use these credentials:

-   **Admin:**

    -   Email: `admin@quizzes.com`
    -   Password: `password`

-   **Teacher:**

    -   Email: `teacher@quizzes.com`
    -   Password: `password`

-   **Student:**
    -   Email: `student@quizzes.com`
    -   Password: `password`

## User Roles & Permissions

### Admin

-   Full access to all features
-   User management
-   Can view/edit/delete all questions and quizzes

### Teacher

-   Access to admin area (except user management)
-   Can create, edit, and delete their own questions and quizzes
-   Can view quiz attempts
-   Can manage tags

### Student

-   Can take quizzes
-   Can view their own quiz attempts

## Building for Production

### Docker

```bash
docker-compose exec app npm run build
```

### Local

```bash
npm run build
```

This compiles all frontend assets for production use. The built files will be in `public/build/`.

## Development Workflow

### Making Changes

1. **Backend changes (PHP):**

    - Edit files in `app/`, `routes/`, `database/`, etc.
    - Changes are reflected immediately (no rebuild needed)

2. **Frontend changes (React/TypeScript):**
    - Edit files in `resources/js/`
    - Vite HMR will automatically reload changes
    - If HMR doesn't work, refresh the browser

### Running Artisan Commands

**Docker:**

```bash
docker-compose exec app php artisan [command]
```

**Local:**

```bash
php artisan [command]
```

### Running NPM Commands

**Docker:**

```bash
docker-compose exec app npm [command]
```

**Local:**

```bash
npm [command]
```

## Project Structure

```
Quizzes/
├── app/
│   ├── Http/
│   │   ├── Controllers/     # Application controllers
│   │   └── Middleware/      # Custom middleware
│   └── Models/              # Eloquent models
├── database/
│   ├── migrations/          # Database migrations
│   └── seeders/            # Database seeders
├── resources/
│   ├── js/
│   │   ├── components/      # Reusable React components
│   │   ├── layouts/         # Layout components
│   │   └── pages/           # Inertia page components
│   └── views/               # Blade templates
├── routes/
│   ├── web.php              # Web routes
│   └── admin.php            # Admin routes
└── docker/                  # Docker configuration
```

## Troubleshooting

### Assets not loading

-   Ensure Vite dev server is running (`npm run dev`)
-   Clear browser cache
-   Check that `APP_URL` in `.env` matches your local URL

### Database connection errors

-   Verify database credentials in `.env`
-   Ensure database server is running
-   Check that database exists

### Permission errors (Docker)

```bash
docker-compose exec app chmod -R 775 storage bootstrap/cache
docker-compose exec app chown -R www-data:www-data storage bootstrap/cache
```

### Port already in use

-   Change `APP_PORT` in `.env` (Laravel)
-   Change port in `vite.config.js` (Vite)
-   Or stop the process using the port

## License

This project is open-sourced software licensed under the [MIT license](LICENSE).
