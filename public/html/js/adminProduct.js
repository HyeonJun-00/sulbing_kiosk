( loadJs= () => {

    let searchFunc= () => {
        let targetRow= [...document.querySelectorAll( `.productReadRow` )];
        let searchVIn= [...document.querySelectorAll( `.productSearchRow input` )];
        let searchRow = document.querySelector(`.productSearchRow`);
        return ( e ) => {
            targetRow.forEach( v => {
                if(
                    v.querySelector( `[name=${ searchVIn[0].getAttribute('name')}]` ).value.match( searchRow.querySelector( `[name=${ searchVIn[0].getAttribute('name')}]` ).value ) &&
                    v.querySelector( `[name=${ searchVIn[1].getAttribute('name')}]` ).value.match( searchRow.querySelector( `[name=${ searchVIn[1].getAttribute('name')}]` ).value ) &&
                    v.querySelector( `[name=${ searchVIn[2].getAttribute('name')}]` ).value.match( searchRow.querySelector( `[name=${ searchVIn[2].getAttribute('name')}]` ).value ) &&
                    v.querySelector( `[name=${ searchVIn[3].getAttribute('name')}]` ).value.match( searchRow.querySelector( `[name=${ searchVIn[3].getAttribute('name')}]` ).value ) &&
                    ( Number( v.querySelector( `[name=${ searchVIn[4].getAttribute('name')}]` ).value ) <= Number( searchRow.querySelector( `[name=${ searchVIn[4].getAttribute('name')}]` ).value ) ||
                        searchRow.querySelector( `[name=${ searchVIn[4].getAttribute('name')}]` ).value == '' )&&
                    v.querySelector( `[name=${ searchVIn[5].getAttribute('name')}]` ).value.match( searchRow.querySelector( `[name=${ searchVIn[5].getAttribute('name')}]` ).value ) &&
                    v.querySelector( `[name=${ searchVIn[6].getAttribute('name')}]` ).value.match( searchRow.querySelector( `[name=${ searchVIn[6].getAttribute('name')}]` ).value ) &&
                    v.querySelector( `[name=${ searchVIn[7].getAttribute('name')}]` ).value.match( searchRow.querySelector( `[name=${ searchVIn[7].getAttribute('name')}]` ).value )
                ) {
                    v.style.display= `block`;
                } else v.style.display= `none`;
            })
        };
    }

    let searchInput= [...document.querySelectorAll( `.productSearchRow input` )];
    searchInput.forEach( v => v.oninput= searchFunc() );

    [...document.querySelectorAll( `.productReadRow` )].forEach( ( v, i, a) => {
        v.ondblclick= e => {
            /*a.forEach( vRow => {
                [...vRow.querySelectorAll( `input:not( .fixCol ), select` )].forEach( vi => {
                    vi.disabled = true;
                    vi.value= vi.getAttribute( `data-origin-value` );
                    vRow.classList.remove( `modifyMode` );
                });
            });*/
            [...e.currentTarget.querySelectorAll( `input:not( .fixCol ), select` )].forEach( vi => {
                vi.disabled = false;
                ( vi.getAttribute( `name` ) == `price` ) && ( vi.setAttribute( `type`, `number` ) );
                ( vi.getAttribute( `name` ) == `view_price` ) && ( vi.setAttribute( `type`, `hidden` ) );
                v.classList.add( `modifyMode` );
            });
        }
        v.onclick= e => {
            if( !e.currentTarget.classList.contains( `modifyMode` ) ) {
                a.forEach( vRow => {
                    [...vRow.querySelectorAll( `input:not( .fixCol ), select` )].forEach( vi => {
                        vi.disabled = true;
                        ( vi.getAttribute( `name` ) == `price` ) && ( vi.setAttribute( `type`, `hidden` ) );
                        ( vi.getAttribute( `name` ) == `view_price` ) && ( vi.setAttribute( `type`, `text` ) );
                        vi.value= vi.getAttribute( `data-origin-value` );
                        vRow.classList.remove( `modifyMode` );
                    });
                });
            }
        }
    });

    [...document.querySelectorAll( `.productUpdateBtn` )].forEach( ( v, i, a ) => {
        v.onclick= e => { // 사용자 수정 완료
            modalCon(`상품 정보를 수정하시겠습니까?`);
            resultCon(`update`);
        }
    });

    document.querySelector( `.searchResetBtn` ).onclick= () => {
        [...document.querySelectorAll( `.productSearchRow input` )].forEach( v => {
            v.value= ``;
        });
        [...document.querySelectorAll( `.productReadRow` )].forEach( v => {
            v.style.display= `block`;
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
                document.querySelector( `.productSearchRow [name=menuLv2Name]` ).value= '';
                [...document.querySelectorAll( `.menuLv2` )].forEach( ( v2, i2 ) => {
                    if( i == i2 ) { v2.classList.add( `active` );
                    } else {
                        v2.classList.remove( `active` );
                    }
                })
            } else {
                document.querySelector( `.productSearchRow [name=menuLv2Name]` ).value= e.target.innerHTML;
                document.querySelector( `.productSearchRow [name=menuLv1Name]` ).value= document.querySelector( '[data-lv1-id=' + `"${ e.target.getAttribute( 'data-lv2-pid' )}"` + ']' ).innerHTML;
            }
            searchFunc()();
        }
    });

    [...document.querySelectorAll( `input[type=button][data-event-mode$=active]` )].forEach( v => {
        v.onclick = e => {
            modalCon(`해당 상품을 ${ e.target.value } 상태로 변경하시겠습니까?`);
            resultCon( e.target.getAttribute( `data-event-mode` ), e.target.parentElement.parentElement.querySelector( `[name=id]` ).value );
        }
    });

    [...document.querySelectorAll( `input[data-event-mode=option]` )].forEach( v => {
        v.onclick= e => {
            let targetId= e.target.parentElement.parentElement.querySelector( `[name=id]` ).value;
            let targetName= e.target.parentElement.parentElement.querySelector( `[name=name]` ).value;
            let targetOption= e.target.parentElement.parentElement.querySelector( `.hiddenOption` );
            modalOptionCon( targetName, targetOption );
            resultOptionCon( targetId );
        }
    });

    let modalOptionCon= ( tCon, tOp ) => { // 모달
        document.querySelector( `.modalOptionBak .productTitle` ).innerText= tCon;
        document.querySelector( `.modalOptionBak` ).style.display= `block`;
        [...document.querySelectorAll( `.optionList [data-modal-option-id]` )].forEach( ( v, i ) => {
            if( tOp.querySelector( `[data-option-id="${ v.getAttribute( 'data-modal-option-id' ) }"]` ) ) {
                v.querySelector( `[type=checkbox]` ).checked= true;
            } else {
                v.querySelector( `[type=checkbox]` ).checked= false;
            }
        });
    };

    let resultOptionCon= ( tId ) => {
        [...document.querySelectorAll(`.modalOptionBtn`)].forEach( v => {
            v.onclick= async e => {
                document.querySelector(`.modalOptionBak`).style.display = `none`;
                if( e.target.getAttribute(`data-modal-option` ) ) {
                    let sql= ``;
                    [...document.querySelectorAll( `.optionList [data-modal-option-id]` )].forEach( vOp => {
                        if( vOp.querySelector( `[type=checkbox]` ).checked ) {
                            sql+= `insert into product_option ( product_id, product_option_cmm_id )
                                    select ${ tId }, ${ vOp.getAttribute( 'data-modal-option-id' ) } from dual
                                    where not exists 
                                        ( select id from product_option where
                                            product_id= ${ tId } and
                                            product_option_cmm_id= ${ vOp.getAttribute( 'data-modal-option-id' ) });`;
                        } else {
                            sql+= `delete from product_option
                                    where product_id= ${ tId } and
                                            product_option_cmm_id= ${ vOp.getAttribute( 'data-modal-option-id' ) };`;
                        }
                    });
                    const res= await axios.post( `/admin_product/optionUpdate`, { sql, tId } );
                    let targetElm= document.querySelector( `.productReadRow [name=id][value="${ tId }"]` ).parentElement.parentElement.querySelector( `.hiddenOption` );
                    let optionObj= {};
                    let tempHtml= ``;
                    res.data.targetOption.forEach( v => {
                        ( !optionObj[v.category] ) && ( optionObj[v.category]= [] );
                        optionObj[v.category].push( { id: v.option_id, name: v.name } );
                    });
                    for( let v in optionObj ) {
                        tempHtml+= `<ul data-option-category="${ v }">`
                        for( let vV in optionObj[v] ) {
                            tempHtml+= `<li data-option-id="${ optionObj[v][vV].id }"><span data-option-name="${ optionObj[v][vV].name }"></span></li>`;
                            console.log( optionObj[v][vV] );
                        }
                        tempHtml+= `</ul>`
                    };
                    targetElm.innerHTML= tempHtml;
                }
            }
        });
    }

    let modalCon= ( tCon, conM= true ) => { // 모달
        document.querySelector( `#modalConfirmBak > .modalConfirm > p` ).innerText= tCon;
        document.querySelector( `#modalConfirmBak` ).style.display= `block`;
        document.querySelector( `.modalBtn[data-modal-confirm]` ).style.display= 'block';
        ( !conM ) && ( document.querySelector( `.modalBtn[data-modal-confirm]` ).style.display= 'none' );
    };

    let resultCon= ( qMode, tId= null ) => {
        [...document.querySelectorAll(`.modalBtn`)].forEach( v => {
            v.onclick= async e => {
                document.querySelector(`#modalConfirmBak`).style.display = `none`;
                if( e.target.getAttribute(`data-modal-confirm`) ) {
                    switch ( qMode ) {
                        case `active`:
                        case `inactive`:
                            if( await axios.post( `/admin_product/isActive`, { id: tId, isActive: qMode } ) ) {
                                let targetRow= document.querySelector( `.productReadRow input[name=id][data-origin-value="${ tId }"]` ).parentElement.parentElement;
                                targetRow.setAttribute( `data-use`, qMode );
                            }
                            break;
                        case `update`:
                            targetValue = {};
                            [...document.querySelectorAll(`.modifyMode input`)].forEach(v => {
                                targetValue[v.getAttribute(`name`)] = v.value.trim();
                            });
                            if( targetValue.name.trim() == '' ) {
                                modalCon( `상품명을 입력해주세요.`, false );
                                return false;
                            }
                            if( await axios.post( `/admin_product/update`, targetValue ) ) {
                                [...document.querySelectorAll(`.modifyMode input:not( .fixCol ), .modifyMode select`)].forEach(v => {
                                    ( v.getAttribute(`name`) == `name`) && (v.setAttribute(`data-origin-value`, targetValue.name) );
                                    ( v.getAttribute(`name`) == `price`) && (v.setAttribute(`data-origin-value`, targetValue.price != '' ? targetValue.price : 0) );
                                    ( v.getAttribute(`name`) == `view_price`) && (v.setAttribute(`data-origin-value`, targetValue.price != '' ? targetValue.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0) );
                                    ( v.getAttribute(`name`) == `discount`) && (v.setAttribute(`data-origin-value`, targetValue.discount != '' ? targetValue.discount : 0) );
                                    ( v.getAttribute(`name`) == `stock`) && (v.setAttribute(`data-origin-value`, targetValue.stock != '' ? targetValue.stock : 0) );
                                    ( v.getAttribute(`name`) == `description`) && (v.setAttribute(`data-origin-value`, targetValue.description) );
                                    ( v.getAttribute(`name`) == `allergy`) && (v.setAttribute(`data-origin-value`, targetValue.allergy) );
                                    if( targetValue.stock == 0 || targetValue.stock == '' ) {
                                        v.parentElement.parentElement.setAttribute(`data-stock`, `soldout` );
                                    } else { v.parentElement.parentElement.setAttribute(`data-stock`, `` ) }
                                    ( v.getAttribute( `name` ) == `price` ) && ( v.setAttribute( `type`, `hidden` ) );
                                    ( v.getAttribute( `name` ) == `view_price` ) && ( v.setAttribute( `type`, `text` ) );
                                    v.disabled = true;
                                    v.value = v.getAttribute(`data-origin-value`);
                                });
                                document.querySelector(`.modifyMode`).classList.remove(`modifyMode`);
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        });
    }

})();