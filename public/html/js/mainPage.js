
function fn_showTopping (productId) {
    document.getElementById('asd').style.display = 'block';
    document.getElementById('selectTopp').src = '/selectTopping?productId=' + productId; 
}
