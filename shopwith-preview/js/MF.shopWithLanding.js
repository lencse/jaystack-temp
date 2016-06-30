
(function($) {

  'use strict';

  var MF = window.MF || {};

  MF.shopWithLanding = (function() {

    function Carousels(){

      var $slider1, $slider2, $slider2b, $slider3;
        //$('.ep-slider').after('<div id="ep-slider-content"></div>');
        //$("#ep-slider-content").html($(".ep-slider div:eq("+$('.ep-slider').data("first-slide-mobile")+") span").html());

        var epSliderFirstSlide=$('.ep-slider').data("first-slide-mobile")-1;
        $slider1=$('.ep-slider').bxSlider({
            startSlide:epSliderFirstSlide,
            onSlideBefore:function(){
                // $("#ep-slider-content").fadeOut("fast");
            },
            onSlideAfter:function(){
                // $("#ep-slider-content").html($('.ep-slider div:eq('+($slider1.getCurrentSlide()+1)+') span').html());
                // $("#ep-slider-content").fadeIn();
            }
        });



        Breakpoints.on({
            name: "mobile",
            matched: function() {
                $('.shop-with-influences').after('<div id="influences-content"></div>');
                var shopWithInfluencesFirstSlide = $('.shop-with-influences').data("first-slide-mobile")-1;
                $("#influences-content").html($(".shop-with-influences").children().eq(shopWithInfluencesFirstSlide).html());
                $("#influences-content span:eq(0)").remove();

                // $slider2=$('.shop-with-influences').bxSlider({
                //     startSlide:shopWithInfluencesFirstSlide,
                //     onSlideBefore:function(){
                //         $("#influences-content").fadeOut("fast");
                //     },
                //     onSlideAfter:function(){
                //         $("#influences-content").html($(".shop-with-influences").children().eq(($slider2.getCurrentSlide()+1)).html());
                //         $("#influences-content span:eq(0)").remove();
                //         $("#influences-content").fadeIn();
                //     }
                //
                // });
                $slider2=$('.shop-with:not(.shop-with2)').find('.shop-with-influences').bxSlider({
                    startSlide:shopWithInfluencesFirstSlide,
                    onSlideBefore:function(){
                        $("#influences-content").fadeOut("fast");
                    },
                    onSlideAfter:function(){
                        $("#influences-content").html($(".shop-with-influences").children().eq(($slider2.getCurrentSlide()+1)).html());
                        $("#influences-content span:eq(0)").remove();
                        $("#influences-content").fadeIn();
                    }

                });

                $slider2b=$('.shop-with.shop-with2').find('.shop-with-influences').bxSlider({
                    startSlide:shopWithInfluencesFirstSlide,
                    onSlideBefore:function(){
                        $("#influences-content").fadeOut("fast");
                    },
                    onSlideAfter:function(){
                        $("#influences-content").html($(".shop-with-influences").children().eq(($slider2b.getCurrentSlide()+1)).html());
                        $("#influences-content span:eq(0)").remove();
                        $("#influences-content").fadeIn();
                    }

                });

                $slider3=$('.shop-with-style-report-d-and-m .shop-with-style-report').bxSlider({
                    onSlideBefore:function(){
                        $(".shop-with-style-report-d-and-m .shop-with-style-report a div").fadeOut("fast");
                    },
                    onSlideAfter:function(){
                        $(".shop-with-style-report-d-and-m .shop-with-style-report a div").fadeIn();
                    }
                });
            },
            exit: function() {
                if(typeof $slider2 != "undefined"){
                  $slider2.destroySlider();
                }
                if(typeof $slider2b != "undefined"){
                  $slider2b.destroySlider();
                }
                if(typeof $slider3 != "undefined"){
                  $slider3.destroySlider();
                }
                $("#influences-content").remove();
            }
        });
    }

    function feedNav(){
        $(".feedNav > div").click(function(){
            if(!$(this).hasClass("active")){
                $(".feedNav > div").removeClass("active");
                $(this).addClass("active");
                $(".live-feed-1").hide();
                $(".live-feed-2").hide();
                $(".live-feed-"+($(this).index()+1)).show();
            }
            //alert($(this).index()+1);
        });
    }

    function scrollBar(){
        $('.shop-with-three-cols .shop-with-style-report').mCustomScrollbar({
            horizontalScroll: false,
            autoDraggerLength: true,
            scrollInertia:0,
            theme: "dark-thick",
            mouseWheel: {
                enable: true
            }
        });



        Breakpoints.on({
            name: "tablet",
            matched: function() {
                $('.shop-with-style-report-d-and-m .shop-with-style-report').mCustomScrollbar({
                    horizontalScroll: false,
                    autoDraggerLength: true,
                    scrollInertia:0,
                    theme: "dark-thick",
                    mouseWheel: {
                        enable: true
                    }
                });
            },
            exit: function() {
                $(".shop-with-style-report-d-and-m .shop-with-style-report").mCustomScrollbar("destroy");
            }
        });

    }

    function mobilecheck() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        console.log(check);
        return check;
    }

    function insta() {
        $(".live-feed-1").html("");
        $(".live-feed-2").html("");
        // var feed1 = new Instafeed({
        //     get: 'user',
        //     userId: $("#live-feed-1").data("insta-userid"),
        //     clientId: 'f1b739882a154637a0fdf415a28d9492',
        //     target: "live-feed-1",
        //     template: '<div><a href="{{link}}" title="{{caption}}"><img src="{{image}}" alt="{{caption}}" /></a></div>',
        //     limit: 12,
        //     resolution: "low_resolution"
        // });
        var feed1 = new Instafeed({
            get: 'user',
            userId: $("#live-feed-1").data("insta-userid"),
            accessToken: '19099262.8d8f3d5.9332a28b152d40fa86b5ff0d30e04d4b',
            clientId: '8d8f3d5d8300448db8bcf476ec07bec9',
            target: "live-feed-1",
            template: '<div><a href="{{link}}" title="{{caption}}"><img src="{{image}}" alt="{{caption}}" /></a></div>',
            limit: 12,
            resolution: "low_resolution"
        });
        feed1.run();
        // feed2.run();
    }

    function init() {
      $('.shop-with-style-report-d-and-m .shop-with-style-report').html($(".shop-with-three-cols .shop-with-style-report").html());

      var currentBreakpoint=MF.breakpoint.getActive();

      $( window ).resize(function() {
          scrollBar();
      });

      scrollBar();
      Carousels();
      feedNav();
      insta();
    }

    return {
      init: init
    };

  })();

  window.MF = MF;

}(jQuery));

$(document).ready(function() {
    MF.shopWithLanding.init();
});
