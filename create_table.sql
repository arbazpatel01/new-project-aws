-- Create the contacts table in geek_contact_db database
-- Run this SQL in phpMyAdmin or MySQL Workbench

USE geek_contact_db;

CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);

-- Verify table was created
SHOW TABLES;
DESCRIBE contacts;
