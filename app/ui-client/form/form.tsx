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
import Albums from "./albums";

export default function Form({ formDTO, edit, categoriesDTO, albums }: {
    formDTO: IFormDTO, 
    categoriesDTO: Array<ICategoryDTO>,
    albums: CommonPrefix[] 
    edit: boolean
}) {
    const defaultAlbumName = decodeURIComponent(albums[0].Prefix || "").replace("/", "")
    const [photos, setPhotos] = useState<ObjectList>([]);
    const [albumName, setAlbumName] = useState(defaultAlbumName); 
    const handleAlbums: ChangeEventHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        setAlbumName(e.target.value);    
    }

    useEffect(() => {
        (async function(){
            const data = await getPhotos(albumName);
            setPhotos(data?.slice(1) || []);   
        })();
    }, [albumName]);

    const albumPhotosKey = encodeURIComponent(albumName) + "/"; 

    const initialState: IFormState = { message: null, errors: {} };
    const [state, formAction] = useActionState(handleProduct, initialState);

    
   
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
                        <Albums albumName={albumName} handleAlbums={handleAlbums} albums={albums}/>
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
                                                    // defaultChecked={formDTO.smallImage!.includes(name)}
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
                        <label htmlFor="price" className="edit-form-label">Price:</label><br/>
                        <span className="product-price">$
                            <input 
                                className="edit-form-price"
                                type="number" 
                                id="price" 
                                defaultValue={formDTO.price.toFixed(2)} 
                                name="price" 
                                min="1" 
                                step=".1"
                            />
                        </span><br/>
                        <label htmlFor="availability" className="edit-form-label">Quantity:</label><br/>
                        <input 
                            id="availability"
                            name="availability"
                            type="number" 
                            className="edit-form-availability" 
                            defaultValue={formDTO.availability}
                        /> 
                        <br/>
                        <label htmlFor="description" className="edit-form-label">Description:</label>
                        <textarea 
                            id="description" 
                            name="description" 
                            className="edit-form-description"
                            defaultValue={formDTO.description}
                        />
                        <label htmlFor="price" className="edit-form-label">Category:</label>
                        <ul className="edit-form-categories" role="list">
                            {
                                categoriesDTO.map(({ name, id, slug }) => 
                                    <li key={id} className="edit-form-category">
                                        <input 
                                            type="radio" 
                                            id={slug} 
                                            name="categoryId" 
                                            value={id} 
                                            defaultChecked={id === formDTO.categoryId}
                                        />
                                        <label className="edit-form-category-label" htmlFor={slug}>{name}</label><br />
                                    </li>)
                            }
                        </ul>   
                        {/* <div className="edit-form-new-category-flex">
                            <input 
                                type="text" 
                                id="edit-form-new-category" 
                                name="new-category" 
                                defaultValue={"+ new category"} 
                                className="edit-form-new-category"
                            />
                            <button className="edit-form-new-category-btn">+ Add</button>
                        </div>  */}
                    </div>
                </div>
            </section>
        </form>

    );
  }

  