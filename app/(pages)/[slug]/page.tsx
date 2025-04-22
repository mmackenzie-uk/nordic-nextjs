
import { findByCategory, getCategory, getCategories } from "@/app/actions/get-actions";
import ProductsListByCategory from "@/app/ui-client/products-list-by-category";

export default async function CategoryPage({ params, }: {params: Promise<{ slug: string }>}) {
    const { slug } = await params;
    const categoryDTO = await getCategory(slug);
    const categories = await getCategories();
    let productsDTO;
    if (categoryDTO.id) {
        productsDTO = await findByCategory(categoryDTO.id, 1, 12);  
    }
    return (
        <>
            <div className="category-header">
                <section className="section">
                    <h1 className="category-name">{categoryDTO.name}</h1>
                </section>
            </div>
            {
                productsDTO &&
                <ProductsListByCategory 
                    inititalProducts={productsDTO} 
                    hasMore={true} 
                    categoryId={categoryDTO.id}
                />
            }
        </>
    );
}
