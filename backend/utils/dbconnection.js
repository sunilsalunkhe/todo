/**
 * Initializer module for db connection to mongoDB. Uses mongoose.
 * Once initialzed, mongoose object is available throughout the application using require
 * Mongoose object contains the connection as well
 */

import configEnv from"../config/config.js";
import mongoose from"mongoose";


const env = process.env.NODE_ENV || "local",

    config = configEnv[ env ],

    dbUrl = config.dbUrl;

export default function dbConnection() {
    // Setup connection events
    // When successfully connected
    mongoose.connection.on( "connected", () => {
    } );

    // If the connection throws an error
    mongoose.connection.on( "error", ( err ) => {
        throw err;
    } );

    // When the connection is disconnected
    mongoose.connection.on( "disconnected", () => {
    } );

    mongoose.set( "debug", true );

    // do the connection
    mongoose.connect( dbUrl, { "useNewUrlParser": true, "useUnifiedTopology": true, "useCreateIndex": true } );
}
