import categoriesDTO from "./categories.json" with {type: "json"};
import productsDTO from "./products.json" with {type: "json"};
import { seed } from "../database-functions.js";

seed(categoriesDTO, productsDTO).catch(err => {
  console.error(err.message)
})  