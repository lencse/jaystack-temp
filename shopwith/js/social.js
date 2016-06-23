(function($) {


    function getSocialIconsWidth($btn) {
        var socialWidth = 0;
        $btn.siblings(".share-icons").find("a").each( function(i) {
            socialWidth += $(this).outerWidth(true);
        });
        return socialWidth;
    }

    function getSocialWidth($btn) {
        var total = $btn.outerWidth(true);
        total += getSocialIconsWidth($btn);
        return total;
    }

    function desktopSocial($btn) {
        var totalWidth = 0;
        var iconsW = 0;
        var btnWidth, btnXinit, btnYinit, rightInit;
        var $socialWrapper = $btn.parents(".edtl-cta-social-wrapper");

        var onMobile = Breakpoints.on({
            name: "mobile",
            matched: function() {
                $btn.parent().css("width", "");
                $socialWrapper.find(".share-icons").css("width", "");
                $socialWrapper.find(".dummy-share").css("width", "");
            },
            exit: function() {
                $( ".mf-sc__look-like .share-icons" ).hide();
            }
        });
        var onTablet = Breakpoints.on({
            name: "tablet",
            matched: function() {
                $btn.parent().css("width", "");
                $socialWrapper.find(".share-icons").css("width", "");
                $socialWrapper.find(".dummy-share").css("width", "");
            },
            exit: function() {
                $( ".mf-sc__look-like .share-icons" ).hide();
                $( ".mf-sc__look-like .edtl-share" ).css("height" , "");
            }
        });
        var onDesktop = Breakpoints.on({
            name: "desktop",
            matched: function() {

                if ( totalWidth == 0 )
                {
                    totalWidth = getSocialWidth($btn);
                }
                if ( iconsW == 0 )
                {
                    iconsW = getSocialIconsWidth($btn);
                }
                btnWidth = $socialWrapper.find(".share_btn").outerWidth(true);
                btnXinit = $socialWrapper.find(".share_btn").position().left;
                btnYinit = btnXinit + btnWidth;
                rightInit = totalWidth-btnYinit;

                $btn.parent().width(totalWidth);
                $btn.siblings(".share-icons").width(iconsW);
                $btn.siblings(".dummy-share").width(iconsW);
            },
            exit: function() {
                

                $( ".mf-sc__look-like .dummy-share").css({
                    right: "35%",
                    display: "none"
                });

                $( ".mf-sc__look-like .share_btn").css({
                    right: "",
                    left: "0",
                    position: "relative",
                    "z-index": 3
                });

                $( ".mf-sc__look-like .share-icons" ).css({
                    display: "none",
                    right: "35%",
                    opacity: ""
                });
            }
        });
        var onDesktopLarge = Breakpoints.on({
            name: "desktop-large",
            matched: function() {
                if ( totalWidth == 0 )
                {
                    totalWidth = getSocialWidth($btn);
                }

                if ( iconsW == 0 )
                {
                    iconsW = getSocialIconsWidth($btn);
                }

                btnWidth = $socialWrapper.find(".share_btn").outerWidth(true);
                btnXinit = $socialWrapper.find(".share_btn").position().left;
                btnYinit = btnXinit + btnWidth;
                rightInit = totalWidth-btnYinit;

                $btn.parent().width(totalWidth);
                $btn.siblings(".share-icons").width(iconsW);
                $btn.siblings(".dummy-share").width(iconsW);
            },
            exit: function() {
                $( ".mf-sc__look-like .dummy-share").css({
                    right: "35%",
                    display: "none"
                });

                $( ".mf-sc__look-like .share_btn").css({
                    right: "",
                    left: "0",
                    position: "relative",
                    "z-index": 3
                });

                $( ".mf-sc__look-like .share-icons" ).css({
                    display: "none",
                    right: "35%",
                    opacity: ""
                });
            }
        });


        function desktopShareToggle() {
            $socialWrapper.find(".share_btn").toggle( function() {
                btnWidth = $socialWrapper.find(".share_btn").outerWidth(true);
                btnXinit = $socialWrapper.find(".share_btn").position().left;
                btnYinit = btnXinit + btnWidth;
                rightInit = totalWidth-btnYinit;
                $(this).css({"position": "relative", "z-index": 3}).animate({
                    "left": -btnXinit
                }, 250);
                $socialWrapper.find(".dummy-share").css({
                    "right": rightInit,
                    "display": "block"
                })
                    .animate({
                        "right": iconsW
                    }, 250);

                $(this).siblings(".share-icons")
                    .css({
                        "right": rightInit,
                        "opacity": 0,
                        "display": "block"
                    }).animate({
                        right: 0,
                        opacity: 1
                    }, 500);
            }, function() {

                $socialWrapper.find(".dummy-share")
                    .animate({
                        right: "35%"
                    }, 500);

                $(this).animate({
                    "left": 0
                }, 500);

                $(this).siblings(".share-icons")
                    .animate({
                        right: "35%"
                    }, 1000);
            });
        }

        function desktopShareToggleOff() {
            $socialWrapper.find(".share_btn").off("toggle");
        }

        desktopShareToggle();
    }

    function mobileSocial($btn) {
        var onMobile = Breakpoints.on({
            name: "mobile",
            matched: function() {
                $btn.siblings(".share-icons").slideToggle();
            },
            exit: function() {
            }
        });
        var onTablet = Breakpoints.on({
            name: "tablet",
            matched: function() {
                var slotWrapper = $btn.parents(".mf-sc__look-wrapper");
                var wrapperIndex = slotWrapper.index(".mf-sc__look-wrapper") + 1;
                var thisShare = $btn.siblings(".share-icons");
                var nextShare;
                var hasPrevVisible = false;
                var isOdd = false;
                var isNextVisible = false;
                if ( wrapperIndex % 2 != 0 ) {
                    isOdd = true;
                    nextShare = slotWrapper.next().find(".edtl-share");
                    if ( nextShare.children(".share-icons").is(":visible") ) {
                        isNextVisible = true;
                    }
                }
                else if ( wrapperIndex > 0 ) {
                    hasPrevVisible = slotWrapper.prev().find(".share-icons").is(":visible");
                }
                    
                if ( thisShare.is( ":visible" ) ) {
                    if ( !isOdd && hasPrevVisible ) {
                        thisShare.parent().css("height", "108px");
                    }

                    thisShare.slideUp(400);
                    
                    if ( isOdd ) {
                        if ( !isNextVisible ) {
                            nextShare
                                .animate({
                                    height: "40px"
                                }, 400);
                        }

                        setTimeout(function() {
                            nextShare.css("height", "");
                        }, 500);
                    }
                }
                else {
                    if ( isOdd && !isNextVisible ) {
                        nextShare
                            .animate({
                                height: "108px"
                            }, 400);
                    }

                    setTimeout(function() {
                        thisShare.slideDown(400);
                    }, 100);
                }
            },
            exit: function() {
            }
        });
    }

    function social() {
        //mobile/tablet
        $(".mf-sc__look-like .share_btn_mob").on("click", function(e){
            e.preventDefault();
            mobileSocial($(this));
        });
        //desktop/large desktop
        $( ".mf-sc__look-like .share_btn" ).each(function() {
          desktopSocial($(this));
        });
    }

    function buildTweetHref(url) {
        return "javascript:void(window.open('https://twitter.com/share?url=" + encodeURIComponent(url) + "','twitter_share', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600'));";
    }

    function setUpSocialData() {
        var e = encodeURIComponent(window.location.href),
        // var e = encodeURIComponent("http://www.matchesfashion.com/preview-content?uid=style-council-temp"),
            n = $(document).find("title").text(),
            f = "https://www.facebook.com/sharer/sharer.php?s=100&u=",
            i = f+e;

        var metaOgTitle = "";
        var metaOgTitleElem = $(document).find("meta[property='og:title']");
        if ( metaOgTitleElem != undefined && metaOgTitleElem.length ) {
            metaOgTitle = metaOgTitleElem.attr("content");
            n = metaOgTitle;
        }

        // var metaOgDesc = "";
        // var metaOgDescElem = $(document).find("meta[property='og:description']");
        // if ( metaOgDescElem != undefined && metaOgDescElem.length ) {
        //     metaOgDesc = metaOgDescElem.attr("content");
        // }

        // n = ( metaOgTitle.length > 0 || metaOgDesc.length > 0 ? metaOgTitle + "</br>" + metaOgDesc : n );

        var href = "";
        $(".icon-facebook").each(function() {
            href = $(this).attr("href");
            if ( href.length > 0 ) {
                $(this).attr( "href", f+encodeURIComponent(href) );
            }
            else {
                $(this).attr( "href", i );
            }
        });

        var r = "";
        if ( $("#pinterestMediaURL").length ) { 
            r = "&media=" + $("#pinterestMediaURL").attr("src");
        }

        var p = "http://pinterest.com/pin/create/button/?url=",
            p2 = "&amp;description=" + n;// + r,
            // a = p + e + p2;
        var imgsrc = "";
        $(".icon-pinterest").each(function() {
            imgsrc = $(this).data("img");
            if ( imgsrc != undefined && imgsrc.length > 0 ) {
                p2 += "&media=" + imgsrc;
            }
            else {
                p2 += r;
            }

            href = $(this).attr("href");
            if ( href.length > 0 ) {
                $(this).attr("href", p + encodeURIComponent(href) + p2);
            }
            else {
                $(this).attr("href", p + e + p2);
            }
        });

        var g = "https://plus.google.com/share?url=",
            o = g + e;
        $(".icon-google").each(function() {
            href = $(this).attr("href");
            if ( href.length > 0 ) {
                $(this).attr("href", g + encodeURIComponent(href));
            }
            else {
                $(this).attr("href", o);
            }
        });

        var c = e;
        $(".icon-twitter").each(function() {
            href = $(this).attr("data-url");
            if ( href.length > 0 ) {
                $(this).attr("data-url", encodeURIComponent(href)), $(this).attr("data-text", n);
                
                href = buildTweetHref(href);
                $(this).attr("href", href);
            }
            else {
                $(this).attr("data-url", c), $(this).attr("data-text", n)
            }
        });
    }

    if ( $('.share_btn').length ) {
        social();
    }

    setUpSocialData();

    /**************************************************/
    /* DESIGNER SIGN UP POP-UPS */

    function _designerPopup($elem) {

        $elem.on("click", function(e){
            e.preventDefault();
            MF.overlay.openWithElement({
                element: $( '#' + $elem.data("popup-target") )
            });
        });
    }

    function designersSignUpPopups(){
        $('[class~="popup-edtl-signup"]').each( function(i) {
            var $this = $(this);

            _designerPopup($this);
        });
    }

    //designer sign up pop ups
    designersSignUpPopups();

}(jQuery));



