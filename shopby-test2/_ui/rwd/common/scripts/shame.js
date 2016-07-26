// Testing MF library

MF.accordion.init();
MF.expand.init();

MF.scrollBars.init();

// Custom select

MF.select.init({
    contextId: '#accountLinks'
});


MF.select.init({
    contextId: '#headerRegisterForm'
});

MF.select.init({
    contextId: '#updateProfileForm'
});


var $window = $(window);
// Checkout Form Section Elements
// if ($('.checkout-stage__wrapper, .shipping-stage__wrapper, .review-stage__wrapper').length) {
//     MF.select.init();
// }


$(function() {
    jQuery("#numberOfRecordsPerPage").change(function() {
        location.href = $(this).val();
    });
});

$(document).ready(function() {
    var timer;

    $(window).resize(function() {
        // clearTimeout(timer);
        // timer = setTimeout(MF.homepage.mobile, 500);
        // Scroll bars Homepage
        //$('.ph-tpl__scroll-pane').height($(window).innerHeight() - 150);

    });


    $('.tabberer').tabber();
});

// hack to get localised CS phone numbers in footer. To be replaced by CMS component with restrictions
$(function() {
    var faqEntries = $(".faq__answer");
    if (faqEntries.length) {
        $.ajax({
            url: "/component/json/DynamicPhoneNumbers" + "?country=" + $.cookie('country'),
            cache: true,
            success: function(result) {
                if (result.data && result.data.items[0] && result.data.items[0].intlPhoneNumber) {
                    faqEntries.each(function() {
                        $(this).html(function(i, t) {
                            t = t.replace('[localPhoneNumber]', result.data.items[0].localPhoneNumber);
                            return t.replace('[intlPhoneNumber]', result.data.items[0].intlPhoneNumber);
                        });
                    });
                }
            }
        });
    }
});

$(function () {
    function getGenderCookie() {
        if (document.getElementsByClassName('womens--is-active').length)    { return "womens"; } // getElementsByClassName is 10x faster than reading cookies   
        else if (document.getElementsByClassName('mens--is-active').length) { return "mens"; }
        else                                                                { return $.cookie('gender'); }
    }
    function cookieMatchesNav(correctGender) {
        var menuLinks = document.getElementsByClassName('main-menu__link');
        return (menuLinks && menuLinks[0] && menuLinks[0].href && (menuLinks[0].href.indexOf('/'+correctGender) > -1));
    }
    function changeGenderOfNavMainLinks(correctGender) {
        var genderToCorrect = (correctGender == 'womens') ? 'mens' : 'womens';
        $("#nav_main .main-menu__item a").each( function() {
            if ($(this).attr('href').indexOf('/'+genderToCorrect)>-1) {
                var textToReplace = new RegExp('/'+genderToCorrect,'ig');
                var newVal = $(this).attr('href').replace(textToReplace, '/'+correctGender);
                $(this).attr('href', newVal);
            }
        });
    }
    function removeMegaNavDropDown() {
        $("#nav_main .sub_menu").remove();
    }
    
    var correctGender = getGenderCookie();
    if ( (correctGender == "mens" || correctGender == "womens") && !cookieMatchesNav(correctGender) ) {
        changeGenderOfNavMainLinks(correctGender);
        removeMegaNavDropDown();
    }
});

// hack to get localised CS phone numbers in footer. To be replaced by CMS component with restrictions
$(function () {
    if (document.getElementById('ftCsTel')) { // main footer
        $.ajax({
            url: "/component/json/DynamicPhoneNumbers"+"?country="+$.cookie('country'), cache: true,
            success: function(result){
                if (result.data && result.data.items[0] && result.data.items[0].intlPhoneNumber) {
            	    var obj = $('#ftCsTel');
                    obj.find('>span').remove();
                    obj.append('<span>' + result.data.items[0].intlPhoneNumber + '</span><br />');
        		    obj.append('<span>' + result.data.items[0].localPhoneNumber + '</span>');
                }
        	}
        });
    }
    if (document.getElementById('ftChkOutNumTollFree')) { // checkout footer
        $.ajax({
            url: "/component/json/DynamicPhoneNumbers"+"?country="+$.cookie('country'), cache: true,
            success: function(result){
                if (result.data && result.data.items[0] && result.data.items[0].intlPhoneNumber) {
            	    var obj; 
                    obj = $('#ftChkOutNumTollFree'); obj.find('>span').remove();
                    obj.append('<span>' + result.data.items[0].localPhoneNumber + '</span>');
                    obj = $('#ftChkOutNumIntl'); obj.find('>span').remove();
                    obj.append('<span">' + result.data.items[0].intlPhoneNumber + '</span>');
                    obj = $('#ftChkOutNumTollFreeMbl');  obj.find('>span').remove();
                    obj.append('<span">' + result.data.items[0].localPhoneNumber + '</span>');
                    obj = $('#ftChkOutNumIntlMbl');  obj.find('>span').remove();
                    obj.append('<span">' + result.data.items[0].intlPhoneNumber + '</span>');
                }
        	}
        });
    }
});

// Tool to list all events registered via jQuery to an element.
// Usage:
//  - click / inspect the element in Web developer tool
//  - run "events($0)" in console
function events(element) {
    var eventType, events = $._data(element).events;
    for (eventType in events) {
        var eventList = events[eventType];
        console.log('%c' + eventType + ': (' + eventList.length + ')', 'color: white; background-color: blue;');
        for (var i = 0; i < eventList.length; i++) {
            console.log('%c - %o (%o)', 'color: blue', eventList[i].handler.prototype, eventList[i].handler)
        }
    }
}


// hack to avoid blank nav on womens homepage
$(function () {
    var navElem = document.getElementById('nav_main');
    if (navElem && navElem.children && (navElem.children.length === 0)) {
        var synthNav = '<ul class="yCmsContentSlot main-menu__wrapper"><li class="main-menu__item"><span class="main-menu__item__text"><a class="main-menu__link" href="/womens/just-in/just-in-this-month" style="border-bottom-style: none;">JUST IN</a></span></li><li class="main-menu__item"><span class="main-menu__item__text"><a class="main-menu__link" href="/womens/shop">Shop</a></span></li><li class="main-menu__item"><span class="main-menu__item__text"><a class="main-menu__link" href="/designers">DESIGNERS</a></span></li><li class="main-menu__item"><span class="main-menu__item__text"><a class="main-menu__link" href="/womens/the-style-report">The Style Report</a></span></li><li class="main-menu__item"><span class="main-menu__item__text"><a class="main-menu__link" href="#">Studios</a></span></li><li class="main-menu__item"><span class="main-menu__item__text"><a class="main-menu__link" href="/womens/sale">Sale</a></span></li></ul>';
        if ($.cookie("gender")=="mens") {
            synthNav = synthNav.replace(/womens/gi,"mens");
        }
        $("#nav_main").append(synthNav);
    }
});
