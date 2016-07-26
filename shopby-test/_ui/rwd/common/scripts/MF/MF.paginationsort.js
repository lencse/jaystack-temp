/*
 *  Dependencies 
 *  MF.select
 *  
 */

;(function ($, window, document){
	'use strict';

	var MF = window.MF || {};

	MF.paginationsort = (function () {

		var defaults = {
			downUpKeysPressed: false
		};

		function bindAll()
		{
			bindPaginaSort();
		}

		function bindPaginaSort()
		{
			MF.select.init({
				callback: function(){
					$('#sort_form1').submit();
				},
				contextId: "#sort_form1"
			});

			bindSortForm($('#sort_form1'));
			bindSortForm($('#sort_form2'));
		}

		function bindSortForm(sortForm)
		{

			if ($.browser.msie)
			{
				sortFormIEFix($(sortForm).children('select'), $(sortForm).children('select').val());
			}

			sortForm.change(function ()
			{
				if (!$.browser.msie)
				{
					this.submit();
				}
				else
				{
					if (!defaults.downUpPressed)
					{
						this.submit();
					}
					defaults.downUpPressed = false;
				}
			});
		}

		function sortFormIEFix(sortOptions, selectedOption)
		{
			sortOptions.keydown(function (e)
			{
				// Pressed up or down keys
				if (e.keyCode === 38 || e.keyCode === 40)
				{
					defaults.downUpPressed = true;
				}
				// Pressed enter
				else if (e.keyCode === 13 && selectedOption !== $(this).val())
				{
					$(this).parent().submit();
				}
				// Any other key
				else
				{
					defaults.downUpPressed = false;
				}
			});
		}

	    return {
	      bindAll: bindAll
	    };

  })();

  window.MF = MF;

}(jQuery, this, this.document));


MF.paginationsort.bindAll();
