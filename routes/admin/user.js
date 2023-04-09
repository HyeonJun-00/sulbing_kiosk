const express= require( `express` );
const mysql= require( `mysql` );
const DBConnect= require( `../../config/DBConnect` );
const router= express.Router();
const bodyParser= require( `body-parser` );
const con= mysql.createConnection( DBConnect );
con.connect( err => {
    if( err ) throw err;
});

router.get ( `/`, ( req, res, next ) => {
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
                        order by id desc
                        limit 20 offset 0;`;
    con.query( sqlUserTotCnt + sqlReadPost, ( err, result ) => {
       if( err ) throw err;
        res.render(`adminUser`, {
            userTotCnt: result[0],
            readPost: result[1],
            nowPage: 0 } );
    });
});

router.post( `/`, async ( req, res ) => {
    let tel= ( await req.body.searchTel )? await req.body.searchTel: ``;
    let nowPage= Number( await req.body.targetPaging ?? 0 );
    let sqlUserTotCnt= `select count( * ) cnt from user where deleted_date is null and tel like '${ tel }%';`;
    let sqlReadPost= `
                    select
                        id, tel, name, sex, stamp,
                        date_format( birth_date, '%Y-%m-%d' ) birth_date,
                        auth, remark,
                        date_format( created_date, '%Y-%m-%d %H:%i' ) created_date,
                        date_format( join_date, '%Y-%m-%d %H:%i' ) join_date
                    from user
                    where deleted_date is null
                        and tel like '${ tel }%'
                        order by id desc
                        limit 20 offset ${ nowPage * 20 };`;
    con.query( sqlUserTotCnt + sqlReadPost, ( err, result ) => {
        if( err ) throw err;
        res.status( 201 ).json( {
            userTotCnt: result[0] ?? 0,
            readPost: result[1],
            nowPage: nowPage } );
    });
});

router.post( `/update`, async ( req, res ) => {
    let targetValue= await req.body;
    console.log( targetValue );
})

module.exports= router;