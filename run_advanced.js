import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runAdvanced() {
  const password = encodeURIComponent('VoDigibooster@123');
  const projectRef = 'bpjokrefslllioxtdxce';
  
  const connStr = `postgresql://postgres.${projectRef}:${password}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`;
  const sql = fs.readFileSync(path.join(__dirname, 'supabase_advanced.sql'), 'utf8');

  console.log('Connecting to Supabase to enable Realtime, pgvector, and RPC Functions...');
  const client = new Client({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    await client.query(sql);
    console.log('ADVANCED_SETUP_SUCCESS: Realtime publications, pgvector, and RPC functions are live!');
    await client.end();
  } catch (err) {
    console.error('Advanced setup error:', err.message);
    try { await client.end(); } catch (e) {}
    process.exit(1);
  }
}

runAdvanced();
