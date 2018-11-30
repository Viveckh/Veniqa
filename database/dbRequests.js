import express from 'express';
import assert from 'assert';
import MongoClient from 'mongodb';
import config from './../properties/db.js'
import tunnel from 'tunnel-ssh'
import DBCollections from './../properties/dbCollections.json'

let db = null, server;
let database; 
let whitepaper_auth_collection, external_messages_collection;

/**
 * Function that connects with the database and gets up the db connection for the application to use. It also 
 * sets all the collections that exists in the backend. 
 * @author Vivek Pandey
 */
let getDB = async () => {
    
    try {
        server = await tunnel(config.config);

        let client = null;
        try {
            console.log("URL", config.url)
            client = await MongoClient.connect(config.url, {useNewUrlParser: true});
        }
        catch(err){
            console.log("ERROR IN DB: ", err);
        }

        console.log("Connected to DB successfully!");
        database = client.db(config.databaseName);

        whitepaper_auth_collection = database.collection(DBCollections.WHITEPAPER_AUTH_COLLECTION)
        external_messages_collection = database.collection(DBCollections.EXTERNAL_MESSAGES_COLLECTION)
    }
    catch(err){
        console.log("Error connecting to SSH Tunnel")
    }
    return database;
}

getDB()

exports.db = () => database;

exports.whitepaperAuthCollection = () => whitepaper_auth_collection;

exports.externalMessagesCollection = () => external_messages_collection;