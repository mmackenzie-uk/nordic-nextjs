import categories from "./categories.json" with {type: "json"};
import data from "./products.json" with {type: "json"};
import { createCategories, createProducts, toDomain} from "../database-functions.js";


async function seed() {
    await createCategories(categories);
    const products = await toDomain(data);
    await createProducts(products); 
  }  
  
seed().catch(err => {
        console.error(err.message)
    })  
  