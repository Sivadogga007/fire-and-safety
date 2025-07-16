### --- Stage 1: Build Theme Assets ---
    FROM node:18 AS builder

    WORKDIR /src
    
    # Clone your repo
    RUN git clone https://github.com/Sivadogga007/fire-and-safety.git .
    
    # Install theme dependencies and build assets
    WORKDIR /src/web/themes/custom/fire_and_safety
    RUN npm install
    RUN npm run production
    
    
    ### --- Stage 2: Final Drupal Image ---
    FROM php:8.3-apache
    
    # Install system packages & PHP extensions
    RUN apt-get update && apt-get install -y \
        unzip git libpng-dev libjpeg-dev libfreetype6-dev libonig-dev libxml2-dev libzip-dev libicu-dev \
        && docker-php-ext-install pdo pdo_mysql mysqli intl xml mbstring gd zip opcache \
        && a2enmod rewrite headers \
        && apt-get clean && rm -rf /var/lib/apt/lists/*
    
    # Set Drupal's web directory as document root
    ENV APACHE_DOCUMENT_ROOT=/var/www/html/web
    
    RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
     && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf \
     && echo '<Directory /var/www/html/web>\n\
        AllowOverride All\n\
    </Directory>' >> /etc/apache2/apache2.conf
    
    # Copy Drupal project (includes core + themes + modules)
    WORKDIR /var/www/html
    COPY --from=builder /src /var/www/html
    
    # Install Composer
    RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
    
    # Install Composer dependencies
    RUN composer install --no-dev --optimize-autoloader
    
    # Permissions
    RUN chown -R www-data:www-data /var/www/html \
     && chmod -R 775 /var/www/html/web/sites/default/files
    
    # Expose port 80
    EXPOSE 80
    