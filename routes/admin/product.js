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
    let sqlGetMenuInProduct= `select * from v_menu_in_product_admin;`;
    let sqlGetProduct= `select * from v_product_admin;`;
    let sqlGetProductOption= `select * from v_product_option;`;
    let sqlGetOptionCmm= `select id, category, name, price, discount from product_option_cmm`;

    con.query( sqlGetMenu + sqlGetMenuInProduct +
            sqlGetProduct +
            sqlGetProductOption +
            sqlGetOptionCmm, ( err, result ) => {
        if( err ) throw err;
        res.render( `adminProduct`, {
            menu: result[0],
            menuInProduct: result[1],
            product: result[2],
            productOption: result[3],
            productOptionCmm: result[4]
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
    const allergy= targetValue.allergy != ''? '\'' + targetValue.allergy + '\'': null;

    let sql= `
        update product set 
            name= ${ name },
            price= ${ price },
            discount= ${ discount },
            stock= ${ stock },
            description= ${ description },
            allergy= ${ allergy }
            where id= ${ id };`;
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
    });
});

router.post( `/optionUpdate`, async ( req, res ) => {
    const sql= await req.body.sql;
    con.query( sql, ( err, result ) => {
        if( err ) throw err;
        //res.status( 201 ).json( result );
        res.redirect( `/admin_product` )
    });
});

module.exports= router;