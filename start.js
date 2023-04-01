const express= require( `express` );
const mysql= require( `mysql` );
const DBConnect= require( `./config/DBConnect.js` );

const app= express();
const con= mysql.createConnection( DBConnect );

app.set( `view engine`, `pug` );
app.set( `views`, `./src/pug` );

app.use( express.static( `./public/html` ) );

const port= 4191;

con.connect( err => {
    if( err ) throw err;
    app.get( `/`, ( req, res ) => {
        console.log( `connected sql server!` );
        let sqlGetMenu= `select * from v_menu;`;
        let sqlGetMenuInProduct= `select * from v_menu_in_product;`;
        let sqlGetProduct= `select * from v_product;`;
        let sqlGetProductOption= `select * from v_product_option;`;

        con.query( sqlGetMenu + sqlGetMenuInProduct + sqlGetProduct + sqlGetProductOption, ( err, result ) => {
            if( err ) throw err;
            res.render( `index`, {
                menu: result[0],
                menuInProduct: result[1],
                product: result[2],
                productOption: result[3]
            } );
        });
    });
});

app.listen( port, () => {
    console.log( `connected ${ port } port!` );
});