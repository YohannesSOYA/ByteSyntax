-- Admins table
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),telte
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parcels (main table)
CREATE TABLE parcels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    tracking_number VARCHAR(100) NOT NULL,
    courier_name VARCHAR(50),
    arrived_at DATETIME NOT NULL,
    status ENUM('Pending', 'Collected') DEFAULT 'Pending',
    collected_at DATETIME NULL,
    collected_by_name VARCHAR(100) NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP
);
