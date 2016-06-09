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


$(document).ready(function($) {
	social();
});