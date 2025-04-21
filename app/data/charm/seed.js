import categoriesDTO from "./categories.json" with {type: "json"};
import productsNecklaces from "./products-necklaces.json" with {type: "json"};
import productsEarrings from "./products-earrings.json" with {type: "json"};
import productsBrooches from "./products-brooches.json" with {type: "json"};
import productsBracelets from "./products-bracelets.json" with {type: "json"};
import { seed, deleteDb } from "../database-functions.js";

await deleteDb();
await seed(categoriesDTO, productsNecklaces);
await seed(categoriesDTO, productsEarrings);
await seed(categoriesDTO, productsBrooches);
await seed(categoriesDTO, productsBracelets);