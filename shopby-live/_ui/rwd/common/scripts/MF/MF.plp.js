/*
 *  require : lazyload, selecter, scrollBars, $.cookie, _, MF.breakpoint
 *
 */
(function ($, window, document) {
    'use strict';

    var MF = window.MF || {};

    MF.plp = (function () {

        var context, options, plpWrapper,
            iconsHandle, listerHandle, shoeGroup, clothesGroup, appliedFilters, desktopWrapper,
            firstEl, firstElHeight, firstElPos, topVisiblePos, lastEl, lastElHeight, lastElPos, bottomVisiblePos, topButton,
            trendListingPage, tabletViewContainer;

        var $window = $(window),
            listerClasses = "",
            listMatrix = [],
            mobileCurrPage = 0,
            visible = false;

        function initStickyNav() {
            if( $('.plp__filter').length > 0 ) {
                MF.stickit.init({
                    targetElement: '.plp__filter',
                    topElement: '.header-wrapper, .plp__breadcrumb, .applied-filters__wrapper, .plp__mainContainer .plp__title',
                    topOffset: getPlpPageType(),
                    bottomElement: '.mf-footer',
                    bottomOffset: 20
                });
            }
        }

        function removeStickyNavOnTouch(){
            var onMobile = Breakpoints.on({
                name: "mobile",
                matched: function() {
                   if (!Modernizr.touch) $(".plp__loadMore__mobile").css("display", "none");
                    readMoreMobile();
                },
                exit: function() {
                  
                }
            });
        }

        function initLazyLoad(){
            $("img.lazy").lazyload({
                 threshold : 200,
                placeholder : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII="
            });
        }

        function loadMoreMobile(){
            var currItems = $(".plp__lister .lister__item").length;
            var totalNum = $(".mobile__results__display .mobile__total__results").text();

            if(currItems >= totalNum){
                $(".plp__loadMore__mobile").hide();
            }
        }

        function bindListeners() {
            $window.off("scroll.MFBackToTop").on("scroll.MFBackToTop", backToTop);
        }

        function getPlpPageType() {
            var topPosition = 27;
            if ( plpWrapper.hasClass("plp__designerListing") ) {
                topPosition = 70;
            } else if ( plpWrapper.hasClass("plp__productListing") ) {
                if(trendListingPage.length === 1){
                    topPosition = 59;
                } else {
                    if( $(".plp__appliedFilters").length === 1 ){

                    } else {
                        topPosition = 32;
                    }
                }
            } else if ( plpWrapper.hasClass("plp__searchResults") ) {

            } else {

            }
            return topPosition;
        }

        function setupBacktoTopDefaults() {
            firstEl = $(".lister__item:eq(0)");
            firstElHeight = firstEl.height();
            firstElPos = firstEl.offset().top;
            topVisiblePos = firstElPos;

            lastEl = $(".lister__item").last();
            lastElHeight = lastEl.height();
            lastElPos = lastEl.offset().top;
            bottomVisiblePos = lastElPos - lastElHeight;

            topButton = $(".plp__backTop");
        }

        function backToTop() {
            var st = $window.scrollTop();

            if (st > topVisiblePos) {
                topButton.fadeIn(50);
                visible = true;
            } else {
                topButton.fadeOut(50);
                visible = false;
            }

        }

        function scrollToDesignerPosition() {

            var $path = $(this).closest(".filter__box").find(".filter__scroll");
            var typed = "^" + $(this).val();
            var regex = new RegExp(typed, 'i');
            var pointer;
            var defaultPointer = $('.mCSB_container li:eq(0)', $path);

            $('.mCSB_container li', $path).filter(function () {
                if ($("a", $(this)).text().match(regex) !== null) {
                    if(!pointer){
                        pointer = $(this);
                    }
                }
            });

            if (typed === "^") {
                $path.mCustomScrollbar("scrollTo", defaultPointer);
            } else {
                $path.mCustomScrollbar("scrollTo", pointer);
                pointer = "";
            }
        }

        function anchorToFilterPosition() {
            if( $(".filter__box__list a").hasClass("active") ){
                var anchor = $(".filter__box__list a.active").parent();
                var parent = $(".filter__box__list a.active").parents(".filter__scroll");
                parent.mCustomScrollbar("scrollTo", anchor);
            }
        }

        function setDefaultListerLayout() {
            if(!$.cookie('plpLayoutLargeDesktop')) {
                $.cookie('plpLayoutLargeDesktop', 4)
            }
            if(!$.cookie('plpLayoutDesktop')) {
                $.cookie('plpLayoutDesktop', 3)
            }
            if(!$.cookie('plpLayoutTablet')) {
                $.cookie('plpLayoutTablet', 2)
            }
            if(!$.cookie('plpLayoutMobile')) {
                $.cookie('plpLayoutMobile', 2)
            }
        }

        function updateMobileListerView() {
            $(".redefine__left__productView__tablet").on("click", ".mobile-view", function(e){
                e.preventDefault();
                var $this = $(this);

                if( $this.hasClass("double-view") ){
                    // change to single view (1)
                    listerHandle.removeClass("mfM1 mfM2").addClass("mfM1");
                    $this.removeClass("double-view").addClass("single-view");
                } else {
                    // change to double view (2)
                    listerHandle.removeClass("mfM1 mfM2").addClass("mfM2");
                    $this.removeClass("single-view").addClass("double-view");
                }
            });
        }

        function updateDesktopListerView() {

            $(".tablet-icons").on("click", "li", function () {
                var $this = $(this);
                var listerIndex = $this.data("mf-lister");
                $this.siblings().removeClass("mfT").end().addClass("mfT");
                listerHandle.removeClass("mfT1 mfT2").addClass("mfT" + listerIndex);
                $.cookie('plpLayoutTablet', listerIndex);
            });

            $(".desktop-icons").on("click", "li", function () {
                var $this = $(this);
                var listerIndex = $this.data("mf-lister");
                $this.siblings().removeClass("mfD").end().addClass("mfD");
                listerHandle.removeClass("mfD2 mfD3").addClass("mfD" + listerIndex);
                $.cookie('plpLayoutDesktop', listerIndex);
            });

            $(".large-desktop-icons").on("click", "li", function () {
                var $this = $(this);
                var listerIndex = $this.data("mf-lister");
                $this.siblings().removeClass("mfLD").end().addClass("mfLD");
                listerHandle.removeClass("mfLD3 mfLD4 mfLD5").addClass("mfLD" + listerIndex);
                $.cookie('plpLayoutLargeDesktop', listerIndex);

                // reinit lazy load and execute once
                if(listerIndex === 5){
                    //wait for the animation to end
                    setTimeout(function(){
                        $(window).scroll();
                    }, 150)
                }
                console.log("i am ...", listerIndex)

            });

        }

        function showSize() {
            $(".lister__wrapper").on({
                mouseenter: function () {
                    $(".lister__item__size", $(this)).show();
                    toggleProductImage($(this));
                },
                mouseleave: function () {
                    $(".lister__item__size", $(this)).hide();
                    toggleProductImage($(this));
                }
            }, ".lister__item__image");
        }

        function toggleProductImage($this){
            var $img, src, newSrc, imgType;
            
            $img = $("img", $this);
            src = $img.attr("src");
            imgType = src.split("_");
            
            if( imgType[1] == 2){
                newSrc = src.replace(/([^_]+_)(\d+)(_[A-Za-z\.]+)/g, '$1' + '1' + '$3');
            } else {
                newSrc = src.replace(/([^_]+_)(\d+)(_[A-Za-z\.]+)/g, '$1' + '2' + '$3');
            }
            
            $img.attr("src", newSrc);
        }

        function groupUnorderedList(listGroup) {
            var totalItems = $(".filter__box__list > li", listGroup).length;
            var leftItem = Math.ceil(totalItems / 2);
            var rightItem = totalItems - leftItem - 1;
            var wrapDOM = "<li class='filter__box__list__left'><ul></ul></li>";

            $(".filter__box__list > li:lt(" + leftItem + ")", listGroup).wrapAll(wrapDOM);
            $(".filter__box__list > li:gt(0)", listGroup).wrapAll(wrapDOM);
        }

        function toggleFilterItems() {
            $(".filter__box__list").on("click", "a", function () {
                $(this).toggleClass("active");
            });
        }

        function toggleMobileFilters() {
            $(".filter__box__toggle").on("click", "a", function (e) {
                e.preventDefault();
                var $this = $(this);
                $(".filter__box__wrapper__mobile").toggleClass("active", updateMobileFilterLabel($this));
            });
        }

        function toggleFilterHeader() {
            $(".filter__box__title").on("click", function (e) {
                e.preventDefault();
                $(this).toggleClass("closed").siblings(".filter__toggle").toggle();
            });
        }

        function updateMobileFilterLabel(_this) {
            var activeClass = "filter__active";
            $("span", _this).each(function (i) {
                var _that = $(this);
                if (_that.hasClass(activeClass)) {
                    _that.removeClass(activeClass);
                } else {
                    _that.addClass(activeClass);
                }
            });
        }

        function stickyAppliedFilters(stickyItem) {
            var stickyHeaderHeight = ( MF.breakpoint.getActive() === "desktop" ) ? 115 : 135;

            var stickyTopRight = stickyItem.offset().top - stickyHeaderHeight;

            $window.scroll(function () {
                var st = $window.scrollTop();
                if (st > stickyTopRight) {
                    stickyItem.addClass("mfSticky");
                } else {
                    stickyItem.removeClass("mfSticky");
                }
            });
        }

        function checkPagination(){
            if( !$(".redefine__right__pager").length ){
                desktopWrapper.addClass("no__pagination");
            } else {
                if( desktopWrapper.hasClass("no__pagination") ){
                    desktopWrapper.removeClass("no__pagination");
                }
            }
        }

        function trendPage(){
            if(trendListingPage.exists()){
                plpWrapper.addClass("plp__trendListing");
            }
        }

        function toggleTabletProductOutfitView(){
            $(".product-view, .outfit-view").on("click", function(e){
                e.preventDefault();

                var $this = $(this);
                var productView = $this.parent().find(".product-view");
                var outfitView = $this.parent().find(".outfit-view");

                if( $this.hasClass("product-view") ){
                    updateProductImage(1);
                    $this.addClass("active");
                    $this.siblings(".outfit-view").removeClass("active");
                } else {
                    updateProductImage(2);
                    $this.addClass("active");
                    $this.siblings(".product-view").removeClass("active");
                }
            });
        }

        function toggleDesktopProductOutfitView(){
            MF.select.init({
                callback: function(e){
                    tabletViewContainer.find("a").removeClass("active");

                    if(e === "outfit-view"){
                        updateProductImage(2);
                        tabletViewContainer.find(".outfit-view").addClass("active");
                    } else {
                        updateProductImage(1);
                        tabletViewContainer.find(".product-view").addClass("active");
                    }
                },
                contextId: "#redefine__left__productView1"
            });
        }

        function readMoreMobile(){
            var regx = /(^.{0,241})([\s\S]+)/g;
            var description = $('.plp__header__description__details .designer-desc').text().trim();
            var newDesc = description.replace(regx, "$1<span class='hideme'>$2</span>");

            $('.plp__header__description__details .designer-desc').html(newDesc);

            $(".mobile-readMore").on("click", function(e){
                e.preventDefault();
                $(this).siblings(".designer-desc").find(".hideme").css("display", "inline");
                $(this).hide();
            });
        }

        function updateProductImage(imgValue){
            var $img, src, newSrc, lazyLoadURL, newLazyLoadURL;

            // store in cookie

            
            (imgValue == 1) ? $.cookie('plpView', 'productView') : $.cookie('plpView', 'outfitView');

            $( ".lister__item" ).each(function( index ) {
                $img = $(".lister__item__image img", $(this));
                lazyLoadURL = $img.attr("data-original");
                src = $img.attr("src");
                newSrc = src.replace(/([^_]+_)(\d+)(_[A-Za-z\.]+)/g, '$1' + imgValue + '$3');
                newLazyLoadURL = lazyLoadURL.replace(/([^_]+_)(\d+)(_[A-Za-z\.]+)/g, '$1' + imgValue + '$3');
                $img.attr("src", newSrc);
                $img.attr("data-original", newLazyLoadURL);
            });
        }

        function mobileDropdownSubmit(){
            $("#plp__mobile__filter .mobile__filter").change(function(e) {
                if(e.target.value){
                    window.open(e.target.value, '_self');
                }
            });
            MF.select.init({
              callback: function(url){
                if(url){
                    window.open(url, '_self');
                }
              },
              contextId: "#plp__mobile__filter"
            });
        }

        function adjustFilterBoxBorder(){
            $(".filter__box").next(".filter__box").addClass("noBorderTop");
        }

        var initPlpObjects = function() {
            plpWrapper = $(".plp__mainContainer");

            iconsHandle = plpWrapper.find(".redefine__right__icons");
            listerHandle = plpWrapper.find(".plp__lister");
            shoeGroup = plpWrapper.find(".filter__box__shoe");
            clothesGroup = plpWrapper.find(".filter__box__clothesSize");
            appliedFilters = plpWrapper.find('.plp__appliedFilters__wrapper');
            desktopWrapper = plpWrapper.find('.plp__desktopWrapper');
            topButton = plpWrapper.find(".plp__backTop");
            trendListingPage = plpWrapper.find(".plp__trendBanner");
            tabletViewContainer = $(".redefine__left__productView__tablet .redefine__leftView");

        };
         var handleData = function(data, newData, totalPages){
            var productlistTemplate = $("#productListTemplate").html();
            var compiledproductlistTemplate = Handlebars.compile(productlistTemplate);

            $('.lister__wrapper').append(compiledproductlistTemplate({products: data}));

            initLazyLoad();

            if (newData == totalPages) {      
                MF.spinnerHandler.hideSpinner('.loadMore__mobile__button');
                $('.loadMore__mobile__button').hide();
            }
         };

        var initInnerMobileFilterCat = function(){
            if ( $(".innerFilterMobile").length !== 0) {
                var innerFilterMobileTemplate = $("#innerFilterMobileTemplate").html();
                var compiledTemplate = Handlebars.compile(innerFilterMobileTemplate);
                $('.filter__box__innerFilter__mobile').append(compiledTemplate);
                MF.select.init({
                    callback: function(url){
                        if(url){
                            window.open(url, '_self');
                        }
                    },
                    contextId: ".filter__box__innerFilter__mobile"
                });
            }
        };

        var dlpCtaCounter = function(){
            if ( $(".plp__designerListing").length !== 0) {
                var ctaCount = $(".desktop__cta ul li").length;
                $(".desktop__cta").addClass("cta" + ctaCount);
            }
        };

        function getSearchParameter(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        var loadMore = function(newData) {        
            var el = '.loadMore__mobile__button', $el = $(el),
                $resultsCountPlaceholder = $('#mobileResultsCounter');
            
                var uri;

                if ( plpWrapper.hasClass("plp__searchResults") ) {
                    var params = getSearchParameter("text");
                    //Because the base tag has already been implemented so we need to fix the load more JSON URL.
                    uri = window.location.pathname+'?page=' + newData + '&noOfRecordsPerPage=' + $el.data('noofrecordsperpage')
                        + '&sort=' + $el.data('sort') + '&q=' + params + '&format=json';
                } else {
                    //Because the base tag has already been implemented so we need to fix the load more JSON URL.
                    uri = window.location.pathname+'?page=' + newData + '&noOfRecordsPerPage=' + $el.data('noofrecordsperpage')
                        + '&sort='+$el.data('sort') + '&q=' + $el.data('queryvalue') + '&format=json';
                }
                MF.spinnerHandler.showSpinner(el, {'margin-left': 0});
                    $.getJSON( uri, function(json, textStatus) {
                            if (textStatus == 'success') {
                                MF.spinnerHandler.hideSpinner(el);     
                            }
                        }).done(function(json, textStatus){
                            var totalPages = json.pagination.numberOfPages;

                            handleData(json, newData, totalPages);
                            $resultsCountPlaceholder.empty().text($(".lister__item").length);
                            MF.basepath.remove_leading_forward_slashes_from_all_links();
                        });
        };

        function initLoadMore() {
            var $el = $('.loadMore__mobile__button'),

            currentPage = Number($el.data('currentpage'))+1,
            nextPage = currentPage,
            newData = 1;

            loadMoreMobile();

            $el.on('click', function(ev){
                ev.preventDefault();
                newData += nextPage;
                loadMore(newData);
            });
        }

        function init() {
           
            initPlpObjects();

            initLazyLoad();

            trendPage();
            dlpCtaCounter();

            mobileDropdownSubmit();

            MF.scrollBars.init();

            setupBacktoTopDefaults();

            bindListeners();
            adjustFilterBoxBorder();

            setDefaultListerLayout();
            updateMobileListerView();
            updateDesktopListerView();

            toggleTabletProductOutfitView();
            toggleDesktopProductOutfitView();

            groupUnorderedList(shoeGroup);
            groupUnorderedList(clothesGroup);

            toggleFilterItems();
            toggleMobileFilters();
            toggleFilterHeader();

            checkPagination();
            initStickyNav();
            removeStickyNavOnTouch();

            anchorToFilterPosition();
            initInnerMobileFilterCat();

            initLoadMore();

            if (!Modernizr.touch) {
                showSize();
                if (appliedFilters.length) {
                    stickyAppliedFilters(appliedFilters);
                }
            }

            $('input.filter__box__search__input').keyup( _.debounce( scrollToDesignerPosition, 250 ) );
        }

        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document));


$(function () {
    if ($(".plp__mainContainer").length) {
        MF.plp.init();
    }
});
