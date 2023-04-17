$(document).ready(()=>{

    $('.displayMonthlySale').css('display','flex');
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
    });

    heightMax = Math.max( Number($('.yearValue').attr('data-price')), Number($('.lastYearValue').attr('data-price')));

    $(".yearValue").each((i,v)=>{
        let heightV = Number(v.getAttribute('data-price'));
        v.style.height = `${(heightV/heightMax)*100}%`;
    });
    $(".lastYearValue").each((i,v)=>{
        let heightV = Number(v.getAttribute('data-price'));
        v.style.height = `${(heightV/heightMax)*100}%`;
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
                if($('.displayMonthlySale').css('display') === 'none'){
                    $('.displayMonthlySale').css('display','flex');
                }
                break;
            case 'dailySale' :
                $('.displayMonthlySale').css('display', 'none');
                $('.displayYearlySale').css('display', 'none');
                $('.displayBestSales').css('display', 'none');
                if($('.displayDailySale').css('display') === 'none') {
                    $('.displayDailySale').css('display', 'flex');
                }
                break;
            case 'yearlySale' :
                $('.displayDailySale').css('display', 'none');
                $('.displayMonthlySale').css('display', 'none');
                $('.displayBestSales').css('display', 'none');
                if($('.displayYearlySale').css('display') === 'none') {
                    $('.displayYearlySale').css('display', 'flex');
                }
                break;
            case 'bestMenu' :
                $('.displayDailySale').css('display', 'none');
                $('.displayMonthlySale').css('display', 'none');
                $('.displayYearlySale').css('display', 'none');
                if($('.displayBestSales').css('display') === 'none') {
                    $('.displayBestSales').css('display', 'flex');
                }
                break;
        }
    })
});