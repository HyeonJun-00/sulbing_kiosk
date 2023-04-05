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
    console.log( `connected sql server!` );
    if( err ) throw err;
});
app.get( `/`, ( req, res ) => {
    let sqlGetMenu= `select * from v_menu;`;
    let sqlGetMenuInProduct= `select * from v_menu_in_product;`;
    let sqlGetProduct= `select * from v_product;`;
    let sqlGetProductOption= `select * from v_product_option;`;
    let menuCategory= `select id as lv1_id, name as lv1_name from menu where pid is null and deleted_date is null;`;

    con.query( sqlGetMenu + sqlGetMenuInProduct + sqlGetProduct + sqlGetProductOption + menuCategory, ( err, result ) => {
        if( err ) throw err;
        res.render( `index`, {
            menu: result[0],
            menuInProduct: result[1],
            product: result[2],
            productOption: result[3],
            menuCategory: result[4]
        } );
    });
});

app.get( `/admin_menu`, ( req, res, next ) => {
    let sqlGetMenu= `select * from v_menu;`;
    con.query( sqlGetMenu, ( err, result ) => {
       if( err ) throw err;
       res.render( `adminMenu`, { menu: result } );
    });
});
app.get ( `/admin_order`, ( req, res, next ) => {
    res.render(`adminOrder`);
});
app.get ( `/admin_product`, ( req, res, next ) => {
    let sqlGetMenu= `select * from v_menu;`;
    let sqlGetMenuInProduct= `select * from v_menu_in_product;`;
    let sqlGetProduct= `select * from v_product;`;
    let sqlGetProductOption= `select * from v_product_option;`;

    con.query( sqlGetMenu + sqlGetMenuInProduct + sqlGetProduct + sqlGetProductOption, ( err, result ) => {
        if( err ) throw err;
        res.render( `adminProduct`, {
            menu: result[0],
            menuInProduct: result[1],
            product: result[2],
            productOption: result[3]
        });
    });
});
app.get ( `/admin_sales`, ( req, res, next ) => {
    res.render(`adminSales`);
});
app.get ( `/admin_user`, ( req, res, next ) => {
    res.render(`adminUser`);
});

app.listen( port, () => {
    console.log( `connected ${ port } port!` );
});