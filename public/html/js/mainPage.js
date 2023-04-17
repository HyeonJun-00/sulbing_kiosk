(() => {
    const menuBar1 = $(".menuBar1 li");
    const menuBar2 = $(".menuBar2 li");
    const productListBox = $(".productListBox");
    const productListWrapBox = $(".productListWrapBox");
    const productItem = $(".productItem");
    const drawNumber = inputString => {
        if (inputString == "") return "";
        return Number(String(inputString.replace(/[^0-9]/g, "")));
    };
    const putComma = inputString => Number(String(inputString).replace(/[^0-9]/g, '')).toLocaleString();
    const transferData = {
        tel: null,
        item: [
        ],
        stamp: { use: false, save: 0 }, // 사용 10, 적립 2
        payment: [
            { id: 6, amount: 0, gifticon: [] }
        ],
        take_out: 0,
        remark: ''
    };
    let totalAmount = 0;
    const totalSet = () => {
        let totalCount = 0;
        totalAmount = 0;
        transferData.stamp.save = 0;
        for (let i = 0; i < transferData.item.length; i++) {
            totalCount += transferData.item[i].cnt;
            $(".product_number").eq(i).html(transferData.item[i].cnt);
            (/bingsoo/.test($(".product_image").eq(i).attr("src"))) && (transferData.stamp.save += transferData.item[i].cnt);
            $(".product_result_price").eq(i).html(putComma($(".product_result_price").eq(i).attr("data-this-price") * transferData.item[i].cnt) + " 원");
            totalAmount += parseInt(String($(".product_result_price").eq(i).html()).replace(/,/g, ""));
        }
        if (transferData.stamp.use) {
            totalAmount -= 5000;
        }
        totalAmount -= transferData.payment[0].amount;
        totalAmount = totalAmount < 0 ? 0 : totalAmount;
        $("#final_amount").html(`${putComma(totalAmount)} 원`);
        $("#total_number").html(`총 수량(${totalCount})`);
        $("#total_amount").html(`${putComma(totalAmount)} 원`);
        $("#gifticon_price").html(`${putComma(totalAmount)}원`);
    }
    const stockSet = checkID => {
        if (checkID.attr("data-product-stock") - checkID.attr("data-minus-stock") < 6 && checkID.attr("data-product-stock") - checkID.attr("data-minus-stock") > 0) {
            checkID.removeClass("sold_out");
            checkID.addClass("backgroundFlag displayFlag");
            checkID.html(`${checkID.attr("data-product-stock") - checkID.attr("data-minus-stock")}개 남았어요`);
        } else if (checkID.attr("data-product-stock") - checkID.attr("data-minus-stock") == 0) {
            checkID.removeClass("displayFlag backgroundFlag");
            checkID.addClass("sold_out");
            checkID.html("");
        } else if (checkID.attr("data-product-stock") - checkID.attr("data-minus-stock") < 11) {
            checkID.removeClass("backgroundFlag sold_out");
            checkID.addClass("displayFlag");
            checkID.html(`${checkID.attr("data-product-stock") - checkID.attr("data-minus-stock")}개 남았어요`);
        }
    }
    const resetTimer = time => {
        $("#reset_time_modal").css("background", `conic-gradient(#f6d73d ${time}deg, rgba(245, 245, 245, 0) ${time}deg)`);
        $("#reset_time_guide").html(`${Math.floor(time / 6 + 0.5)}초 후 시작화면으로 돌아갑니다.`);
        if (time > 0 && loadTimeValue > 50) setTimeout(resetTimer, 1000 / 6, time - 1);
        else if (loadTimeValue > 50) location.reload();
    }
    let loadTimeValue = 0;
    const loadTime = () => {
        if (loadTimeValue == 59) {
            $("#reset_timer_modal_background").addClass("displayFlag");
            resetTimer(360);
        }
        loadTimeValue++;
        setTimeout(loadTime, 1000);
    }
    $("html").on("click", () => {
        (loadTimeValue == 0) && (loadTime());
        loadTimeValue = 1;
    });
    let menuBar1_num = 0;
    let menuBar2_num = 0;
    let productPrice = 0;

    $("#reset_timer_modal_background").on("click", () => {
        $("#reset_time_modal").css("background", `conic-gradient(#f6d73d 0deg, rgba(245, 245, 245, 0) 0deg)`);
        $("#reset_timer_modal_background").removeClass("displayFlag");
    });

    $("#point_lookup_button").on("click", async () => {
        const tel = $(`#point_input_box`).html();
        try {
            transferData.tel = tel;
            const res = await axios.post(`/getUserStamp`, { tel });
            if (res.data.length > 0) {
                $("#have_stamp").html(`${res.data[0].stamp}/10`);
                if (res.data[0].auth != "G") {
                    (res.data[0].stamp >= 10) && ($("#stamp_use_button").addClass("displayFlag"), $("#stamp_use").html("5000원 할인"));
                } else {
                    ($("#stamp_use").html("가입 후 사용가능"));
                }
            }
            $("#accumulate_stamp").html(`${transferData.stamp.save}개`);
        } catch (err) {
            console.error(err);
        }
    });
    $("#stamp_use_button").on("click", function () {
        $(this).toggleClass("backgroundFlag");
    });
    $("#inquiry_add_button").on("click", async () => {
        if (totalAmount == 0) return;
        const code = $(`.inquiry_input_box`).val();
        try {
            const res = await axios.post(`/getGifticon`, { code });

            if (!transferData.payment[0].gifticon.some(item => item.id == res.data[0].id)) {
                transferData.payment[0].amount += res.data[0].save_amount;
                transferData.payment[0].gifticon.push({ id: res.data[0].id, price: res.data[0].save_amount - totalAmount < 0 ? 0 : res.data[0].save_amount - totalAmount });
                console.log(transferData.payment[0].gifticon);
                $("#gifticon_box").append(
            `
                <div class="gifticon_element">
                    <button></button>
                    <p> ${res.data[0].name}</p>
                    <p> 잔액: </p>
                    <p> ${putComma(res.data[0].save_amount)}원 </p>
                </div>
            `)
                $(".gifticon_element button").off();
                $(".gifticon_element button").on("click", function () {
                    transferData.payment[0].amount -= drawNumber($(".gifticon_element").eq($(this).parent().index()).children("p").eq(2).html());
                    transferData.payment[0].gifticon.splice($(this).parent().index(), 1);
                    $(this).parent().remove();
                    totalSet();
                });
            }
            $(`.inquiry_input_box`).val("");
            transferData.payment[0].amount = 0;

            for (let i = 0; i < $(".gifticon_element").length; i++) {
                transferData.payment[0].amount += drawNumber($(".gifticon_element p:last-child").eq(i).html());
            }
            totalSet();
        } catch (err) {
            console.error(err);
        }
    });
    let endCheck = true;
    menuBar1.eq(0).addClass("backgroundFlag");
    menuBar2.eq(0).addClass("displayFlag");
    productListWrapBox.eq(0).addClass("displayFlag");
    productListBox.eq(0).addClass("displayFlag");
    menuBar2.eq(0).children().eq(0).addClass("backgroundFlag");
    menuBar1.on("click", function () {
        menuBar1_num = $(this).index();
        menuBar1.removeClass("backgroundFlag");
        $(this).addClass("backgroundFlag");
        menuBar2.removeClass("displayFlag");
        menuBar2.eq(menuBar1_num).addClass("displayFlag");
        menuBar2.children().removeClass("backgroundFlag");
        menuBar2.eq(menuBar1_num).children().eq(0).addClass("backgroundFlag");
        productListWrapBox.removeClass("displayFlag");
        productListWrapBox.eq(menuBar1_num).addClass("displayFlag");
        productListWrapBox.eq(menuBar1_num).children().removeClass("displayFlag");
        productListWrapBox.eq(menuBar1_num).children().eq(0).addClass("displayFlag");
    });
    menuBar2.children().on("click", function () {
        menuBar2_num = $(this).index();
        menuBar2.children().removeClass("backgroundFlag");
        $(this).addClass("backgroundFlag");
        productListWrapBox.eq(menuBar1_num).children().removeClass("displayFlag");
        productListWrapBox.eq(menuBar1_num).children().eq(menuBar2_num).addClass("displayFlag");
    });
    menuBar2.on("click", function () {
        menuBar2.removeClass("displayFlag");
        $(this).addClass("displayFlag");
    });
    let cardTerminalCheck = true;
    let cardTerminal = true;
    let payTerminalCheck = true;
    let payTerminal = true;
    $("#card_terminal_modal button").on("click", () => {
        $("#card_terminal_modal_background").removeClass("displayFlag");
        $("#card_terminal_price").removeClass("backgroundFlag");
        cardTerminal = false;
        cardTerminalCheck = false;
    });
    $("#pay_terminal_modal button").on("click", () => {
        $("#pay_terminal_modal_background").removeClass("displayFlag");
        $("#pay_terminal_price").removeClass("backgroundFlag");
        payTerminal = false;
        payTerminalCheck = false;
    });
    $("#card_payment_window_button").on("click", () => {
        $("#card_terminal_modal_background").addClass("displayFlag");

        cardTerminalCheck = true;
        setTimeout(() => {
            cardTerminal = true;
            if (cardTerminal && cardTerminalCheck) {
                const threeDots = async dot => {
                    let setThreeDots = setTimeout(threeDots, 500, dot + 1);
                    $("#card_terminal_modal > section > p").html(`결제 진행중입니다${(() => {
                        let dotString = "";

                        for (let i = 0; i < dot % 4; i++) {
                            dotString += "."
                        }
                        return dotString;
                    })()}`);
                    if (dot < 7 && cardTerminal && cardTerminalCheck) {
                        setThreeDots();
                    } else if (cardTerminal && cardTerminalCheck && endCheck) {
                        endCheck = false;
                        if (transferData.payment.some(item => item.id == 1)) {
                            transferData.payment[1].amount = totalAmount;
                        } else {
                            transferData.payment.push({ id: 1, amount: totalAmount });
                        }
                        transferData.remark = `스푼: ${$(".spoon_number_plus").parent().children("p").html()}, 드라이아이스: ${$(".dryice_number_plus").parent().children("p").html()}`;
                        const jsonData = transferData;
                        try {
                            if (await axios.post(`/cart`, { jsonData })) {
                                setTimeout(() => {
                                    location.reload()
                                }, 500);
                            }
                        } catch (err) {
                            console.error(err);
                        }
                    } else {
                        clearTimeout(setThreeDots);
                        $("#card_terminal_modal > section > p").html(`결제 진행중입니다`);
                    }
                };
                $("#card_terminal_price").addClass("backgroundFlag");
                $("#card_terminal_price > p").html(`${putComma(totalAmount)}원 결제`);
                threeDots(1);
            }
        }, 3000);
    });
    $(".pay_payment_window_button").on("click", function () {
        $("#pay_terminal_modal_background").addClass("displayFlag");

        payTerminalCheck = true;
        setTimeout(() => {
            payTerminal = true;
            if (payTerminal && payTerminalCheck) {
                const threeDots = async dot => {
                    let setThreeDots = setTimeout(threeDots, 500, dot + 1);
                    $("#pay_terminal_modal > section > p").html(`결제 진행중입니다${(() => {
                        let dotString = "";

                        for (let i = 0; i < dot % 4; i++) {
                            dotString += "."
                        }
                        return dotString;
                    })()}`);
                    if (dot < 7 && payTerminal && payTerminalCheck) {
                        setThreeDots();
                    } else if (payTerminal && payTerminalCheck && endCheck) {
                        endCheck = false;
                        if (transferData.payment.some(item => item.id == $(this).index() + 2)) {
                            transferData.payment[1].amount = totalAmount;
                            transferData.payment[1].id = $(this).index() + 2;
                        } else {
                            transferData.payment.push({ id: $(this).index() + 2, amount: totalAmount });
                        }
                        transferData.remark = `스푼: ${$(".spoon_number_plus").parent().children("p").html()}, 드라이아이스: ${$(".dryice_number_plus").parent().children("p").html()}`;
                        const jsonData = transferData;
                        try {
                            if (await axios.post(`/cart`, { jsonData })) {
                                setTimeout(() => {
                                    location.reload()
                                }, 500);
                            }
                        } catch (err) {
                            console.error(err);
                        }
                    } else {
                        clearTimeout(setThreeDots);
                        $("#card_terminal_modal > section > p").html(`결제 진행중입니다`);
                    }
                };
                $("#pay_terminal_price").addClass("backgroundFlag");
                $("#pay_terminal_price > p").html(`${putComma(totalAmount)}원 결제`);
                threeDots(1);
            }
        }, 2100);
    });
    $("#result_button").on("click", () => {
        const orderProduct = $(".orderBox").children("div");
        let optionString = "";

        if (!transferData.item.length) {
            return false;
        }
        $("#final_amount").html($("#total_amount").html());
        for (let i = 0; i < orderProduct.length; i++) {
            let optionSubString = "";
            let optionPrice = 0;

            for (let j = 0; j < transferData.item[i].option.length; j++) {
                const optionNameString = String(orderProduct.eq(i).children("div").eq(0).children("p").eq(j).html()).split(' ');

                optionPrice += drawNumber(optionNameString[1]);
                optionSubString += `
                                <div class="option addOption">
                                    <p> ${optionNameString[0]} </p>
                                    <p> &#10004; </p>
                                    <p> ${optionNameString[1]} </p>
                                </div>
                `;
            }
            optionString += `
                                 <div class="option">
                                    <p> ${orderProduct.eq(i).children("p").eq(0).html()} </p>
                                    <p> ${transferData.item[i].cnt}</p>
                                    <p> ${putComma($(".product_result_price").eq(i).attr("data-this-price") - optionPrice)}원 </p>
                                </div>           
            ` + optionSubString;
        }
        $(".payment_modal_order_box > aside").html("");
        $(".payment_modal_order_box > aside").append(`${optionString}`);
        $(".payment_modal").addClass("displayFlag");
    });
    productItem.on("click", function () {
        if ($(this).children().children().hasClass("sold_out")) {
            return;
        }
        productPrice = $(this).find(".productPrice").html();
        $(".modalBackground").addClass("displayFlag");
        $(".option_modal_main").html("");
        $(".option_modal_main").append($(this).children().eq(3).html());
        $(".resultPrice").html(`${putComma(productPrice)} 원`);
        $(".optionButton").on("click", function () {
            const result = drawNumber($(this).html());

            if ($(this).hasClass("backgroundFlag")) productPrice = parseInt(String(productPrice).replace(/,/g, "")) - Number(result);
            else productPrice = parseInt(String(productPrice).replace(/,/g, "")) + Number(result);
            $(this).toggleClass("backgroundFlag");
            $(".resultPrice").html(`${putComma(productPrice)} 원`);
        });
        $(".option_modal_x_button").on("click", () => $(".modalBackground").removeClass("displayFlag"));
        $(".add_order_button").on("click", () => {
            const optionId = [];
            const thisStock = $(this).children().eq(1).children().eq(0);
            const arrayComparison = (inputArray1, inputArray2) => {
                const arrayLength = inputArray1.length > inputArray2.length ? inputArray1.length : inputArray2.length;

                for (let i = 0; i < arrayLength; i++) {
                    if (inputArray1[i] != inputArray2[i]) return false;
                }
                return true;
            }
            let duplicationCheck = true;
            let optionString = "";

            thisStock.attr("data-minus-stock", drawNumber(thisStock.attr("data-minus-stock")) + 1);
            stockSet(thisStock);
            for (let i = 0; i < $(".optionButton").length; i++) {
                if ($(".optionButton").eq(i).hasClass("backgroundFlag")) {
                    optionId.push({id : $(".optionButton").eq(i).attr("data-option-id"), price : $(".optionButton").eq(i).attr("data-option-price"), discount : $(".optionButton").eq(i).attr("data-option-discount") })
                    optionString += `<p>${$(".optionButton").eq(i).html()}</p>`;
                }
            }
            for (let i = 0; i < transferData.item.length; i++) {
                if ($(".option_modal_main p").eq(0).attr("data-product-id") == transferData.item[i].id && arrayComparison(optionId, transferData.item[i].option)) {
                    transferData.item[i].cnt++;
                    duplicationCheck = false;
                }
            }
            if (duplicationCheck) {
                $(".orderBox").append(`
                    <div>
                        <button class="orderXButton"></button>
                        <img class="product_image" src="${$(this).children().eq(0).attr("src")}" alt="">
                        <p product-id = "${$(this).children().eq(1).attr("data-product-id")}"> ${$(this).children().eq(1).text().match(/^[^\d]+/)} </p>
                        <div>
                            ${optionString}
                        </div>
                        <p class="product_result_price"  data-this-price = "${drawNumber($(".resultPrice").html())}"> ${putComma(drawNumber($(".resultPrice").html()))} 원 </p>
                        <div>
                            <div> 
                                <button class="product_number_minus"> - </button>
                                <p class="product_number"> 1 </p>
                                <button class="product_number_plus"> + </button>
                            </div> 
                        </div>
                    </div>
            `);
                transferData.item.push({ id: $(this).attr("data-product-id"), cnt: 1, option: optionId, price : $(this).attr("data-product-price"), discount : $(this).attr("data-product-discount") });
                $(".product_number_minus").off();
                $(".product_number_plus").off();
                $(".orderXButton").off();
                $(".product_number_minus").on("click", function () {
                    const productNumber = $(this).parent().children("p").html();
                    const productID = $(this).parent().parent().parent().children("p").eq(0).attr("product-id");
                    const checkID = $(`[data-check-id=${productID}]`);

                    if (productNumber == 1) return;
                    else transferData.item[$(this).parent().parent().parent().index()].cnt--;
                    checkID.attr("data-minus-stock", drawNumber(checkID.attr("data-minus-stock")) - 1);
                    stockSet(checkID);
                    totalSet();
                });
                $(".product_number_plus").on("click", function () {
                    const productID = $(this).parent().parent().parent().children("p").eq(0).attr("product-id");
                    const checkID = $(`[data-check-id=${productID}]`);

                    if (checkID.attr("data-product-stock") - checkID.attr("data-minus-stock") == 0) return;
                    else transferData.item[$(this).parent().parent().parent().index()].cnt++;
                    checkID.attr("data-minus-stock", drawNumber(checkID.attr("data-minus-stock")) + 1);
                    stockSet(checkID);
                    totalSet();
                });
                $(".orderXButton").on("click", function () {
                    const productID = $(this).parent().children("p").eq(0).attr("product-id");
                    const checkID = $(`[data-check-id=${productID}]`);

                    transferData.item.splice($(this).parent().index(), 1);
                    $(this).parent().remove();
                    checkID.attr("data-minus-stock", 0);
                    stockSet(checkID);
                    totalSet();
                });
            }
            totalSet();
            $(".modalBackground").removeClass("displayFlag");
        });
    });
    $(".store_or_packaging").on("click", function () {
        $(".store_or_packaging").removeClass("backgroundFlag");
        $(this).addClass("backgroundFlag");
        (($(this).index() == 1) && (transferData.take_out = 1)) || (transferData.take_out = 0);
    });
    $(".dryice_number_minus").on("click", function () {
        const dryIceNumber = $(this).parent().children("p").html() == 0 ? 0 : $(this).parent().children("p").html() - 5;
        $(this).parent().children("p").html(dryIceNumber)
    });
    $(".dryice_number_plus").on("click", function () {
        const dryIceNumber = parseInt($(this).parent().children("p").html()) + 5;
        $(this).parent().children("p").html(dryIceNumber)
    });
    $(".spoon_number_minus").on("click", function () {
        const spoonNumber = $(this).parent().children("p").html() == 0 ? 0 : $(this).parent().children("p").html() - 1;
        $(this).parent().children("p").html(spoonNumber);
    });
    $(".spoon_number_plus").on("click", function () {
        const spoonNumber = parseInt($(".spoon_number_plus").parent().children("p").html()) + 1;
        $(this).parent().children("p").html(spoonNumber);
    });
    $(".modal2_pay").on("click", function () {
        $(".modal2_pay").removeClass("backgroundFlag");
        $(this).addClass("backgroundFlag");
    });
    $(".inquiry_keypad button").on("click", function () {
        if ($(this).html() == "") {
            let pointPoneNum = $(".inquiry_input_box").val().split("");
            pointPoneNum.pop();
            $(".inquiry_input_box").val(drawNumber(pointPoneNum.join()));
        } else if ($(this).html() == "CLEAR") {
            $(".inquiry_input_box").val("");
        }
        else if ($(".inquiry_input_box").html().length < 20) {
            $(".inquiry_input_box").val(($(".inquiry_input_box").val() + $(this).html()));
        }
    });
    $("#point_keypad button").on("click", function () {
        if ($(this).html() == "") {
            let pointPoneNum = $("#point_input_box").html().split("");
            pointPoneNum.pop();
            $("#point_input_box").html(pointPoneNum);
        } else if ($("#point_input_box").html().length < 12) {
            $("#point_input_box").html(($("#point_input_box").html() + $(this).html()));
        }
    });
    $("#reset_button").on("click", () => {
        $(".orderBox").html("");
        transferData.item = [];
        const checkID = $(".this_stock");
        for (let i = 0; i < checkID.length; i++) {
            checkID.eq(i).attr("data-minus-stock", 0);
            stockSet(checkID.eq(i));
        }
        totalSet();
    });
    const pointModalReset = () => {
        $(".point_modal_background").removeClass("displayFlag")
        $("#point_input_box").html("");
        $("#have_stamp").html(`/10`);
        $("#accumulate_stamp").html(`개`);
        $("#stamp_use_button").removeClass("displayFlag");
        $("#stamp_use_button").removeClass("backgroundFlag");
        $("#stamp_use").html("");
        $("#point_deduction").remove();
        transferData.stamp.use = false;
        totalSet();
    }
    $(".point_modal_x_button").on("click", () => {
        pointModalReset();
        transferData.tel = null;
    });
    $(".point_modal_o_button").on("click", () => {
        const optionString = `
                    <div id = "point_deduction" class="option">
                        <p> 스탬프 차감 </p>
                        <p> </p>
                        <p> -5,000원 </p>
                    </div> `
        $(".point_modal_background").removeClass("displayFlag");
        if ($("#stamp_use_button").hasClass("displayFlag backgroundFlag") && $("#point_deduction").length == 0) {
            $(".payment_modal_order_box > aside").append(`
                ${optionString}
            `);
            transferData.stamp.use = true;
        } else if (!$("#stamp_use_button").hasClass("displayFlag backgroundFlag")) {
            $("#point_deduction").remove();
            transferData.stamp.use = false;
        }
        totalSet();
    });
    $(".voucher_modal section:nth-child(4) button:nth-child(2)").on("click", () => {
        let gifticonNumber = 0;

        $("#gifticon_deduction").remove();
        if ($(".gifticon_element").length) {
            for (let i = 0; i < $(".gifticon_element").length; i++) {
                gifticonNumber += drawNumber($(".gifticon_element p:last-child").eq(i).html());
            }
            transferData.payment[0].amount = gifticonNumber;
            //console.log(transferData.payment);
            const optionString = `
                    <div id = "gifticon_deduction" class="option">
                        <p> 기프티콘 차감 </p>
                        <p> </p>
                        <p> -${putComma(gifticonNumber)}원 </p>
                    </div> `
            $(".payment_modal_order_box > aside").append(`
                ${optionString}
            `);
        }
        $(".voucher_modal_background").removeClass("displayFlag");
        totalSet();
    });
    $(".payment_modal_x_button").on("click", () => {
        $(".payment_modal").removeClass("displayFlag");
        $(".spoon_number_plus").parent().children("p").html("0");
        $(".dryice_number_plus").parent().children("p").html("0");
        $(".voucher_modal_background").removeClass("displayFlag")
        $(".gifticon_element").remove();
        pointModalReset();
    });
    $(".option_modal_x_button").on("click", () => $(".modalBackground").removeClass("displayFlag"));
    $("#point_payment").on("click", () => $(".point_modal_background").addClass("displayFlag"));
    $("#voucher_payment").on("click", () => {
        $(".voucher_modal_background").addClass("displayFlag")
        $("#gifticon_price").html(`${putComma(totalAmount)}원`);
    });
    $(".voucher_modal section:nth-child(4) button:nth-child(1)").on("click", () => {
        transferData.payment[0].gifticon = [];
        transferData.payment[0].amount = 0;
        $("#gifticon_deduction").remove();
        $(".voucher_modal_background").removeClass("displayFlag")
        $(".gifticon_element").remove();
        totalSet();
    });
    $("#payment_button").on("click", () => {
        $(".paying_modal_background").addClass("displayFlag");
        $(".paying_modal > section > p").html(`결제금액: ${putComma(totalAmount)}원`);
    });
    $(".paying_modal section:last-child button").on("click", () => $(".paying_modal_background").removeClass("displayFlag"));
    $(".modal2_o_button").on("click", () => $(".modal2WrapBox").removeClass("displayFlag"));
    $(".modal2_x_button").on("click", () => {
        $(".modal2_pay").removeClass("backgroundFlag");
        $(".modal2WrapBox").removeClass("displayFlag");
    });
})();

