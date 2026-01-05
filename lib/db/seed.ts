import { db } from "./index";
import { category, product } from "./schema";
import { v4 as uuidv4 } from "uuid";

async function main() {
  console.log("Seeding database...");

  // Clear existing data (optional, but good for idempotent runs if we truncate/delete)
  // For now, let's just insert new data. If unique constraints are hit, it might fail.
  // Ideally we should maybe clean up or check existence.
  // Given it's a "create some data" request, appending is usually safer unless asked to reset.
  // However, without checking, running it twice duplicates data (uuids are new).
  // Let's just create data.

  // 1. Create Categories
  const categories = [
    { id: uuidv4(), name: "热销榜", sort: 1 },
    { id: uuidv4(), name: "主食套餐", sort: 2 },
    { id: uuidv4(), name: "小吃炸物", sort: 3 },
    { id: uuidv4(), name: "爽口饮品", sort: 4 },
  ];

  await db.insert(category).values(categories);
  //   console.log("Inserted categories");

  //   // 2. Create Products
  //   const productsData = [
  //     {
  //       id: uuidv4(),
  //       name: "招牌牛肉面", // Signature Beef Noodles
  //       categoryId: categories[1].id,
  //       price: "28.00",
  //       originalPrice: "35.00",
  //       description: "精选上等牛腱肉，慢火炖煮4小时，汤浓肉烂。",
  //       image:
  //         "https://images.unsplash.com/photo-1554502078-ef0fc409efce?auto=format&fit=crop&w=800&q=80",
  //       specifications: [
  //         {
  //           name: "口味",
  //           options: ["不辣", "微辣", "中辣", "特辣"],
  //           required: true,
  //         },
  //         {
  //           name: "面条",
  //           options: ["细面", "宽面", "刀削面"],
  //           required: true,
  //         },
  //         {
  //           name: "加料",
  //           options: ["加肉", "加蛋", "加青菜"],
  //           required: false,
  //         },
  //       ],
  //       stock: 100,
  //       sort: 1,
  //       status: true,
  //     },
  //     {
  //       id: uuidv4(),
  //       name: "酸菜鱼饭", // Pickled Fish Rice
  //       categoryId: categories[1].id,
  //       price: "32.00",
  //       originalPrice: "40.00",
  //       description: "老坛酸菜，鲜嫩鱼片，开胃下饭。",
  //       image:
  //         "https://images.unsplash.com/photo-1562967960-f55ca6308550?auto=format&fit=crop&w=800&q=80",
  //       specifications: [
  //         {
  //           name: "辣度",
  //           options: ["微辣", "中辣", "特辣"],
  //           required: true,
  //         },
  //       ],
  //       stock: 50,
  //       sort: 2,
  //       status: true,
  //     },
  //     {
  //       id: uuidv4(),
  //       name: "现炸酥肉", // Crispy Fried Pork
  //       categoryId: categories[2].id,
  //       price: "18.00",
  //       originalPrice: "22.00",
  //       description: "外酥里嫩，肥而不腻，配上干辣椒面。",
  //       image:
  //         "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80",
  //       specifications: [],
  //       stock: 200,
  //       sort: 1,
  //       status: true,
  //     },
  //     {
  //       id: uuidv4(),
  //       name: "柠檬红茶", // Lemon Black Tea
  //       categoryId: categories[3].id,
  //       price: "12.00",
  //       originalPrice: "15.00",
  //       description: "新鲜柠檬，红茶底，清爽解腻。",
  //       image:
  //         "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
  //       specifications: [
  //         {
  //           name: "温度",
  //           options: ["正常冰", "少冰", "去冰", "常温", "热"],
  //           required: true,
  //         },
  //         {
  //           name: "甜度",
  //           options: ["标准糖", "半糖", "微糖", "无糖"],
  //           required: true,
  //         },
  //       ],
  //       stock: 500,
  //       sort: 1,
  //       status: true,
  //     },
  //     {
  //       id: uuidv4(),
  //       name: "超级豪华双人餐",
  //       categoryId: categories[0].id,
  //       price: "88.00",
  //       originalPrice: "128.00",
  //       description: "包含2份主食，2份小吃，2杯饮品。",
  //       image:
  //         "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80",
  //       specifications: [],
  //       stock: 20,
  //       sort: 0,
  //       status: true,
  //     },
  //   ];

  //   await db.insert(product).values(productsData);
  console.log("Inserted products");

  console.log("Seeding complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed", err);
  process.exit(1);
});
