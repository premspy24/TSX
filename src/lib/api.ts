import { NextResponse } from "next/server";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number = 400,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function ok<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(
  error: string,
  status = 400,
): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ success: false, error }, { status });
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    return (body ?? {}) as Record<string, unknown>;
  } catch {
    throw new ApiError("Invalid or missing JSON body", 400);
  }
}

export function requireFields(
  body: Record<string, unknown>,
  fields: string[],
): void {
  const missing = fields.filter(
    (field) =>
      body[field] === undefined ||
      body[field] === null ||
      body[field] === "",
  );
  if (missing.length > 0) {
    throw new ApiError(
      `Missing required field${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}`,
      400,
    );
  }
}

export function isOneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
): value is T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value);
}

export function handleError(error: unknown): NextResponse<ApiResponse<never>> {
  if (error instanceof ApiError) {
    return fail(error.message, error.status);
  }
  return fail("Internal server error", 500);
}