( loadJs= () => {
    document.querySelector( `#searchDay` ).valueAsDate= new Date();

    let searchPaging= async ( targetPaging= 0, targetStatus= 'all' ) => {
        const targetDay= document.querySelector( `#searchDay` ).value;
        try {
            const res= await axios.post( `/admin_order`, { targetDay, targetStatus } );
            document.querySelector( `.orderReadRowSet` ).innerHTML= ``;
            let tempHtml= ``;
            if( res.data.readPost.length > 0 ) {
                res.data.readPost.forEach((v, i) => {
                    tempHtml +=
                        `<li class="orderReadRow">
                        <form>
                            <ul class="userColSet">
                                <li> ${i + 1}
                                    <input type="hidden" name="id" data-origin-value="${v.id}" value="${v.id}"> 
                                </li>                        
                                <li>
                                    <input type="text" name="name" data-origin-value="${(v.name) ? v.name : ''}" value="${(v.name) ? v.name : ''}" require disabled>
                                </li>
                                <li>
                                    <input type="text" name="tel" data-origin-value="${v.tel}" value="${v.tel}" require disabled>
                                </li>
                                <li>
                                    <select name="sex" data-origin-value="${v.sex}" disabled>
                                        ${tempSex}
                                    </select>
                                </li>
                                <li>
                                    <input type="date" name="birth_date" data-origin-value="${v.birth_date}" value="${v.birth_date}" disabled>
                                </li>
                                <li>
                                    <input type="number" class="fixCol" name="stamp" data-origin-value="${v.stamp}" value="${v.stamp}" disabled>
                                </li>
                                <li>
                                    <select name="auth" data-origin-value="${v.auth}" disabled>
                                        ${tempAuth}    
                                    </select>
                                </li>
                                <li>${(v.created_date) ? v.created_date : ''}</li>
                                <li>${(v.join_date) ? v.join_date : ''}</li>
                                <li>
                                    <input type="text" name="remark" data-origin-value="${(v.remark) ? v.remark : ''}" value="${(v.remark) ? v.remark : ''}" disabled>
                                </li>
                                <li>
                                    <input class="userUpdateBtn" type="button" data-origin-value="수정" value="수정" disabled>                            
                                </li>
                                <li>
                                    <input class="userDeleteBtn fixCol" type="button" data-origin-value="삭제" value="삭제">                            
                                </li>
                            </ul>
                        </form>
                    </li>`;
                });
            } else {
                tempHtml= `<li class="emptyRow">게시물이 존재하지 않습니다.</li>`;
            }
            document.querySelector( `.userReadRowSet` ).innerHTML= tempHtml;
            document.querySelector( `.tablePaging` ).innerHTML= ``;
            let pageCnt= ( ( res.data.userTotCnt[0].cnt / 10 ) < 1 )? 1 : ( res.data.userTotCnt[0].cnt / 10 ) - 1;
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
            alert();
            //searchPaging( e.target.getAttribute(`data-page-idx`) );
        }
    });
})();