import categoriesDTO from "./categories.json" with {type: "json"};
import productsNecklaces from "./products-necklaces.json" with {type: "json"};
import productsEarrings from "./products-earrings.json" with {type: "json"};
import productsBrooches from "./products-brooches.json" with {type: "json"};
import productsBracelets from "./products-bracelets.json" with {type: "json"};
import { seedProducts, seedCategories, deleteDb } from "../database-functions.js";

await deleteDb();
await seedCategories(categoriesDTO);
await seedProducts(productsNecklaces);
await seedProducts(productsEarrings);
await seedProducts(productsBrooches);
await seedProducts(productsBracelets);