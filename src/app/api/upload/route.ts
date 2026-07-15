import { NextRequest } from "next/server";
import { db } from "@/db";
import { media } from "@/db/schema";
import { requireAdmin, isAllowedOrigin } from "@/lib/auth";
import { revalidateAll, logAudit } from "@/lib/cms";
import { cloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const guard = await requireAdmin();
  if (guard instanceof Response) return guard;
  if (!isAllowedOrigin(request)) {
    return Response.json({ error: "Forbidden origin" }, { status: 403 });
  }

  if (!cloudinaryConfigured()) {
    return Response.json(
      {
        error:
          "Cloudinary is not configured. Set CLOUDINARY_* env vars, or paste an image URL directly.",
      },
      { status: 400 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = (formData.get("folder") as string) || "studio";
  const title = (formData.get("title") as string) || "";

  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToCloudinary(buffer, { folder });

    await db.insert(media).values({
      url: result.url,
      publicId: result.publicId,
      title,
      resourceType: result.resourceType,
    });

    revalidateAll();
    await logAudit(guard.email, "media.upload", result.publicId);

    return Response.json({ url: result.url, publicId: result.publicId });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 },
    );
  }
}
