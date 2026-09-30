import { NextResponse } from "next/server";
import { ApiError, handleError, ok, readJson, requireFields } from "@/lib/api";
import { generateToken, hashPassword } from "@/lib/auth";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  city?: string;
}

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await readJson(request);
    requireFields(body, ["name", "email", "password"]);

    const payload: RegisterPayload = {
      name: String(body.name).trim(),
      email: String(body.email).trim().toLowerCase(),
      password: String(body.password),
      phone: body.phone ? String(body.phone) : undefined,
      city: body.city ? String(body.city) : undefined,
    };

    if (payload.name.length < 2) {
      throw new ApiError("Name must be at least 2 characters", 422);
    }
    if (!EMAIL_REGEX.test(payload.email)) {
      throw new ApiError("Invalid email address", 422);
    }
    if (payload.password.length < 8) {
      throw new ApiError("Password must be at least 8 characters", 422);
    }

    const passwordHash = await hashPassword(payload.password);
    void passwordHash;

    const newUser = {
      id: `u${Date.now()}`,
      name: payload.name,
      email: payload.email,
      phone: payload.phone ?? "",
      avatar: "",
      verified: false,
      rating: 0,
      totalSales: 0,
      totalPurchases: 0,
      joinDate: new Date().toISOString().slice(0, 10),
      role: "user" as const,
      city: payload.city,
    };

    const token = generateToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone || null,
      avatar_url: newUser.avatar || null,
      verified: newUser.verified,
      role: newUser.role,
      city: newUser.city ?? null,
    });

    return ok({ token, user: newUser }, 201);
  } catch (error) {
    return handleError(error);
  }
}