const express= require( `express` );
const mysql= require( `mysql` );
const DBConnect= require( `../../config/DBConnect` );
const router= express.Router();
const con= mysql.createConnection( DBConnect );
con.connect( err => {
    if( err ) throw err;
});

router.get ( `/`, ( req, res, next ) => {
    let sqlGetMenu= `select * from v_menu;`;
    let sqlGetMenuInProduct= `select * from v_menu_in_product;`;
    let sqlGetProduct= `select * from v_product_admin;`;
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

router.post( `/update`, async ( req, res ) => {
    const targetValue= await req.body;
    const id= targetValue.id;
    const name= '\'' + targetValue.name + '\'';
    const price= targetValue.price != ''? targetValue.price: 0;
    const discount= targetValue.discount != ''? targetValue.discount: 0;
    const stock= targetValue.stock != ''? targetValue.stock: 0;
    const description= targetValue.description != ''? '\'' + targetValue.description + '\'': null;
    //const discription= targetValue.discription != ''? '\'' + targetValue.discription + '\'': null;

    let sql= `update product set 
                name= ${ name },
               
            where id= ${ id };`;
    console.log( sql );
    con.query( sql, ( err, result ) => {
        if( err ) throw err;
        res.status( 201 ).json( result );
    });
});

router.post( '/isActive', async ( req, res ) => {
    const reqBody= await req.body;
    const id= reqBody.id;
    const isActive= reqBody.isActive == `active`? `null`: `now()`;

    let sql= `update product set deleted_date = ${ isActive } where id = ${ id }`;
    con.query( sql, ( err, result ) => {
        if( err ) throw err;
        res.status( 201 ).json( result );
    })
});

module.exports= router;