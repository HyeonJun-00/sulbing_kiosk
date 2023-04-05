(() => {
    const   mainMenu = $(".mainMenu li");
    const   productInventory = $(".productInventory div:first-child > button");

    for (i = 1; i < mainMenu.length; i++) {
        mainMenu.eq(i).on("click", function () {
            mainMenu.removeClass("backgroundFlag");
            $(this).addClass("backgroundFlag");
            $(".mainDisplay > section").removeClass("displayFlag");
            $(".mainDisplay > section").eq($(this).index() - 1).addClass("displayFlag");
        });
    }
    console.log(productInventory.length);
    for (i = 0; i < productInventory.length; i++) {
        productInventory.eq(i).on("click", function () {
            productInventory.removeClass("borderFlag");
            $(this).addClass("borderFlag");
            $(".productInventory div").removeClass("displayFlag");
            $(".productInventory div").eq($(this).index() + 1).addClass("displayFlag");
        });
    }
})();

