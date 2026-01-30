const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'contact_db',
    port: parseInt(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create connection pool (will be created after DB exists)
let pool = null;

// Initialize database and create tables
async function initializeDatabase() {
    let tempConnection = null;

    try {
        console.log('📊 Connecting to MySQL...');
        console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
        console.log(`   User: ${dbConfig.user}`);
        console.log(`   Database: ${dbConfig.database}`);

        // First, create connection without database
        tempConnection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
            port: dbConfig.port
        });

        console.log('✅ Connected to MySQL server');

        // Create database if it doesn't exist
        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
        console.log(`✅ Database '${dbConfig.database}' ready`);

        // Select the database
        await tempConnection.query(`USE \`${dbConfig.database}\``);

        // Create the contact_messages table
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                subject VARCHAR(200),
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_read BOOLEAN DEFAULT FALSE
            )
        `;

        await tempConnection.query(createTableSQL);
        console.log('✅ Table "contact_messages" created/verified');

        await tempConnection.end();

        // Now create the connection pool
        pool = mysql.createPool(dbConfig);

        // Test the pool
        const testConn = await pool.getConnection();
        testConn.release();

        console.log('✅ Database initialized successfully!');
        return true;

    } catch (error) {
        console.error('❌ Database initialization error:', error.message);
        console.error('   Error code:', error.code);

        if (error.code === 'ECONNREFUSED') {
            console.error('   Make sure MySQL is running on the specified port');
        }
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('   Check your username and password in .env file');
        }

        if (tempConnection) {
            try { await tempConnection.end(); } catch (e) { }
        }
        return false;
    }
}

// Get pool (with initialization check)
function getPool() {
    if (!pool) {
        throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return pool;
}

// Save contact message
async function saveContact(contactData) {
    const { name, email, subject, message } = contactData;

    try {
        const [result] = await getPool().execute(
            'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject || '', message]
        );
        return { success: true, id: result.insertId };
    } catch (error) {
        console.error('Error saving contact:', error);
        throw error;
    }
}

// Get all contact_messages
async function getAllcontact_messages() {
    try {
        const [rows] = await getPool().execute('SELECT * FROM contact_messages ORDER BY created_at DESC');
        return rows;
    } catch (error) {
        console.error('Error fetching contact_messages:', error);
        throw error;
    }
}

// Get single contact by ID
async function getContactById(id) {
    try {
        const [rows] = await getPool().execute('SELECT * FROM contact_messages WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error fetching contact:', error);
        throw error;
    }
}

// Mark contact as read
async function markAsRead(id) {
    try {
        await getPool().execute('UPDATE contact_messages SET is_read = TRUE WHERE id = ?', [id]);
        return { success: true };
    } catch (error) {
        console.error('Error updating contact:', error);
        throw error;
    }
}

// Delete contact
async function deleteContact(id) {
    try {
        await getPool().execute('DELETE FROM contact_messages WHERE id = ?', [id]);
        return { success: true };
    } catch (error) {
        console.error('Error deleting contact:', error);
        throw error;
    }
}

module.exports = {
    getPool,
    initializeDatabase,
    saveContact,
    getAllcontact_messages,
    getContactById,
    markAsRead,
    deleteContact
};
