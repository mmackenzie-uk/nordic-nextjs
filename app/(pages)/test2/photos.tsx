"use client"

import AWS from "aws-sdk";
import { CommonPrefix, ObjectList } from "aws-sdk/clients/s3";
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import Albums from "./albums";

// Initialize the Amazon Cognito credentials provider
AWS.config.region = "eu-west-2"; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "eu-west-2:95647da0-9c5e-46aa-b3bc-28d82e38d901",
});
const Bucket = "charm-mackenzie"
// Create a new service object
const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket },
});

const  removePrefix = (prefix: string) => {
    return decodeURIComponent(prefix.replace("/", ""));
}

export default function Photos({ albums }: { albums: CommonPrefix[]  }) {
    const [photos, setPhotos] = useState<ObjectList>([]);
    const [bucketUrl, setBucketUrl] = useState("");

    const [albumName, setAlbumName] = useState(removePrefix(albums[0].Prefix || "")); 
    const handleAlbums: ChangeEventHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        setAlbumName(e.target.value);    
    }

    useEffect(() => {
      s3.listObjects({ Prefix: prefix, Bucket }, function(err, data){

         // @ts-ignore
        const href = this.request.httpRequest.endpoint.href;
        if (data.Contents) {
          setPhotos(data.Contents.slice(1));
        }
        setBucketUrl(href + Bucket + "/");
      });
    }, [albumName]);

    const albumPhotosKey = encodeURIComponent(albumName) + "/"; 
    const prefix = encodeURIComponent(albumName) + "/";

    return (
        <>
        <Albums albumName={albumName} handleAlbums={handleAlbums} albums={albums}/>
        <div className="bucket-image-widget-container" style={{maxWidth: "60%"}}>
            <ul className="bucket-image-widget-list" role="list">
            {
                photos.map((photo) => {   
                    const photoKey = photo.Key;                         
                    const photoUrl = bucketUrl + encodeURIComponent(photo.Key!)
                    const name = photoKey!.replace(albumPhotosKey, "");     
                    let title = name.replaceAll("-", " ");                
                    title = title.replaceAll(".jpg", "");                
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
