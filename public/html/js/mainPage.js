(() => {

    const menuBar1 = $(".menuBar1 li");
    const menuBar2 = $(".menuBar2 li");
    const productListBox = $(".productListBox");
    const productListWrapBox = $(".productListWrapBox");
    let   menuBar1_num = 0;
    let   menuBar2_num = 0;

    menuBar1.eq(0).addClass("backgroundFlag");
    menuBar2.eq(0).addClass("displayFlag");
    productListWrapBox.eq(0).addClass("displayFlag");
    productListBox.eq(0).addClass("displayFlag");
    menuBar2.eq(0).children().eq(0).addClass("backgroundFlag");
    
    for (let i = 0; i < menuBar1.length; i++) {
        menuBar1.eq(i).on("click",  function () {
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
    }
    for (let i = 0; i < menuBar2.length; i++) {
        menuBar2.eq(i).children().on("click", function () {
            menuBar2_num = $(this).index();
            menuBar2.children().removeClass("backgroundFlag");
            $(this).addClass("backgroundFlag");
            productListWrapBox.eq(menuBar1_num).children().removeClass("displayFlag");
            productListWrapBox.eq(menuBar1_num).children().eq(menuBar2_num).addClass("displayFlag");
        });
        menuBar2.eq(i).on("click", function () {
            menuBar2.removeClass("displayFlag");
            $(this).addClass("displayFlag");
        });
    }


})();

