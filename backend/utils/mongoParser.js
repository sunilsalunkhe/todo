

const parseUnknownError = function() {
        return{
            "code": 400,
            "message": "Internal server error."
        };
    },

    parseError = function( err ) {
        // eslint-disable-next-line no-console
        console.log( "database error-------", err );
        const data = parseUnknownError();

        return{
            "code": data.code || 400,
            "message": data.message
        };
    };

export default parseError;
