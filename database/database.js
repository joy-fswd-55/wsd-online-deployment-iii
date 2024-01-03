import { Client } from 'https://deno.land/x/postgres/mod.ts';

const env = Deno.env.toObject();
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
} = env;

const client = new Client({
  hostname: DB_HOST || 'localhost',
  port: +DB_PORT || 5432,
  user: DB_USER || 'postgres',
  password: DB_PASSWORD || 'password',
  database: DB_DATABASE || 'database',
});

async function connectWithRetry() {
  for (let i = 0; i < 5; i++) {
    try {
      await client.connect();
      console.log("Database connected");
      return;
    } catch (err) {
      console.error("Failed to connect to the database, retrying in 5 seconds...", err);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    }
  }
  throw new Error("Failed to connect to the database after several attempts.");
}

async function createMessagesTable() {
  try {
    await client.queryArray(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender TEXT NOT NULL,
        message TEXT NOT NULL
      );
    `);
    console.log("Table 'messages' ensured.");
  } catch (err) {
    console.error("Error creating 'messages' table:", err);
  }
}

await connectWithRetry();
await createMessagesTable();

export default client;
