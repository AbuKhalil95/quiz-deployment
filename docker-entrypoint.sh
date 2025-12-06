#!/bin/bash
set -e

# Fix permissions for mounted volumes
# This allows composer and other commands to work properly
if [ -d "/var/www/html" ]; then
    # Configure git safe directory (needed for composer) - use user's home
    export HOME=/root
    git config --global --add safe.directory /var/www/html 2>/dev/null || true
    
    # Create necessary directories if they don't exist
    mkdir -p /var/www/html/vendor
    mkdir -p /var/www/html/storage/framework/cache
    mkdir -p /var/www/html/storage/framework/sessions
    mkdir -p /var/www/html/storage/framework/views
    mkdir -p /var/www/html/storage/logs
    mkdir -p /var/www/html/bootstrap/cache
    
    # Set permissions - make directories writable
    chmod -R 777 /var/www/html/storage /var/www/html/bootstrap/cache 2>/dev/null || true
    chmod -R 777 /var/www/html/vendor 2>/dev/null || true
fi

# Run commands as root (for development - in production, switch to www-data)
# This avoids permission issues with mounted volumes
exec "$@"

