const express= require( `express` );
const mysql= require( `mysql` );
const DBConnect= require( `../../config/DBConnect` );
const router= express.Router();
const con= mysql.createConnection( DBConnect );
con.connect( err => {
    if( err ) throw err;
});

router.get ( `/`, ( req, res, next ) => {
    let sqlOrderTotCnt= `select count( * ) cnt from purchase;`;
    let sqlReadPost= `
        select
            id, status, 
            total_price, total_discount, total_charge, use_stamp,
            floor( total_price -
                   ((total_price / 100 * total_discount) +
                    ( total_price / 100 * total_charge ) +
                    ( case when use_stamp = true then 5000 else 0 end)) )
                                                           final_price,
            save_stamp, take_out, remark, null user_tel,
            date_format( purchase_date, '%Y-%m-%d %H:%i' ) purchase_date,
            date_format( refund_date, '%Y-%m-%d %H:%i' ) refund_date
        from purchase
        order by id desc
            limit 25 offset 0;`;
    let sqlProductPost= `
        select A.id,
               C.name product_name, C.price product_price, B.item_cnt,
               B.difference_item_id item_id, D.name option_name, D.price option_price
        from ( select id from purchase order by id desc limit 25 offset 0 ) A
                 right outer join purchase_item B on A.id= B.purchase_id
                 left outer join product C on B.product_id = C.id
                 left outer join product_option_cmm D on B.product_option_id = D.id
        where not A.id is null
        order by id desc;`;
    let sqlPaymentPost = `
        select A.id, C.category, C.name, B.amount, B.discount, B.charge
        from ( select id from purchase order by id desc limit 25 ) A
        right outer join purchase_payment B on A.id = B.purchase_id
        left outer join payment_method C on B.payment_method_id = C.id;`;
    con.query( sqlOrderTotCnt + sqlReadPost + sqlProductPost + sqlPaymentPost, ( err, result ) => {
        if( err ) throw err;
        console.log( result[2]);
        res.render(`adminOrder`, {
            orderTotCnt: result[0],
            readPost: result[1],
            productPost: result[2],
            paymentPost: result[3],
            nowPage: 0 } );
    });
});

module.exports= router;