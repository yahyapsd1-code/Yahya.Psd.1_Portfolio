import "server-only";
import crypto from "node:crypto";

export function cloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

/** Signed upload to Cloudinary using the raw REST API (no SDK required). */
export async function uploadToCloudinary(
  file: Buffer,
  opts: { folder?: string; resourceType?: "image" | "video" | "auto" } = {},
): Promise<{ url: string; publicId: string; resourceType: string }> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const folder = opts.folder ?? "studio";
  const resourceType = opts.resourceType ?? "auto";
  const timestamp = Math.floor(Date.now() / 1000).toString();

  // Signature must cover all signed params, alphabetically sorted.
  const paramsToSign = { folder, timestamp };
  const stringToSign = Object.keys(paramsToSign)
    .sort()
    .map((k) => `${k}=${paramsToSign[k as keyof typeof paramsToSign]}`)
    .join("&");
  const signature = crypto
    .createHash("sha1")
    .update(stringToSign + apiSecret)
    .digest("hex");

  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(file)]));
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    { method: "POST", body: form },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} ${text}`);
  }

  const json = (await res.json()) as {
    secure_url: string;
    public_id: string;
    resource_type: string;
  };

  return {
    url: json.secure_url,
    publicId: json.public_id,
    resourceType: json.resource_type,
  };
}
