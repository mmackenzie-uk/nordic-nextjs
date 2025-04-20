"use client"

import { CommonPrefix } from "aws-sdk/clients/s3";
import { ChangeEventHandler } from "react";

// @ts-nocheck 

export default function Albums({ 
    handleAlbums, 
    albums, 
    albumName 
} : { 
    albums: CommonPrefix[],  
    handleAlbums: ChangeEventHandler, 
    albumName: string 
}) {   
    return  <select  value={albumName} onChange={handleAlbums}  >
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
}

