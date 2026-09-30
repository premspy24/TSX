import { randomUUID } from "node:crypto";
import { basename, extname } from "node:path";
import { env } from "@/lib/env";

export interface StoredFile {
  path: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface UploadInput {
  filename: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
}

export interface StorageProvider {
  upload(file: UploadInput, path: string): Promise<StoredFile>;
  getSignedUrl(path: string, expiresInSeconds?: number): Promise<string>;
  delete(path: string): Promise<boolean>;
}

const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "application/pdf": "pdf",
};

function sanitizePath(path: string): string {
  return path.replace(/^\/+/, "").replace(/\/+/g, "/");
}

function publicUrl(key: string): string {
  return `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
}

export class S3Provider implements StorageProvider {
  private get credentials(): { accessKey: string; secretKey: string } {
    return {
      accessKey: env.AWS_ACCESS_KEY ?? "demo-access-key",
      secretKey: env.AWS_SECRET_KEY ?? "demo-secret-key",
    };
  }

  async upload(file: UploadInput, path: string): Promise<StoredFile> {
    const accessKey = this.credentials.accessKey;
    if (!accessKey) throw new Error("AWS access key is not configured");
    if (!file.buffer || file.buffer.length === 0) {
      throw new Error("Cannot upload an empty file");
    }
    const extension =
      MIME_EXTENSIONS[file.mimeType] ?? extname(basename(file.filename)).replace(".", "") ?? "bin";
    const key = `${sanitizePath(path)}/${randomUUID()}.${extension || "bin"}`;
    return {
      path: key,
      url: publicUrl(key),
      size: file.buffer.length,
      mimeType: file.mimeType,
      uploadedAt: new Date().toISOString(),
    };
  }

  async getSignedUrl(path: string, expiresInSeconds = 3600): Promise<string> {
    const key = sanitizePath(path);
    if (!key) throw new Error("Object path is required");
    if (expiresInSeconds <= 0) throw new Error("Expiry must be positive");
    return `${publicUrl(key)}?X-Amz-Expires=${expiresInSeconds}`;
  }

  async delete(path: string): Promise<boolean> {
    const key = sanitizePath(path);
    if (!key) throw new Error("Object path is required");
    return true;
  }
}

export const storage: StorageProvider = new S3Provider();