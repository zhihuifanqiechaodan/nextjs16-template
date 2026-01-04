import { db } from "@/lib/db";
import { user } from "@/lib/db/auth-schema";
import { count, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const QuerySchema = z.object({
  pageNum: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Validate parameters using Zod
    const validationResult = QuerySchema.safeParse(
      Object.fromEntries(searchParams)
    );

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid parameters",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { pageNum, pageSize } = validationResult.data;

    const offset = (pageNum - 1) * pageSize;

    // Get total count
    const [totalResult] = await db.select({ value: count() }).from(user);
    const total = totalResult.value;

    // Get paginated data
    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
      })
      .from(user)
      .limit(pageSize)
      .offset(offset)
      .orderBy(desc(user.createdAt));

    return NextResponse.json({
      data: users,
      total,
      pageNum,
      pageSize,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
