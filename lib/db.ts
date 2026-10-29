import "server-only";
import mysql, { type Pool, type RowDataPacket, type ResultSetHeader } from "mysql2/promise";
import { SCHEMA, COLUMNS } from "./schema.mjs";

const g = globalThis as unknown as { __nikPool?: Pool; __nikSchema?: Promise<void> };

export const dbConfigured = Boolean(process.env.DATABASE_URL);

function pool() {
  if (!g.__nikPool) {
    g.__nikPool = mysql.createPool({
      uri: process.env.DATABASE_URL,
      connectionLimit: 5,
      waitForConnections: true,
      timezone: "Z",
      dateStrings: false,
      charset: "utf8mb4",
      enableKeepAlive: true,
    });
  }
  return g.__nikPool;
}

/** Creates tables on first use, so a fresh Hostinger database works without a migration step. */
function ensureSchema() {
  if (!g.__nikSchema) {
    g.__nikSchema = (async () => {
      for (const sql of SCHEMA) await pool().query(sql);
      const [cols] = await pool().query<RowDataPacket[]>(
        `SELECT TABLE_NAME AS t, COLUMN_NAME AS c FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE()`
      );
      const have = new Set(cols.map((r) => `${r.t}.${r.c}`));
      for (const [table, column, def] of COLUMNS) {
        if (!have.has(`${table}.${column}`)) await pool().query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${def}`);
      }
    })().catch((e) => {
      g.__nikSchema = undefined;
      throw e;
    });
  }
  return g.__nikSchema;
}

export async function query<T = RowDataPacket>(sql: string, params: unknown[] = []): Promise<T[]> {
  await ensureSchema();
  const [rows] = await pool().query<RowDataPacket[]>(sql, params);
  return rows as unknown as T[];
}

export async function execute(sql: string, params: unknown[] = []): Promise<ResultSetHeader> {
  await ensureSchema();
  const [res] = await pool().query<ResultSetHeader>(sql, params);
  return res;
}
