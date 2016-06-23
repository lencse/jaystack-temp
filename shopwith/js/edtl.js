//API TO GET DETAILS FOR ONE PRODUCT
var apiURI = "/ajax/p/";

/* MAKING THE IMAGE MAPS RESPONSIVE (plugin rwdImageMaps - http://mattstow.com/experiment/responsive-image-maps/rwd-image-maps.html ) */
function rwdImgMaps() {
	$('img[usemap]').rwdImageMaps();
}

/* Obtains the product info via AJAX for the the mapped areas */
// Requires the attribute [data-id] with the ID of the product
// It will only do this for the areas not to have rollover tips
function setMappedInfo() {

	$('.editorial_wrapper area').each( function(i) {

		if ( !$(this).hasClass("rollover") ) {
			var prodID = $(this).data("id");
			if ( typeof prodID !== 'undefined' && prodID != '' ) {
				setMappingsInfo($(this), prodID, 0);
			}
		}
	});
}

/**************************************************************************************************************************************/
/* BUILDING THE ROLLOVER TIPS (plugin qTip2 - http://qtip2.com/) */

// Gets a product's info via AJAX and sets it to the href and alt attributes of an element
// (adds an extra data attribute [data-info-loaded] to indicate the info was already obtained)
function setMappingsInfo($area, prodID, hasRollover) {

	var infoLoaded = $area.data("info-loaded");
	if ( typeof infoLoaded === 'undefined' || infoLoaded == '' ) {
		$.getJSON( apiURI + prodID )
			.done(function( json ) {

				var href = json.url;
				var title = json.designerData.name;
				var desc = json.name;
				// var label = ( json.slug == '' ? '' : 'COMING SOON' );
				var label = '';

				if ( hasRollover )
				{
					$area.attr({
						"href": href,
						"alt": title + " | " + desc + ( label == '' ? label : " | " + label ),
						"data-info-loaded": "yes"
					});

					setTipContent($area);
				}
				else
				{
					var altTag = title.toUpperCase() + " " + desc;
					$area.attr({
						"href": href,
						"alt": altTag,
						"title": altTag,
						"data-info-loaded": "yes"
					});
				}

			})
			.fail(function( jqxhr, textStatus, error ) {
				var err = textStatus + ", " + error;
				console.log( "Request Failed: " + err );
			});
	}
}

// Builds the tip content
function buildBubble(href, title, desc, label, $elem) {

	var bubbleContent = "";

	var cta = "SHOP NOW";

	var cssClass="mfBubble";

	if ( typeof title === "undefined" || title == "" )
	{
		// console.log( "title is undefined" );
		bubbleContent = "";
	}
	else {

		if( typeof label !== "undefined" )
		{
			cta = label;
		}

		var dataPopupTarget = " ";
		var popupTarget;
		if ( $elem.hasClass("popup-edtl-signup") ) {
			popupTarget = $elem.data("popup-target");

			if ( popupTarget !== undefined ) {
				cssClass += " popup-edtl-signup";
				dataPopupTarget = "data-popup-target='" + popupTarget + "'";
			}
		}

		bubbleContent = '<a href="' + href + '" class="' + cssClass + '"' + dataPopupTarget + '>' +
	      					'<span class="mfBubble__designer">' + title + '</span>' +
	      					'<span class="mfBubble__desc">' + desc + '</span>' +
	      					'<span class="mfBubble__cta">' + cta + '</span>' +
	      				'</a>';
    }

    return bubbleContent;
}

// Sets the tip content(get's the content from the element href and alt tags)
// assumes the tip already exists (attribute [data-hasqtip])
function setTipContent($this) {

	var alt = $this.attr("alt");
	var href = $this.attr("href");
	var title = '';
	var desc = '';
	var label = '';
	if ( alt !== undefined )
	{
		var prod = alt.split("|");
		title = prod[0];
		desc = prod[1];
		label = '';
	    if( prod.length > 1 ) {
	      label = prod[2];
	    }
	}

  	bubbleContent = buildBubble(href, title, desc, label, $this);

	var tip = "#qtip-" + $this.data("hasqtip");
	$(tip).find(".qtip-content").html(bubbleContent);
}

// Updates the tip content
// gets the product info via AJAX (if need be) and updates the alt and href tags
function updateTip($this) {

	var prodID = $this.data("id");
	if ( typeof prodID !== 'undefined' && prodID != '' )
	{
		setMappingsInfo($this, prodID, 1);
	}
	else {
		setTipContent($this);
	}

	if ( $this.hasClass("popup-edtl-signup") ) {

		var qTipNr = $this.data("hasqtip");
		var $qTipElem = $("#qtip-" + qTipNr + " > .qtip-content > a");

		_designerPopup($qTipElem);
	}
}

// Creates a rollover tip for every area with class="rollover"
function createRolloverTips() {

	var alt;
	var href;
	var prod;
	var title;
	var desc;
	var label;
	var bubbleContent;

	$('.editorial_wrapper area[class~="rollover"]').each( function(i) {
		var $this = $(this);

		href = $this.attr("href");
		alt = $this.attr("alt");
		title = '';
		desc = '';
		label = '';
		if ( alt !== undefined )
		{
			// console.log(alt);
			prod = alt.split("|");
			title = prod[0];
			desc = prod[1];
	        if( prod.length > 1 ) {
	          label = prod[2];
	        }
	        // console.log(label);
		}

      	bubbleContent = buildBubble(href, title, desc, label, $this);

    	$this.qtip({
    		content: {
		      	text: bubbleContent
		    },
		    events: {
		        render: function(event, api) { //this event is triggered when the tooltip is rendered (not on page load and only once)
		        	console.log("!!!RENDERING TOOLTIP!!!");
		            updateTip($this);
		        }
		    },
		    style: {
		      classes: 'qtip-matches'
		    },
		    position: {
		       my: 'center center',  // Position my top left...
		           at: 'center center' // at the bottom right of...
		         },
		        show: {
		             solo: true
		             // delay: 200
		        },
		    hide: {
		             fixed: true
		             //delay: 100
		        }
    	});
	});
}


/**************************************************************************************************************************************/
/* SHARE ICONS FUNCTIONALITIES */

function getSocialIconsWidth($btn) {
	// return $btn.siblings(".share-icons").outerWidth(true);
	var socialWidth = 0;

	$btn.siblings(".share-icons").find("a").each( function(i) {
		// console.log("socialWidth: " + socialWidth);
		socialWidth += $(this).outerWidth(true);
	});

	// console.log("socialWidth: " + socialWidth);

	return socialWidth;
}

function getSocialWidth($btn) {

	var total = $btn.outerWidth(true);
	total += getSocialIconsWidth($btn);

	return total;
}

function desktopSocial($btn) {

	// var totalWidth = getSocialWidth($btn);
	// var iconsW = getSocialIconsWidth($btn);
	var totalWidth = 0;
	var iconsW = 0;

	var btnWidth;
	var btnXinit;
	var btnYinit;
	var rightInit;

	var onMobile = Breakpoints.on({
		name: "mobile",
		matched: function() {
			$btn.parent().css("width", "");
			$btn.siblings(".share-icons").css("width", "");
			$btn.siblings("#dummy").css("width", "");
		},
		exit: function() {
		}
	});

	var onTablet = Breakpoints.on({
		name: "tablet",
		matched: function() {
			$btn.parent().css("width", "");
			$btn.siblings(".share-icons").css("width", "");
			$btn.siblings("#dummy").css("width", "");
		},
		exit: function() {
		}
	});

	var onDesktop = Breakpoints.on({
		name: "desktop",
		matched: function() {

			if ( totalWidth == 0 )
			{
				totalWidth = getSocialWidth($btn);
			}

			if ( iconsW == 0 )
			{
				iconsW = getSocialIconsWidth($btn);
			}

			btnWidth = $("#share_btn").outerWidth(true);
			btnXinit = $("#share_btn").position().left;
			btnYinit = btnXinit + btnWidth;
			rightInit = totalWidth-btnYinit;

			$btn.parent().width(totalWidth);
			$btn.siblings(".share-icons").width(iconsW);
			$btn.siblings("#dummy").width(iconsW);
		},
		exit: function() {
			// $btn.parent().css("width", "");
			// $btn.siblings(".share-icons").css("width", "");
			// $btn.siblings("#dummy").css("width", "");
		}
	});
	var onDesktopLarge = Breakpoints.on({
		name: "desktop-large",
		matched: function() {
			if ( totalWidth == 0 )
			{
				totalWidth = getSocialWidth($btn);
			}

			if ( iconsW == 0 )
			{
				iconsW = getSocialIconsWidth($btn);
			}

			btnWidth = $("#share_btn").outerWidth(true);
			btnXinit = $("#share_btn").position().left;
			btnYinit = btnXinit + btnWidth;
			rightInit = totalWidth-btnYinit;

			$btn.parent().width(totalWidth);
			$btn.siblings(".share-icons").width(iconsW);
			$btn.siblings("#dummy").width(iconsW);
		},
		exit: function() {
			// $btn.parent().css("width", "");
			// $btn.siblings(".share-icons").css("width", "");
			// $btn.siblings("#dummy").css("width", "");
		}
	});


	$("#share_btn").toggle( function() {


		btnWidth = $("#share_btn").outerWidth(true);
		btnXinit = $("#share_btn").position().left;
		btnYinit = btnXinit + btnWidth;
		rightInit = totalWidth-btnYinit;

		$(this).css({"position": "relative", "z-index": 3}).animate({
			"left": -btnXinit
		}, 250);

		$("#dummy").css({
			// "width": totalWidth,
			"right": rightInit,
			"display": "block"
			})
			.animate({
				// "right": totalWidth
				"right": iconsW
			}, 250);

		$(this).siblings(".share-icons")
			.css({
				"right": rightInit,
				"opacity": 0,
				"display": "block"
			}).animate({
				right: 0,
				opacity: 1
			}, 500);
	}, function() {

		$("#dummy")
			.animate({
				right: "35%"
			}, 500);

		$(this).animate({
			"left": 0
		}, 500);

		$(this).siblings(".share-icons")
			.animate({
				right: "35%"
			}, 1000);
	});
}

// creates the slide down functionality for mobile, and the slide left/right for desktop
function social() {

	//mobile
	$("#share_btn_mob").on("click", function(e){
		e.preventDefault();
		$(this).siblings(".share-icons").slideToggle();
	});

	//desktop/large desktop
	desktopSocial($("#share_btn"));
}


/***********************************************/
/* GET PRODUCT DETAILS */

function _getProductData(prodID, $elem) {

	var infoLoaded = $elem.data("info-loaded");
	if ( typeof infoLoaded === 'undefined' || infoLoaded == '' ) {

	    $.getJSON( apiURI  + prodID)
	      .done(function( json ) {

	        var href = json.url;
	        var brand = json.designerData.name;
	        var name = json.name;
	        var price = json.priceData.formattedValue;

	        var html = "<a href='" + href + "'>" +
	                    "       <span class='editorial-prod__details__brand'>" + brand + "</span>" +
	                    "       <span class='editorial-prod__details__desc'>" + name + "</span>" +
	                    "       <span class='editorial-prod__details__price'>" + price + "</span>" +
	                    "       <span class='editorial-prod__details__cta'>Shop Now</span>" +
	                    "   </a>";

	        $elem.append(html);

	        $elem.attr({
				"data-info-loaded": "yes"
			});

	    })
	    .fail(function( jqxhr, textStatus, error ) {
	        var err = textStatus + ", " + error;
	        console.log( "Request Failed: " + err );
	    });
	}
}

function buildProductDetails() {

	$('.editorial_wrapper div[class~="editorial-prod__details"]').each( function(i) {
		var $this = $(this);

		var prodID = $this.data("id");
		if ( typeof prodID !== 'undefined' && prodID != '' ) {
			_getProductData(prodID, $this);
		}
	});

}


/**************************************************/
/* DESIGNER SIGN UP POP-UPS */

function _designerPopup($elem) {

	$elem.on("click", function(e){
		e.preventDefault();
		MF.overlay.openWithElement({
		  element: $( '#' + $elem.data("popup-target") )
		});
	});
}

function designersSignUpPopups(){
  $('[class~="popup-edtl-signup"]').each( function(i) {
		var $this = $(this);

		_designerPopup($this);
	});
}


/**************************************************************************************************************************************/
$(document).ready(function($) {



	// Fill info (alt and href tags) for the mapped areas that won't have rollovers
	setMappedInfo();

	//building the rollover tips
	createRolloverTips();

	// Responsive image maps
	if ($('img[usemap]').length) rwdImgMaps();

	//Get single product details
	buildProductDetails();

	//designer sign up pop ups
	designersSignUpPopups();


	/**************************************************/

	

});
