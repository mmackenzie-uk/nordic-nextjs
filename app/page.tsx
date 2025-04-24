import Carousel from "./ui-client/carousel";
import { findAll, getCategories } from "./actions/get-actions";
import ProductsListByCategory from "./ui-client/products-list-by-category";

export default async function Home() {
  const productsDTO = await findAll(1, 12);  

  console.log("productsDTO ", productsDTO)
  
  return (
    <>
      <Carousel />
      <ProductsListByCategory inititalProducts={productsDTO} hasMore={true} />   
    </>
  );
}
