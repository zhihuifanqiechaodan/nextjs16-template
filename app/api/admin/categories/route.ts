import { db } from "@/lib/db";
import { category } from "@/lib/db/schema";
import { createCategorySchema } from "@/lib/validations";
import { asc, count } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const QuerySchema = z.object({
  pageNum: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
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

    const [totalResult] = await db.select({ value: count() }).from(category);
    const total = totalResult.value;

    const categories = await db
      .select()
      .from(category)
      .limit(pageSize)
      .offset(offset)
      .orderBy(asc(category.sort));

    return NextResponse.json({
      data: categories,
      total,
      pageNum,
      pageSize,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = createCategorySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid parameters",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, sort } = validationResult.data;

    const newCategory = {
      id: uuidv4(),
      name,
      sort,
    };

    await db.insert(category).values(newCategory);

    return NextResponse.json(
      {
        message: "Category created successfully",
        data: newCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
