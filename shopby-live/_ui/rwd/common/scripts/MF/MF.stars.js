/*
 *  No Dependencies 
 *  
 */

;(function ($, window, document){
  'use strict';

  var MF = window.MF || {};

  MF.stars = (function () {

    function bindStarsWrapperRadioButtons(radioButtons)
	{
		var length = radioButtons.length;
		radioButtons.change(function() {
			for (var btnNo = 1; btnNo <= length; btnNo++)
			{
				var ratingId = '#rating' + btnNo;

				if (btnNo <= $(this).val())
				{
					$(ratingId).prev().removeClass('no_star');
				}
				else
				{
					$(ratingId).prev().addClass('no_star');
				}

				$(ratingId).prev().removeClass('selected');
			}
			$(this).prev().addClass('selected');
		});
	}

	function bindStarsWrapperRadioButtonsFirstTimeFocus(radioButtons)
	{
		radioButtons.one('focus', function() {
			$(this).trigger('change');
		});
	}

	function initialize()
	{
		bindStarsWrapperRadioButtons($('#stars-wrapper input'));
		bindStarsWrapperRadioButtonsFirstTimeFocus($('#stars-wrapper input'));
	}

    return {
      initialize: initialize
    };

  })();

  window.MF = MF;

}(jQuery, this, this.document));


MF.stars.initialize();

