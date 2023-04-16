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

    con.query( sqlGetMenu + sqlGetMenuInProduct + sqlGetProduct + sqlGetProductOption, ( err, result ) => {
        if( err ) throw err;
        let     productOptionArray = [];        


        for (let i = 0; i < result[2].length; i++) {
            productOptionArray[result[2][i].product_id] = [];
            for (let j = 0; j < result[3].length; j++) {
                if (result[2][i].product_id == result[3][j].product_id) {
                    productOptionArray[result[2][i].product_id].push([result[3][j].option_category , result[3][j].option_name, result[3][j].option_price, result[3][j].option_discount, result[3][j].option_id]); 
                }
            }
        }
        res.render( `index`, {
            menu: result[0],
            menuInProduct: result[1],
            product: result[2],
            productOption: result[3],
            productOptionArray: productOptionArray
        } );
    });
});

router.post( `/getUserStamp`, async ( req, res, next ) => {
    let tel= await req.body.tel;
    let sql= `select id, name, tel, stamp, join_date from user where tel= '${ tel }';`;
    con.query( sql, ( err, result ) => {
        if( err ) throw err;
        res.status( 201 ).json( result );
    });
});

router.post( `/getGifticon`, async ( req, res, next ) => {
    let code= await req.body.code;
    let sql= `select id, name, code, save_amount from gifticon_info where code= '${ code }' and deleted_date is null;`;
    con.query( sql , ( err, result ) => {
        if( err ) throw err;
        res.status( 201 ).json( result );
    });
});

router.post( `/cart`, async ( req, res, next ) => {
    try {
        let cartItem= await req.body.jsonData;
        console.log(cartItem);
        res.status( 201 ).json( cartItem );
    `    
    IF EXISTS(SELECT * FROM table_name WHERE column_name = 'value')
        UPDATE table_name SET column_name = 'new_value' WHERE column_name = 'value'
    ELSE
        INSERT INTO table_name (column_name) VALUES ('value')
    `
    } catch ( err ) {
        console.error( err );
        next( err );
    }
});

module.exports= router;