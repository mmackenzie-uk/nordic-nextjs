"use server"

import AWS from 'aws-sdk';
const { S3_ALBUM_NAME, AWS_BUCKET_NAME, AWS_REGION } = require('../templates');

import {
    S3Client,
    ListObjectsV2Command,
} from "@aws-sdk/client-s3";

// Initialize the Amazon Cognito credentials provider
AWS.config.region = AWS_REGION; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: process.env.AWS_IDENTITY_POOL!,
});
const client = new S3Client({});

export async function getPhotos() {

    const command = new ListObjectsV2Command({
        Bucket: AWS_BUCKET_NAME,
        Prefix: S3_ALBUM_NAME
    });

    const response = await client.send(command);

    return response.Contents?.slice(1);
}


