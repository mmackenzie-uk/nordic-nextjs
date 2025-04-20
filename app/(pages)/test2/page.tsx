"use client"

// @ts-nocheck 

const {  AWS_BUCKET_NAME } = require( '../../templates');

import AWS from 'aws-sdk';
import { CommonPrefixList, ObjectList } from 'aws-sdk/clients/s3';
import { useState, useEffect, ChangeEventHandler, ChangeEvent } from 'react';

const ident_pool = process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL;

// Initialize the Amazon Cognito credentials provider
AWS.config.region = "eu-west-2"; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: ident_pool! //"eu-west-2:95647da0-9c5e-46aa-b3bc-28d82e38d901"
});
const Bucket = AWS_BUCKET_NAME
// Create a new service object
const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket },
});

function ListAlbums({ 
  handleSelect, 
  albumName, 
  albums 
} : { 
  albums:CommonPrefixList, 
  albumName: string, 
  handleSelect: ChangeEventHandler
}) {   
    return (
      <select  value={albumName} onChange={handleSelect}  >
      {
          albums.map((commonPrefix) => {
            let prefix = commonPrefix.Prefix;
            let albumName = decodeURIComponent(prefix!.replace("/", ""));
            return  <option key={albumName} value={albumName} style={{paddingInline: "89px"}}>
                    {albumName}
                    </option>
          })
        }
      </select>
    )
}

export default function Home() {
    const [albumName, setAlbumName] = useState("");
    const [albums, setAlbums] = useState<CommonPrefixList>([]);
    const [photos, setPhotos] = useState<ObjectList>([]);
    const [bucketUrl, setBucketUrl] = useState("");

    useEffect(() => {
        s3.listObjects({ Delimiter: "/", Bucket }, (err, data) => {
            if (data.CommonPrefixes) {
                setAlbums(data.CommonPrefixes);
                let prefix = data.CommonPrefixes[0].Prefix;
                let albumName = decodeURIComponent(prefix!.replace("/", ""));
                setAlbumName(albumName)
            }
        });
    }, []);

    useEffect(() => {
      s3.listObjects({ Prefix: prefix, Bucket }, function(err, data){
         // @ts-ignore
        const href = this.request.httpRequest.endpoint.href;
        if (data.Contents) {
          setPhotos(data.Contents?.slice(1));
        }
        setBucketUrl(href + Bucket + "/");
      });
    }, [albumName]);

    const albumPhotosKey = encodeURIComponent(albumName) + "/"; 
    const prefix = encodeURIComponent(albumName) + "/";

    const handleAlbums: ChangeEventHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        setAlbumName(e.target.value);    
    }

    return (
        <section className="section">
            <div className="edit-product-image-header" style={{maxWidth: "60%", marginBottom: "10px"}}>
                <div>
                    <h2 className="edit-product-image-header-title">Images:</h2>
                    <span> ({photos?.length})</span>
                </div>
                <ListAlbums handleSelect={handleAlbums}  albumName={albumName} albums={albums}/>
            </div>
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
        </section>
    );
}
