
(function($) {

  'use strict';

  MF.shopBy = window.MF.shopBy || {};

  MF.shopBy.prodsByCat = (function() {

    var shopByCatTemplate,
        compiledShopByCatTemplate;

    function getCategoryEndpoint(category) {
      return category + '?format=json&page=1';
    }

    //writes the products data in the products wrappers
    function writeProdData(prodsWrapper, prodsData, showOutfit) {
        var imgType = "1";
        if ( showOutfit ) {
            imgType = "2";
        }
      var prodsHtml = $(compiledShopByCatTemplate({
            products: prodsData,
            imgType: imgType
          }));
        $(prodsWrapper).html(prodsHtml);
    }


    function iterate(data, wrapper, showOutfit) {//, isLastIteration) {
        if ( data.length > 12 ) {
            data = data.slice(0, 12);
        }
        writeProdData(wrapper, data, showOutfit);
        // if ( isLastIteration ) {
            MF.shopBy.loadCategoriesCarousel($(wrapper));
        // }
    }

    //gets the products info and iterates through them
    function getCategoryProducts(cat, $wrapper, showOutfit) {//, isLastIteration) {
        var urlEndpoint = getCategoryEndpoint(cat);
        $.ajax({
            url: urlEndpoint,
            type: 'GET',
            cache: true,
        })
        .done(function(data) {
            iterate(data.results, $wrapper, showOutfit);//, isLastIteration);
        })
        .fail(function() {
            console.log("error");
        });
    }

    //gets the first 12 products of a certain category
    function iterateCategoryProducts() {
        var $catElems = $('[data-mf-category]').filter('[data-mf-category!=""]'),
            cat = "",
            showOutfit = false;
        $.each($catElems, function(index, el) {
            cat = $(el).attr('data-mf-category');
            showOutfit = ( $(el).attr('data-mf-outfit') == "true" ? true : false );
            getCategoryProducts(cat, el, showOutfit);//, isLastIteration);
        });
    }

    function init() {
        shopByCatTemplate = $("#shopByCatTemplate").html();
        compiledShopByCatTemplate = Handlebars.compile(shopByCatTemplate);
        iterateCategoryProducts();
    }

    return {
      init: init
    };

  })();

  window.MF.shopBy = MF.shopBy;

}(jQuery));
