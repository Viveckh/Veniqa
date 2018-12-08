import express from 'express';
import * as AWS from 'aws-sdk';
import awsConfig from '../properties/aws-config';

// Initialize S3 module
AWS.config.loadFromPath('properties/aws-creds.json');
let s3 = new AWS.S3();

module.exports.s3 = s3;

