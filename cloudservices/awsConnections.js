import express from 'express';
import * as AWS from 'aws-sdk';
import config from 'config';

// Configure and authenticate with AWS
AWS.config.update({
    accessKeyId: process.env.VENIQA_AWS_ACCESS_KEY_ID, 
    secretAccessKey: process.env.VENIQA_AWS_SECRET_ACCESS_KEY, 
    region: config.get('aws_settings.default_region')
});

// Initialize S3 module
let s3 = new AWS.S3();

module.exports.s3 = s3;

