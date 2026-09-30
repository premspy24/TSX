import { randomUUID } from "node:crypto";
import { env } from "@/lib/env";

export interface QueryResult<T = unknown> {
  rows: T[];
  rowCount: number;
}

export interface DbClient {
  query<T = unknown>(text: string, params?: unknown[]): Promise<QueryResult<T>>;
  transaction<T>(work: (client: DbClient) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}

export interface Repository<T extends { id: string }> {
  list(filter?: Partial<T>): Promise<T[]>;
  get(id: string): Promise<T | null>;
  create(
    row: Omit<T, "id" | "created_at" | "updated_at"> & {
      id?: string;
      created_at?: string;
      updated_at?: string;
    },
  ): Promise<T>;
  update(id: string, patch: Partial<T>): Promise<T | null>;
  remove(id: string): Promise<boolean>;
}

class InMemoryDb implements DbClient {
  private readonly stores = new Map<string, Map<string, { id: string } & Record<string, unknown>>>();

  async query<T = unknown>(text: string, params?: unknown[]): Promise<QueryResult<T>> {
    void text;
    void params;
    return { rows: [], rowCount: 0 };
  }

  async transaction<T>(work: (client: DbClient) => Promise<T>): Promise<T> {
    return work(this);
  }

  async close(): Promise<void> {
    this.stores.clear();
  }

  table<T extends { id: string }>(name: string): Repository<T> {
    const store = this.store(name);

    return {
      async list(filter?: Partial<T>): Promise<T[]> {
        const rows = [...store.values()] as T[];
        if (!filter) return rows;
        return rows.filter((row) =>
          Object.entries(filter).every(
            ([key, value]) => (row as Record<string, unknown>)[key] === value,
          ),
        );
      },

      async get(id: string): Promise<T | null> {
        return (store.get(id) as T | undefined) ?? null;
      },

      async create(row): Promise<T> {
        const now = new Date().toISOString();
        const id = (row.id ?? randomUUID()) as string;
        const record: { id: string } & Record<string, unknown> = {
          ...(row as unknown as Record<string, unknown>),
          id,
          created_at: row.created_at ?? now,
          updated_at: row.updated_at ?? now,
        };
        store.set(id, record);
        return record as T;
      },

      async update(id: string, patch: Partial<T>): Promise<T | null> {
        const existing = store.get(id);
        if (!existing) return null;
        const updated: { id: string } & Record<string, unknown> = {
          ...existing,
          ...(patch as unknown as Record<string, unknown>),
          id,
          updated_at: new Date().toISOString(),
        };
        store.set(id, updated);
        return updated as T;
      },

      async remove(id: string): Promise<boolean> {
        return store.delete(id);
      },
    };
  }

  private store(name: string): Map<string, { id: string } & Record<string, unknown>> {
    let store = this.stores.get(name);
    if (!store) {
      store = new Map();
      this.stores.set(name, store);
    }
    return store;
  }
}

export const db: DbClient = new InMemoryDb();

export function repo<T extends { id: string }>(table: string): Repository<T> {
  return (db as InMemoryDb).table<T>(table);
}

export async function mockQuery<T = unknown>(
  sql: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  void sql;
  void params;
  return { rows: [], rowCount: 0 };
}

/**
 * In-memory mock used while the app runs without a real database. The API
 * route handlers serve frontend mock data directly; this module documents the
 * integration points for going live.
 *
 * To wire production Postgres use `pg`:
 *
 *   import { Pool } from "pg";
 *   export const pool = new Pool({ connectionString: env.DATABASE_URL });
 *   export async function query(text, params) { return pool.query(text, params); }
 *
 * Or adopt Prisma: replace this module with the generated client and use the
 * `DATABASE_URL` (migrate) and `DIRECT_URL` (runtime) variables.
 */
export interface DbConfig {
  url: string;
  directUrl: string | null;
  poolSize: number;
}

export function getDbConfig(): DbConfig {
  return {
    url: env.DATABASE_URL,
    directUrl: env.DIRECT_URL,
    poolSize: 10,
  };
}