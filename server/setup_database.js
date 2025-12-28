// Script untuk setup database TiDB Cloud
// Jalankan: node setup_database.js

const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
    console.log('🔄 Connecting to TiDB Cloud...');

    try {
        // Connect tanpa specify database dulu
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT || 4000,
            ssl: process.env.DB_SSL === 'true' ? {
                minVersion: 'TLSv1.2',
                rejectUnauthorized: true
            } : undefined
        });

        console.log('✅ Connected to TiDB Cloud!');
        console.log('📦 Creating database...');

        // Create database
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        await connection.query(`USE ${process.env.DB_NAME}`);

        console.log(`✅ Database '${process.env.DB_NAME}' created/selected`);
        console.log('📋 Creating tables...');

        // Create categories table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Table "categories" created');

        // Insert default categories
        await connection.query(`
            INSERT IGNORE INTO categories (name) VALUES 
            ('Perumahan'), ('Komersial'), ('Interior'), ('Landscape')
        `);
        console.log('✅ Default categories inserted');

        // Create projects table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                image_url VARCHAR(500),
                category VARCHAR(100) DEFAULT 'Perumahan',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Table "projects" created');

        // Insert sample data
        await connection.query(`
            INSERT INTO projects (title, description, image_url, category) VALUES
            ('Villa Minimalis Bali', 'Desain villa modern dengan sentuhan tradisional Bali. Menggunakan material alami seperti kayu jati dan batu alam.', '/uploads/sample1.jpg', 'Perumahan'),
            ('Kantor Startup Tech', 'Ruang kerja open-plan dengan area kolaborasi dan ruang meeting yang fleksibel.', '/uploads/sample2.jpg', 'Komersial'),
            ('Apartemen Studio', 'Interior apartemen studio 35m2 dengan konsep multifungsi dan storage maksimal.', '/uploads/sample3.jpg', 'Interior'),
            ('Taman Kota Hijau', 'Desain taman publik dengan area bermain, jogging track, dan zona meditasi.', '/uploads/sample4.jpg', 'Landscape')
        `);
        console.log('✅ Sample projects inserted');

        // Verify
        const [categories] = await connection.query('SELECT * FROM categories');
        const [projects] = await connection.query('SELECT * FROM projects');

        console.log('\n📊 Database Summary:');
        console.log(`   Categories: ${categories.length} items`);
        console.log(`   Projects: ${projects.length} items`);

        await connection.end();
        console.log('\n🎉 Database setup completed successfully!');
        console.log('👉 You can now run: npm start');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\n💡 Tips:');
        console.error('   - Check your .env credentials');
        console.error('   - Make sure DB_SSL=true for TiDB Cloud');
        console.error('   - Verify internet connection');
        process.exit(1);
    }
}

setupDatabase();
