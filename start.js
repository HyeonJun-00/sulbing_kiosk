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
        let sqlGetProduct= `select * from product;`;
        let sqlGetOption= `
        select
            A.id, A.price, A.discount,
            B.id option_id, 
            C.category option_category, C.name option_name, C.price option_price, C.discount option_discount
        from
            product A
        join product_option B on A.id= B.product_id
        join product_option_cmm C on B.product_option_cmm_id = C.id;`;

        con.query( sqlGetProduct + sqlGetOption, ( err, result ) => {
            if( err ) throw err;
            res.render( `index`, { product: result[0], productOption: result[1] } );
        });
    });
});

app.listen( port, () => {
    console.log( `connected ${ port } port!` );
});