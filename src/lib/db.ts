import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from "@/db/schema"

export interface Env {
  api_portal_db: D1Database;
}

let db: DrizzleD1Database<typeof schema> | null = null

export async function createDB() {
  if (!db) {
    const { env } = await getCloudflareContext({ async: true })
    console.log(env)
    db = drizzle((env as Env).api_portal_db, { schema })
  }
  console.log(db)
  return db
}
