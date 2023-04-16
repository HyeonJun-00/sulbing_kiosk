( loadJs= () => {
    //////////////////////////////////////////////////////////////////////////// 회원 관리
    let searchPaging= async ( targetPaging= 0 ) => {
        const searchTel= document.querySelector( `#searchTel` ).value.trim();
        try {
            const res= await axios.post( `/admin_user`, { searchTel, targetPaging } );
            document.querySelector( `.userReadRowSet` ).innerHTML= ``;
            let tempHtml= ``;
            if( res.data.readPost.length > 0 ) {
                res.data.readPost.forEach((v, i) => {
                    let tempSex = `<option value="" ${(v.sex == null) ? 'selected' : ''}></option>`;
                    [{K: '남', V: 'M'}, {K: '여', V: 'F'}].forEach(vo => {
                        tempSex += `<option value=${vo.V} ${(v.sex == vo.V) ? 'selected' : ''}>${vo.K}</option>`;
                    });
                    let tempAuth = ``;
                    [{K: '미가입자', V: 'G'}, {K: '일반회원', V: 'N'}, {K: '관리자', V: 'S'}].forEach(vo => {
                        tempAuth += `<option value=${vo.V} ${(v.auth == vo.V) ? 'selected' : ''}>${vo.K}</option>`;
                    });
                    tempHtml +=
                        `<li class="userReadRow">
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
    document.querySelector( `#searchTelForm` ).onsubmit= e => {
        e.preventDefault();
        searchPaging();
    };

    [...document.querySelectorAll( `a[data-page-idx]` )].forEach( v => {
        v.onclick= e => {
            searchPaging( e.target.getAttribute(`data-page-idx`) );
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
        .onclick= e => { // 회원 추가
        modalCon(`사용자 정보를 등록하시겠습니까?`);
        resultCon(`insert`);
    }

    [...document.querySelectorAll( `.userReadRow` )].forEach( ( v, i, a) => {
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

    [...document.querySelectorAll( `.userUpdateBtn` )].forEach( ( v, i, a ) => {
        v.onclick= e => { // 사용자 수정 완료
            modalCon(`사용자 정보를 수정하시겠습니까?`);
            resultCon(`update`);
        }
    });

    [...document.querySelectorAll( `.userDeleteBtn` )].forEach( ( v, i ) => {
        v.onclick = e => { // 사용자 삭제
            modalCon(`사용자 정보를 삭제하시겠습니까?`);
            resultCon( `delete`, document.querySelector( `.userReadRow:nth-of-type( ${ i + 1 } ) [name=id]` ).value );
        };
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
                    let targetValue, isTel;
                    switch ( qMode ) {
                        case `insert`:
                            targetValue = {};
                            [...document.querySelectorAll(`.userInsertRow input, .userInsertRow select`)].forEach(v => {
                                targetValue[v.getAttribute(`name`)] = v.value.trim();
                            });
                            if( targetValue.tel.trim() == '' ) {
                                modalCon( `연락처를 입력해주세요.`, false );
                                return false;
                            }
                            if( targetValue.tel.match( /\D/g ) ) {
                                modalCon( `연락처에 숫자만 입력해주세요.`, false );
                                return false;
                            }
                            console.log( targetValue );
                            isTel= await axios.post( `/admin_user/isTel`, { tel: targetValue.tel } );
                            if( isTel.data[0].cnt > 0 ) {
                                modalCon( `이미 사용중인 연락처입니다.`, false );
                                return false;
                            } else {
                                if( await axios.post( `/admin_user/insert`, targetValue ) ) {
                                    location.reload();
                                }
                            }
                            break;
                        case `update`:
                            targetValue = {};
                            [...document.querySelectorAll(`.modifyMode input, .modifyMode select`)].forEach(v => {
                                targetValue[v.getAttribute(`name`)] = v.value.trim();
                            });
                            if( targetValue.tel.trim() == '' ) {
                                modalCon( `연락처를 입력해주세요.`, false );
                                return false;
                            }
                            if( targetValue.tel.match( /\D/g ) ) {
                                modalCon( `연락처에 숫자만 입력해주세요.`, false );
                                return false;
                            }
                            isTel= await axios.post( `/admin_user/isTel`, { id: targetValue.id ,tel: targetValue.tel } );
                            if( isTel.data[0].cnt > 0 ) {
                                modalCon( `이미 사용중인 연락처입니다.`, false );
                                return false;
                            } else {
                                if( await axios.post( `/admin_user/update`, targetValue ) ) {
                                    [...document.querySelectorAll(`.modifyMode input:not( .fixCol ), .modifyMode select`)].forEach(v => {
                                        ( v.getAttribute(`name`) == `name` ) && ( v.setAttribute(`data-origin-value`, targetValue.name ));
                                        ( v.getAttribute(`name`) == `tel` ) && ( v.setAttribute(`data-origin-value`, targetValue.tel ));
                                        ( v.getAttribute(`name`) == `sex` ) && ( v.setAttribute(`data-origin-value`, targetValue.sex ));
                                        ( v.getAttribute(`name`) == `birth_date` ) && ( v.setAttribute(`data-origin-value`, targetValue.birth_date ));
                                        ( v.getAttribute(`name`) == `auth` ) && ( v.setAttribute(`data-origin-value`, targetValue.auth ));
                                        ( v.getAttribute(`name`) == `remark` ) && ( v.setAttribute(`data-origin-value`, targetValue.remark ));
                                        v.disabled = true;
                                        v.value = v.getAttribute(`data-origin-value`);
                                    });
                                    document.querySelector(`.modifyMode`).classList.remove(`modifyMode`);
                                }
                            }
                            break;
                        case 'delete':
                            axios.post( `/admin_user/delete`, { id: tId } );
                            location.reload();
                            break;
                        default:
                            break;
                    }
                }
            }
        });
    }

})();