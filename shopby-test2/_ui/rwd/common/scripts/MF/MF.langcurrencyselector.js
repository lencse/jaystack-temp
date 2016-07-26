/*
 *  No dependencies 
 *  
 */

;(function ($, window, document){
  'use strict';

  var MF = window.MF || {};

  MF.langcurrency = (function () {

    var defaults = {};

    function bindAll()
	{
		bindLangCurrencySelector();
	}

	function bindLangCurrencySelector()
	{
		$('#lang-selector').change(function ()
		{
			$('#lang-form').submit();
		});

		$('#country-selector').change(function ()
		{
			$('#country-form').submit();
		});
	}

    return {
      bindAll: bindAll
    };

  })();

  window.MF = MF;

}(jQuery, this, this.document));


MF.langcurrency.bindAll();
