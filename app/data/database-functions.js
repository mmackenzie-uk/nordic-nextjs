import * as fs from 'fs';

import { openDb } from './db.js' 

export const fromProductDomain = ({
  id,  
  name,
  price,
  description,
  smallImage,
  mediumImage,
  largeImage,
  availability,
  slug,
  categoryId } , categories) => {

  const productDTO = {
    id,
    name,
    price,
    description,
    smallImage,
    mediumImage,
    largeImage,
    availability,
    slug,
    category: categories.find(category => category.id === categoryId).name.toLowerCase()
  }
  return  productDTO;
}

export const fromProductsDomain = (products, categories) => {
  const arr = [];
  products.forEach((product) => {
      const response = fromProductDomain(product, categories)
      arr.push(response);
  });
  return arr;
}



function deleteDb() {
  fs.unlink('./mydb.db', function (err) {
    if (!err) {
      console.log('File deleted!');
    }
  });
}

async function createCategories(categories) {
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

async function toDomain(productsDTO) {
  const db = await openDb()
  const categories = await db.all('SELECT * FROM categories');
  const products = [];
  productsDTO.map((dataObject) => {
    // For ease of entering data, catgeory is entered by slug. Convert slug to Id
    const category = categories.find(({ slug }) => (slug === dataObject.category));

    // console.log("prod ", dataObject)

    const product = {
      name: dataObject.name,
      price: Number(dataObject.price), 
      description: dataObject.description, 
      smallImage: dataObject.smallImage, 
      mediumImage: dataObject.mediumImage, 
      largeImage: dataObject.largeImage, 
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
  products.map((product, index) => {
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

async function seedProducts(productsDTO) {
  const products = await toDomain(productsDTO);
  await createProducts(products); 
}  

async function seedCategories(categoriesDTO) {
  await createCategories(categoriesDTO);
}  

async function productsDump() {
  const db = await openDb();
  const products = await db.all('SELECT * FROM products');
  const categories = await db.all('SELECT * FROM categories');
  const productsDTO = fromProductsDomain(products, categories);
  // the two terms "null" and "4" are for formatting the json file to be pretty
  return JSON.stringify(productsDTO, null, 4);
}

async function categoriesDump() {
  const db = await openDb();
  const sql = 'SELECT * FROM categories';
  const categories = await db.all(sql);
  // the two terms "null" and "4" are for formatting the json file to be pretty
  return JSON.stringify(categories, null, 4);
}


export {
  seedProducts,
  seedCategories,
  deleteDb,
  productsDump,
  categoriesDump,
}