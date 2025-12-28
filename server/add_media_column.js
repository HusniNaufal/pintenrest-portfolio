// Migration: Add media column to projects table for multiple image/video support
// Run: node add_media_column.js

const mysql = require('mysql2/promise');
require('dotenv').config();

async function addMediaColumn() {
    console.log('🔄 Connecting to TiDB Cloud...');

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 4000,
            ssl: process.env.DB_SSL === 'true' ? {
                minVersion: 'TLSv1.2',
                rejectUnauthorized: true
            } : undefined
        });

        console.log('✅ Connected!');
        console.log('📝 Adding media column to projects table...');

        // Check if column already exists
        const [columns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'projects' AND COLUMN_NAME = 'media'
        `, [process.env.DB_NAME]);

        if (columns.length > 0) {
            console.log('ℹ️  Column "media" already exists, skipping...');
        } else {
            // Add media column (JSON type for storing array of URLs)
            await connection.query(`
                ALTER TABLE projects 
                ADD COLUMN media JSON DEFAULT NULL
            `);
            console.log('✅ Column "media" added successfully!');
        }

        // Migrate existing image_url to media array
        console.log('📦 Migrating existing image_url to media array...');
        await connection.query(`
            UPDATE projects 
            SET media = JSON_ARRAY(image_url) 
            WHERE image_url IS NOT NULL AND (media IS NULL OR JSON_LENGTH(media) = 0)
        `);
        console.log('✅ Migration completed!');

        await connection.end();
        console.log('\n🎉 Database updated successfully!');
        console.log('👉 You can now upload multiple images and videos per project!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

addMediaColumn();
