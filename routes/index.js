const express = require(`express`);
const mysql = require(`mysql`);
const DBConnect = require(`../config/DBConnect`);
const router = express.Router();
const con = mysql.createConnection(DBConnect);
con.connect(err => {
    if (err) throw err;
});
router.get(`/`, (req, res) => {
        res.render(`login`);
});
router.get(`/index`, (req, res) => {
    let sqlGetMenu = `select * from v_menu;`;
    let sqlGetMenuInProduct = `select * from v_menu_in_product;`;
    let sqlGetProduct = `select * from v_product;`;
    let sqlGetProductOption = `select * from v_product_option;`;
    let sqlPurchaseId = `select max(id) from purchase;`;

    con.query(sqlGetMenu + sqlGetMenuInProduct + sqlGetProduct + sqlGetProductOption + sqlPurchaseId, (err, result) => {
        if (err) throw err;
        let productOptionArray = [];


        for (let i = 0; i < result[2].length; i++) {
            productOptionArray[result[2][i].product_id] = [];
            for (let j = 0; j < result[3].length; j++) {
                if (result[2][i].product_id == result[3][j].product_id) {
                    productOptionArray[result[2][i].product_id].push([result[3][j].option_category, result[3][j].option_name, result[3][j].option_price, result[3][j].option_discount, result[3][j].option_id]);
                }
            }
        }
        res.render(`index`, {
            menu: result[0],
            menuInProduct: result[1],
            product: result[2],
            productOption: result[3],
            productOptionArray: productOptionArray,
            purchaseId : result[4]
        });
    });
});

router.post(`/getUserStamp`, async (req, res, next) => {
    let tel = await req.body.tel;
    let sql = `select id, name, tel, stamp, auth, join_date from user where tel= '${tel}';`;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json(result);
    });
});

router.post(`/getGifticon`, async (req, res, next) => {
    let code = await req.body.code;
    let sql = `select id, name, code, save_amount from gifticon_info where code= '${code}' and deleted_date is null;`;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json(result);
    });
});

router.post(`/cart`, async (req, res, next) => {
    try {
        let cartItem = await req.body.jsonData;
        let stamp = cartItem.stamp.save;
        let resultPrice = cartItem.totalAmount;
        let userId = null;
        let purchaseId = "";
        let sql = "";
        stamp -= cartItem.stamp.use ? 10 : 0;
        res.status(201).json(cartItem);


        if (await cartItem.tel) {
            sql = `    
                INSERT INTO user (id, tel, stamp, auth, created_date)
                VALUES (null , '${cartItem.tel}',  ${stamp}, "G",NOW())
                ON DUPLICATE KEY UPDATE
                    stamp = stamp + VALUES(stamp);
                SELECT id FROM user WHERE tel = '${cartItem.tel}';
                `
            con.query(sql, async (err, result) => {
                if (err)
                    throw err;
                userId = await result[1][0].id;
                sql = `
                    INSERT INTO purchase (id, user_id, total_price, total_discount, total_charge, purchase_date, use_stamp, save_stamp, take_out, remark)
                    VALUES (null, ${userId}, ${resultPrice}, 0, 0, NOW(), ${cartItem.stamp.use}, ${cartItem.stamp.save}, ${cartItem.take_out}, '${cartItem.remark}');
                    SELECT LAST_INSERT_ID();
                `
                con.query(sql, async (err, result) => {
                    if (err)
                        throw err;
                    purchaseId = await result[1][0]['LAST_INSERT_ID()'];

                    sql = "";
                    for (let i = 0; i < cartItem.item.length; i++) {
                        sql +=
                            `
                            INSERT INTO purchase_item (id, purchase_id, difference_item_id, product_id, product_option_id, item_price, item_discount, item_cnt)
                            VALUES  (null, ${purchaseId}, null, ${cartItem.item[i].id}, null, ${cartItem.item[i].price}, ${cartItem.item[i].discount}, ${cartItem.item[i].cnt} );
                            SET @purchase_item_id = LAST_INSERT_ID();
                        `
                        for (let j = 0; j < cartItem.item[i].option.length; j++) {
                            sql +=
                                `
                            INSERT INTO purchase_item (id, purchase_id, difference_item_id, product_id, product_option_id, item_price, item_discount, item_cnt)
                            VALUES  (null, ${purchaseId}, @purchase_item_id, null,${cartItem.item[i].option[j].id}, ${cartItem.item[i].option[j].price}, ${cartItem.item[i].option[j].discount}, ${cartItem.item[i].cnt} );
                        `
                        }
                    }
                    con.query(sql, async (err, result) => {
                        if (err) throw err;
                    });
                    sql = "";
                    for (let i = 0; i < cartItem.payment.length; i++) {
                        if (cartItem.payment[i].amount != 0) {
                            sql += `
                                INSERT INTO purchase_payment (id, purchase_id, payment_method_id, amount, discount, charge)
                                VALUES (null, ${purchaseId}, ${cartItem.payment[i].id}, ${cartItem.payment[i].amount}, 0, 0);
                            `
                        }
                    }
                    con.query(sql, async (err, result) => {
                        if (err) throw err;
                    });
                    sql = "";
                    for (let i = 0; i < cartItem.item.length; i++) {
                        sql += `UPDATE product SET stock = stock - ${cartItem.item[i].cnt} WHERE id = "${cartItem.item[i].id}";`;
                    }
                    con.query(sql, async (err, result) => {
                        if (err) throw err;
                    });
                    sql = "";
                    for (let i = 0; i < cartItem.payment[0].gifticon.length; i++) {
                        sql += `UPDATE gifticon_info SET save_amount = ${cartItem.payment[0].gifticon[i].price} WHERE id = "${cartItem.payment[0].gifticon[i].id}";`;
                    }
                    if (sql != "") {
                        con.query(sql, async (err, result) => {
                            if (err) throw err;
                        });
                    }
                });
            });
        } else {
            sql = `
                    INSERT INTO purchase (id, user_id, total_price, total_discount, total_charge, purchase_date, use_stamp, save_stamp, take_out, remark)
                    VALUES (null, ${userId}, ${resultPrice}, 0, 0, NOW(), ${cartItem.stamp.use}, ${cartItem.stamp.save}, ${cartItem.take_out}, '${cartItem.remark}');
                    SELECT LAST_INSERT_ID();
                `
            con.query(sql, async (err, result) => {
                if (err)
                    throw err;
                purchaseId = await result[1][0]['LAST_INSERT_ID()'];

                sql = "";
                for (let i = 0; i < cartItem.item.length; i++) {
                    sql +=
                        `
                            INSERT INTO purchase_item (id, purchase_id, difference_item_id, product_id, product_option_id, item_price, item_discount, item_cnt)
                            VALUES  (null, ${purchaseId}, null, ${cartItem.item[i].id}, null, ${cartItem.item[i].price}, ${cartItem.item[i].discount}, ${cartItem.item[i].cnt} );
                            SET @purchase_item_id = LAST_INSERT_ID();
                        `
                    for (let j = 0; j < cartItem.item[i].option.length; j++) {
                        sql +=
                            `
                            INSERT INTO purchase_item (id, purchase_id, difference_item_id, product_id, product_option_id, item_price, item_discount, item_cnt)
                            VALUES  (null, ${purchaseId}, @purchase_item_id, null,${cartItem.item[i].option[j].id}, ${cartItem.item[i].option[j].price}, ${cartItem.item[i].option[j].discount}, ${cartItem.item[i].cnt} );
                        `
                    }
                }
                con.query(sql, async (err, result) => {
                    if (err) throw err;
                });
                sql = "";
                for (let i = 0; i < cartItem.payment.length; i++) {
                    if (cartItem.payment[i].amount != 0) {
                        sql += `
                                INSERT INTO purchase_payment (id, purchase_id, payment_method_id, amount, discount, charge)
                                VALUES (null, ${purchaseId}, ${cartItem.payment[i].id}, ${cartItem.payment[i].amount}, 0, 0);
                            `
                    }
                }
                con.query(sql, async (err, result) => {
                    if (err) throw err;
                });
                sql = "";
                for (let i = 0; i < cartItem.item.length; i++) {
                    sql += `UPDATE product SET stock = stock - ${cartItem.item[i].cnt} WHERE id = "${cartItem.item[i].id}";`;
                }
                con.query(sql, async (err, result) => {
                    if (err) throw err;
                });
                sql = "";
                for (let i = 0; i < cartItem.payment[0].gifticon.length; i++) {
                    sql += `UPDATE gifticon_info SET save_amount = ${cartItem.payment[0].gifticon[i].price} WHERE id = "${cartItem.payment[0].gifticon[i].id}";`;
                }
                if (sql != "") {
                    con.query(sql, async (err, result) => {
                        if (err) throw err;
                    });
                }
            });
        }



    

        


    } catch (err) {
        console.error(err);
        next(err);
    }
});


router.post ( `/login`, async ( req, res ) => {
    let pwGet = await req.body.pwValue;
    let pwSql = `SELECT tel FROM user WHERE auth = 'S'`;
    let flagPW = false;
    con.query(pwSql, (err, result)=>{
        if (err) throw err;
        result.forEach((v)=>{
            console.log(v.tel);
            (v.tel == pwGet) && (flagPW = true)
        });
        if(flagPW != true) {
            res.redirect('/admin_order');
        } else {
            res.redirect('/');
        }
    });
});

module.exports= router;