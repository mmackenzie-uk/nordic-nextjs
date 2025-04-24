
export interface IProduct { 
    id?: number;
    name: string;
    price: number; 
    description: string;
    smallImage: string; 
    mediumImage: string;
    largeImage: string; 
    defaultImage: number;
    availability: number; 
    slug: string;
    categoryId?: number;
  }    

