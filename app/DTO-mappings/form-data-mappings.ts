import { ICategory } from "../domain/category";
import { IProduct } from "../domain/product";
import { IFormDTO } from "../DTO/formDTO";


const createSlug = (name: string | undefined) => {
    if (!name) return;
    const slug = name.replaceAll(" ", "-")
    return slug.toLowerCase();
  }

export const toFormDTO = (product: IProduct, categories: Array<ICategory>) => {

  const formDTO: IFormDTO = {
      name: "Product Name",
      description: "description",
      price: 1,
      category: "",
      smallImage: "",
      availability: 1,
  }
  if (product) {
    formDTO.id = product.id;
    formDTO.name = product.name;
    formDTO.description = product.description;
    formDTO.price = product.price / 100;
    formDTO.category = categories.find(category => product.categoryId === category.id)!.name.toLowerCase();
    formDTO.smallImage = product.smallImage;
    formDTO.availability = product.availability;
  }
  return formDTO;
}

export const fromFormData = (request : FormData, categories: Array<ICategory>) => {
  const name = request.get("name") as string;

  const defaultImage = request.get("defaultImage");
  const arr = request.getAll("image").toString().split(",");
  const orderedArr = [defaultImage];

  arr.forEach((str) => {
    if (str !== defaultImage) {
      orderedArr.push(str);
    }
  })

  const image = orderedArr.join(",")

  const product: IProduct = {
    price: Number(request.get("price")) * 100,
    name: name,
    id: request.get("id") ? Number(request.get("id")) : undefined,
    description: request.get("description") as string,
    categoryId: categories.find(category => category.name === request.get("category"))!.id,
    smallImage: image.toString(),
    mediumImage: image.toString(),
    largeImage: image.toString(),
    slug: createSlug(name) as string,
    availability: Number(request.get("availability"))
  }
  return product;
}
