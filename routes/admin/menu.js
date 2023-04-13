const express= require( `express` );
const mysql= require( `mysql` );
const DBConnect= require( `../../config/DBConnect` );
const router= express.Router();
const bodyParser= require( `body-parser` );
const con= mysql.createConnection( DBConnect );
con.connect( err => {
    if( err ) throw err;
});

router.get( `/`, ( req, res, next ) => {
    let sqlGetMenu= `SELECT * FROM menu WHERE pid IS NULL;`;
    let sqlGetList= `SELECT * FROM menu WHERE pid IS NOT NULL`
    con.query( sqlGetMenu+sqlGetList, ( err, result ) => {
        if( err ) throw err;
        res.render( `adminMenu`, { menu: result } );
    });
});

router.post('/menuCheck', (req, res)=>{
    console.log(req.body.checkMenu, req.body.nameMenu, req.body.isMain);
    let sqlActive = `UPDATE menu SET deleted_date = NULL WHERE name Like '${req.body.nameMenu}'`;
    let sqlInactive = `UPDATE menu SET deleted_date = now() WHERE name Like '${req.body.nameMenu}'`;
    let sqlInactiveSub= `UPDATE menu SET deleted_date = now() WHERE pid Like '${req.body.nameMenu}'`;


    switch(req.body.checkMenu){

        case "active":
            con.query(sqlActive, (err, result) => {
                if (err) throw err;
            });
            break;

        case "inactive":

            if(req.body.isMain == 'true'){
                con.query(sqlInactive, (err, result)=>{
                    if (err) throw err;
                    console.log(req.body.nameMenu);

                    con.query(sqlInactiveSub, (err, result2)=>{
                        console.log(sqlInactiveSub);
                        if (err) throw err;
                    });
                });
            } else {
                con.query(sqlInactive, (err, result) => {
                    if (err) throw err;
                });
            }
            break;
    }
    res.redirect('/admin_menu');
})

module.exports= router;