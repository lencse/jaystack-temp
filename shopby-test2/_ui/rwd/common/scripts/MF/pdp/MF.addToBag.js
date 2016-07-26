;(function($, mediator) {
    "use strict";

    var MF = window.MF || {};

    MF.addToBagForm = function() {

        var $form,
            $qty,
            $productCode,
			addToBagButton,
            dataProvider;

        var validateForm = function() {
            var productCodePost = $productCode.val();
            var hasProductCode = (productCodePost !== "");

			if(!hasProductCode) {
				dataProvider.notifyNoProductCode();
			}
            return hasProductCode;
        };

        var onBeforeSubmit = function() {
            return validateForm() && addToBagButton.disable();
        };

        var onSuccess = function(obj) {
            if (obj.cartData.StockError == '') {
                mediator.publish("cart:product:added", {
                    qty: $qty.val(),
                    productCode: $productCode.val()
                });
                addToBagButton.enable();
                addToBagButton.showOverlayMessage();
            } else {
                addToBagButton.showErrorMessage();
            }
        };

        var onError = function() {
            addToBagButton.showErrorMessage();
        };

        var updateFields = function(productCode, qty) {
            $productCode.val(productCode || dataProvider.getProductCode());
            $qty.val(qty || dataProvider.getQty());
        };

        var onBeforeSerialize = function() {
            updateFields();
        };

        var init = function(_$form, _dataProvider) {
            $form = _$form;
            dataProvider = _dataProvider;
            $qty = $("input[name='qty']", $form);
            $productCode = $("input[name='productCodePost']", $form);

			addToBagButton = MF.addToBagButton({
				selectors: {
					container: $form,
					button: "[data-add-to-basket]"
				}
			});

            $form.ajaxForm({
                beforeSerialize: onBeforeSerialize,
                beforeSubmit: onBeforeSubmit,
                success: onSuccess,
                error: onError
            });
        };

        return {
            init: init,
            updateFields: updateFields,
            validateForm: validateForm
        };
    };

    window.MF = MF;

}(jQuery, mediator));
