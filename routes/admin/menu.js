const express= require( `express` );
const mysql= require( `mysql` );
const DBConnect= require( `../../config/DBConnect` );
const router= express.Router();
const con= mysql.createConnection( DBConnect );
con.connect( err => {
    if( err ) throw err;
});

router.get( `/`, ( req, res, next ) => {
    let sqlGetMenu= `select * from v_menu;`;
    con.query( sqlGetMenu, ( err, result ) => {
        if( err ) throw err;
        res.render( `adminMenu`, { menu: result } );
    });
});

module.exports= router;