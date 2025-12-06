# Docker Setup for Quizzes Application

This directory contains Docker configuration files for running the Quizzes application in a containerized environment.

## Quick Start

1. Copy `.env.example` to `.env` (if not already done):

    ```bash
    cp .env.example .env
    ```

2. Generate application key:

    ```bash
    docker-compose exec app php artisan key:generate
    ```

3. Run database migrations:

    ```bash
    docker-compose exec app php artisan migrate
    ```

4. (Optional) Seed the database:

    ```bash
    docker-compose exec app php artisan db:seed
    ```

5. Install PHP dependencies:

    ```bash
    docker-compose exec app composer install
    ```

6. Install Node dependencies (if needed):

    ```bash
    docker-compose exec app npm install
    ```

7. Build assets (if needed):

    ```bash
    docker-compose exec app npm run build
    ```

8. Set proper permissions:
    ```bash
    docker-compose exec app chmod -R 775 storage bootstrap/cache
    docker-compose exec app chown -R www-data:www-data storage bootstrap/cache
    ```

## Services

-   **app**: PHP 8.2 FPM application container
-   **nginx**: Nginx web server (port 8000)
-   **db**: MySQL 8.0 database
-   **redis**: Redis cache/session store

## Useful Commands

### Start containers:

```bash
docker-compose up -d
```

### Stop containers:

```bash
docker-compose down
```

### View logs:

```bash
docker-compose logs -f app
docker-compose logs -f nginx
docker-compose logs -f db
```

### Execute commands in app container:

```bash
docker-compose exec app php artisan [command]
docker-compose exec app composer [command]
docker-compose exec app npm [command]
```

### Access database:

```bash
docker-compose exec db mysql -u quizzes_user -pquizzes_password quizzes
```

### Access Redis CLI:

```bash
docker-compose exec redis redis-cli
```

### Rebuild containers:

```bash
docker-compose build --no-cache
docker-compose up -d
```

## Environment Variables

Key environment variables for Docker setup:

-   `DB_HOST=db` (Docker service name)
-   `DB_DATABASE=quizzes`
-   `DB_USERNAME=quizzes_user`
-   `DB_PASSWORD=quizzes_password`
-   `REDIS_HOST=redis` (Docker service name)
-   `APP_URL=http://localhost:8000`

Make sure these match your `.env` file configuration.



