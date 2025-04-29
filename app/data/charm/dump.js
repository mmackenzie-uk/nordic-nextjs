import { promises as fs } from 'fs';
import { productsDump, categoriesDump } from "../database-functions.js";

const prod = await productsDump();
await fs.writeFile('./app/data/charm/products-dump.json', prod);
const cat = await categoriesDump();
await fs.writeFile('./app/data/charm/categories-dump.json', cat);


