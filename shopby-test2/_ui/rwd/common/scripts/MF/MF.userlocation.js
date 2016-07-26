/*
 *  No Dependencies 
 *  
 */

;(function ($, window, document){
  'use strict';

  var MF = window.MF || {};

  MF.userlocation = (function () {

    var defaults = {};

    function bindAll()
	{
		bindUserLocationSearchButtonClick();
		bindUserLocationEnterPress();
		bindAutoLocationSearchButtonClick();
	}

	function bindUserLocationEnterPress()
	{
		$('#user_location_query').keypress(function (e)
		{
			var code = null;
			code = (e.keyCode ? e.keyCode : e.which);
			if (code == 13)
			{
				$.ajax({
					url: searchUserLocationUrl,
					type: 'GET',
					data: {q: $('#user_location_query').attr("value")},
					success: function (data)
					{
						location.reload();
					}
				});
				return false;
			}
		});
	}

	function bindUserLocationSearchButtonClick()
	{
		$('#user_location_query_button').click(function (e)
		{
			$.ajax({
				url: searchUserLocationUrl,
				type: 'GET',
				data: {q: $('#user_location_query').attr("value")},
				success: function (data)
				{
					location.reload();
				}
			});
			return false;
		});
	}

	function bindAutoLocationSearchButtonClick()
	{
		$(document).on("click", "#findStoresNearMeAjax", function (e)
		{
			e.preventDefault();
			try
			{
				var gps = navigator.geolocation;
				gps.getCurrentPosition(positionSuccessStoresNearMe, function (error)
				{
					console.log("An error occurred... The error code and message are: " + error.code + "/" + error.message);
				});
			}
			catch (error)
			{
				console.log("An error occurred... ");
			}
		});
	}

	function positionSuccessStoresNearMe(position)
	{
		if (typeof autoUserLocationUrl !== 'undefined')
		{
			$.ajax({
				url: autoUserLocationUrl,
				type: 'POST',
				data: {latitude: position.coords.latitude, longitude: position.coords.longitude},
				success: function (data)
				{
					location.reload();
				}
			});
		}

		return false;
	}

    return {
      bindAll: bindAll
    };

  })();

  window.MF = MF;

}(jQuery, this, this.document));


MF.userlocation.bindAll();

