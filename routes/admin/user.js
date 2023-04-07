const express= require( `express` );
const mysql= require( `mysql` );
const DBConnect= require( `../../config/DBConnect` );
const router= express.Router();
const con= mysql.createConnection( DBConnect );
con.connect( err => {
    if( err ) throw err;
});

router.get ( `/`, ( req, res, next ) => {
    let nowPage= Number( req.query.page ?? 0 );
    let sqlSearchTel= ( req.query.searchTel )? `and tel= '${ req.query.searchTel }' `: ``;
    let sqlUserTotCnt= `select count( * ) cnt from user where deleted_date is null ${ sqlSearchTel };`;
    let sqlReadPost= `
                    select
                        id, tel, name, sex,
                        date_format( birth_date, '%Y-%m-%d' ) birth_date,
                        auth, remark,
                        date_format( created_date, '%Y-%m-%d %H:%i' ) created_date,
                        date_format( join_date, '%Y-%m-%d %H:%i' ) join_date
                    from user
                    where deleted_date is null
                        ${ sqlSearchTel }
                        limit 20 offset ${ nowPage * 20 };`;
    req.params= null;
    con.query( sqlUserTotCnt + sqlReadPost, ( err, result ) => {
       if( err ) throw err;
        res.render(`adminUser`, {
            userTotCnt: result[0],
            readPost: result[1],
            nowPage: nowPage });
    });
});

module.exports= router;