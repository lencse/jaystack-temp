;(function (window, document) { // Setting a closure function
		'use strict';
		var MF = window.MF || {};
		MF.pdpFetchData = (function () {
			var pdpData;
			var currentProductID;
			var pdp_response_data;
			function getData(productId, options){
				currentProductID = productId;
				pdpData =  $.getJSON("/ajax/p/" + productId, function(){

				})
				.done(function(data){
					pdp_response_data = data;
					if (options !== 'shop_the_look') {
						processData();
					}
				})
				.fail(function() {
					console.log( "MF.pdpFetchData.getData() AJAX request failed." );
				})
				.always(function() {
				});
				return pdpData;
			}
			function processData(){
				setTaxAndDutyMessage();
				setPriceData();
			}
			function setTaxAndDutyMessage(){
				$('.tax-and-duty-message').html(pdp_response_data.taxAndDutyMessage);
			}
			function setPriceData(){
				var productPriceTemplate = $("#productPriceTemplate").html();
				if ( productPriceTemplate !== undefined ){
					var compiledPriceTemplate = Handlebars.compile(productPriceTemplate);
					$('.pdp-price').html(compiledPriceTemplate(pdp_response_data));
				}
			}
			return {
				getData: getData,
				setTaxAndDutyMessage: setTaxAndDutyMessage,
				setPriceData: setPriceData
			};
		})();
		window.MF = MF;
}(this, this.document, $));
