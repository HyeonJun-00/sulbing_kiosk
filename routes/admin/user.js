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

router.post( `/isTel`, async ( req, res ) => {
    let id= await req.body.id ?? 0;
    let tel= await req.body.tel;

    let sql= `
        select 
            count( * ) cnt
        from user 
        where deleted_date is null 
            and id != ${ id }
            and tel = '${ tel }'
        ;`;
    con.query( sql, ( err, result ) => {
        if( err ) throw err;
        res.status( 201 ).json( result );
    });
});

router.post( `/insert`, ( req, res ) => {
    const targetValue= req.body;
    const name= ( targetValue.name.trim() == '' )? null: '\'' + targetValue.name.trim() + '\'';
    const tel= ( targetValue.tel.trim() == '' )? null: '\'' + targetValue.tel.trim() + '\'';
    const sex= ( targetValue.sex == '' )? null: '\'' + targetValue.sex + '\'';
    const birth_date= ( targetValue.birth_date == '' )? null: '\'' + targetValue.birth_date + '\'';
    const auth= ( targetValue.auth == '' )? null: '\'' + targetValue.auth + '\'';
    const remark= ( targetValue.remark.trim() == '' )? null: '\'' + targetValue.remark.trim() + '\'';

    let sql= `
        insert into user (
                          id, tel, name, sex, birth_date, 
                          stamp, auth, remark, created_date, join_date)
        values (
                null, ${ tel }, ${ name }, ${ sex }, ${ birth_date },
                0, ${ auth }, ${ remark }, now(),
                case when
                    ${ auth } in ( 'N', 'S' ) and join_date is null then now()
                    else null end
               );`;
    con.query( sql, ( err, result ) => {
        if( err ) throw err;
        res.status( 201 ).json( result );
    });
});

router.post( `/update`, async ( req, res ) => {
    const targetValue= await req.body;
    const id= targetValue.id;
    const name= ( targetValue.name.trim() == '' )? null: '\'' + targetValue.name.trim() + '\'';
    const tel= ( targetValue.tel.trim() == '' )? null: '\'' + targetValue.tel.trim() + '\'';
    const sex= ( targetValue.sex == '' )? null: '\'' + targetValue.sex + '\'';
    const birth_date= ( targetValue.birth_date == '' )? null: '\'' + targetValue.birth_date + '\'';
    const auth= ( targetValue.auth == '' )? null: '\'' + targetValue.auth + '\'';
    const remark= ( targetValue.remark.trim() == '' )? null: '\'' + targetValue.remark.trim() + '\'';

    let sql= `update user set 
                name= ${ name },
                tel= ${ tel },
                sex= ${ sex },
                birth_date= ${ birth_date },
                auth= ${ auth },
                join_date = 
                    case when
                        ${ auth } in ( 'N', 'S' ) and join_date is null then now() 
                        else join_date end, 
                remark= ${ remark } 
            where id= ${ id };`;
    console.log( sql );
    con.query( sql, ( err, result ) => {
        if( err ) throw err;
        res.status( 201 ).json( result );
    });
});

router.post( `/delete`, ( req, res) => {
    const id= req.body.id;
    let sql= `update user set 
                name= null,
                tel= null,
                sex= null,
                birth_date= null,
                stamp= 0,
                auth= 'G',
                remark= null,
                deleted_date= now()
            where id= ${ id };`;
    console.log( sql );
    con.query( sql, ( err, result ) => {
        if( err ) throw err;
        res.status( 201 ).json( result );
    });
});

module.exports= router;