const pool = require('./config/database');

async function fixBookingsTable() {
  try {
    const connection = await pool.getConnection();
    
    console.log('Checking bookings table structure...');
    
    // Check if columns exist
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'bookings'
    `);
    
    const columnNames = columns.map(c => c.COLUMN_NAME);
    console.log('Existing columns:', columnNames);
    
    // Add theater_id if it doesn't exist
    if (!columnNames.includes('theater_id')) {
      console.log('Adding theater_id column...');
      await connection.query(`
        ALTER TABLE bookings 
        ADD COLUMN theater_id INT NULL
      `);
      console.log('✓ theater_id column added');
    }
    
    // Add theater_name if it doesn't exist
    if (!columnNames.includes('theater_name')) {
      console.log('Adding theater_name column...');
      await connection.query(`
        ALTER TABLE bookings 
        ADD COLUMN theater_name VARCHAR(255) NULL
      `);
      console.log('✓ theater_name column added');
    }
    
    // Add theater_location if it doesn't exist
    if (!columnNames.includes('theater_location')) {
      console.log('Adding theater_location column...');
      await connection.query(`
        ALTER TABLE bookings 
        ADD COLUMN theater_location VARCHAR(500) NULL
      `);
      console.log('✓ theater_location column added');
    }
    
    console.log('\n✅ Bookings table is now up to date!');
    
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing bookings table:', error);
    process.exit(1);
  }
}

fixBookingsTable();
