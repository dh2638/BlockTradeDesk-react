const $ = require('jquery/dist/jquery.min');

$(document).ready(function () {

    /*Login page Body height */
    $('body.loginBg').height('');
    var bodyHeight = $('body.loginBg').outerHeight();
    $('body.loginBg').height(bodyHeight);

    /* Pasword hide show*/
    $('.passIcon').click(function () {
        $(this).toggleClass('fa-eye');
        var x = document.getElementById("password");
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    });

    $(document).on('click', '.currency-dropdown', function () {
        var type = $(this).data('type');
        var code = $(this).data('code');
        var name = $(this).data('name');
        var value = $(this).data('value');
        $('.coinTabActive').removeClass('coinTabActive');
        $('[data-coin="' + type + '"]').addClass('coinTabActive');
        $('.coinList ul li.temp-coin').remove();
        $('.coinList ul').append('<li class="coinTabActive temp-coin" data-coin="' + name.toLowerCase() + '"><span>' + name + '</span> ' + value + '</li>')

    });
    /* Top Tab Script */
    $(document).on('click', '.coinList li', function () {
        $('.coinList ul li.temp-coin').remove();
        var coinTab = $(this).attr('data-coin');
        $(this).parents('.whiteBox').find('.coinTabActive').removeClass('coinTabActive');
        $(this).addClass('coinTabActive');
        $('#' + coinTab).addClass('coinTabActive');
    });

    /* Second Tab */
    $(document).on('click', '.tabList li', function () {
        var typeId = $(this).attr('data-type');
        $(this).parent().parent().find('.tabActive').removeClass('tabActive');
        $(this).addClass('tabActive');
        $('#' + typeId).addClass('tabActive');
    });

    /* submenu toggle */
    $(document).on('click', '.dropClick', function () {
        if (!$(this).parent('.dropdownSlide').hasClass('openBox')) {
            $('.dropdownSlide').removeClass('openBox');
            $('.dropClick').removeClass('active');
        }
        if ($(this).parent('.dropdownSlide').hasClass('openBox')) {
            $(this).removeClass('active');
            $(this).parent('.dropdownSlide').removeClass('openBox');
        } else {
            $(this).addClass('active');
            $(this).parent('.dropdownSlide').addClass('openBox');
        }
    });

    $(document).mouseup(function (e) {
        var popup = $(".dropdownSlide");
        if (!$('.dropdownSlide').is(e.target) && !popup.is(e.target) && popup.has(e.target).length == 0) {
            popup.removeClass('openBox');
            $('.dropdownClick').removeClass('active');
        }
    });
});

$(window).resize(function () {
    $('body.loginBg').height('');
    var bodyHeight = $('body.loginBg').outerHeight();
    $('body.loginBg').height(bodyHeight);
});


/* Chart function*/
