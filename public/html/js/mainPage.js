(() => {
    
    const menuBar1 = $(".menuBar1 li");
    const menuBar2 = $(".menuBar2 li");

//    console.log($(".menuBar2 li").eq(1).children(1));
    for (let i = 0; i < menuBar1.length; i++) {
        menuBar1.eq(i).on("click",  function () {
            menuBar1.removeClass("backgroundFlag");
            $(this).addClass("backgroundFlag");
            menuBar2.removeClass("displayFlag");
            menuBar2.eq($(this).index()).addClass("displayFlag");
            menuBar2.children().removeClass("backgroundFlag");
            menuBar2.eq($(this).index()).children().eq(0).addClass("backgroundFlag");
        });
    }
    for (let i = 0; i < menuBar2.length; i++) {
        for (let j = 0; j < menuBar2.eq(i).length; j++) {
            menuBar2.eq(i).children(j).on("click", function () {
                menuBar2.children().removeClass("backgroundFlag");
                $(this).addClass("backgroundFlag");
            });
        }
        menuBar2.eq(i).on("click", function() {
            menuBar2.removeClass("displayFlag");
            $(this).addClass("displayFlag");
        });
    }

})();

