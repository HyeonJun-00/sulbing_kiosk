(() => {
    const menuBar1 = $(".menuBar1 li");
    const menuBar2 = $(".menuBar2 li");
    const productListBox = $(".productListBox");
    const productListWrapBox = $(".productListWrapBox");
    const productItem = $(".productItem");
    const transferData = {
        tel: '',
        item: [
        ],
        stamp: { use: false, save: 0 }, // 사용 10, 적립 2
        payment: [
            { id: 0, amount: 0 },
        ],
        take_out: true,
        remark: ''
    };
    const putComma = target => {
        return Number(String(target).replace(/[^0-9]/g, '')).toLocaleString();
    };
    const totalSet = () => {
        let totalAmount = 0;
        let totalCount = 0;

        for (let i = 0; i < transferData.item.length; i++) {
            totalAmount += parseInt(String($(".product_result_price").eq(i).html()).replace(/,/g, ""));
            totalCount += transferData.item[i].cnt
            $(".product_number").eq(i).html(transferData.item[i].cnt)
        }
        console.log(transferData.item);
        $("#total_number").html(`총 수량(${totalCount})`);
        $("#total_amount").html(`${putComma(totalAmount)} 원`);
    }
    let menuBar1_num = 0;
    let menuBar2_num = 0;

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

    $("#result_button").on("click", () => {
        const orderProduct = $(".orderBox").children("div");
        let optionString = "";
        if (!transferData.item.length) {
            return false;
        }
        $("#final_amount").html($("#total_amount").html());
        for (let i = 0; i < orderProduct.length; i++) {
            optionString += `
                                 <div class="option">
                                    <p> ${orderProduct.eq(i).children("p").eq(0).html()} </p>
                                    <p> ${transferData.item[i].cnt}</p>
                                    <p> ${orderProduct.eq(i).children("p").eq(1).html()} </p>
                                </div>           
            `;
            for (let j = 0; j < transferData.item[i].option.length; j++) {
                const a = String(orderProduct.eq(i).children("div").eq(0).children("p").eq(j).html()).split(' ');
                optionString += `
                                <div class="option addOption">
                                    <p> ${a[0]}</p>
                                    <p> ${transferData.item[i].cnt} </p>
                                    <p></p>
                                </div>
                `;
            }
        }
        console.log(orderProduct.eq(0).children("div").eq(0).children("p").eq(0).html());
        $(".payment_modal_order_box > aside").html("");
        $(".payment_modal_order_box > aside").append(`
                                ${optionString}
        `);
        $(".payment_modal").addClass("displayFlag");
    });
    $(".payment_modal_x_button").on("click", () => {
        $(".payment_modal").removeClass("displayFlag");
    });
    let productPrice = 0; 

    productItem.on("click", function() {
        const regex = /[^0-9]/g;

        productPrice = $(this).find(".productPrice").html();
        $(".modalBackground").addClass("displayFlag");
        $(".option_modal_main").html("");
        $(".option_modal_main").append($(this).children().eq(3).html());
        $(".resultPrice").html(`${putComma(productPrice)} 원`);
        $(".optionButton").on("click", function () {
            const result = $(this).html().replace(regex, "");

            if ($(this).hasClass("backgroundFlag")) productPrice = parseInt(String(productPrice).replace(/,/g, "")) - Number(result);
            else productPrice = parseInt(String(productPrice).replace(/,/g, "")) + Number(result);
            $(this).toggleClass("backgroundFlag");
            $(".resultPrice").html(`${putComma(productPrice)} 원`);
        });
        $(".option_modal_x_button").on("click", () => $(".modalBackground").removeClass("displayFlag"));
        $(".add_order_button").on("click", () => {
            const optionId  = [];
            const arrayComparison = (inputArray1, inputArray2) => {
                const arrayLength = inputArray1.length > inputArray2.length ? inputArray1.length : inputArray2.length;

                for (let i = 0; i < arrayLength; i++) {
                    if (inputArray1[i] != inputArray2[i]) return false;
                }
                return true;
            }
            let duplicationCheck = true;
            let optionString = "";

            for (let i = 0; i < $(".optionButton").length; i++) {
                if ($(".optionButton").eq(i).hasClass("backgroundFlag")) {
                    optionId.push($(".optionButton").eq(i).attr("data-option-id"))
                    optionString += `<p>${$(".optionButton").eq(i).html()}</p>`;
                }
            }
            for (let i = 0; i < transferData.item.length; i++) {
                if ($(".option_modal_main p").eq(0).attr("data-product-id") == transferData.item[i].id && arrayComparison(optionId, transferData.item[i].option)) {
                    transferData.item[i].cnt++;
                    duplicationCheck = false ;
                }
            }
            if (duplicationCheck) {
            $(".orderBox").append(`
                    <div>
                        <button class="orderXButton"></button>
                        <img src="${$(this).children().eq(0).attr("src")}" alt="">
                        <p> ${$(this).children().eq(1).html()} </p>
                        <div>
                            ${optionString}
                        </div>
                        <p class="product_result_price"> ${putComma($(".resultPrice").html().replace(regex, ""))} 원 </p>
                        <div>
                            <div> 
                                <button class="product_number_minus"> - </button>
                                <p class="product_number"> 1 </p>
                                <button class="product_number_plus"> + </button>
                            </div> 
                        </div>
                    </div>
            `);
            transferData.item.push({id: $(this).attr("data-product-id"), cnt : 1, option : optionId});
            $(".product_number_minus").off();
            $(".product_number_plus").off();
            $(".orderXButton").off();
            $(".product_number_minus").on("click", function () {
                let productNumber = parseInt($(this).parent().children("p").html());
                const productResultPrice =$(this).parent().parent().parent().children(".product_result_price");
                
                if ( productNumber == 1) {
                    return ;
                } else {
                    productNumber--;
                    productResultPrice.html(putComma(productNumber * (productResultPrice.html().replace(regex, "") / (productNumber + 1))) + " 원");
                    transferData.item[$(this).parent().parent().parent().index()].cnt = productNumber;
                }
                totalSet();
            });
            $(".product_number_plus").on("click", function () {
                let productNumber = $(this).parent().children("p").html();
                const productResultPrice =$(this).parent().parent().parent().children(".product_result_price");

                if ( productNumber == 19999999999999) {
                    return ;
                } else {
                    productNumber++;
                    productResultPrice.html(putComma(productNumber * (productResultPrice.html().replace(regex, "") / (productNumber - 1))) + " 원");
                    transferData.item[$(this).parent().parent().parent().index()].cnt = productNumber;
                }
                totalSet();
            });
            $(".orderXButton").on("click", function () {
                transferData.item.splice($(this).parent().index(), 1);
                $(this).parent().remove();
                totalSet();
            });
        }
            totalSet();
            $(".modalBackground").removeClass("displayFlag");
        });
    });
    $(".option_modal_x_button").on("click", () => $(".modalBackground").removeClass("displayFlag"));
    $(".store_or_packaging").on("click", function() {
        $(".store_or_packaging").removeClass("backgroundFlag");
        $(this).addClass("backgroundFlag");
    });
    $(".dryice_number_minus").on("click", function() {
        const  dryIceNumber = $(this).parent().children("p").html() == 0 ? 0 : $(this).parent().children("p").html() - 5;
        $(this).parent().children("p").html(dryIceNumber)
    });
    $(".dryice_number_plus").on("click", function() {
        const  dryIceNumber = parseInt($(this).parent().children("p").html()) + 5;
        $(this).parent().children("p").html(dryIceNumber)
    });
    $(".spoon_number_minus").on("click", function() {
        const  spoonNumber = $(this).parent().children("p").html() == 0 ? 0 : $(this).parent().children("p").html() - 1;
        $(this).parent().children("p").html(spoonNumber);
    });
    $(".spoon_number_plus").on("click", function() {
        const  spoonNumber = parseInt($(this).parent().children("p").html()) + 1;
        $(this).parent().children("p").html(spoonNumber);
    });
    $(".modal2_pay").on("click", function () {
        $(".modal2_pay").removeClass("backgroundFlag");
        $(this).addClass("backgroundFlag");
    });
    $(".point_modal_x_button").on("click", () => {
        $(".point_modal_background").removeClass("displayFlag");
    });
    $("#reset_button").on("click", () => {
        $(".orderBox").html("")
        transferData.item = [];
        totalSet();
    });
    $("#point_payment").on("click", () => {
        $(".point_modal_background").addClass("displayFlag");
    });
    $(".modal2_x_button").on("click", () => {
        $(".modal2_pay").removeClass("backgroundFlag");
        $(".modal2WrapBox").removeClass("displayFlag");
    });
    $(".modal2_o_button").on("click", () => {
        $(".modal2WrapBox").removeClass("displayFlag");
    });
    $("#pay_payment").on("click", () => {
        $(".modal2WrapBox").addClass("displayFlag");
    });
})();

