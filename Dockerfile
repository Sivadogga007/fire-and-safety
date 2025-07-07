### --- Stage 1: Build Theme Assets ---
    FROM node:18 AS builder

    WORKDIR /src
    RUN git clone https://github.com/Sivadogga007/fire-and-safety.git .
    
    WORKDIR /src/web/themes/custom/fire_and_safety
    RUN npm install
    RUN npm run production
    
    
    ### --- Stage 2: Final Production Image ---
    FROM php:8.3-apache
    
    # Install required PHP extensions
    RUN apt-get update && apt-get install -y \
        unzip git libpng-dev libjpeg-dev libfreetype6-dev libonig-dev libxml2-dev \
        libzip-dev libicu-dev curl \
        && docker-php-ext-configure gd --with-jpeg --with-freetype \
        && docker-php-ext-install pdo pdo_mysql gd intl xml mbstring zip opcache \
        && a2enmod rewrite headers \
        && apt-get clean && rm -rf /var/lib/apt/lists/*
    
    # Set Apache doc root to Drupal's web/ folder
    ENV APACHE_DOCUMENT_ROOT=/var/www/html/web
    RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
        && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/sites-available/*.conf
    
    # Copy entire code from builder stage
    WORKDIR /var/www/html
    COPY --from=builder /src /var/www/html
    
    # Run Composer install inside final PHP container
    RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
      && composer install --no-dev --optimize-autoloader
    
    # Set correct permissions
    RUN chown -R www-data:www-data /var/www/html \
        && chmod -R 775 /var/www/html/web/sites/default/files
    
    # Healthcheck
    HEALTHCHECK --interval=30s --timeout=3s \
      CMD curl -f http://localhost/ || exit 1
    
    EXPOSE 80
    