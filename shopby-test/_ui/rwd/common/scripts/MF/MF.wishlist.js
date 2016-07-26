;
(function($, window, document, spinnerHandler) {
	'use strict';

	var MF = window.MF || {};

	MF.wishlist = (function() {

		var mediator = new Mediator();

		var confirmDeletePopup;

		mediator.subscribe("wishlist:bulk", function() {
			var value = arguments[0];
			if (value) {
				MF.select.enable($("#wishlistBulkActions"));
			} else {
				MF.select.disable($("#wishlistBulkActions"));
			}
		});

		mediator.subscribe("wishlist:share", function() {
			var selected = arguments[0];
			var shareWishlistForm = $("#shareWishlistForm");

			if (selected['selected'].length > 0 || selected['all'] == true) {
				shareWishlistForm.find("input[name=productCodes]").val(selected['selected']);
				shareWishlistForm.find("input[name=all]").val(selected['all']);
				shareWishlistForm.submit();
			} else {
				var errorMessage = $("#selectProductToShare").text();
				$(".error").html(errorMessage);
				return false;
			}
		});

		function initSelectAll() {

			var selectAllBtn = $('#selectAll');

			selectAllBtn.on("click", function() {
				var value = $(this).data("value");
				if (value) {
					$(".wishlistItem").prop("checked", "checked");
					$(this).text("Clear All");
					$(this).data("value", false);
					mediator.publish("wishlist:bulk", true);
				} else {
					$(".wishlistItem").removeAttr("checked");
					$(this).text("Select All");
					$(this).data("value", true);
					mediator.publish("wishlist:bulk", false);
				}
			});

			var selected = $(".wishlistItem[checked]").size() > 0;

			selectAllBtn.text(selected ? "Clear All" : "Select All");
			selectAllBtn.data("value", !selected);
			mediator.publish("wishlist:bulk", selected);

		}

		var confirmBulkDelete = function() {
			MF.overlay.openWithElement({
				element : confirmDeletePopup,
				callbacks : {
					close : resetManageOptions
				}
			})
		};

		var bindDeleteConfirmationEvents = function() {
			confirmDeletePopup.on("click", ".cancel-btn",
					closeDeleteConfirmationPopup);
			confirmDeletePopup.on("click", ".continue-btn",
					onBulkDeleteConfirmed);
		};

		var closeDeleteConfirmationPopup = function() {
			resetManageOptions();
			MF.overlay.close();
		};

		var resetManageOptions = function() {
			$("#wishlistBulkActions").prop('selectedIndex', 0).change();
		};

		var onBulkDeleteConfirmed = function() {
			var selected = $("*[data-delete=true]:checked").map(function() {
				return $(this).data("product");
			}).get();
			$("#removeBulkFromWishlist input[name=productCodes]").val(selected);
			$("#removeBulkFromWishlist").submit();
			closeDeleteConfirmationPopup();
		};

		function onBulkActionChanged() {
			var $wishlistBulkActions = $("#wishlistBulkActions");
			var selectedValue = $wishlistBulkActions.val();

			if (selectedValue === "add") {

				var selected = $("*[data-add=true]:checked").map(function() {
					return $(this).data("product");
				}).get();

				if (selected.length > 0) {
					$("#addBulkToCart input[name=productCodes]").val(selected);
					$("#addBulkToCart").submit();
				} else {
					$("option:first", $wishlistBulkActions).attr("selected",
							"selected");
					MF.select.refresh(".wishlist__manage-selected-items");
				}
			} else if (selectedValue === "remove") {

				var selected = $(".wishlistItem:checkbox:checked").map(
						function() {
							return $(this).data("product");
						}).get();

				confirmBulkDelete();

			} else if (selectedValue === "share") {
				var selected = $(".wishlistItem:checkbox:checked").map(
						function() {
							return $(this).data("product");
						}).get();
				mediator.publish("wishlist:share", {'selected': selected, 'all': false});
			}
		}

		function initBulkActions() {

			confirmDeletePopup = $("#deleteConfirmPopup");

			bindDeleteConfirmationEvents();
		}

		function initSendActions() {
			$("#shareSelectedWishlist").on("click", function(e) {
				e.preventDefault();
				if ($(".wishlistItem:checked").length === 0) {
					$('#shareWishlistForm .error').slideDown();
				}
				var selected = $(".wishlistItem:checked").map(function() {
					return $(this).data("product");
				}).get();
				mediator.publish("wishlist:share", {'selected': selected, 'all': false});
			});

			$("#shareEntireWishlist").on("click", function(e) {
				e.preventDefault();
				mediator.publish("wishlist:share", {'selected': [], 'all': true});
			});
		}

		function initSelectItems(items) {
			items.on("click", function() {
				var value = $(this).prop("checked");
				if (value) {
					mediator.publish("wishlist:bulk", true);
				} else {
					if (!$(".wishlistItem:checked").length) {
						mediator.publish("wishlist:bulk", false);
					}
				}
			});
		}

		function initItems() {
			initSelectItems($(".wishlistItem"));
		}

		function onAddToCartSuccess() {
			MF.minicart.showMiniCart();
			resetManageOptions();
		}

		function initForms() {

			function addItemToCart(addToCartFormElem) {
				var addToBagButton, $thisButton;

				addToCartFormElem.ajaxForm({

					beforeSubmit : function(e, arr, data) {

						$thisButton = arr.find('button');

						addToBagButton = MF.addToBagButton({
							selectors : {
								button : $thisButton
							}
						});
						addToBagButton.disable();

					},
					error : function() {
						addToBagButton.showErrorMessage();
						addToBagButton.enable();
					},
					success : function(data) {
						onAddToCartSuccess();

						addToBagButton = MF.addToBagButton({
							selectors : {
								button : $thisButton
							}
						});
						addToBagButton.showOverlayMessage();
						addToBagButton.enable();
					}
				});
			}

			var addToCartForm = $('.addToCartForm');
			addItemToCart(addToCartForm);

			// Delete items without refreshing the page
			var itemsToRemove;
			function storeItemsToRemove(codes) {
				itemsToRemove = codes.split(',');				
			}
			function removeItems() {
				var selector = "";
				for (var i = 0; i < itemsToRemove.length; i++) {
					if (i > 0) {
						selector += ', '
					}
					selector += ".wishlist__item-row[data-code='" + itemsToRemove[i] + "']";
				}
				var items = $(selector);
				items.next(".wishlist__item-buttons").remove(); // remove add-to-cart buttons (mobile only)
				items.remove(); // remove items
			}

			function removeItemFromWishList(removeFromWishListForm) {
				removeFromWishListForm.ajaxForm({
					beforeSubmit : function(data) {
						storeItemsToRemove(data[0].value) 					
					},
					success : function(data) {
						removeItems();
					}
				});
			}

			var removeFromWishlist = $('.removeFromWishlist');
			removeItemFromWishList(removeFromWishlist);

			var addBulkToCart = $('#addBulkToCart');
			addBulkToCart.ajaxForm({
				beforeSubmit : function(e, arr, data) {
					//
				},
				success : function(data) {
					onAddToCartSuccess();
				}
			});

			var removeBulkFromWishlist = $('#removeBulkFromWishlist');
			removeBulkFromWishlist.ajaxForm({
				beforeSubmit : function(data) {
					storeItemsToRemove(data[0].value) // productCodes					
				},
				success : function(data) {
					removeItems();
				}
			});

			// "Load more" button
			var nextPageForm = $("#nextPageForm");
			var totalPages = nextPageForm.data("totalpages");
			var currentPage;			
			var nextPageButton;
			nextPageForm.ajaxForm({
				beforeSubmit : function(e, arr, data) {
					currentPage = parseInt(e[0].value);				
					if(currentPage >= totalPages) {
						return false;
					}
					currentPage++;
					$("input[name=pageNumber]").val(currentPage);
					
					nextPageButton = arr.find('button');
					spinnerHandler.showSpinner(nextPageButton);
				},
				error : function(data) {
					spinnerHandler.hideSpinner(nextPageButton);
				},
				success : function(data) {
					spinnerHandler.hideSpinner(nextPageButton);
					if(currentPage >= totalPages || data.length == 0) {
						nextPageButton.hide();
					}
					
					var $data = $(data);

					//attach remove from wishlist action to new pulled items
					removeItemFromWishList($data.find('.removeFromWishlist'));

					//attach add to bag action to new pulled items
					addItemToCart($data.find('.addToCartForm'));

					//attach checkbox actions to new pulled items
					initSelectItems($data.find('.wishlistItem'));

					// $(".wishlist__share-buttons").before(data);
					$(".wishlist__share-buttons").before($data);

					//enable buttons Add to Bag button
					$('.wishlist__item-buttons .addToCartForm button[disabled]').removeAttr('disabled');
				}
			});

			var continueShoppingButton = $("#continueShoppingBtn");

			continueShoppingButton.on("click", function() {
				window.location = $(this).data("home-url");
			});

			MF.select.init({
				contextId : ".wishlist__manage-selected-items",
				callback : onBulkActionChanged
			});

			//enable buttons Add to Bag, Load more, Share Selected Items and Share Entire Wishlist buttons
	        $('.wishlist__item-buttons .addToCartForm button').removeAttr('disabled');
	        $('#nextPageButton').removeAttr('disabled');
	        $('#shareSelectedWishlist').removeAttr('disabled');
	        $('#shareEntireWishlist').removeAttr('disabled');
		}

		return {
			initForms : initForms,
			initSendActions : initSendActions,
			initBulkActions : initBulkActions,
			initSelectAll : initSelectAll,
			initItems : initItems,
			mediator : mediator
		};

	})();

	window.MF = MF;

}(jQuery, this, this.document, MF.spinnerHandler));

MF.wishlist.initBulkActions();
MF.wishlist.initItems();
MF.wishlist.initSendActions();
MF.wishlist.initForms();
MF.wishlist.initSelectAll();