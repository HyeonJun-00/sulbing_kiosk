const express= require( `express` );
const mysql= require( `mysql` );
const DBConnect= require( `../../config/DBConnect` );
const router= express.Router();
const con= mysql.createConnection( DBConnect );
con.connect( err => {
    if( err ) throw err;
});

router.get ( `/`, ( req, res, next ) => {
    let sqlOrderTotCnt= `select count( * ) cnt from purchase where date_format( purchase_date, '%Y-%m-%d' ) = current_date;`;
    let sqlReadPost= `
        select
            A.id, status,
            total_price, total_discount, total_charge, use_stamp,
            floor( total_price -
                   ((total_price / 100 * total_discount) +
                    ( total_price / 100 * total_charge )) )
                                                           final_price,
            save_stamp, take_out, A.remark, B.tel user_tel,
            date_format( purchase_date, '%Y-%m-%d %H:%i' ) purchase_date,
            date_format( refund_date, '%Y-%m-%d %H:%i' ) refund_date
        from purchase A
                 left join user B on A.user_id= B.id
        where date_format( purchase_date, '%Y-%m-%d' ) = current_date
        order by id desc
            limit 20 offset 0;`;
    let sqlProductPost= `
        select A.id, B.id item_id,
               C.name product_name, C.price - ( ( C.price / 100 ) * C.discount ) product_price, B.item_cnt,
               B.difference_item_id dif_id, D.category option_category, D.name option_name, D.price - ( ( D.price / 100 ) * D.discount ) option_price
        from ( select id from purchase where date_format( purchase_date, '%Y-%m-%d' ) = current_date order by id desc limit 20 offset 0 ) A
                 right outer join purchase_item B on A.id= B.purchase_id
                 left outer join product C on B.product_id = C.id
                 left outer join product_option_cmm D on B.product_option_id = D.id
        where not A.id is null
        order by id desc;`;
    let sqlPaymentPost = `
        select A.id, C.category, C.name, B.amount, B.discount, B.charge
        from ( select id from purchase where date_format( purchase_date, '%Y-%m-%d' ) = current_date order by id desc limit 20 offset 0 ) A
                 left outer join purchase_payment B on A.id = B.purchase_id
                 join payment_method C on B.payment_method_id = C.id
        order by id desc;`;
    con.query( sqlOrderTotCnt + sqlReadPost + sqlProductPost + sqlPaymentPost, ( err, result ) => {
        if( err ) throw err;
        console.log(result[0]);
        res.render(`adminOrder`, {
            orderTotCnt: result[0],
            readPost: result[1],
            productPost: result[2],
            paymentPost: result[3],
            nowPage: 0 } );
    });
});

router.post ( `/`, async ( req, res, next ) => {
    let targetDay= '\'' + await req.body.targetDay + '\'';
    let targetStatus= ( await req.body.targetStatus == `all` )? `status`: '\'' + req.body.targetStatus + '\'';
    let nowPage= Number( await req.body.targetPaging );
    let sqlOrderTotCnt= `select count( * ) cnt from purchase where status = ${ targetStatus } and
        date_format( purchase_date, '%Y-%m-%d' ) = ${ targetDay };`;
    let sqlReadPost= `
        select
            A.id, status, 
            total_price, total_discount, total_charge, use_stamp,
            floor( total_price -
                   ((total_price / 100 * total_discount) +
                    ( total_price / 100 * total_charge )) )
                                                           final_price,
            save_stamp, take_out, A.remark, B.tel user_tel,
            date_format( purchase_date, '%Y-%m-%d %H:%i' ) purchase_date,
            date_format( refund_date, '%Y-%m-%d %H:%i' ) refund_date
        from purchase A
            left join user B on A.user_id = B.id
        where status = ${ targetStatus } and
            date_format( purchase_date, '%Y-%m-%d' ) = ${ targetDay }
        order by id desc
            limit 20 offset ${ nowPage * 20 };`;
    let sqlProductPost= `
        select A.id, B.id item_id,
               C.name product_name, C.price - ( ( C.price / 100 ) * C.discount ) product_price, B.item_cnt,
               B.difference_item_id dif_id, D.category option_category, D.name option_name, D.price - ( ( D.price / 100 ) * D.discount ) option_price
        from ( select id from purchase where status = ${ targetStatus } and date_format( purchase_date, '%Y-%m-%d' ) = ${ targetDay } 
                                       order by id desc limit 20 offset ${ nowPage * 20 } ) A
                 right outer join purchase_item B on A.id= B.purchase_id
                 left outer join product C on B.product_id = C.id
                 left outer join product_option_cmm D on B.product_option_id = D.id
        where not A.id is null
        order by id desc;`;
    let sqlPaymentPost = `
        select A.id, C.category, C.name, B.amount, B.discount, B.charge
        from ( select id from purchase where status = ${ targetStatus } and date_format( purchase_date, '%Y-%m-%d' ) = ${ targetDay } 
                                       order by id desc limit 20 offset ${ nowPage * 20 } ) A
                 left outer join purchase_payment B on A.id = B.purchase_id
                 join payment_method C on B.payment_method_id = C.id
        order by id desc;`;
    con.query( sqlOrderTotCnt + sqlReadPost + sqlProductPost + sqlPaymentPost, ( err, result ) => {
        if( err ) throw err;
        res.status( 201 ).json( {
            orderTotCnt: result[0],
            readPost: result[1],
            productPost: result[2],
            paymentPost: result[3],
            targetDay: targetDay,
            targetStatus: targetStatus,
            nowPage: nowPage } );
    });
});

router.post ( `/remarkUpdate`, async ( req, res ) => {
    const reqBody= await req.body;
    const id= reqBody.id;
    const remark= ( reqBody.remark == '' )? null: '\'' + reqBody.remark + '\'';
    let sql= `update purchase set remark= ${ remark } where id= ${ id };`;
    con.query( sql, ( err, result ) => {
        res.status( 201 ).json( result );
    });
})

router.post( `/statusUpdate`, async ( req, res ) => {
    const reqBody= await req.body;
    const id= reqBody.id;
    const orderMode= reqBody.orderMode;
    let sql= `update purchase set status= '${ orderMode }' where id= ${ id }`;
    con.query( sql, ( err, result ) => {
       res.status( 201 ).json( result );
    });
})

module.exports= router;