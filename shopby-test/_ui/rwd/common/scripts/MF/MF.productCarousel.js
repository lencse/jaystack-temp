;(function($, window, document) {
    'use strict';

    var MF = window.MF || {};

    MF.productCarousel = (function() {

        var defaults = {};
        var $homepageCarousel;
        var $productNumber;


        function carousel(cid, options) {
            $homepageCarousel = $(cid).data('cms-carousel');
            $productNumber = $(cid).children().length;
    
            if ($productNumber >= $homepageCarousel) {

                $.each($('[data-cms-carousel]'), function(index, val) {
                $(cid).slick({
                    //dots: true,
                    infinite: true,
                    speed: 300,
                    slidesToShow: (!options.desktop) ? $homepageCarousel : options.desktop,
                    slidesToScroll: 1,
                    responsive: [{
                        breakpoint: 960,
                        settings: {
                            slidesToShow: (!options.tablet) ? $homepageCarousel : options.tablet,
                            slidesToScroll: 1,
                            infinite: true,
                            //dots: true
                        }
                    }, {
                        breakpoint: 680,
                        settings: {
                            slidesToShow: (!options.mobile) ? $homepageCarousel : options.mobile,
                            slidesToScroll: 1,
                            infinite: true,
                            adaptiveHeight: true
                        }
                    }]
                });
            });

            }
        }

        function init(cid, options){
            //console.log(MF.breakpoint);
            carousel(cid, options);
        }

        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document));