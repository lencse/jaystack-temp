;
(function ($, window, document) {
    'use strict';

    var MF = window.MF || {};

    MF.returns = (function () {

        var updateReturnsPriceAndPhoneNumber = function () {
            var countryIso = $('#returnsPageCountryDropdown #countryIso').val();
            if ( countryIso === "GBR" ){
                $('.block-title-container_not-uk').css('display', 'none');
                $('.block-title-container_uk').css('display', 'block');
                if ( !($('.block-title-container_uk_not-mobile-container').hasClass('block-title-container_uk_not-mobile_uk-confirmed')) ){
                    $('.block-title-container_uk_not-mobile-container').addClass('block-title-container_uk_not-mobile_uk-confirmed');
                }
                $('.returns-steps-container_returns-step_extra-notes_uk').css('display','block');
                $('.block-title-container_uk').removeClass('block-title-container_uk_hide');
            }
            else{
                $('.block-title-container_not-uk').css('display', 'block');
                $('.block-title-container_uk').css('display', 'none');
                if ( ($('.block-title-container_uk_not-mobile-container').hasClass('block-title-container_uk_not-mobile_uk-confirmed')) ){
                    $('.block-title-container_uk_not-mobile-container').removeClass('block-title-container_uk_not-mobile_uk-confirmed');
                }
                $('.returns-steps-container_returns-step_extra-notes_uk').css('display','none');
            }
            $.ajax({
                beforeSend: function (request) {
                    request.setRequestHeader("Cache-Control", "no-store");
                },
                url: "/ajax/returnsInfo",
                data: {countryIso: countryIso},
                cache: false,
                success: function (data) {
                    if (data.returnsInformationData.cost === '' || data.returnsInformationData.cost === '0') {
                        $('.return-price').html($('#freeShippingChargeId').text());
                    } else {
                        $('.return-price').html(data.returnsInformationData.currency + data.returnsInformationData.cost);
                    }
                    $('.return-phone').html(data.returnsInformationData.phoneNo);
                    $('.return-dhlUrl1').hide();

                   if(data.returnsInformationData.dhlUrl1 !== '')
                   {
                       $('.dhl_language_link1').attr('href', data.returnsInformationData.dhlUrl1);

                       $('.return-dhlUrl1').show();
                       $('.return-dhlUrl1-defaultText').show();
                       $('.return-dhlUrl2').hide();
                       $('.return-dhlUrl1-text').hide();

                       if(data.returnsInformationData.dhlUrl2 !== '')
                       {
                           $('.return-dhlUrl1-text').html(data.returnsInformationData.dhlLanguage1);
                           $('.dhl_language_link2').attr('href', data.returnsInformationData.dhlUrl2);
                           $('.dhl_language_link2').html(data.returnsInformationData.dhlLanguage2);

                           $('.return-dhlUrl2').show();
                           $('.return-dhlUrl1-text').show();
                           $('.return-dhlUrl1-defaultText').hide();
                       }
                   }
                   if( (data.returnsInformationData.dhlUrl1 === '') && (data.returnsInformationData.dhlUrl2 === '') ){
                        $('.returns-steps-container_returns-step_5 picture').remove();
                        $('.returns-steps-container_returns-step_5 > .returns-steps-container_returns-step_image').prepend('<picture> <!--[if IE 9]><video style="display:none"><![endif]--> <source srcset="//assets.matchesfashion.com/images/returns/confirmation_page/05b-desktop.jpg" media="(min-width: 61.25em)"> <source srcset="//assets.matchesfashion.com/images/returns/confirmation_page/05b-tablet.jpg, //assets.matchesfashion.com/images/returns/confirmation_page/05b-tablet_retina.jpg 2x" media="(min-width: 42.5625em)"> <source srcset="//assets.matchesfashion.com/images/returns/confirmation_page/05b-mobile.jpg, //assets.matchesfashion.com/images/returns/confirmation_page/05b-mobile_retina.jpg 2x" media="(min-width: 0)"> <!--[if IE 9]></video><![endif]--> <img srcset="//assets.matchesfashion.com/images/returns/confirmation_page/05b-desktop.jpg" alt=""> </picture>');
                   }
                   else{
                        $('.returns-steps-container_returns-step_5 picture').remove();
                        $('.returns-steps-container_returns-step_5 > .returns-steps-container_returns-step_image').prepend('<picture> <!--[if IE 9]><video style="display:none"><![endif]--> <source srcset="//assets.matchesfashion.com/images/returns/confirmation_page/05a-desktop.jpg" media="(min-width: 61.25em)"> <source srcset="//assets.matchesfashion.com/images/returns/confirmation_page/05a-tablet.jpg, //assets.matchesfashion.com/images/returns/confirmation_page/05a-tablet_retina.jpg 2x" media="(min-width: 42.5625em)"> <source srcset="//assets.matchesfashion.com/images/returns/confirmation_page/05a-mobile.jpg, //assets.matchesfashion.com/images/returns/confirmation_page/05a-mobile_retina.jpg 2x" media="(min-width: 0)"> <!--[if IE 9]></video><![endif]--> <img srcset="//assets.matchesfashion.com/images/returns/confirmation_page/05a-desktop.jpg" alt=""> </picture>');
                   }
                }
            });
        }

        function init() {
            $(function () {
                var countryIso = $('#returnsPageCountryDropdown #countryIso').val()
                if ( countryIso === "GBR" ){
                    $('.block-title-container_not-uk').css('display', 'none');
                    $('.block-title-container_uk').css('display', 'block');
                    $('.block-title-container_uk_not-mobile-container').addClass('block-title-container_uk_not-mobile_uk-confirmed');
                    $('.returns-steps-container_returns-step_extra-notes_uk').css('display','block');
                    $('.block-title-container_uk').removeClass('block-title-container_uk_hide');
                }
                else{
                    $('.block-title-container_not-uk').css('display', 'block');
                    $('.block-title-container_uk').css('display', 'none');
                    $('.returns-steps-container_returns-step_extra-notes_uk').css('display','none');
                }
                $('#returnsPageCountryDropdown #countryIso').on("change", updateReturnsPriceAndPhoneNumber);
            });
        }


        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document));

MF.returns.init();