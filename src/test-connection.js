const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'server42.hostwhitelabel.com',
  port: 3306,
  user: 'mediaweb6_cityxpress',
  password: 'Rfc59sspvyqGxZD6dgkz',
  database: 'mediaweb6_cityxpress',
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check if port 3306 is open on server42.hostwhitelabel.com');
    console.log('2. Enable remote MySQL access in cPanel');
    console.log('3. Try SSH tunnel method');
  } else {
    console.log('✅ Connected successfully!');
    
    // Test query
    connection.query('SHOW TABLES', (err, results) => {
      if (err) {
        console.error('Query failed:', err.message);
      } else {
        console.log('Tables in database:', results.map(row => Object.values(row)[0]));
      }
      connection.end();
    });
  }
});