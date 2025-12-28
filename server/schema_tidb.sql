-- ============================================
-- PINTENREST DATABASE SCHEMA - For TiDB Cloud
-- ============================================

-- Untuk TiDB Cloud:
-- 1. Buat database dulu via SQL Editor/Chat2Query:
--    CREATE DATABASE IF NOT EXISTS pintenrest_db;
--    USE pintenrest_db;
-- 
-- 2. Lalu jalankan script dibawah ini

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT IGNORE INTO categories (name) VALUES 
('Perumahan'), ('Komersial'), ('Interior'), ('Landscape');

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  category VARCHAR(100) DEFAULT 'Perumahan',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO projects (title, description, image_url, category) VALUES
('Villa Minimalis Bali', 'Desain villa modern dengan sentuhan tradisional Bali. Menggunakan material alami seperti kayu jati dan batu alam.', '/uploads/sample1.jpg', 'Perumahan'),
('Kantor Startup Tech', 'Ruang kerja open-plan dengan area kolaborasi dan ruang meeting yang fleksibel.', '/uploads/sample2.jpg', 'Komersial'),
('Apartemen Studio', 'Interior apartemen studio 35m2 dengan konsep multifungsi dan storage maksimal.', '/uploads/sample3.jpg', 'Interior'),
('Taman Kota Hijau', 'Desain taman publik dengan area bermain, jogging track, dan zona meditasi.', '/uploads/sample4.jpg', 'Landscape');
