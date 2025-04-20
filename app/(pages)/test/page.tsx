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

function ViewAlbum({ albumName } : { albumName: string}) {
    const [photos, setPhotos] = useState<ObjectList>([]);
    const [bucketUrl, setBucketUrl] = useState("");

    const prefix = encodeURIComponent(albumName) + "/";

    useEffect(() => {
      s3.listObjects({ Prefix: prefix, Bucket }, function(err, data){
         // @ts-ignore
        const href = this.request.httpRequest.endpoint.href;
        if (data.Contents) {
          setPhotos(data.Contents);
        }
        setBucketUrl(href + Bucket + "/");
      });
    }, [albumName]);

    const albumPhotosKey = encodeURIComponent(albumName) + "/"; 

    return (
      <>
        <h2>{`Album: ${albumName}`}</h2>
        {
          (photos.length === 0) ? 
              <p>The following photos are present.</p> 
            : <p>There are no photos in this album.</p>
        }
        <div>
        {
          photos.map(photo => (photo.Key === prefix) ?
            <span key={photo.Key}></span>
            :
            <span key={photo.Key}>
              <div>
                <br/>
                <img 
                  width={128} 
                  height={128} 
                  src={bucketUrl + encodeURIComponent(photo.Key!)} 
                />
              </div>
              <div>
                <span>
                  {photo.Key!.replace(albumPhotosKey, "")}
                </span>
              </div>
            </span>
          )
        }
        </div>
      </>
    )
}

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
      <>
      <select  value={albumName} onChange={handleSelect}  >
      {
          albums.map((commonPrefix) => {
            var prefix = commonPrefix.Prefix;
            var albumName = decodeURIComponent(prefix!.replace("/", ""));
            return  <option key={albumName} style={{margin: "5px"}} value={albumName}>
                      {albumName}
                    </option>
          })
        }

      </select>
      </>
    )
}

export default function Home() {
  const [albumName, setAlbumName] = useState("");

  const [albums, setAlbums] = useState<CommonPrefixList>([]);
  useEffect(() => {

    console.log("buck ", Bucket)

  s3.listObjects({ Delimiter: "/", Bucket }, (err, data) => {
    console.log("data ", data)
    if (data.CommonPrefixes) {
      setAlbums(data.CommonPrefixes);

      var prefix = data.CommonPrefixes[0].Prefix;
            var albumName = decodeURIComponent(prefix!.replace("/", ""));
            setAlbumName(albumName)
    }
  });
}, []);

  const handleAlbums: ChangeEventHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setAlbumName(e.target.value);    
  }

  return (
    <div>
      <h1>Photo Album Viewer</h1>
      <h2>Albums</h2>
      <ListAlbums handleSelect={handleAlbums}  albumName={albumName} albums={albums}/>
      <ViewAlbum albumName={albumName} />
    </div>
  );
}
