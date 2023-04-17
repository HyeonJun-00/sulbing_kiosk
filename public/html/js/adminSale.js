$(document).ready(()=>{

    $('.displayMonthlySale').css('display','flex');
    $('#monthlySale').css('background-color', '#f3f3f3');
    let heightValue = [];
    let heightMax = 0;
    $(".dataValue").each((i,v)=>{
        heightValue.push(Number(v.getAttribute('data-price')));
    });
    heightValue.sort((a,b)=> b-a);
    heightMax = heightValue[0];
    $(".dataValue").each((i,v)=>{
       let heightV = Number(v.getAttribute('data-price'));
        v.style.height = `${(heightV/heightMax)*100}%`;
        v.style.backgroundColor = `lightblue`;
    });
    heightValue = [];
    $(".dayValue").each((i,v)=>{
        heightValue.push(Number(v.getAttribute('data-price')));
    });
    heightValue.sort((a,b)=> b-a);
    heightMax = heightValue[0];
    $(".dayValue").each((i,v)=>{
        let heightV = Number(v.getAttribute('data-price'));
        v.style.height = `${(heightV/heightMax)*100}%`;
        v.style.backgroundColor = `#ffcb6b`;
    });

    heightMax = Math.max( Number($('.yearValue').attr('data-price')), Number($('.lastYearValue').attr('data-price')));

    $(".yearValue").each((i,v)=>{
        let heightV = Number(v.getAttribute('data-price'));
        v.style.height = `${(heightV/heightMax)*100}%`;
        v.style.backgroundColor = `rgba(255,0,0,0.4)`;
    });
    $(".lastYearValue").each((i,v)=>{
        let heightV = Number(v.getAttribute('data-price'));
        v.style.height = `${(heightV/heightMax)*100}%`;
        v.style.backgroundColor = `rgba(255,0,0,0.2)`;
    });

    heightValue = [];
    $(".itemValue").each((i,v)=>{
        heightValue.push(Number(v.getAttribute('data-price')));
    });
    heightValue.sort((a,b)=> b-a);
    heightMax = heightValue[0];
    $(".itemValue").each((i,v)=>{
        let heightV = Number(v.getAttribute('data-price'));
        v.style.height = `${(heightV/heightMax)*100}%`;
    });

    this.addEventListener('click', (e)=>{
        console.log(e.target.id);
        switch (e.target.id){
            case 'monthlySale' :
                $('.displayDailySale').css('display', 'none');
                $('.displayYearlySale').css('display', 'none');
                $('.displayBestSales').css('display', 'none');
                $('#dailySale').css('background-color', 'lightgray');
                $('#yearlySale').css('background-color', 'lightgray');
                $('#bestMenu').css('background-color', 'lightgray');
                if($('.displayMonthlySale').css('display') === 'none'){
                    $('.displayMonthlySale').css('display','flex');
                    $('#monthlySale').css('background-color', '#f3f3f3');
                }
                break;
            case 'dailySale' :
                $('.displayMonthlySale').css('display', 'none');
                $('.displayYearlySale').css('display', 'none');
                $('.displayBestSales').css('display', 'none');
                $('#monthlySale').css('background-color', 'lightgray');
                $('#yearlySale').css('background-color', 'lightgray');
                $('#bestMenu').css('background-color', 'lightgray');
                if($('.displayDailySale').css('display') === 'none') {
                    $('.displayDailySale').css('display', 'flex');
                    $('#dailySale').css('background-color', '#f3f3f3');
                }
                break;
            case 'yearlySale' :
                $('.displayDailySale').css('display', 'none');
                $('.displayMonthlySale').css('display', 'none');
                $('.displayBestSales').css('display', 'none');
                $('#monthlySale').css('background-color', 'lightgray');
                $('#dailySale').css('background-color', 'lightgray');
                $('#bestMenu').css('background-color', 'lightgray');
                if($('.displayYearlySale').css('display') === 'none') {
                    $('.displayYearlySale').css('display', 'flex');
                    $('#yearlySale').css('background-color', '#f3f3f3');
                }
                break;
            case 'bestMenu' :
                $('.displayDailySale').css('display', 'none');
                $('.displayMonthlySale').css('display', 'none');
                $('.displayYearlySale').css('display', 'none');
                $('#monthlySale').css('background-color', 'lightgray');
                $('#yearlySale').css('background-color', 'lightgray');
                $('#dailySale').css('background-color', 'lightgray');
                if($('.displayBestSales').css('display') === 'none') {
                    $('.displayBestSales').css('display', 'flex');
                    $('#bestMenu').css('background-color', '#f3f3f3');
                }
                break;
        }
    })
});