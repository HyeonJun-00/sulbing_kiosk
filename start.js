const express= require( `express` );
const app= express();

const indexRouter= require( `./routes` );
const adminMenuRouter= require( `./routes/admin/menu` );
const adminOrderRouter= require( `./routes/admin/menu` );
const adminProductRouter= require( `./routes/admin/product` );
const adminSalesRouter= require( `./routes/admin/sales` );
const adminUserRouter= require( `./routes/admin/user` );

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
    let optionCategory= `SELECT distinct product_id, option_category FROM line_sulbing_kiosk.v_product_option order by 1, 2;`
    con.query( sqlGetMenu + sqlGetMenuInProduct + sqlGetProduct + sqlGetProductOption + menuCategory + optionCategory, ( err, result ) => {
        if( err ) throw err;
        res.render( `index`, {
            menu: result[0],
            menuInProduct: result[1],
            product: result[2],
            productOption: result[3],
            menuCategory: result[4],
            optionCategory: result[5]
        } );
    });
});

app.get ( `/admin_menu`, ( req, res, next ) => {
    res.render( `adminMenu` );
});
app.get ( `/admin_order`, ( req, res, next ) => {
    res.render(`adminOrder`);
});
app.get ( `/admin_product`, ( req, res, next ) => {
    res.render(`adminProduct`);
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