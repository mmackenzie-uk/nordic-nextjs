const { AWS_BUCKET_NAME, AWS_REGION } = require('../../templates');
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers"; 
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