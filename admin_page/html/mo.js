(() => {
    const   mainMenu = $(".mainMenu li");

    for (i = 1; i < mainMenu.length; i++) {
        mainMenu.eq(i).on("click", function () {
            $(".mainDisplay section").removeClass("displayFlag");
            $(".mainDisplay section").eq($(this).index() - 1).addClass("displayFlag");
        });
    }
})();

