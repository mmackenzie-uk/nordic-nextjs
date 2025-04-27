import { promises as fs } from 'fs';
import { productsDump } from "../database-functions.js";

const data = await productsDump();
await fs.writeFile('./app/data/charm/products-dump.json', data);
