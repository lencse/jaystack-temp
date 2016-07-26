/*
 *  The modal overlay which pops up when user switches shipping country
 */

;(function($, window, mediator) {
    'use strict';

    var MF = window.MF || (window.MF = {});

    var defaultOptions = {
        url: {
            checkCountryWithinSite: "/ajax/checkout/deliveryAddress/checkCountrySameAsInSession",
            selectCountry: "/_s/country?isoCode={0}&redirectUrl={1}"
        },

        selectors: {
            dialog: ".shipping-country-switcher"
        },

        outEvents: {
            countrySwitching : "delivery:country:switching"
        }
    };

    var defaultSwitchOptions = {
        "redirectUrl": "/shopping-bag/switch",
        "handlers": {}
    };

    MF.shippingCountrySwitch = (function() {

        var options;
        var deferredDialogResult;
        var $shippingCountrySwitchDialog;

        var isPromise = function(obj) {
            return obj && typeof obj.then === "function";
        };

        var closeDialog = function() {
            MF.overlay.close();
        };

        var openDialog = function() {
            MF.overlay.openWithElement({
               element: $shippingCountrySwitchDialog
            })
        };

        var checkCountryIsAssociatedWithCurrentSite = function(countryCode) {
            var payload = {
                "countryCode": countryCode
            };

            return $.post(options.url.checkCountryWithinSite, payload)
                .fail(function() {
                    console.error("Can not identify if a given country is associated with current site");
                });
        };

        var switchToCountrySpecificSite = function(isoCode, redirectUrl) {
            // prepend site url prefix (/uk, /us or empty string) to select country url
            // and provide country iso code and redirect url
            var redirectPath = ACC.config.siteUrlPrefix + options.url.selectCountry
                                   .replace("{0}", isoCode)
                                   .replace("{1}", redirectUrl);

            window.location.href = redirectPath;
        };

        var callHandler = function(handler) {
            var result = handler && handler();

            if (isPromise(result)) {
                return result;
            }

            return $.Deferred().resolve();
        };

        var createDeferredModalResult = function(switchOptions) {
            var countryCode = switchOptions.countryCode;
            var redirectUrl = switchOptions.redirectUrl || "";
            var handlers = switchOptions.handlers;

            var deferredDialogResult = $.Deferred();

            deferredDialogResult.progress(function(action) {
                callHandler(handlers[action]).then(function(result) {
                    if (action === "onContinue") {
                        switchToCountrySpecificSite(countryCode, redirectUrl);
                    }

                    deferredDialogResult.resolve(result);
                });
            });

            return deferredDialogResult;
        };

        var switchCountry = function(switchOptions) {
            switchOptions = $.extend({}, defaultSwitchOptions, switchOptions);

            var countryCode = switchOptions.countryCode;
            var previousCountryCode = switchOptions.previousCountryCode;

            deferredDialogResult = createDeferredModalResult(switchOptions);
            
            if (previousCountryCode && previousCountryCode != countryCode) {
            	openDialog();
            } else {
            	checkCountryIsAssociatedWithCurrentSite(countryCode).then(function(response) {
                    if (response.status === "SUCCESS" && response.data.result === false) {
                        openDialog();
                    } else {
                        deferredDialogResult.notify("onCountryWithinCurrentSite");
                    }
                });
            }

            return deferredDialogResult.promise();
        };

        var onCancelButtonClicked = function() {
            deferredDialogResult.notify("onClose");
            closeDialog();
        };

        var onContinueButtonClicked = function() {

            mediator.publishAsync(defaultOptions.outEvents.countrySwitching);

            deferredDialogResult.notify("onContinue");
        };

        var onDialogClose = function() {
            deferredDialogResult.notify("onClose");
        };

        var bindEvents = function() {
            $shippingCountrySwitchDialog.on("click", ".cancel-btn", onCancelButtonClicked);
            $shippingCountrySwitchDialog.on("click", ".continue-btn", onContinueButtonClicked);
            $shippingCountrySwitchDialog.on("click", ".mfp-close", onDialogClose);
        };

        var initObjects = function() {
            $shippingCountrySwitchDialog = $(options.selectors.dialog);
        };

        var init = function(opts) {
            options = $.extend({}, defaultOptions, opts);

            initObjects();
            bindEvents();
        };

        return {
            init: init,
            switchCountry: switchCountry
        };

    })();

}(jQuery, this, MF.checkout.mediator));

MF.shippingCountrySwitch.init();
