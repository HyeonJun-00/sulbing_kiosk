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

    console.log(heightMax);
    this.addEventListener('click', (e)=>{
        console.log(e.target.id);
        switch (e.target.id){
            case 'monthlySale' :
                $('.displayDailySale').css('display', 'none');
                $('.displayYearlySale').css('display', 'none');
                $('.displayBestSale').css('display', 'none');
                if($('.displayMonthlySale').css('display') === 'none'){
                    $('.displayMonthlySale').css('display','flex');
                } else {
                    $('.displayMonthlySale').css('display', 'none');
                }
                break;
            case 'dailySale' :
                $('.displayMonthlySale').css('display', 'none');
                $('.displayYearlySale').css('display', 'none');
                $('.displayBestSale').css('display', 'none');
                if($('.displayDailySale').css('display') === 'none'){
                    $('.displayDailySale').css('display','flex');
                } else {
                    $('.displayDailySale').css('display', 'none');
                }
                break;
            case 'yearlySale' :
                $('.displayDailySale').css('display', 'none');
                $('.displayMonthlySale').css('display', 'none');
                $('.displayBestSale').css('display', 'none');
                if($('.displayYearlySale').css('display') === 'none'){
                    $('.displayYearlySale').css('display','flex');
                } else {
                    $('.displayYearlySale').css('display', 'none');
                }
                break;
            case 'bestMenu' :
                $('.displayDailySale').css('display', 'none');
                $('.displayMonthlySale').css('display', 'none');
                $('.displayYearlySale').css('display', 'none');
                if($('.displayBestSale').css('display') === 'none'){
                    $('.displayBestSale').css('display','block');
                } else {
                    $('.displayBestSale').css('display', 'none');
                }
                break;
        }
    })
});