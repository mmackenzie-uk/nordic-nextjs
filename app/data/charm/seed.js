import products from "./products-dump.json" with {type: "json"};
import categories from "./categories-dump.json" with {type: "json"};
import { seedProducts, seedCategories, deleteDb } from "../database-functions.js";

await deleteDb();
await seedCategories(categories);
await seedProducts(products);