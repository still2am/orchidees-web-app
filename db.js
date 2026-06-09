const mysql = require('mysql2/promise');

async function initDB() {
    const connection = await mysql.createConnection({ 
        host: 'localhost', 
        user: 'root', 
        password: 'root',
        charset: 'utf8mb4' 
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS orchidees_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.query(`USE orchidees_db`);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
            id_user INT AUTO_INCREMENT PRIMARY KEY,
            firstname VARCHAR(100),
            lastname VARCHAR(100),
            email VARCHAR(255),
            password VARCHAR(255),
            phone VARCHAR(50),
            gender VARCHAR(20)
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS orders (
            id_order INT AUTO_INCREMENT PRIMARY KEY,
            id_user INT,
            recipient_firstname VARCHAR(100),
            recipient_lastname VARCHAR(100),
            address VARCHAR(255),
            phone VARCHAR(50),
            delivery_date DATE,
            notes TEXT,
            flower_name VARCHAR(100),
            price VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    return connection;
}

module.exports = initDB;