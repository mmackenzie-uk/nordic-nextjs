import { ICategory } from "../domain/category";
import { IProduct } from "../domain/product";
import { IProductDTO } from "../DTO/productDTO";

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
  categoryId} : IProduct, categories: Array<ICategory>) => {


  const productDTO: IProductDTO = {
    id,
    name,
    price: price / 100,
    description,
    smallImage: smallImage.replaceAll("\"", "").split(','),
    mediumImage: mediumImage.replaceAll("\"", "").split(','),
    largeImage: largeImage.replaceAll("\"", "").split(','),
    availability,
    slug,
    category: categories.find(category => category.id === categoryId)!.name.toLowerCase()
  }
  return  productDTO;
}

export const fromProductsDomain = (products: Array<IProduct>, categories: Array<ICategory>) => {
  const arr: Array<IProductDTO> = [];
  products.forEach((product) => {
      const response = fromProductDomain(product, categories)
      arr.push(response);
  });
  return arr;
}




