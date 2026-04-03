-- Admins table
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE NULL, -- For password resets
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    reset_token VARCHAR(100) NULL,
    reset_token_expires DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parcels (main table)
CREATE TABLE parcels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL, -- Normalized: 601xxxxxxxxx
    tracking_number VARCHAR(50) NOT NULL,
    email VARCHAR(255) NULL, -- For notifications
    courier_name VARCHAR(50),
    arrived_at DATETIME NOT NULL,
    status ENUM('Pending', 'Collected') DEFAULT 'Pending',
    collected_at DATETIME NULL,
    collected_by_name VARCHAR(100) NULL,
    storage_location VARCHAR(100) NULL, -- e.g., "Shelf A-1"
    arrival_photo_url VARCHAR(255) NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP
);
