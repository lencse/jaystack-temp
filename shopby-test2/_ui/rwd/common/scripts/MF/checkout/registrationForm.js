/*
 *  requires
 *
 *  MF.select
 */

;(function($, window){
	'use strict';
	var MF = window.MF = window.MF || {};

	MF.registrationForm = (function() {
		function init() {
			bindAll();
			initSelectElements();
			adjustSeparatorHeight();
			expandOnError();
		}
		function expandOnError() {
			if( $('.checkout-stage__wrapper__register, .login-stage__wrapper__register').find('.error').exists()  ) {
				expandRegistration();
			}
		}
		function initSelectElements() {
			MF.select.init( {contextId: '.checkout-stage__wrapper__account-create, .login-stage__wrapper__account-create'} );
		}
		function adjustSeparatorHeight() {
			var heightLogin = $('.checkout-stage__wrapper__login, .login-stage__wrapper__login').height();
			var heightRegister = $('.checkout-stage__wrapper__register, .login-stage__wrapper__register').height();
			$('.border-line').height( Math.max ( heightLogin, heightRegister ) );
			$(this).css('overflow', 'visible');
		}
		function expandRegistration() {
			var register = $('.checkout-stage__wrapper__register, .login-stage__wrapper__register');
			register.find('.register-btn').slideUp();
			register.find('.registration-form__wrapper').slideDown(adjustSeparatorHeight);
		}
		function bindRegistrationExpand() {
			$('.checkout-stage__wrapper__register, .login-stage__wrapper__register').find('.register-btn').on('click', expandRegistration);
		}
		function bindAll() {
			bindRegistrationExpand();
		}
		return {
			init: init,
			bindAll: bindAll,
			adjustSeparatorHeight: adjustSeparatorHeight
		};
	})()

	MF.registrationForm.init();

}(jQuery, this));
