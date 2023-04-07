const express= require( `express` );
const mysql= require( `mysql` );
const DBConnect= require( `../../config/DBConnect` );
const router= express.Router();
const bodyParser= require( `body-parser` );
const con= mysql.createConnection( DBConnect );
con.connect( err => {
    if( err ) throw err;
});

router.get ( `/`, async ( req, res, next ) => {
    let sqlUserTotCnt= `select count( * ) cnt from user where deleted_date is null;`;
    let sqlReadPost= `
                    select
                        id, tel, name, sex, stamp,
                        date_format( birth_date, '%Y-%m-%d' ) birth_date,
                        auth, remark,
                        date_format( created_date, '%Y-%m-%d %H:%i' ) created_date,
                        date_format( join_date, '%Y-%m-%d %H:%i' ) join_date
                    from user
                    where deleted_date is null
                        limit 20 offset 0;`;
    con.query( sqlUserTotCnt + sqlReadPost, ( err, result ) => {
       if( err ) throw err;
        res.render(`adminUser`, {
            userTotCnt: result[0],
            readPost: result[1],
            nowPage: 0 } );
    });
});

router.post( `/getSearchTel`, async ( req, res ) => {
    let tel= await req.body.searchTel;
    let sql= `
                    select
                        id, tel, name, sex, stamp,
                        date_format( birth_date, '%Y-%m-%d' ) birth_date,
                        auth, remark,
                        date_format( created_date, '%Y-%m-%d %H:%i' ) created_date,
                        date_format( join_date, '%Y-%m-%d %H:%i' ) join_date
                    from user
                    where deleted_date is null
                        and tel= '${ tel }'
                        limit 20 offset 0;`;
    con.query( sql, ( err, result ) => {
        if( err ) throw err;
        res.status( 201 ).json( {
            userTotCnt: 1,
            readPost: result,
            nowPage: 0 } );
    });
});

/*
router.get ( `/:page`, async ( req, res, next ) => {
    let nowPage= Number( req.query.page ?? 0 );
    let sqlSearchTel= ( req.query.searchTel )? `and tel= '${ req.query.searchTel }' `: ``;
    let sqlUserTotCnt= `select count( * ) cnt from user where deleted_date is null ${ sqlSearchTel };`;
    let sqlReadPost= `
                    select
                        id, tel, name, sex, stamp,
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
            nowPage: nowPage }, null, 1 );
    });
});
*/
router.post( `/update`, async ( req, res ) => {
    let targetValue= await req.body;
    console.log( targetValue );
})

module.exports= router;