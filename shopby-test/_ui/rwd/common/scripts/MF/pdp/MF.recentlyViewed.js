;
(function($, window, document) {
  'use strict';
  var MF = window.MF = window.MF || {};

  MF.recently = (function() {

    var privateData, int, _product,
        $tabber = $('.tabber-menu'),
        // Should be an ID ideally
        product = $('.baseProductCode').val(),
        max = ( $('div#recentlyViewedProducts').data('max-items') ); // no datatype defined - still a number.

    var check = function() {
      if ('localStorage' in window && window['localStorage'] !== null) {
        return true
      } else {
        return false
      }
    }
    var set = function(privateData) {
      var storage = JSON.stringify(privateData);

      return storage.replace('_thumbnail.','_medium.');
    }

    var add = function(item) {
      localStorage.setItem('recent', item)
    }

    var validate = function(_carousel) {
      // validates if current product is already stored
      for (var k in _carousel) {
        if (_carousel[k].code == _product) {
          return true;
          break;
        }
      }
    }

    var read = function(_current) {
      var _current_json = '[' + _current + ']';
      var _carousel = JSON.parse(_current_json);
      var _lenght = _carousel.length;
      // remove items above the max number.
      _carousel.splice(max, _lenght);
      //append _carousel using same method
      MF.carousel.init({ json: _carousel, elId: '#recentlyViewedProducts', isYourMatches: false });
      $('[data-pid="'+_product+'"]').remove()

      return validate(_carousel);
    }

    var core = function(privateData) {
      if (typeof localStorage.recent === 'undefined') {
        add(set(privateData));

      } else {
        var _current = localStorage.getItem('recent');

        if (!read(_current)) {
          localStorage.clear();
          var _new_current = set(privateData) + ',' + _current;
          add(_new_current);
        }
      }
    }

    var init = function() {
      // Get current product information from MF.variantDropDown
      // avoinding 2nd request.
      var v = MF.variantDropDown();

      var privateData = v.fetchProductData(product).responseText;
      // recursion till the data is valid.
      if (typeof privateData === 'undefined') {
        clearInterval(int);
        int = setInterval(function() {
          init()
        }, 500);
      } else {
        clearInterval(int);
        privateData = JSON.parse(privateData)
      }
      if (privateData) {
         _product = privateData.code;

        core(privateData)
      }
    }

    return {
      init: init
    }
  })();

  window.MF = MF;

})(jQuery, this, this.document);

if ($('#pdpMainWrapper').length) MF.recently.init();
