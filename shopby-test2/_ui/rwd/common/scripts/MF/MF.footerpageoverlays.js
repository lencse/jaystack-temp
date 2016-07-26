;(function ($, window, document){
	'use strict';
	var MF = window.MF = window.MF || {};

	MF.footerPageOverlays = (function(){
		function init() {
			if ( $('.footer-page-popup').length == 0 ) {
				return;
			}
			$(function(){
				bindAll();
			});
		}

		function bindAll() {
			bindReturnspopup();
			bindDeliverypopup();
			bindHelppopup();
			bindFaqspopup();
		}

		function bindFaqspopup() {
			$('[data-product-cites]').on('click', function(event){
				openFaqspopup(true);
				event.preventDefault();
			})
		}

		function bindReturnspopup(){
			$('#returnsPopupLink, #mobileReturnsPopupLink, .acc__content__header .order__help, [data-pdp-returns]').on("click", function(event){
				openReturnspopup();
				event.preventDefault();
			});
		}

		function bindDeliverypopup(){
			$('#deliveryPopupLink, #mobileDeliveryPopupLink, [data-pdp-delivery]').on("click", function(event){
				openDeliverypopup();
				event.preventDefault();
			});
		}

		function bindHelppopup(){
			$('#helpPopupLink, #mobileHelpPopupLink').on("click", function(event){
				openContactUspopup();
				event.preventDefault();
			});
		}

		function openReturnspopup() {
			MF.busyOverlay.enable();
			$.ajax({
                beforeSend: function (request)
                {
                    request.setRequestHeader("Cache-Control", "no-store");
                },
				url: "/ajax/returns/noPageTemplate",
				cache: false,
				success: function (data) {
					if( $('.returns-page-popup').length > 0 ) {	 //TODO: might need to remove this condition
						$('.returns-page-popup__content').html(data)
						$('.returns-page-popup').find('.ft-page__left-nav').find('li, ul').hide();
						var $elements = $('.returns-page-popup').find('[href="/contact-us"], [href="/faqs"], [href="/delivery"], [href="/returns"]').parents('ul, li').show();
						MF.footerPage.init();
						MF.returns.init();
						popupifyLeftHandLinks();
					}
				}
			}).always(function(){
				MF.busyOverlay.disable();
			});
			$(function(){
				MF.overlay.openWithElement({element: $('.returns-page-popup')})
			})
		}

		function openDeliverypopup() {
			MF.busyOverlay.enable();
			$.ajax({
                beforeSend: function (request)
                {
                    request.setRequestHeader("Cache-Control", "no-store");
                },
				url: "/ajax/delivery/noPageTemplate",
				cache: false,
				success: function (data) {
					if( $('.footer-page-popup').length > 0 ) {	 //TODO: might need to remove this condition
						$('.footer-page-popup__content').html(data)
						$('.footer-page-popup').find('.ft-page__left-nav').find('li, ul').hide();
						var $elements = $('.footer-page-popup').find('[href="/contact-us"], [href="/faqs"], [href="/delivery"], [href="/returns"]').parents('ul, li').show();
						MF.footerPage.init();
						MF.deliveryMethodSelector.init();
						popupifyLeftHandLinks();
						MF.accordion.init();
					}
				}
			}).always(function(){
				MF.busyOverlay.disable();
			});
			$(function(){
				MF.overlay.openWithElement({element: $('.footer-page-popup')})
			})
		}

		function showContactUsThankYou() {
			$(".thank-you-message").show();
			$(".contact-form").hide();
		}

		function hideContactUsThankYou() {
			$(".thank-you-message").hide();
			$(".contact-form").show();
		}

		function errorContactUS() {
			showContactUsThankYou();
			console.log("Error submitting contact us form");
		}

		function openContactUspopup() {
			MF.busyOverlay.enable();
			$.ajax({
                beforeSend: function (request)
                {
                    request.setRequestHeader("Cache-Control", "no-store");
                },
				url: "/ajax/contactus/noPageTemplate",
				cache: false,
				success: function (data) {
					if( $('.footer-page-popup').length > 0 ) {	 //TODO: might need to remove this condition
						$('.footer-page-popup__content').html(data)
						$('.footer-page-popup').find('.ft-page__left-nav').find('li, ul').hide();
						var $elements = $('.footer-page-popup').find('[href="/contact-us"], [href="/faqs"], [href="/delivery"], [href="/returns"]').parents('ul, li').show();
						MF.footerPage.init();
						popupifyLeftHandLinks();
						var contactUsFormObj = MF.contactUsForm();
						contactUsFormObj.init({hideOrderNoField: true});
						contactUsFormObj.setSubject($("#contactUsCheckoutSubject").text().trim());
						hideContactUsThankYou();

						contactUsFormObj.getForm().ajaxForm({
							// type: "POST",
							dataType: "jsonp",
							success: function() {
								showContactUsThankYou();
							},
							error: errorContactUS,
							beforeSubmit: function() {
								return contactUsFormObj.getValidator().form();
							}
						});
					}
				}
			}).always(function(){
				MF.busyOverlay.disable();
			});
			$(function(){
				MF.overlay.openWithElement({element: $('.footer-page-popup')})
			})
		}

		function openFaqspopup(scrollToShippingRestrictions) {
			MF.busyOverlay.enable();
			$.ajax({
                beforeSend: function (request)
                {
                    request.setRequestHeader("Cache-Control", "no-store");
                },
				url: "/ajax/faqs/noPageTemplate",
				cache: false,
				success: function (data) {
					if( $('.footer-page-popup').length > 0 ) {	 //TODO: might need to remove this condition
						$('.footer-page-popup__content').html(data)
						$('.footer-page-popup').find('.ft-page__left-nav').find('li, ul').hide();
						var $elements = $('.footer-page-popup').find('[href="/contact-us"], [href="/faqs"], [href="/delivery"], [href="/returns"]').parents('ul, li').show();
						MF.footerPage.init();
						popupifyLeftHandLinks();
						if(scrollToShippingRestrictions) {
				 			$('.footer-page-popup').find('a[href="#answer15"]').click();
						}
					}
				}
			}).always(function(){
				MF.busyOverlay.disable();
			});
			$(function(){
				MF.overlay.openWithElement({element: $('.footer-page-popup')})
			})
		}

		function popupifyLeftHandLinks() {
			var $popup = $('.footer-page-popup');
			var $returns_popup = $('.returns-page-popup');
			$returns_popup.find('[href="/returns"]').click(function(event){
				openReturnspopup();
				event.preventDefault();
			});
			$popup.find('[href="/delivery"]').click(function(event){
				openDeliverypopup();
				event.preventDefault();
			});
			$popup.find('[href="/contact-us"]').click(function(event){
				openContactUspopup();
				event.preventDefault();
			});
			$popup.find('[href="/faqs"]').click(function(event){
				openFaqspopup();
				event.preventDefault();
			});

			$('.ft-page__top-nav select').change(function(){
				switch ( $(this).val() ) {
					case '/returns':
						openReturnspopup();
						break
					case '/delivery':
						openDeliverypopup();
						break
					case '/contact-us':
						openContactUspopup();
						break
					case '/faqs':
						openFaqspopup();
						break
				}
			})
		}



		return {
			init: init
		}

	})()

}(jQuery, this, this.document));

MF.footerPageOverlays.init();
