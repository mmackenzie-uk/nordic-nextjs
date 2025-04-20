import Link from "next/link";

import BtnBuy from "../ui-client/btn-buy";
import { BtnLike } from "./btns";
import { HREF, IMAGE_PREFIX } from "../aws-images/s3-configuration";
import { IProductDTO } from "../DTO/productDTO";
import { ICategoryDTO } from "../DTO/categoryDTO";

export default function Card({ productDTO, categories }: {
    productDTO: IProductDTO;
    categories: Array<ICategoryDTO>
}) {
    const { name, mediumImage, slug, categoryId } = productDTO;
    // const src = IMAGE_PREFIX + encodeURIComponent(mediumImage[0]); 
    const category = categories.find(category => category.id === categoryId)
    const src = HREF + category!.name.toLowerCase() + "/" + encodeURIComponent(mediumImage[0]); 
    return (
        <div className="card">                   
            <Link href={`/product/${slug}`} className="card-img-wrap">
                <img className="card-img" src={src} alt="card image" />
            </Link>            
            <div className="card-caption">
                <ul className="card-detail-list">
                    <li key="card-link"><Link href="" className="card-link">{name}</Link></li>
                    <li key="btn-buy"><BtnBuy productDTO={productDTO}/></li>                                    
                </ul>
                <div className="card-like">
                    <BtnLike />
                </div>
            </div>
        </div>
    );
}