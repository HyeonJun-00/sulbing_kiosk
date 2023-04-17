$(document).ready( ()=>{
    $('#adminForm > button').on('click', async ()=>{
        $('.modalConfirmBak').css('display', 'block');
    });
    $('#pwValue').on('input', ()=>{
        console.log('aaa');
        $('#pwValue').val($('#pwValue').val().replace(/[^\d]/, ""));
    });
});