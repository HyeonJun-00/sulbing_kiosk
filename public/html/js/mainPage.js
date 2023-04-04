function inputElement() {
    let showModal = document.querySelector('#toppModalBack');
    showModal.style.display = 'block';
    let menuName = document.querySelector('.mProd_name');
    let inputName = document.querySelector('.prod_name').textContent;
    menuName.innerHTML = inputName;
}