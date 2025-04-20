"use client"
const { AWS_BUCKET_NAME, AWS_REGION } = require('../../templates');
import { CommonPrefix, ObjectList } from "aws-sdk/clients/s3";
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import Albums from "./albums";

import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers"; 
export const HREF = `https://${AWS_BUCKET_NAME}.s3.eu-west-2.amazonaws.com/`;

import {
    S3Client,
    ListObjectsV2Command,
} from "@aws-sdk/client-s3";

let client = new S3Client({
    region:AWS_REGION,
    credentials: fromCognitoIdentityPool({
        identityPoolId: "eu-west-2:95647da0-9c5e-46aa-b3bc-28d82e38d901"
    })
});

export async function getPhotos(albumName: string) {
    const command = new ListObjectsV2Command({
        Bucket: AWS_BUCKET_NAME,
        Prefix: albumName
    });
    const response = await client.send(command);
    return response.Contents?.slice(1);
}

const removePrefix = (prefix: string) => decodeURIComponent(prefix.replace("/", ""));

export default function Photos({ albums }: { albums: CommonPrefix[]  }) {
    const [photos, setPhotos] = useState<ObjectList>([]);
    const [albumName, setAlbumName] = useState(removePrefix(albums[0].Prefix || "")); 
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
    return (
        <>
        <div className="edit-product-image-header" style={{maxWidth: "60%", marginBottom: "10px"}}>
            <h2 className="edit-product-image-header-title">Images:</h2>
            <Albums albumName={albumName} handleAlbums={handleAlbums} albums={albums}/>
        </div>    
        <div className="bucket-image-widget-container" style={{maxWidth: "60%"}}>
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
        </>
    );
}

