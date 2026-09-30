import { NextResponse } from "next/server";
import { ApiError, handleError, ok, readJson, requireFields } from "@/lib/api";
import { generateToken } from "@/lib/auth";
import { DEMO_USERS } from "@/lib/mock-data";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await readJson(request);
    requireFields(body, ["email", "password"]);

    const email = String(body.email).trim().toLowerCase();
    const password = String(body.password);
    if (password.length < 6) {
      throw new ApiError("Password must be at least 6 characters", 422);
    }

    const demoUser =
      DEMO_USERS.find((user) => user.email.toLowerCase() === email) ?? DEMO_USERS[0];

    const token = generateToken({
      id: demoUser.id,
      name: demoUser.name,
      email: demoUser.email,
      phone: demoUser.phone ?? null,
      avatar_url: demoUser.avatar ?? null,
      verified: demoUser.verified,
      role: demoUser.role,
      city: demoUser.city ?? null,
    });

    return ok({ token, user: demoUser });
  } catch (error) {
    return handleError(error);
  }
}