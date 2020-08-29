var FS = require( 'fs' );

module.exports = {

    /**
     * 将base64转化为二进制文件
     * @param uri
     * @param fileName
     * @param next
     */
    decode: function( uri, fileName, next ){

        var base64Data = uri.replace(/^data:.+;base64,/,"");
        var dataBuffer = new Buffer(base64Data, 'base64');

        FS.writeFile( fileName, dataBuffer, next );
    },

    decodeSync: function( uri, fileName ){

        var base64Data = uri.replace(/^data:.+;base64,/,"");
        var dataBuffer = new Buffer(base64Data, 'base64');

        FS.writeFileSync( fileName, dataBuffer );
    },

    /**
     * 将二进制文件转化为base64字符串
     * @param filename
     * @param next
     */
    encode: function( filename, next ){

        FS.readFile( filename, function( err, data ){

            if( err ){
                next( err );
            }

            else {
                next( null, data.toString( 'base64' ) );
            }
        });
    },

    encodeSync: function( filename, next ){

        var data = FS.readFileSync( filename );
        return data.toString( 'base64' );
    }
};