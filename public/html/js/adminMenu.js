console.log('aaa');
( loadJs= () => {
    $(document).on('click', '#test', async (e)=>{
            e.preventDefault();
            const jsonData = $('#test').html();
            console.log(jsonData);
            try {
                const res = await axios.post(`/admin_menu/test`, {jsonData});
                console.log(res.data);
            } catch (err) {
                console.error(err);
            }
        });
})();