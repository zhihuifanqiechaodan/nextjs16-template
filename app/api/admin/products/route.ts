import { db } from "@/lib/db";
import { product } from "@/lib/db/schema";
import { createProductSchema } from "@/lib/validations";
import { eq, count, desc, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const QuerySchema = z.object({
  pageNum: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  categoryId: z.string().optional(),
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

    const { pageNum, pageSize, categoryId } = validationResult.data;
    const offset = (pageNum - 1) * pageSize;

    const where = categoryId ? eq(product.categoryId, categoryId) : undefined;

    const [totalResult] = await db
      .select({ value: count() })
      .from(product)
      .where(where);
    const total = totalResult.value;

    const products = await db
      .select()
      .from(product)
      .where(where)
      .limit(pageSize)
      .offset(offset)
      .orderBy(desc(product.createdAt));

    return NextResponse.json({
      data: products,
      total,
      pageNum,
      pageSize,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = createProductSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid parameters",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      name,
      image,
      categoryId,
      price,
      originalPrice,
      description,
      specifications,
      stock,
      sort,
      status,
    } = validationResult.data;

    const newProduct = {
      id: uuidv4(),
      name,
      image,
      categoryId,
      price,
      originalPrice,
      description,
      specifications,
      stock,
      sort,
      status,
    };

    await db.insert(product).values(newProduct);

    return NextResponse.json(
      {
        message: "Product created successfully",
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
