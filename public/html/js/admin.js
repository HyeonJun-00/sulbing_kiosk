(() => {
    /*
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
    }*/

    $( `.userResetBtn` ).on( `click`, e => { // 추가 셀 내용 삭제
        $( `.userInsertRow [name=name]` ).val( `` );
        $( `.userInsertRow [name=tel]` ).val( `` );
        $( `.userInsertRow [name=sex]` ).val( `M` ).prop( `selected`, true );
        $( `.userInsertRow [name=birth_date]` ).val( `` );
        $( `.userInsertRow [name=auth]` ).val( `N` ).prop( `selected`, true );
        $( `.userInsertRow [name=remark]` ).val( `` );
    });

    //////////////////////////////////////////////////////////////////////////// 회원 관리
    document.querySelector( `.userInsertBtn` )
        .addEventListener( `click`, e => { // 회원 추가
       alert();
    });

    [...document.querySelectorAll( `.userReadRow` )].forEach( ( v, i, a) => {
        v.addEventListener( `dblclick`, e => {
            a.forEach( vRow => {
                [...vRow.querySelectorAll( `input:not( .fixCol ), select` )].forEach( vi => {
                    vi.disabled = true;
                    vi.value= vi.getAttribute( `data-origin-value` );
                    vRow.classList.remove( `modifyMode` );
                });
            });
            [...e.currentTarget.querySelectorAll( `input:not( .fixCol ), select` )].forEach( vi => {
                vi.disabled = false;
                v.classList.add( `modifyMode` );
            });
        });
        v.addEventListener( `click`, e => {
            if( !e.currentTarget.classList.contains( `modifyMode` ) ) {
                a.forEach( vRow => {
                    [...vRow.querySelectorAll( `input:not( .fixCol ), select` )].forEach( vi => {
                        vi.disabled = true;
                        vi.value= vi.getAttribute( `data-origin-value` );
                        vRow.classList.remove( `modifyMode` );
                    });
                });
            }
        });
    });
    document.querySelector( `.userUpdateBtn` )
        .addEventListener( `click`, e => { // 사용자 수정 완료

        });
    document.querySelector( `.userDeleteBtn` )
        .addEventListener( `click`, e => { // 사용자 삭제

    });
})();

