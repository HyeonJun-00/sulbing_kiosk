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

app.use( `/`, indexRouter );
app.use( `/admin_menu`, adminMenuRouter );
app.use( `/admin_order`, adminOrderRouter );
app.use( `/admin_product`, adminProductRouter );
app.use( `/admin_sales`, adminSalesRouter );
app.use( `/admin_user`, adminUserRouter );

app.listen( port, () => {
    console.log( `connected ${ port } port!` );
});