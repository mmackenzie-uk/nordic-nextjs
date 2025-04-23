"use client"

import { handleProduct } from "@/app/actions/form-actions";
import { HREF } from "@/app/aws-images/s3-configuration";
import Link from "next/link";

import { _Object, CommonPrefix } from "@aws-sdk/client-s3";
import { ChangeEvent, ChangeEventHandler, useActionState, useEffect, useState } from "react";

import { IFormState } from "../../validation/validate";
import { ICategoryDTO } from "../../DTO/categoryDTO";
import { IFormDTO } from "../../DTO/formDTO";
import { ObjectList } from "aws-sdk/clients/s3";
import { getPhotos } from "./getPhotos";

export default function Form({ formDTO, edit, categoriesDTO, albums }: {
    formDTO: IFormDTO, 
    categoriesDTO: Array<ICategoryDTO>,
    albums: CommonPrefix[] 
    edit: boolean
}) {

    const callback = (category: ICategoryDTO) => category.id === formDTO.categoryId

    const defaultCategoryName = categoriesDTO.find(callback)?.name || "";

    const [photos, setPhotos] = useState<ObjectList>([]);
    const [categoryName, setCategoryName] = useState(defaultCategoryName); 
    const [thumbs, setThumbs] = useState<Array<string>>(JSON.parse(formDTO.smallImage).split(","));
    const [selected, setSelected] = useState(0);
    const [len, setLen] = useState(JSON.parse(formDTO.smallImage).split(",").length);

    const handleSelectThb = (index: number) => setSelected(index);


    useEffect(() => {
        (async function(){
            const data = await getPhotos(categoryName);
            setPhotos(data?.slice(1) || []);   
        })();
    }, [categoryName]);

    useEffect(() => {}, [thumbs.length]);

    const albumPhotosKey = encodeURIComponent(categoryName) + "/"; 

    const initialState: IFormState = { message: null, errors: {} };
    const [state, formAction] = useActionState(handleProduct, initialState);

    const handleSelect: ChangeEventHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        setCategoryName(e.target.value);  
        if (e.target.value === defaultCategoryName) {
            setThumbs(JSON.parse(formDTO.smallImage).split(","));        
        } else {
           setThumbs([])
        }
      }
   
    const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const img = e.target.value;
        const index = thumbs.indexOf(img);
        (index > -1) ? thumbs.splice(index, 1) : thumbs.push(img);
        setThumbs(thumbs);
        setLen(thumbs.length);
    }
    
    return (
        <form className="product" action={formAction}>          
            <input 
                type="text" 
                name="id" 
                defaultValue={formDTO?.id || ""} 
                hidden
            />
            <section className="section">
                <div className="edit-product-header">
                    <h2 className="edit-product-title">{edit ? "Edit" : "Create"} Product</h2>   
                    <div className="edit-btn-wrap">
                        <Link href="/admin" className="edit-btn-cancel">Cancel</Link>
                        <button className="edit-btn-save" type="submit">Save</button>
                    </div>   
                </div> 
            </section>
            { 
             state && state.message ? 
                <section className="section">
                    <div className="error-msg-wrap" >
                        <p className="error-msg">
                            {state.message} 
                            {state.errors?.categoryId ? " Please choose a category" : ""} 
                            {state.errors?.name ? " A product with that name already exists" : ""} 
                        </p>
                        <button className="error-msg-btn">x</button>
                    </div>
                </section> 
                : null
            }
            
            <section className="section">
                <div className="edit-product-grid">
                    <div>
                        <div className="edit-product-image-header">
                            <h2 className="edit-product-image-header-title">Images:</h2>
                            <select  value={categoryName} onChange={handleSelect}  style={{marginBottom: "10px", padding: "5px"}}>
                            {
                                categoriesDTO.map(({ name }) => {
                                    return  <option key={name} value={name}>
                                            {name}
                                            </option>
                                })
                            }
                            </select>
                        </div>   
                        <div className="bucket-image-widget-container" >
                            <ul className="bucket-image-widget-list" role="list">
                            {
                                photos.map((photo) => {   
                                    const photoKey = photo.Key;                         
                                    const photoUrl = HREF + encodeURIComponent(photoKey!);  
                                    const name = photoKey!.replace(albumPhotosKey, "");                  
                                    return (
                                        <li key={photoKey} className="bucket-image-widget-li">
                                            <div className="bucket-image-widget-img-wrap" >
                                                <label >
                                                    <input 
                                                        type="checkbox" 
                                                        id={photoKey} 
                                                        value={name} 
                                                        name={"image"} 
                                                        onChange={handleSelectImage}
                                                        defaultChecked={formDTO.smallImage!.includes(name)}
                                                    />
                                                    <img 
                                                        src={photoUrl} 
                                                        className="bucket-image-widget-img"
                                                        alt="form image"
                                                        style={{border: "1px solid #bbb"}}
                                                    />
                                                </label>
                                            </div>
                                        </li>);
                                    }
                                )
                            }
                            </ul>
                        </div>
                    </div>
                    
                    <div className="edit-product-details">
                       
                        <label htmlFor="name" className="edit-form-label">Product Name:</label>
                        <input 
                            type="text" 
                            id="edit-form-name" 
                            name="name" 
                            defaultValue={formDTO.name} 
                            className="edit-form-name"
                        />
                      
                        <br/>
                        <label htmlFor="description" className="edit-form-label">Description:</label>
                        <textarea 
                            id="description" 
                            name="description" 
                            className="edit-form-description"
                            defaultValue={formDTO.description}
                        />
                         <div style={{display: "flex", justifyContent: "space-between"}}>
                            <div>
                                <label htmlFor="price" className="edit-form-label">Price $:</label>
                                <input 
                                    className="edit-form-price"
                                    type="number" 
                                    id="price" 
                                    defaultValue={formDTO.price.toFixed(2)} 
                                    name="price" 
                                    min="1" 
                                    step=".1"
                                />
                            </div>
                            <div>
                                <label htmlFor="availability" className="edit-form-label">Stock Quantity:</label>
                                <input 
                                    id="availability"
                                    name="availability"
                                    type="number" 
                                    className="edit-form-availability" 
                                    defaultValue={formDTO.availability}
                                /> 
                            </div>     
                        </div>
                        <label htmlFor="price" className="edit-form-label">Select Default Image:</label>
                        <ul className="form-thumbnail-list" role="list">
                        {
                            thumbs.map((thumb, index) => {
                                // const src = IMAGE_PREFIX + encodeURIComponent(thumb); 
                                const src = HREF + categoryName + "/" + encodeURIComponent(thumb); 
                                
                                return ( 
                                <li key={index} className={`thumbnail ${(index === selected) ? "form-thumbnail-selected" : ""}`} >
                                    <img 
                                        src={src} 
                                        onClick={() => handleSelectThb(index)} 
                                        className="thumbnail-img"
                                        alt="thumbnail image"
                                    />
                                </li>)
                            })    
                        } 
                        </ul>
                        <div>
                            {/* <p>{formDTO.smallImage}</p> */}
                        </div> 
                    </div>
                </div>
            </section>
        </form>

    );
  }

  