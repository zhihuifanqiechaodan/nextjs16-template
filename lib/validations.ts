import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "分类名称不能为空"),
  sort: z.number().int().default(0),
});

export const updateCategorySchema = createCategorySchema.partial();

export const productSpecificationSchema = z.object({
  name: z.string().min(1, "规格名称不能为空"),
  options: z.array(z.string()).min(1, "规格选项不能为空"),
  required: z.boolean().default(false),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "商品名称不能为空"),
  image: z.string().optional(),
  categoryId: z.string().min(1, "分类不能为空"),
  price: z.string().refine((val) => !isNaN(Number(val)), "价格必须是数字"),
  originalPrice: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), "原价必须是数字"),
  description: z.string().optional(),
  specifications: z.array(productSpecificationSchema).optional(),
  stock: z.number().int().min(0, "库存不能小于0").default(0),
  sort: z.number().int().default(0),
  status: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();
