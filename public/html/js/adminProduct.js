( loadJs= () => {

    document.querySelector( `.searchResetBtn` ).onclick= () => {
        [...document.querySelectorAll( `.productSearchRow input` )].forEach( v => {
            v.value= '';
        });
    }

    [...document.querySelectorAll( `.menuSet li` )].forEach( ( v, i, a ) => {
        v.onclick = e => {
            if( e.target.hasAttribute( `data-lv1-id` ) ) {
                a.forEach( v1 => {
                    v1.classList.remove( `active` );
                });
                e.target.classList.add( `active` );
                document.querySelector( `.productSearchRow [name=menuLv1Name]` ).value= e.target.innerHTML;
                [...document.querySelectorAll( `.menuLv2` )].forEach( ( v2, i2 ) => {
                    if( i == i2 ) { v2.classList.add( `active` );
                    } else {
                        v2.classList.remove( `active` );
                    }
                })
            } else {
                document.querySelector( `.productSearchRow [name=menuLv2Name]` ).value= e.target.innerHTML;
            }
        }
    });

})();