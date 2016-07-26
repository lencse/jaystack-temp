/*
 *  require
 *  MF.track.trackRemoveFromCart
 *  MF.track.trackUpdateCart
 */

;(function($, window, mediator) {
    "use strict";

    var MF = window.MF || {};

    var defaultOptions = {
        selectors: {
            removeProductLink: "[id^='RemoveProduct_']"
        },
        outEvents: {
            cartItemRemoved: "cart:product:removed"
        },
        cartItemsContainer: null
    };

    MF.cartActions = function() {

        var options = {};

        var callbacks = {
            onCartItemRemoved: $.Callbacks("unique stopOnFalse"),
            onCartItemVariantChanged: $.Callbacks("unique stopOnFalse"),
            onCartItemQtyChanged: $.Callbacks("unique stopOnFalse")
        };

        function bindCartModifications() {
            $(options.selectors.removeProductLink).on("click", onRemoveCartItem);
        }

        function onRemoveCartItem(e) {
            e.preventDefault();

            var removeCartItemUrl = $(this).data('href');
            var entryNumber = $(this).data("entryNumber");

            $.post(removeCartItemUrl, {
                entryNumber: entryNumber
            }).then(function() {
                mediator.publish(options.outEvents.cartItemRemoved, entryNumber);
                callbacks.onCartItemRemoved.fire(entryNumber);
            });

            // TODO Track remove cart item
        }

        function onCartItemQtyChanged($updateQtyForm, newCartQuantity) {
            var productCode = $("[name='productCode']", $updateQtyForm).val();
            var initialCartQuantity = $("[name='initialCartQuantity']", $updateQtyForm).val();

            MF.track.trackUpdateCart(productCode, initialCartQuantity, newCartQuantity);

            $updateQtyForm.ajaxSubmit({
                success: function() {
                    callbacks.onCartItemQtyChanged.fire(productCode, newCartQuantity);
                }
            });
        }

        function bindUpdateQtyForms() {
            $("[data-update-cart-form]", options.cartItemsContainer).each(function() {
                var $form = $(this);

                MF.select.init({
                    contextId: $form,
                    callback: function(value) {
                        onCartItemQtyChanged($form, value);
                    }
                });
            });
        }

        function bindUpdateVariantsForm() {
            $("form.product-sizes", options.cartItemsContainer).each(function() {
                var $form = $(this);

                var productId = $("input[name=productId]", this).val();
                var selectedSize = $("input[name=selectedSize]", this).val();

                loadSizeData(productId, selectedSize, $form);
            });
        }

        function loadSizeData(productId, selectedSize, $form) {
            var variantDD = MF.variantDropDown();
            var $container = $("div.variantDropDown-" + selectedSize, $form);

            variantDD.init({
                container: $container,
                selectedValue: selectedSize,
                variantDDTemplate: "#variantSizeOptionsTemplate",
                elementId: "sizeVariant-" + selectedSize,
                elementName: "newVariant"
            });

            variantDD.loadVariants(productId);

            variantDD.callbacks.onChange.add(_.partial(onVariantChange, $form));
        }

        function onVariantChange($form, variantCode) {
            var entryNumber = $("input[name=entryNumber]", $form).val();

            $form.ajaxSubmit({
                success: function() {
                    callbacks.onCartItemVariantChanged.fire(entryNumber, variantCode);
                }
            });
        }

        function init(opts) {
            options = $.extend(true, {}, defaultOptions, opts);

            bindCartModifications();
            bindUpdateQtyForms();
            bindUpdateVariantsForm();
        }

        return {
            init: init,
            callbacks: callbacks
        };

    };

// TODO Here we use global variable 'mediator' which is a bad idea.
// Instead we should use a common mediator instance per application.
}(jQuery, this, mediator));
