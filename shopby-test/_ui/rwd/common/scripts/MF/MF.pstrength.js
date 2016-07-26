/*
 *  require (TODO: Transfer the Constants below into MF.config and stop littering the namespace!)
 *
 *  MF.pwdStrengthVeryWeak
 *  MF.pwdStrengthWeak
 *  MF.pwdStrengthMedium
 *  MF.pwdStrengthStrong,
 *  MF.pwdStrengthVeryStrong
 *  MF.pwdStrengthTooShortPwd
 *  MF.pwdStrengthMinCharText
 *  
 */

;(function ($, window, document){
  'use strict';

  var MF = window.MF || {};

  MF.pwdstrength = (function () {

    function bindAll()
	{
		bindPStrength();
	}

	function bindPStrength()
	{
		$('.strength').pstrength({ verdicts: [MF.pwdStrengthVeryWeak,
			MF.pwdStrengthWeak,
			MF.pwdStrengthMedium,
			MF.pwdStrengthStrong,
			MF.pwdStrengthVeryStrong],
			tooShort: MF.pwdStrengthTooShortPwd,
			minCharText: MF.pwdStrengthMinCharText });
	}

    return {
      bindAll: bindAll
    };

  })();

  window.MF = MF;

}(jQuery, this, this.document));


MF.pwdstrength.bindAll();
