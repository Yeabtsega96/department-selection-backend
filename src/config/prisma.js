import "dotenv/config";
import fs from "node:fs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaMariaDb({
  host: "gateway01.eu-central-1.prod.aws.tidbcloud.com",
  port: 4000,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "department_selection",
  ssl: {
    ca: fs.readFileSync("./certs/ca.pem"),
  },
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
