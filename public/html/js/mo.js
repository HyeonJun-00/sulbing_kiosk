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



    $( `.userResetBtn` ).on( `click`, e => { // 추가 셀 내용 삭제
        $( `.userInsertRow [name=name]` ).val( `` );
        $( `.userInsertRow [name=tel]` ).val( `` );
        $( `.userInsertRow [name=sex]` ).val( `M` ).prop( `selected`, true );
        $( `.userInsertRow [name=birth_date]` ).val( `` );
        $( `.userInsertRow [name=auth]` ).val( `N` ).prop( `selected`, true );
        $( `.userInsertRow [name=remark]` ).val( `` );
    });

    document.querySelector( `.userInsertBtn` )
        .addEventListener( `click`, e => { // 회원 추가
       alert();
    });

    [...document.querySelectorAll( `.userReadRow` )].forEach( v => {
        v.querySelector( `.userUpdateBtn` ).disabled= true;
        v.addEventListener( `dblclick`, e => {
            let target = e.currentTarget.querySelector( `.userUpdateBtn` );
            target.disabled = false;
        })
    });
    document.querySelector( `.userUpdateBtn` )
        .addEventListener( `click`, e => { // 사용자 수정 완료

        });
    document.querySelector( `.userDeleteBtn` )
        .addEventListener( `click`, e => { // 사용자 삭제

    });
})();

