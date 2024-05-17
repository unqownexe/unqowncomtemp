var checkLightMode = localStorage.getItem("light-mode");
if (checkLightMode === "true") {
    $('body').addClass('light-mode');
    $('.content-wrapper-header').css('background-image', 'url(https://www.transparenttextures.com/patterns/cubes.png),linear-gradient(to right top, #ebebeb, #e7e7e7, #bdb6b6, #fbfbfb');
}
$(document).ready(function () {
    const socket = io()
    var img = new Image();
    img.src = $("body").css("background-image").replace(/url\(\"|\"\)$/ig, "");

    img.onload = function () {
        $("body").css("filter", "blur(0px)");
        $(".blur-bg").css("filter", "blur(40px)");
        $(".dark-light").show()
    };

    //$("#error").html(`<div class="gradient-border" id="box">ErrMsg</div>`).show()
    let lastClick;
    document.querySelectorAll("#navigate").forEach(function (element) {
        element.addEventListener("click", function () {
            let type = this.getAttribute("data-original");
            let date = Date.now()

            lastClick = type
            $("body").css("filter", "blur(40px)");
            $(".blur-bg").css("filter", "blur(0px)")
            $(".content-wrapper").fadeOut(200, function () {
                if (type == "loungeapps") {
                    $("#loungeapps").html(`<iframe id="loungeapps" src="https://www.loungeapps.com"></iframe>`)
                    $(".content-wrapper *").remove()
                    $("body").css("filter", "blur(0px)");
                    $(".blur-bg").css("filter", "blur(40px)")

                    $(".content-wrapper").fadeIn(200, function () {
                        $("#loungeapps").fadeIn(1000)
                        $(this).hide()
                    })
                    return
                }
                setTimeout(() => {
                    socket.emit(`navigate`, {
                        request: date / 2,
                        type: type
                    })
                }, 400);
            })
        })
    })


    document.querySelectorAll("#contact").forEach(function (element) {
        element.addEventListener("click", function () {
            let type = this.getAttribute("data-original");
            let date = Date.now()

            socket.emit(`contact`, {
                request: date / 2,
                type: type
            })
        })
    })
    socket.on("contactSuccess", data => {

        $(".overlay-app").removeClass("is-active");
        window.open(data, "_blank")
    })
    socket.on("navigateSuccess", data => {
        document.open()
        document.write(data)
        document.close()
        $(`[data-original="${lastClick}"]`).addClass("is-active")
    })

    socket.on("error", data => {
        $("body").css("filter", "blur(0px)");
        $(".blur-bg").css("filter", "blur(40px)")

        $("#error").html(`<div class="gradient-border" id="box">${data}</div>`).show()
    })


});


$('.dark-light').on('click', function () {
    let check = localStorage.getItem("light-mode");
    if (check === "true") {
        check = "false";
        $('body').removeClass('light-mode');
        $('.content-wrapper-header').css('background-image', 'url("https://www.transparenttextures.com/patterns/cubes.png"), linear-gradient(to right top, #040005,#252525, #363636, #4b4b4b)');


    } else {
        check = "true";
        $('body').addClass('light-mode');
        $('.content-wrapper-header').css('background-image', 'url(https://www.transparenttextures.com/patterns/cubes.png),linear-gradient(to right top, #ebebeb, #e7e7e7, #bdb6b6, #fbfbfb)');
    }

    localStorage.setItem("light-mode", check);
});