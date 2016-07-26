/*
 *  No Dependencies 
 *  
 */

;(function ($, window, document){
  'use strict';

  var MF = window.MF || {};

  MF.skiplinks = (function () {

    function bindAll()
	{
		bindLinks();
	}

	function bindLinks()
	{
		$("a[href^='#']").not("a[href='#']").not('.faq__questions a').click(function()
		{
			var target = $(this).attr("href");
			$(target).attr("tabIndex", -1).focus();
		});
	}

    return {
      bindAll: bindAll
    };

  })();

  window.MF = MF;

}(jQuery, this, this.document));


if ($.browser.webkit)
{
	MF.skiplinks.bindAll();
}

