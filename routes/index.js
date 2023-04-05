const express= require( `express` );
const mysql= require( `mysql` );
const DBConnect= require( `../config/DBConnect` );
const router= express.Router();
const con= mysql.createConnection( DBConnect );
con.connect( err => {
    if( err ) throw err;
});
router.get( `/`, ( req, res ) => {
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

module.exports= router;