import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runAuthMigration() {
  const password = encodeURIComponent('VoDigibooster@123');
  const projectRef = 'bpjokrefslllioxtdxce';
  
  const connStr = `postgresql://postgres.${projectRef}:${password}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`;
  const sql = fs.readFileSync(path.join(__dirname, 'supabase_auth_hash.sql'), 'utf8');

  console.log('Migrating Bcrypt PIN hash to Supabase...');
  const client = new Client({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    await client.query(sql);
    console.log('PIN_HASH_MIGRATION_SUCCESS: pgcrypto & verify_executive_pin RPC deployed!');
    await client.end();
  } catch (err) {
    console.error('Migration error:', err.message);
    try { await client.end(); } catch (e) {}
    process.exit(1);
  }
}

runAuthMigration();
