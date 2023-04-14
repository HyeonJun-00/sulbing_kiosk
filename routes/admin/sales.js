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
    const today = new Date().toISOString().substring(0,10);
    let [year, month, day] = today.split('-');
    month = month.replace(/^0/, "");
    let lastYear = String(Number(year) - 1);
    let sqlSaleDay = `SELECT DAY(purchase_date) AS date, SUM(total_price) AS totalPrice, FORMAT(sum(total_Price) , 0) AS totalPriceComma
                        FROM purchase
                        WHERE MONTH(purchase_date) LIKE '${month}'
                        GROUP BY date
                        ORDER BY date ASC;`;
    let sqlSaleMonth = `SELECT MONTH(purchase_date) AS date, SUM(total_price) AS totalPrice,FORMAT(sum(total_Price) , 0) AS totalPriceComma
                        FROM purchase
                        WHERE YEAR(purchase_date) LIKE '${year}'
                        GROUP BY date
                        ORDER BY date ASC;`;
    let sqlSaleYear = `SELECT YEAR(purchase_date) AS date, sum(total_price) AS totalPrice, FORMAT(sum(total_Price) , 0) AS totalPriceComma FROM purchase WHERE YEAR(purchase_date) LIKE '${year}' GROUP BY date`;
    let sqlSaleLastYear = `SELECT YEAR(purchase_date) AS date, sum(total_price) AS totalPrice, FORMAT(sum(total_Price) , 0) AS totalPriceComma FROM purchase WHERE YEAR(purchase_date) LIKE '${lastYear}' GROUP BY date`;
    let sqlBestItem = `SELECT pT.name, COUNT(pI.product_id) AS purchaseCnt FROM purchase_item pI INNER JOIN product pT ON pI.product_id = pT.id GROUP BY pI.product_id ORDER BY purchaseCnt DESC LIMIT 10`;

    con.query(sqlSaleDay, (err, resultDay)=>{
        con.query(sqlSaleMonth, (err, resultMonth)=>{
            con.query(sqlSaleYear, (err, resultYear)=>{
                con.query(sqlSaleLastYear, (err, resultLastYear)=>{
                    con.query(sqlBestItem, (err, bestItem)=>{
                        if (err) throw err;
                        console.log(resultDay, resultMonth, resultYear, resultLastYear, bestItem);
                        res.render(`adminSales`, {saleDay: resultDay, saleMonth: resultMonth, saleYear: resultYear, saleLastYear: resultLastYear ,bestItem: bestItem });
                    });
                });
            });
        });
    });
});

module.exports= router;