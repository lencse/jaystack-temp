/* Settings Page */
$(function() {

	if($(".grid-container .settings__container").length){
		
		MF.select.init({
	        contextId: '#settings__wrapper'
	    });

		var adjustSelectHeight = _.throttle(function(){
			var   $window = $(window)
				, $element = $('.settings__shipping__country .cs__options')
				, $select = $('.settings__shipping__country .cs__selected')
				, $header = $('.header-wrapper')
				, winScrollTop = $window.scrollTop()
				, winHeight = $window.height()
				, headerHeight = $header.height()
				, selectOffsetTop = $select.offset().top

			$element.css ({
				top: ( - selectOffsetTop + headerHeight + 40 + winScrollTop ) + 'px',
				height: ( winHeight - headerHeight - 2 * 40 ) + 'px',
				'max-height': 'none'
			});

		}, 510);

		$(window).on('resize scroll', adjustSelectHeight );

		$('.settings__form').on('submit', function(){
			var current_localisation = MF.basepath.get_current_localisation();
			return MF.spinnerHandler.showSpinner('.settings__submit__button', {'margin-left': 0});
		});

		adjustSelectHeight();

	}

	var previousSelectedOption = $('#shippingCountry option:selected').val();

	$(document).on('change','#shippingCountry',function(){
		$.ajax({
			url: "/settings/currencies",
			data: {billingCountryIsoCode: $('#shippingCountry option:selected').val()},
			cache: true,
			success: function(data) {
				populateIndicativeCurrency(data.indicativeCurrency);
				populateBillingCurrencies(data);
				MF.select.refresh('.settings__billing__currency');
				MF.select.refresh('.settings__indicative__currency');
			}
		});
	});

	function populateIndicativeCurrency(currency)
	{
		$('#indicativeCurrency').empty();
		$('.settings__indicative__currency .cs__options').empty();
		if(currency.length === 0)
		{
			$('.settings__indicative__currency').css('display','none');
		}
		else
		{
			$('.settings__indicative__currency').css('display','block');
			$('#indicativeCurrency').append('<option value="">(none)</option><option selected="selected" value="'+currency.isocode+'">'+currency.name+' ('+ currency.symbol+')</option>');
			$('.settings__indicative__currency .cs__options').append('<span class="cs__item selected" data-value="">(none)</span><span class="cs__item" data-value="'+currency.isocode+'"> '+currency.name+' ('+ currency.symbol+')</span>');
			$('.settings__indicative__currency .cs__selected').html(currency.name+' ('+ currency.symbol+')');
		}
	}

	function populateBillingCurrencies(data)
	{
		var currentlySelectedBillingCurrencyIsocode = $('#billingCurrency option:selected').val();
		if (isCurrencyAvailable(data.billingCurrencies, currentlySelectedBillingCurrencyIsocode))
		{
			populateBillingCurrenciesWithSelected(data.billingCurrencies, currentlySelectedBillingCurrencyIsocode);
		}
		else
		{
			populateBillingCurrenciesWithSelected(data.billingCurrencies, data.defaultBillingCurrencyIsocode);
		}
	}

	function isCurrencyAvailable(currencies, currencyIsocode)
	{
		for (i = 0; i < currencies.length; i++) {
			if(currencies[i].isocode == currencyIsocode)
			{
				return true;
			}
		}
		return false;
	}

	function populateBillingCurrenciesWithSelected(currencies, currencyToSelectIsocode)
	{
		$('.settings__billing__currency .cs__options').empty();
		$('#billingCurrency').empty();
		var syms = "";
		$.each(currencies, function(i, currency) {
				if(currency.isocode == currencyToSelectIsocode)
				{
					$('#billingCurrency').append('<option selected="selected" value="'+currency.isocode+'">'+currency.name+' ('+ currency.symbol+')</option>');
					$('.settings__billing__currency .cs__options').append('<span class="cs__item selected" data-value="'+currency.isocode+'"> '+currency.name+' ('+ currency.symbol+')</span>');
					$('.settings__billing__currency .cs__selected').html(currency.name+' ('+ currency.symbol+')');
				}else
				{
					$('#billingCurrency').append('<option value="'+currency.isocode+'">'+currency.name+' ('+ currency.symbol+')</option>');
					$('.settings__billing__currency .cs__options').append('<span class="cs__item" data-value="'+currency.isocode+'"> '+currency.name+' ('+ currency.symbol+')</span>');
				}
				syms+=currency.isocode + " (" + currency.symbol + ")";
				if(currencies.length - 1 != i)
				{
					syms+= ", ";
				}
		});
		$('#billingCurrencyText').html(syms);

	}

    
});
