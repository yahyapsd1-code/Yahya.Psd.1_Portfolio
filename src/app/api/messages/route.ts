import { db } from "@/db";
import { messages } from "@/db/schema";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;

  const items = await db.select().from(messages).orderBy(desc(messages.createdAt));
  return Response.json(items);
}
