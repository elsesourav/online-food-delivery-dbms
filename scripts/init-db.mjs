import dotenv from "dotenv";
import fs from "fs";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config({ path: "../.env.local" });

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
   try {
      // Read the SQL file
      const sqlFile = path.join(__dirname, "..", "database.sql");
      const sql = fs.readFileSync(sqlFile, "utf8");

      // Create connection (without database specified)
      const connection = await mysql.createConnection({
         host: process.env.MYSQL_HOST || "localhost",
         user: process.env.MYSQL_USER || "root",
         password: process.env.MYSQL_PASSWORD || "",
      });

      console.log("Connected to MySQL server");

      // First, create the database
      await connection.execute(
         "CREATE DATABASE IF NOT EXISTS online_food_delivery"
      );
      console.log("Database created");

      // Close the connection and create a new one with the database selected
      await connection.end();

      // Create new connection with database
      const dbConnection = await mysql.createConnection({
         host: process.env.MYSQL_HOST || "localhost",
         user: process.env.MYSQL_USER || "root",
         password: process.env.MYSQL_PASSWORD || "",
         database: "online_food_delivery",
      });

      // Remove CREATE DATABASE and USE statements from SQL and split by semicolons
      const cleanSql = sql
         .replace(/-- Create database[\s\S]*?USE online_food_delivery;/g, "")
         .replace(/CREATE DATABASE IF NOT EXISTS online_food_delivery;/g, "")
         .replace(/USE online_food_delivery;/g, "")
         .trim();

      // Split SQL into individual statements and execute each one
      const statements = cleanSql
         .split(";")
         .filter((stmt) => stmt.trim().length > 0);

      for (const statement of statements) {
         const trimmed = statement.trim();
         if (trimmed) {
            await dbConnection.execute(trimmed);
         }
      }

      console.log("Database and tables created successfully");

      await dbConnection.end();
      console.log("Database initialization completed");
   } catch (error) {
      console.error("Error initializing database:", error);
      process.exit(1);
   }
}

initDatabase();
