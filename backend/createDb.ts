import { Client } from 'pg';

async function createDB() {
  const client = new Client({
    connectionString: "postgresql://postgres:admin123@localhost:5432/postgres",
  });
  try {
    await client.connect();
    await client.query("CREATE DATABASE finance_tracker");
    console.log("Database 'finance_tracker' created successfully!");
  } catch (err: any) {
    if (err.message.includes("already exists")) {
      console.log("Database 'finance_tracker' already exists.");
    } else {
      console.error("Error creating database:", err.message);
    }
  } finally {
    await client.end();
  }
}

createDB();
