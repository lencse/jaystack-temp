// require MF.checkout.mediator

;(function ($, window, document, mediator) {
    'use strict';

    var MF = window.MF || {};

    MF.carousel = (function () {

        var recentlyViewedProductsItemTemplateSource = null,
            recentlyViewedProductsItemTemplate = null,
            // Should be an ID ideally
            product = $('[name="baseProductCode"]').val();

        function init(options) {
            var o = options || {};
            var elId = o.elId || null;
            var isYourMatches = o.isYourMatches;

            var $carousels = elId ? $(elId) : $('[data-mfcarousel]');

            recentlyViewedProductsItemTemplateSource = $('#productCarouselItemTemplate').html();
            recentlyViewedProductsItemTemplate = Handlebars.compile(recentlyViewedProductsItemTemplateSource);

            $carousels.each(function(){
                var $c = $(this); // this carousel element
                if ($c.is('[class^="slick"]')) {
                    $c.unslick().hide();
                }

                var dataUrl = $c.data('ajax');
                var jsonData = $c.data('json') || o.json;

                var carouselDataOptions = $c.data('mfcarousel');
                var _co = _s2o(carouselDataOptions); // Carousel's Options Object

                if (dataUrl && dataUrl.length > 0) {
                    _initCarouselWithDataFromUrl(dataUrl, $c, isYourMatches, _co);
                } else if (jsonData && jsonData.length > 0) {
                    _initCarouselWithJSONData(jsonData, $c, _co);
                } else {
                    mediator.publish('carousel:empty', {carousel: $c });
                }
            });


        }


//      data options string to object
        function _s2o(dataOptions) {

            var optArr, i, p, options;

            options = {};

            optArr = dataOptions.split(';');
            i = optArr.length;

            function trim(str) {
                if (typeof str === 'string') return $.trim(str);
                return str;
            }

            while (i--) {
                p = optArr[i].split(':');

                if (p.length === 2 && p[0].length > 0) {
                    options[trim(p[0])] = trim(p[1]);
                }
            }

            return options;
        }

        function _initCarouselWithDataFromUrl(dataUrl, $carousel, isYourMatches, options){
            var items = [],
                _options = options || {},
                $placeholder = $('[data-outfit-description]'),
                initialText = $placeholder.data('base-text'),
                text = initialText;

            // stop the recently viewed carousel
            // from pushing 2nd ajax.
            if (isYourMatches) $.ajax({
                url: dataUrl,
                cache: isYourMatches
            }).done(function(data) {
                var dataLength = data.length;
                if(dataLength == 0) {
                    mediator.publish('carousel:empty', {carousel: $carousel});
                }
                $.each( data, function( key, val ) {

                    // binding data with template; adding the HTML result in the items array
                    if (val.url.length > 0) {
                        items.push(recentlyViewedProductsItemTemplate(val));
                    }

                    if (dataLength == 1 && key == 0) {
                        text += text += buildOutFitProductLink(val) + ' ';
                    } else if (key < dataLength-2 && dataLength > 1) {
                        text += buildOutFitProductLink(val) + ', ';
                    } else if (key == dataLength-2){
                        text += buildOutFitProductLink(val) + ' ';
                    } else {
                        text += 'and ' + buildOutFitProductLink(val) + '.';
                    }

                });
                $carousel.html(items.join(''));
                // inserting all items html into the wrapper
                // if data is not available lets not init slick


              //  if (  ) {
                  if ( data.length > 0 ) _initCarouselWithOptions($carousel, _options);
              //  };
                // inserting all items html into the Description div
                if ( $carousel.attr('id') == 'matchItWith' && dataLength > 0 ) $placeholder.html(text);
            }).fail(function() {
                mediator.publish('carousel:empty', {carousel: $carousel})
            });
        }

        function buildOutFitProductLink(val) {
            if (val.url.length > 0) {
                return '<a class="outfit-prod-link" href="'+ val.url +'" >'+ val.designer +' '+ val.name+'</a>';
            } else {
                return val.designer +' '+ val.name;
            }
        }

        function _initCarouselWithJSONData(data, $carousel, options){
            var items = [],
                _options = options || {};

                $.each(data, function( key, val ) {
                    // binding data with template; adding the HTML result in the items array
                    // preventing the current product from displaying
                    if (val.code !== product)  items.push(recentlyViewedProductsItemTemplate(val));
                });
                $carousel.html(items.join('')); // inserting all items html into the wrapper
                if ( items.length > 0 ) _initCarouselWithOptions($carousel, _options);
        }

        function show_hide() {
              // All Matches tabs render hidden, then:
              var $header = $('.pdp-your-matches'),
                  $tabber_menu = $header.find('.tabber-menu'),
                  $pdp_section_heading = $header.find('.pdp-section-heading');

              var match_it_with_length = $('div#matchItWith').find(".slick-track").children().length;
              var recently_viewed_products_length = $('#recentlyViewedProducts').children().length;

              var $pdpMatches = $('.pdp-your-matches');
              var matchitText = $('.match-it-with__link').text();
              var recentlyviewedText = $('.recently-viewed__link').text();

              var $heading = $pdpMatches.find('.pdp-section-heading span');

              if (match_it_with_length <= 0 && recently_viewed_products_length <= 0) {
                $header.hide();

              } else if (recently_viewed_products_length <= 0) {

                $heading.text(matchitText);
                $tabber_menu.hide();
                $pdp_section_heading.show();

              } else if (match_it_with_length <= 0) {

                $heading.text(recentlyviewedText);
                $tabber_menu.hide();
                $pdp_section_heading.show();

              } else if (recently_viewed_products_length > 0 && match_it_with_length > 0) {
                $tabber_menu.show();
                $pdp_section_heading.show();
              } else {
                $tabber_menu.hide();
                $pdp_section_heading.hide();
              }
            }


        function _initCarouselWithOptions($carousel, options) {
            $carousel.show().slick({
                infinite: false,
                arrows: true,
                slidesToShow: 4,
                slidesToScroll: 4,
                dots: false,
                onInit: function() {
                  setTimeout(show_hide,500);
                },
                responsive: [
                    {
                        breakpoint: 966,
                        settings: {
                            infinite: false,
                            arrows: true,
                            slidesToShow: 3,
                            slidesToScroll: 3,
                            dots: false
                        }
                    },
                    {
                        breakpoint: 666,
                        settings: {
                            infinite: false,
                            arrows: true,
                            slidesToShow: 2,
                            slidesToScroll: 2,
                            dots: true
                        }
                    }
                ]
            });


        }




        return {
            init: init
        };
    })();

    window.MF = MF;

}(jQuery, this, this.document, MF.checkout.mediator));
