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

    //////////////////////////////////////////////////////////////////////////// 회원 관리
    document.querySelector( `#searchTelForm` ).addEventListener( `submit`, async e => {
        e.preventDefault();
        const searchTel= e.target.querySelector( `#searchTel` ).value;

        try {
            const res= await axios.post( `/admin_user/getSearchTel`, { searchTel } );
            console.log( res.data );
        } catch ( err ) {
            console.error( err );
        }
    });

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
    [...document.querySelectorAll( `.userUpdateBtn` )].forEach( ( v, i, a ) => {
        v.addEventListener( `click`, async e => { // 사용자 수정 완료
            modalCon( `사용자 정보를 수정하시겠습니까?` );
            const targetValue= {};
            [...document.querySelectorAll( `.modifyMode input, .modifyMode select` )].forEach( v => { targetValue[ v.getAttribute( `name` )] = v.value } );
            console.log( targetValue );
            //const res= await axios.post( `/admin_user/update`, targetValue );
        });
    });
    document.querySelector( `.userDeleteBtn` )
        .addEventListener( `click`, e => { // 사용자 삭제

    });
    let modalCon= ( tCon ) => {
        document.querySelector( `#modalConfirmBak > .modalConfirm > p` ).innerText= tCon;
        document.querySelector( `#modalConfirmBak` ).style.display= `block`;

        let conResult= () => {
            document.querySelector(`.modalBtn` ).addEventListener(`click`, e => {
                alert(1);
            });
        }
        conResult();
    }
})();

