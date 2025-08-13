# Amazon-like E-commerce Platform

A comprehensive database design and system architecture for building a scalable e-commerce platform similar to Amazon.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Database Schema](#database-schema)
- [Entity Relationship Diagram](#entity-relationship-diagram)
- [System Architecture](#system-architecture)
- [User Workflows](#user-workflows)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## Overview

This project provides a complete blueprint for building an Amazon-like e-commerce platform with support for multiple user types (customers, merchants, admins), comprehensive product management, order processing, payment integration, and advanced features like reviews, promotions, and analytics.

## Features

### Core Functionality
- ✅ **Multi-User System**: Customers, Merchants, and Admins with role-based permissions
- ✅ **Product Management**: Categories, brands, variants, inventory tracking
- ✅ **Shopping Cart & Wishlist**: Persistent cart, multiple wishlists
- ✅ **Order Management**: Complete order lifecycle from cart to delivery
- ✅ **Payment Processing**: Multiple payment methods, transaction tracking
- ✅ **Shipping Integration**: Multiple carriers, tracking, delivery confirmation
- ✅ **Review System**: Product reviews with verification and moderation
- ✅ **Promotion Engine**: Coupons, discounts, promotional campaigns
- ✅ **Search & Analytics**: Product search, user behavior tracking
- ✅ **Notification System**: Email, SMS, in-app notifications


## Database Schema

### User Management Tables
- `users` - Core user information
- `user_roles` - Role assignment (customer/merchant/admin)
- `merchant_profiles` - Extended merchant information
- `addresses` - User addresses for shipping/billing

### Product Catalog
- `categories` - Hierarchical product categories
- `brands` - Product brands
- `products` - Main product information
- `product_images` - Product photos and media
- `product_attributes` - Custom product attributes
- `product_variants` - Size, color, and other variations

### Shopping & Orders
- `shopping_carts` - User shopping carts
- `cart_items` - Items in shopping carts
- `wishlists` - User wishlists
- `wishlist_items` - Items in wishlists
- `orders` - Order information
- `order_items` - Individual items in orders
- `order_addresses` - Shipping and billing addresses per order

### Payment & Transactions
- `payment_methods` - Stored payment methods
- `transactions` - Payment transaction records
- `coupons` - Promotional codes
- `coupon_usage` - Coupon redemption tracking

### Shipping & Fulfillment
- `shipping_methods` - Available shipping options
- `shipments` - Shipment tracking information

### Reviews & Ratings
- `reviews` - Product reviews and ratings
- `review_images` - Review photos

### System & Analytics
- `notifications` - User notifications
- `search_terms` - Search analytics
- `product_views` - Product view tracking
- `settings` - System configuration

## Entity Relationship Diagram

```mermaid
erDiagram
    users {
        int id PK
        varchar username UK
        varchar email UK
        varchar password_hash
        varchar full_name
        varchar phone
        date date_of_birth
        enum gender
        varchar profile_image_url
        boolean email_verified
        enum account_status
        timestamp created_at
        timestamp updated_at
    }
    
    user_roles {
        int id PK
        int user_id FK
        enum role_type
        boolean is_active
        timestamp created_at
    }
    
    merchant_profiles {
        int id PK
        int user_id FK
        varchar business_name
        varchar business_type
        varchar tax_id
        text business_address
        enum verification_status
        decimal commission_rate
        timestamp created_at
    }
    
    addresses {
        int id PK
        int user_id FK
        enum type
        varchar full_name
        varchar address_line_1
        varchar city
        varchar country
        boolean is_default
        timestamp created_at
    }
    
    categories {
        int id PK
        varchar name
        varchar slug UK
        int parent_id FK
        varchar image_url
        boolean is_active
        timestamp created_at
    }
    
    brands {
        int id PK
        varchar name UK
        varchar slug UK
        varchar logo_url
        boolean is_active
        timestamp created_at
    }
    
    products {
        int id PK
        int merchant_id FK
        int category_id FK
        int brand_id FK
        varchar name
        varchar slug UK
        text description
        varchar sku UK
        decimal price
        int stock_quantity
        enum status
        timestamp created_at
    }
    
    product_images {
        int id PK
        int product_id FK
        varchar image_url
        int sort_order
        boolean is_primary
        timestamp created_at
    }
    
    product_variants {
        int id PK
        int product_id FK
        varchar variant_name
        varchar variant_value
        decimal price_adjustment
        int stock_quantity
        varchar sku UK
        timestamp created_at
    }
    
    shopping_carts {
        int id PK
        int user_id FK
        varchar session_id
        timestamp created_at
        timestamp updated_at
    }
    
    cart_items {
        int id PK
        int cart_id FK
        int product_id FK
        int product_variant_id FK
        int quantity
        decimal price
        timestamp created_at
    }
    
    orders {
        int id PK
        varchar order_number UK
        int user_id FK
        enum status
        enum payment_status
        decimal subtotal
        decimal total_amount
        timestamp created_at
    }
    
    order_items {
        int id PK
        int order_id FK
        int product_id FK
        int merchant_id FK
        int quantity
        decimal unit_price
        decimal total_price
        timestamp created_at
    }
    
    payment_methods {
        int id PK
        int user_id FK
        enum type
        varchar provider
        varchar last_four_digits
        boolean is_default
        timestamp created_at
    }
    
    transactions {
        int id PK
        int order_id FK
        int payment_method_id FK
        varchar transaction_id UK
        enum status
        decimal amount
        timestamp processed_at
        timestamp created_at
    }
    
    reviews {
        int id PK
        int product_id FK
        int user_id FK
        int order_item_id FK
        int rating
        varchar title
        text content
        boolean is_verified_purchase
        enum status
        timestamp created_at
    }
    
    coupons {
        int id PK
        varchar code UK
        varchar name
        enum type
        decimal value
        int usage_limit
        timestamp start_date
        timestamp end_date
        boolean is_active
        timestamp created_at
    }

    %% Relationships
    users ||--o{ user_roles : has
    users ||--o| merchant_profiles : extends
    users ||--o{ addresses : owns
    users ||--o{ shopping_carts : has
    users ||--o{ orders : places
    users ||--o{ reviews : writes
    users ||--o{ payment_methods : stores
    
    merchant_profiles ||--o{ products : sells
    
    categories ||--o{ categories : contains
    categories ||--o{ products : categorizes
    brands ||--o{ products : manufactures
    
    products ||--o{ product_images : displays
    products ||--o{ product_variants : varies
    products ||--o{ cart_items : added_to
    products ||--o{ order_items : included_in
    products ||--o{ reviews : receives
    
    shopping_carts ||--o{ cart_items : contains
    product_variants ||--o{ cart_items : selected
    
    orders ||--o{ order_items : includes
    orders ||--o{ transactions : paid_by
    
    payment_methods ||--o{ transactions : processes
    
    order_items ||--o{ reviews : reviewed_in
```

## System Architecture

### User Types & Privileges

#### Customer/User
- Browse and search products
- Manage shopping cart and wishlist
- Place and track orders
- Write product reviews
- Manage account and addresses
- View order history and invoices

#### Merchant
- Manage product catalog
- Process and fulfill orders
- View sales analytics and reports
- Handle customer inquiries
- Create promotional campaigns
- Manage inventory and pricing

#### Admin
- Full system control and monitoring
- User account management (suspend/activate)
- Content moderation (products, reviews)
- System configuration and settings
- Financial reporting and analytics
- Merchant verification and onboarding

## User Workflows

### Customer Purchase Flow
```
Homepage → Browse/Search → Product Details → Add to Cart → 
Checkout → Payment → Order Confirmation → Shipping → 
Delivery → Review Product
```

### Merchant Order Flow
```
New Order Notification → Order Review → Inventory Check → 
Order Confirmation → Pick & Pack → Ship Order → 
Update Tracking → Order Complete
```

### Admin Management Flow
```
Dashboard → Monitor Activities → Handle Support Tickets → 
Review Merchant Applications → Moderate Content → 
Generate Reports → System Maintenance
```
