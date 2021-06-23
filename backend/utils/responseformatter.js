import Boom from"@hapi/boom";

// eslint-disable-next-line func-style
export function success( data ) {
    return{
        "statusCode": 200,
        "status": "success",
        "data": data.data,
        "message": data.message
    };
}

// eslint-disable-next-line func-style
export function error( err ) {
    console.log( "error-------", err );
    if( !err.isBoom ) {
        const message = err.message || "Internal server error.",
            statusCode = err && err.code && ( typeof err.code == "number" ) ? err.code : 400,
            errObj = new Error( message );

        return Boom.boomify( errObj, { "statusCode": statusCode } );
    }
    return err;

}

// eslint-disable-next-line func-style
export function buildSucess( data, message ) {
    return{
        "data": data,
        "message": message
    };
}

class Conflict extends Error {
    constructor( message ) {
        super( message );
        this.name = "Conflict";
        this.code = 409;
    }
}

const _Conflict = Conflict;

export{ _Conflict as Conflict };
