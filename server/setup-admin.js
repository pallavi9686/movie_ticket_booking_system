const bcrypt = require('bcryptjs');
const pool = require('./config/database');

async function setupAdmin() {
  try {
    // Hash the password 'admin123'
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const connection = await pool.getConnection();
    
    // Check if admin exists
    const [existing] = await connection.query('SELECT * FROM admin WHERE username = ?', ['admin']);
    
    if (existing.length > 0) {
      // Update existing admin
      await connection.query('UPDATE admin SET password = ? WHERE username = ?', [hashedPassword, 'admin']);
      console.log('✓ Admin password updated successfully');
    } else {
      // Insert new admin
      await connection.query('INSERT INTO admin (username, password) VALUES (?, ?)', ['admin', hashedPassword]);
      console.log('✓ Admin user created successfully');
    }
    
    console.log('\nAdmin credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('Error setting up admin:', error.message);
    process.exit(1);
  }
}

setupAdmin();
