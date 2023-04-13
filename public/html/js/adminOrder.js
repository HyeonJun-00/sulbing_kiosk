( loadJs= () => {
    document.querySelector( `#searchDay` ).valueAsDate= new Date();

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
                                    <input data-origin-value="${(v.remark) ? v.remark : ''}" value="${(v.remark) ? v.remark : ''}" disabled>
                                    <input class="remarkUpdateBtn" type="button" value="수정" disabled>
                                </li>
                                <li>${( v.user_tel )? v.user_tel: '-'}</li> 
                                <li>${v.purchase_date}</li>
                                <li>${( v.refund_date )? v.refund_date: '-'}</li>
                                <li>
                                    <input class="completeBtn" type="button" value="완료">                            
                                </li>
                                <li>
                                    <input class="waitBtn" type="button" value="대기">                            
                                </li>
                                <li>
                                    <input class="refundBtn" type="button" value="환불">                            
                                </li>
                            </ul>
                            ${ tempChildRow }
                        </form>
                    </li>`;
                });
            } else {
                tempHtml= `<li class="emptyRow">게시물이 존재하지 않습니다.</li>`;
            }

            document.querySelector( `.orderReadRowSet` ).innerHTML= tempHtml;
            document.querySelector( `.tablePaging` ).innerHTML= ``;
            let pageCnt= ( ( res.data.orderTotCnt[0].cnt / 10 ) < 1 )? 1 : ( res.data.orderTotCnt[0].cnt / 10 ) - 1;
            for( let i= 0; i < pageCnt; i++ ) {
                document.querySelector( `.tablePaging` ).innerHTML+= `<a data-page-idx=${ i } data-page=${ i == res.data.nowPage }>${ i + 1 }</a>`;
            }
            loadJs();
        } catch ( err ) {
            console.error( err );
        }
    }

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
})();