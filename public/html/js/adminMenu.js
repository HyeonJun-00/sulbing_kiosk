$(document).ready( async function(){
    const a = await axios.post( `/admin_menu/ajaxTest`);
    console.log(a.data);
});