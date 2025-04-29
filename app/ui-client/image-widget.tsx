"use client"

import { useState } from "react";
import { HREF } from "../aws-images/s3-configuration";

export default function ImageWidget({ images, thumbs, category }: {
    images: Array<string>;
    thumbs: Array<string>;
    category: string;
}) {
    const [selected, setSelected] = useState(0);
    const handleSelect = (index: number) => setSelected(index);

    return (
    <div className="product-images">
        <ul className="thumbnail-list" role="list" >
        {
            thumbs.map((thumb, index) => {
                const src = HREF + category + "/" + encodeURIComponent(thumb); 
                return ( 
                <li key={index} className={`thumbnail ${(index === selected) ? "thumbnail-selected" : ""}`} >
                    <img 
                        src={src} 
                        onClick={() => handleSelect(index)} 
                        className="thumbnail-img"
                        alt="thumbnail image"
                    />
                </li>)
            })    
        } 
        </ul>
        <ul className="images-list" role="list">
        {
            images.map((image, index) => {
                const src = HREF + category! + "/" + encodeURIComponent(image); 
                return (
                <li key={index} className="product-image-wrap">
                    <img 
                        className = {`product-image ${(index === selected) ? "selected" : ""}`} 
                        src={src} 
                        alt="large image"
                    />
                </li>)
            })           
        }
        </ul>
    </div>
    );
  }