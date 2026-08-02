const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function runMigrations() {
  // Load environment variables
  require('dotenv').config({ path: '.env.local' });

  let connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL environment variable not found');
    process.exit(1);
  }

  // Remove sslmode from connection string to use custom SSL config
  connectionString = connectionString.replace(/([?&])sslmode=\w+&/, '$1').replace(/([?&])sslmode=\w+$/, '');

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Read and execute migrations
    const migrationsDir = path.join(__dirname, 'src/database/migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`Running migration: ${file}`);
      try {
        await client.query(sql);
        console.log(`✓ ${file} completed`);
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log(`⚠ ${file} already exists, skipping`);
        } else {
          throw err;
        }
      }
    }

    console.log('\n✓ All migrations completed successfully');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
