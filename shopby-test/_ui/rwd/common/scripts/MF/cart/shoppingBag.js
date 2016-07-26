/*
 *  require
 */

;(function ($, window, document, breakpoint) {
    'use strict';

    var MF = window.MF || {};

    var defaultOptions = {
        formPrefix: '',
        selectors: {
            listContainerRow: '.spb__items-list-row',
            listContainer: '.spb__items-list'
        }
    };

    MF.shoppingBag = function () {

        var options = {};

        var cartActions, selectUnits;

        var $listContainer, $buttonMobile;

        var selectors = {
            listContainer: '.spb__items-list',
            listContainerRow: '.spb__items-list-row',
            mobileSelect: '.size-lbl-select-m',
            tabletSelect: '.qty-select-t',
            desktopSelect: '.items-list-row__qty'
        };

        function mobileButton(state) {
            var btnSelector = (state === 'mobile' ? '#mobileBtn' : '#desktopBtn');
            $(btnSelector).append($buttonMobile.detach());
        }

        function initUpdateQtyForms(target) {
            $listContainer.find(selectors.listContainerRow).each(function (index, val) {
                var thisForm = '#' + options.formPrefix + 'updateQuantityForm' + index;
                initSelects(thisForm, target, index);
            });
        }

        function initSelects(thisForm, target, index) {
            selectUnits = $(thisForm).detach();

            $listContainer.find(selectors.listContainerRow + ':eq(' + index + ') ' + target).append(selectUnits);

            $listContainer.find(selectors.listContainerRow + ':eq(' + index + ')')
                .find('.items-list-row__qty-messages:visible').parent()
                .find('.selecter').css({'border': '1px solid red'});
        }

        function updateFooter(breakpointName) {
            var $infoMessages = $('.spb__totals-info').detach();

            if (breakpointName === 'mobile') {
                $('#mobile__info').append($infoMessages);
            } else {
                $('.spb__totals').append($infoMessages);
            }
        }

        function updateView(breakpointName) {
            breakpointName = breakpointName || breakpoint.getActive();

            var target = selectors.desktopSelect;

            switch (breakpointName) {
                case MF.breakpoint.MOBILE:
                    target = selectors.mobileSelect;
                    break;
                case MF.breakpoint.TABLET:
                    target = selectors.tabletSelect;
                    break;
                case MF.breakpoint.DESKTOP:
                    target = selectors.desktopSelect;
                    break;
            }

            initUpdateQtyForms(target);

            mobileButton(breakpointName);
            updateFooter(breakpointName);
        }

        function reloadShoppingBagPage() {
            window.location.reload(true);
        }

        function initObjects() {
            cartActions = MF.cartActions();

            cartActions.init({
                cartItemsContainer: selectors.listContainer
            });

            $listContainer = $(selectors.listContainer);
            $buttonMobile = $('.spb-header__cta-top');
        }

        function bindEvents() {
            cartActions.callbacks.onCartItemRemoved.add(reloadShoppingBagPage);
            cartActions.callbacks.onCartItemVariantChanged.add(reloadShoppingBagPage);
            cartActions.callbacks.onCartItemQtyChanged.add(reloadShoppingBagPage);

            breakpoint.callbacks.onChange.add(updateView);

            $("#payTaxOnDelivery").on("change", function() {
                MF.busyOverlay.enable();
                this.form.submit();
            });
        }

        function appendSettingsReturnUrl() {
            var $settingsLinks = $('.spb__totals-info').find('a');
            var redirectUrl = '/settings?returnUrl='+location.href;

            $.each($settingsLinks, function(index, val) {
                var settings = $(val).attr('href');
                if (settings == '/settings') {
                    $(val).attr('href',redirectUrl);
                }
            });
        }

        function popUpTermsAndCoditions() {

            MF.overlay.openWithElement({
                element: $("#termsAndConditionsOverlay")
            });
        }

        function getTermsAndConditions() {
            var url = '/tandcs .fp-page__content';
            MF.busyOverlay.enable();
            $('#termsAndConditionsContent').load(url, function() {
                done: {
                    MF.busyOverlay.disable();
                    popUpTermsAndCoditions();
                }
            });
        }

        function bindTermsAndConditionsClick() {
             $('[data-terms-conditions]').on('click', function(event) {
                event.preventDefault();
                getTermsAndConditions();
            });
        }

        function init(opts) {
            options = $.extend({}, defaultOptions, opts);

            // Override selectors from options
            $.extend(selectors, options.selectors);

            initObjects();

            bindEvents();

            updateView();

            appendSettingsReturnUrl();

            bindTermsAndConditionsClick();
        }

        return {
            init: init
        };

    };

    window.MF = MF;

}(jQuery, this, this.document, MF.breakpoint));

if ($(".spb__total-items").length) {
    MF.shoppingBag().init();
}
