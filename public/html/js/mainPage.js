function fn_showModal(productId) {
    document.getElementById('toppModalBack').style.display = 'block';
    document.getElementById('toppModal_' + productId).style.display = 'none';
    document.getElementById('optionModal_' + productId).style.display = 'block';
    let modalBackground = document.getElementById('toppModalBack');
    let toppModal = document.getElementById('toppModal_' + productId).innerHTML;
    console.log(toppModal)
    modalBackground.innerHTML = toppModal;
}

function fn_mainTabSelect (menuId) {
    document.getElementById('mainCategoryTab_1').style.display = 'none';
    document.getElementById('mainCategoryTab_2').style.display = 'none';
    document.getElementById('mainCategoryTab_3').style.display = 'none';
    document.getElementById('mainCategoryTab_4').style.display = 'none';

    document.getElementById('mainCategoryTab_' + menuId).style.display = 'block';
}