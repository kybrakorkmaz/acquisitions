import 'dotenv/config';
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

let connectionString;

if (process.env.NODE_ENV === 'development') {
  // Local Neon branch
  neonConfig.fetchEndpoint = 'http://neon-local:5432/sql';
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;

  connectionString = 'postgres://neon:npg@neon-local:5432/neondb';
} else {
  // Production: Neon Cloud
  connectionString = process.env.DATABASE_URL;
}

const sql = neon(connectionString);
const db = drizzle(sql);

export { db, sql };
