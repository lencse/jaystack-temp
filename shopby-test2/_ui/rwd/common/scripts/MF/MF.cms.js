/*
 *  No dependencies 
 *  
 */

;(function ($, window, document){
  'use strict';

  var MF = window.MF || {};

  MF.cms = (function () {

    var defaults = {};

    function bindAll()
	{
		bindNavigationBarMenu();
	}

	function bindNavigationBarMenu()
	{
		$('li.La ul ul a').each(function ()
		{
			$(this).focus(function ()
			{
				$(this).addClass('focused');
				var menuParent = $(this).closest('ul').parent().closest('ul');
				$(menuParent).addClass('dropdown-visible');
			});

			$(this).blur(function ()
			{
				$(this).removeClass('focused');
				var menuParent = $(this).closest('ul').parent().closest('ul');
				if (!$('.focused', menuParent).length)
				{
					$(menuParent).removeClass('dropdown-visible');
				}
			});
		});
	}

    return {
      bindAll: bindAll
    };

  })();

  window.MF = MF;

}(jQuery, this, this.document));


MF.cms.bindAll();

