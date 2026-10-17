import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  const password = encodeURIComponent('VoDigibooster@123');
  const projectRef = 'bpjokrefslllioxtdxce';
  
  const connectionStrings = [
    `postgresql://postgres.${projectRef}:${password}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`,
    `postgresql://postgres.${projectRef}:${password}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,
    `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`
  ];

  const sqlPath = path.join(__dirname, 'supabase_schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  let success = false;
  for (const connStr of connectionStrings) {
    console.log('Connecting to Supabase...');
    const client = new Client({
      connectionString: connStr,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000
    });

    try {
      await client.connect();
      console.log('Connected! Executing schema migration...');
      await client.query(sql);
      console.log('MIGRATION_SUCCESSFUL: All tables created successfully!');
      await client.end();
      success = true;
      break;
    } catch (err) {
      console.warn('Attempt failed:', err.message);
      try { await client.end(); } catch (e) {}
    }
  }

  if (!success) {
    process.exit(1);
  }
}

migrate();
