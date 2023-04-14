document.querySelector( `#getUserStamp` ).addEventListener( `submit`, async e => {
    e.preventDefault();
    const tel= document.querySelector( `#getUserStamp [name=tel]` ).value;
    try {
        const res= await axios.post( `/getUserStamp`, { tel } );
        console.log( res.data );
    } catch ( err ) {
        console.error( err );
    }
});

document.querySelector( `#mobileGifticon` ).addEventListener( `submit`, async e => {
    e.preventDefault();
    const code= document.querySelector( `#mobileGifticon [name=code]` ).value;
    try {
        const res= await axios.post( `/getGifticon`, { code } );
        console.log( res.data );
    } catch ( err ) {
        console.error( err );
    }
})

document.querySelector( `#cartForm` ).addEventListener( `submit`,  async e => {
    e.preventDefault();
    const jsonData = document.querySelector(`#cartForm [name=jsonData]`).value;
    try {
        const res= await axios.post( `/cart`, { jsonData } );
        console.log( res.data );
    } catch ( err ) {
        console.error( err );
    }
});