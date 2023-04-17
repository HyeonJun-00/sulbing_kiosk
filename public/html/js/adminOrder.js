( loadJs= () => {
    const offset = 1000 * 60 * 60 * 9;
    ( !document.querySelector( `#searchDay` ).value ) && ( document.querySelector( `#searchDay` ).valueAsDate= new Date(( new Date() ).getTime() + offset ) );

    let searchPaging= async ( targetPaging= 0, targetStatus= 'all' ) => {
        const targetDay= document.querySelector( `#searchDay` ).value;
        try {
            const res= await axios.post( `/admin_order`, { targetDay, targetStatus, targetPaging } );
            document.querySelector( `.orderReadRowSet` ).innerHTML= ``;
            let tempHtml= ``;
            if( res.data.readPost.length > 0 ) {
                let rowStatusObj= { wait: `orderWait`, complete: ``, refund: `orderRefund` };
                let statusObj= { wait: '대기', complete: '완료', refund: '환불' };
                let proPostObj= {};
                let optionObj = {};
                let payPostObj= {};
                res.data.productPost.forEach( pP => {
                    ( !proPostObj[pP.id] ) && ( proPostObj[pP.id]= [] );
                    ( !pP.dif_id && !pP['option'] ) && ( pP['option'] = [] );
                    ( !pP.dif_id ) && ( proPostObj[pP.id].push( pP ) );
                    ( pP.dif_id && !optionObj[pP.dif_id] ) && ( optionObj[pP.dif_id]= [] );
                    ( pP.dif_id ) && ( optionObj[pP.dif_id].push( pP ) );
                });
                res.data.paymentPost.forEach( pP => {
                    ( !payPostObj[pP.id] ) && ( payPostObj[pP.id]= [] );
                    payPostObj[pP.id].push( pP );
                })
                res.data.readPost.forEach((v, i) => {
                    let tempChildRow = ``;
                    proPostObj[v.id].forEach( ( pP, pI ) => {
                        tempChildRow += `
                            <ul class="orderColSet productColSet">
                                <li>${( pI + 1 ) + `. ` + pP.product_name}</li>
                                <li>${pP.product_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</li>
                                <li>${`수량: ` + pP.item_cnt}</li>
                            </ul>`;
                        if( optionObj[pP.item_id] ) {
                            optionObj[pP.item_id].forEach( oP => {
                                tempChildRow += `
                                    <ul class="orderColSet optionColSet">
                                        <li>${'- ' + oP.option_name}</li>
                                        <li>${oP.option_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</li>
                                        <li></li>
                                    </ul>`;
                            });
                        }
                    });
                    payPostObj[v.id].forEach( pP => {
                        tempChildRow += `
                            <ul class="orderColSet paymentColSet">
                                <li>${pP.name}</li> 
                                <li>${`결제 금액: ` + pP.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</li> 
                                <li>${`할인율: ` + pP.discount + `%`}</li> 
                                <li>${`수수료: ` + pP.charge + `%`}</li> 
                            </ul>
                        `;
                    });
                    tempHtml +=
                        `<li class="orderReadRow">
                        <form>
                            <ul class="orderColSet ${ rowStatusObj[v.status] }">
                                <li>${i + 1}
                                    <input type="hidden" name="id" data-origin-value="${v.id}" value="${v.id}"> 
                                </li>
                                <li>${v.id.toString().slice( -3 ).padStart( 3, '0' )}</li>                    
                                <li>${statusObj[v.status]}</li>
                                <li>${v.total_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</li>
                                <li>${v.total_discount}</li>
                                <li>${v.total_charge}</li>
                                <li>${( v.use_stamp )? 'Y': '-'}</li>
                                <li>${v.final_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</li>
                                <li>${( v.save_stamp )? v.save_stamp: '-'}</li>
                                <li>${( v.take_out == '' )? '매장': '포장'}</li>
                                <li>
                                    <input name="remark" data-origin-value="${(v.remark) ? v.remark : ''}" value="${(v.remark) ? v.remark : ''}" disabled>
                                    <input class="remarkUpdateBtn" type="button" data-origin-value="수정" value="수정" disabled>
                                </li>
                                <li>${( v.user_tel )? v.user_tel: '-'}</li> 
                                <li>${v.purchase_date}</li>
                                <li>${( v.refund_date )? v.refund_date: '-'}</li>
                                <li>
                                    <input class="fixCol" type="button" value="완료" data-change-status="complete" ${ v.status == 'refund'? 'disabled': '' }>                            
                                </li>
                                <li>
                                    <input class="fixCol" type="button" value="대기" data-change-status="wait" ${ v.status == 'refund'? 'disabled': '' }>                            
                                </li>
                                <li>
                                    <input class="fixCol" type="button" value="환불" data-change-status="refund" ${ v.status == 'refund'? 'disabled': '' }>                            
                                </li>
                            </ul>
                            ${ tempChildRow }
                        </form>
                    </li>`;
                });
            } else {
                tempHtml= `<li class="emptyRow">게시물이 존재하지 않습니다.</li>`;
            }
            loadJs();
            [...document.querySelectorAll( `.searchBox > input[type=button]` )].forEach( v => {
                v.classList.remove( `targetStatus` );
                ( v.getAttribute( `data-status` ) == targetStatus ) && ( v.classList.add( `targetStatus` ) );
            });
            document.querySelector( `.orderReadRowSet` ).innerHTML= tempHtml;
            document.querySelector( `.tablePaging` ).innerHTML= ``;
            console.log( res.data.orderTotCnt[0].cnt, res.data.nowPage );
            let pageCnt= ( ( ( res.data.orderTotCnt[0].cnt / 10 ) -1 ) < 1 )? 1 : ( res.data.orderTotCnt[0].cnt / 10 ) - 1;
            console.log( pageCnt );
            for( let i= 0; i < pageCnt; i++ ) {
                document.querySelector( `.tablePaging` ).innerHTML+= `<a data-page-idx=${ i } data-page=${ i == res.data.nowPage }>${ i + 1 }</a>`;
            }
            //loadJs();
        } catch ( err ) {
            console.error( err );
        }
    }

    [...document.querySelectorAll( `.orderReadRow` )].forEach( ( v, i, a) => {
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
                v.classList.add( `modifyMode` );
            });
        }
        v.onclick= e => {
            if( !e.currentTarget.classList.contains( `modifyMode` ) ) {
                a.forEach( vRow => {
                    [...vRow.querySelectorAll( `input:not( .fixCol ), select` )].forEach( vi => {
                        vi.disabled = true;
                        vi.value= vi.getAttribute( `data-origin-value` );
                        vRow.classList.remove( `modifyMode` );
                    });
                });
            }
        }
    });

    [...document.querySelectorAll( `a[data-page-idx]` )].forEach( v => {
        v.onclick= e => {
            let targetStatus= document.querySelector( `.targetStatus` ).getAttribute( `data-status` );
            searchPaging( e.target.getAttribute(`data-page-idx`), targetStatus );
        }
    });
    [...document.querySelectorAll( `.searchBox > input[type=button]` )].forEach( v => {
        v.onclick= e => {
            let targetStatus= e.target.getAttribute( `data-status` );
            let nowPage= document.querySelector( `a[data-page=true]` ).getAttribute( `data-page-idx` );
            searchPaging( nowPage, targetStatus );
        }
    });
    document.querySelector(`#searchDay`).onchange = () => {
        let targetStatus = document.querySelector(`.targetStatus`).getAttribute(`data-status`);
        let nowPage = document.querySelector(`a[data-page=true]`).getAttribute(`data-page-idx`);
        searchPaging(nowPage, targetStatus);
    }

    [...document.querySelectorAll( `.remarkUpdateBtn` )].forEach( ( v, i ) => {
        v.onclick= e => { // 사용자 수정 완료
            modalCon(`주문 정보(메모)를 수정하시겠습니까?`);
            resultCon(`remarkUpdate`, document.querySelector( `.orderReadRow:nth-of-type( ${ i + 1 } ) [name=id]` ).value );
        }
    });
    [...document.querySelectorAll( `.orderReadRow .fixCol` )].forEach( ( v, i ) => {
        v.onclick= e => { // 사용자 수정 완료
            modalCon(`주문 상태를 ${ e.target.value }로 변경하시겠습니까?`);
            resultCon( e.target.getAttribute( 'data-change-status' ), e.target.parentElement.parentElement.querySelector( `[name=id]` ).value );
        }
    });
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
                    let modeClassArr= { wait: `orderWait`, complete: ``, refund: `orderRefund` };
                    let modeTextArr= { wait: `대기`, complete: `완료`, refund: `환불` };
                    switch ( qMode ) {
                        case 'remarkUpdate':
                            let targetElem= document.querySelector( `.modifyMode [name=remark]` );
                            let afterRemark= targetElem.value.trim();
                            if( await axios.post( `/admin_order/remarkUpdate`, { id: tId, remark: afterRemark } ) ) {
                                targetElem.setAttribute( `data-origin-value`, afterRemark );
                                targetElem.value= afterRemark;
                                targetElem.disabled= true;
                                document.querySelector(`.modifyMode`).classList.remove(`modifyMode`);
                            }
                            break;
                        case 'wait':
                        case 'complete':
                        case 'refund':
                            if( await axios.post( `/admin_order/statusUpdate`, { id: tId, orderMode: qMode } ) ) {
                                let targetRow= document.querySelector( `.orderReadRow input[name=id][data-origin-value="${ tId }"]` ).parentElement.parentElement;
                                targetRow.querySelector( `li:nth-of-type(3)` ).innerHTML= modeTextArr[qMode];
                                targetRow.setAttribute( `class`, `orderColSet` );
                                ( qMode != 'complete' ) && ( targetRow.classList.add( modeClassArr[qMode] ) );
                                [...targetRow.querySelectorAll( `input.fixCol` )].forEach( v => {
                                    if( qMode == `refund` ) { v.disabled= true; }
                                    else { v.removeAttribute( `disabled` ); }
                                });
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