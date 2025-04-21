"use server"

import { openDb } from "../data/db";

import { fromCategoriesDomain, fromCategoryDomain } from "../DTO-mappings/category-mappings";

import { fromProductDomain, fromProductsDomain } from "../DTO-mappings/product-mappings";
import { categoriesService } from "../services/categories-service";
import { productsService } from "../services/products-service";

export async function getCategories() {
    const categories = await categoriesService.get();
    const categoriesDTO = fromCategoriesDomain(categories)
    return categoriesDTO;
}

export async function findAll(currentPage: number, ITEMS_PER_PAGE: number) {
    const categories = await categoriesService.get();

    const products = await productsService.get(currentPage, ITEMS_PER_PAGE);
    const productDTO = fromProductsDomain(products, categories);
    return productDTO;
}

export async function findByCategory(categoryId: number, currentPage: number, ITEMS_PER_PAGE: number) {
    const categories = await categoriesService.get();

   const products = await productsService.getByCategory(categoryId, currentPage, ITEMS_PER_PAGE)
   const productDTO = fromProductsDomain(products, categories);
   return productDTO;
}

export async function getProduct(slug: string) {
    const categories = await categoriesService.get();

    const product = await productsService.getProductBySlug(slug);
    const productDTO = fromProductDomain(product, categories);
    return productDTO;
}

export async function getCategory(slug: string) {
   const category = await categoriesService.getBySlug(slug);
   const categoryDTO= fromCategoryDomain(category);
   return categoryDTO;
}

export async function getCategoryById(id: number) {
    const db = await openDb();
    const res = await db.all(`SELECT * FROM categories WHERE id = ${id}`);
    return res[0];
}

export async function getSimilar(categoryId: number, id: number) {
    const categories = await getCategories();
    const products = await productsService.getSimilar(categoryId, id);
    const productDTO = fromProductsDomain(products, categories);
    return productDTO;
}

export async function getProductPageData(slug : string) {
    const categories = await getCategories();
    const product = await productsService.getProductBySlug(slug);
    const category = await categoriesService.getById(product.categoryId);
    const products = await productsService.getSimilar(category.id, product.id);

    return { 
        productDTO: fromProductDomain(product, categories),
        productsDTO: fromProductsDomain(products, categories),
        categoryDTO: fromCategoryDomain(category)
    }
}

export async function getCount(ITEMS_PER_PAGE: number) {
    const count = productsService.count(ITEMS_PER_PAGE)
    return count;
}
