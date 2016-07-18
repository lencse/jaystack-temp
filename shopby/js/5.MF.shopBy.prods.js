
(function($) {

  'use strict';

  MF.shopBy = window.MF.shopBy || {};

  MF.shopBy.prods = (function() {

    var shopByProdTemplate,
        compiledShopByProdTemplate;

    function getEndpoint(products) {
      return '/nms/ajax/p/' + products;
    }

    function __deleteRepetitions(prodsList) {
        var uniqueList = prodsList.split(',').filter( function(item,i,allItems) {
            return i==allItems.indexOf(item);
        }).join(',');

        return uniqueList;
    }

    //writes the products data in the products wrappers
    function writeProdData(prodsWrapper, prodsData) {
      var prodsHtml = $(compiledShopByProdTemplate({
            products: prodsData
          }));
        $(prodsWrapper).html(prodsHtml);
    }


    function iterate(data, wrapper) {//, isLastIteration) {
        writeProdData(wrapper, data);
        // if ( isLastIteration ) {
            MF.shopBy.loadProdsCarousel($(wrapper));
        // }
    }

    //gets the products info and iterates through them
    function getPageProducts(products, $wrapper) {//, isLastIteration) {
        var urlEndpoint = getEndpoint(products);
        $.ajax({
            url: urlEndpoint,
            type: 'GET',
            cache: true,
        })
        .done(function(data) {
            iterate(data, $wrapper);//, isLastIteration);
        })
        .fail(function() {
            console.log("error");
        });
    }

    //gets info of all the products in the page
    function iteratePageProducts() {
        var $prodElems = $('[data-mf-products]').filter('[data-mf-products!=""]'),
            prods = "";
            // i = 0,
            // nrElems = $prodElems.length,
            // isLastIteration = false;
        $.each($prodElems, function(index, el) {
            prods = $(el).attr('data-mf-products');
            // i++;
            // if ( i == nrElems ) {
            //   isLastIteration = true;
            // }
            getPageProducts(prods, el);//, isLastIteration);
        });
    }

    function init() {
        shopByProdTemplate = $("#shopByProdTemplate").html();
        compiledShopByProdTemplate = Handlebars.compile(shopByProdTemplate);
        iteratePageProducts();
    }

    return {
      init: init
    };

  })();

  window.MF.shopBy = MF.shopBy;

}(jQuery));
