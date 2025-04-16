import categories from "./categories.json" with {type: "json"};
import seedDTOs from "./seedDTOs.json" with {type: "json"};

import { openDb } from './db.js' 

async function createCategories() {
  const db = await openDb()
  // Define table schema
  await db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL
    );
  `);
  const arrCat = [];
  categories.map(({name, slug}) => { 
    const pr = db.run(`INSERT INTO categories (name, slug) VALUES (?, ?)`, name, slug );
    arrCat.push(pr);
  })
  await Promise.all(arrCat);
  await db.close();
}

async function toDomain() {
  const db = await openDb()
  const categories = await db.all('SELECT * FROM categories');
  const products = [];
  seedDTOs.map((dataObject) => {
    // For ease of entering data, catgeory is entered by slug. Convert slug to Id
    const category = categories.find(({ slug }) => (slug === dataObject.category));

    const product = {
      name: dataObject.name,
      price: Number(dataObject.price * 100), 
      description: dataObject.description, 
      smallImage: JSON.stringify(dataObject.smallImage), 
      mediumImage: JSON.stringify(dataObject.mediumImage), 
      largeImage: JSON.stringify(dataObject.largeImage), 
      availability: dataObject.availability, 
      slug: dataObject.slug,
      categoryId: category.id
    }
    products.push(product);
  });
  await db.close();
  return products;
}

async function createProducts(products) {
  const db = await openDb()
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    smallImage VARCHAR(512),
    mediumImage VARCHAR(512),
    largeImage VARCHAR(512),
    slug VARCHAR(255),
    description VARCHAR(512),
    price INTEGER NOT NULL,
    availability INTEGER NOT NULL,
    categoryId  INTEGER,
    FOREIGN KEY (categoryId) REFERENCES categories(categoryId)
    );
  `);
  const prodArr = [];
  products.map((product) => {
    const pr = db.run(
      `INSERT INTO products ( name, 
                              smallImage,
                              mediumImage,
                              largeImage,
                              slug,
                              description,
                              availability,
                              price,
                              categoryId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                              product.name, 
                              product.smallImage, 
                              product.mediumImage, 
                              product.largeImage, 
                              product.slug,
                              product.description,
                              product.availability, 
                              product.price,
                              product.categoryId
    );
    prodArr.push(pr);
  })
  await Promise.all(prodArr);
  await db.close();
}

async function seed() {
  await createCategories();
  const products = await toDomain();
  await createProducts(products); 
}  

seed()
  .catch(err => {
    console.error(err.message)
  })  
