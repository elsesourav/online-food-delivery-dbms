import mysql from "mysql2/promise";

const dbConfig = {
   host: process.env.MYSQL_HOST || "localhost",
   user: process.env.MYSQL_USER || "root",
   password: process.env.MYSQL_PASSWORD || "",
   database: process.env.MYSQL_DATABASE || "online_food_delivery",
   waitForConnections: true,
   connectionLimit: 10,
   queueLimit: 0,
};

let pool: mysql.Pool;

export const getDb = () => {
   if (!pool) {
      pool = mysql.createPool(dbConfig);
   }
   return pool;
};

export default getDb;
