import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const mysqlServer = mysql.createPool({
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
});

export default mysqlServer;
