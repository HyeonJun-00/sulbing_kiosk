(() => {
    const   phoneNumberButton = (event, thisButton) => {
        const calculator = $(".calculator div").eq(0);

        if (calculator.html().length >= 13 && event != "x" && event != "확인") {
            return ;
        }
        console.log(event);
        switch (event) {
            case "x":
                break ;
            case "확인":
                calculator.html("");
                break ;
            default :
            calculator.html(calculator.html() + $(thisButton).html()) ;
                break ;
        }
    }

    for (let i = 0; i < $(".phoneNumberButton").length; i++) {
        $(".phoneNumberButton").eq(i).on("click", function() {
            const calculator = $(".calculator div").eq(0);

            if (calculator.html().length == 3 || calculator.html().length == 8) {
                calculator.html(calculator.html() + "-")
            }
            phoneNumberButton($(this).html(), this);
        });
    }
})();