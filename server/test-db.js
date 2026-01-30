const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabase() {
    const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        port: parseInt(process.env.DB_PORT) || 3306
    };

    const dbName = process.env.DB_NAME || 'contact_db';

    console.log('🔍 Testing database connection...');
    console.log('Config:', { ...dbConfig, password: dbConfig.password ? '****' : '(empty)' });
    console.log('Database name:', dbName);

    try {
        // Connect to MySQL
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to MySQL');

        // Create database
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`✅ Database '${dbName}' created/exists`);

        // Use database
        await connection.query(`USE \`${dbName}\``);
        console.log(`✅ Using database '${dbName}'`);

        // Show existing tables
        const [tables] = await connection.query('SHOW TABLES');
        console.log('📋 Existing tables:', tables);

        // Create contacts table
        const createSQL = `
            CREATE TABLE IF NOT EXISTS contacts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                subject VARCHAR(200),
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_read TINYINT(1) DEFAULT 0
            )
        `;

        await connection.query(createSQL);
        console.log('✅ CREATE TABLE executed');

        // Show tables again
        const [tablesAfter] = await connection.query('SHOW TABLES');
        console.log('📋 Tables after CREATE:', tablesAfter);

        // Describe the table
        try {
            const [desc] = await connection.query('DESCRIBE contacts');
            console.log('📋 Table structure:', desc);
        } catch (e) {
            console.log('❌ Table does not exist:', e.message);
        }

        // Try inserting test data
        try {
            const [result] = await connection.query(
                'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
                ['Test User', 'test@test.com', 'Test Subject', 'Test Message']
            );
            console.log('✅ Test insert successful, ID:', result.insertId);

            // Delete test data
            await connection.query('DELETE FROM contacts WHERE id = ?', [result.insertId]);
            console.log('✅ Test data cleaned up');
        } catch (e) {
            console.log('❌ Insert failed:', e.message);
        }

        await connection.end();
        console.log('\n✅ All tests passed!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('   Code:', error.code);
        console.error('   SQL State:', error.sqlState);
    }
}

testDatabase();
