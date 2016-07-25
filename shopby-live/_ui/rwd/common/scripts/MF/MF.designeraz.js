/*
  *  require : selecter
  *
  */
 (function($, window, document) {
     'use strict';

     var MF = window.MF || {};

     var debugMode = false,
         headerLinksWrapper = $(".designeraz__index__indexpoint__label"),
         section = $('#section').data('section'),
         selectAction,
         gender = $.cookie('gender'),
         defineTab = '[data-value='+gender+'_categories]',
         defaultTab = '[data-value='+gender+'_alldesigners]';
                 

     MF.designeraz = (function() {
         function init() {

            if ( ! Modernizr.csscolumns && MF.breakpoint.getActive() != 'mobile') $('#designeraz__list').columnize({ columns: 4 });
            
             updatePage();
             setUpTabClickHandler();
             setUpIndexClickHandler();
             windowResize();
             buildMobileSelect();
             setupScrollHandler(MF.breakpoint.getActive());
             $('.tabbed').tabber();
             if (location.search == '?category') { goToCategories(); $('.tabbed').tabber("select", 2); }
            }

         // ------------
         function setUpTabClickHandler() {

             $("#designeraz__tabs__items__wrapper").on("click", "a", function(ev) {
                 ev.preventDefault();
               
                 var selectedItem = $(this).attr("data-value");
                 if (selectedItem) {
                     selectedItem = selectedItem.split("_");
                     changeDesignersFilterType(selectedItem[0], selectedItem[1]);
                 } else {
                     if (debugMode) console.log("designerazTabItemClicked: Invalid value");
                 }
             });
         }

         function setUpIndexClickHandler() {
             $(document).on("click", function(event) {
                 if (MF.breakpoint.getActive() != 'mobile') {
                     $('.designeraz__list').find('a').css({
                         'color': 'black',
                         'font-weight': '200',
                     }).removeClass("inactiveLink");
                     $('.designeraz__index__indexpoint').find('a').css({
                         'color': 'black',
                         'font-weight': '400',
                     });
                 } else {
                     $('.designeraz__list').find('a').css({
                         'color': 'black',
                         'font-weight': '500',
                     }).removeClass("inactiveLink");
                     $('.designeraz__index__indexpoint').find('a').css({
                         'color': 'black',
                         'font-weight': '400',
                     });
                 }
             });

             $("a.designeraz__index__indexpoint__label").on("click", function(event) {
                 event.preventDefault();
                 var selectedTarget = $(this).attr("href");
                 if (selectedTarget && selectedTarget.charAt(0) == "#") {

                     var headerSize = $(".header-wrapper").height();
                     var animateDuration = 500;

                     if(selectAction != true) {
                        if(MF.breakpoint.getActive() != 'mobile') {
                             $('.designeraz__index__indexpoint').find('a').css({
                                 color: 'lightgray'
                             });
                         }
                         $('.designeraz__list').find('a').css({
                             color: 'lightgray'
                         }).addClass("inactiveLink");

                         $(this).css({
                             'font-weight': '500',
                             color: 'black'
                         });

                         $(selectedTarget).find('.designeraz__list__item').removeClass("inactiveLink").css({
                             'font-weight': '500',
                             'color': 'black'
                         });

                     }

                     var scrollTop = ($(window).width() < 680) ? $(selectedTarget).offset().top : $(selectedTarget).offset().top - headerSize;
                     scrollTop = (scrollTop >= 0) ? scrollTop : 0;

                     $('html, body').animate({
                         scrollTop: scrollTop
                     }, animateDuration);
            
                     event.stopPropagation();

                 } else {
                     if (debugMode) console.log("designerazIndexItemClicked: Invalid value");
                 }
             });

         }

         function buildMobileSelect() {

             var categoryNodeTemplate = "<option value='{{categoryUrl}}'>{{categoryName}}</option>";
             var categoryUrlTemplate = "/mfexternal/category/categoryNavTree/rootCategoryCode/{{gender}}/categoryCode/{{departmentId}}shop/";
             var categoryUrl = categoryUrlTemplate.replace("{{departmentId}}", section).replace("{{gender}}", section);

             $.ajax({
                 url: categoryUrl,
                 cache: true
             })
                 .done(function(data) {
                     $.each(data[0].categories, function(index, value) {
                         var categoryNode = categoryNodeTemplate
                             .replace("{{categoryUrl}}", value.code)
                             .replace("{{categoryName}}", value.name);

                         $(categoryNode)
                             .appendTo("#designerSelect");
                     });
                     MF.select.init({
                         callback: changedMobileSelect
                     });
                 })
                 .fail(function(error) {
                     if (debugMode) console.log('getAndShowCategories error', error.status, error.statusText);
                     return false;
                 });


         }

         // ------------
         function changedMobileSelect(value, index) {
             var selectedItem = value;
             if (selectedItem) {
                 filterDesignersByCategory(section, value);

                 selectAction = true;
             } else {
                 if (debugMode) console.log("changedMobileSelect: Invalid value");
             }
         }

         // ------------
         function changeDesignersFilterType(deptIn, selectedTypeIn) {

             if (selectedTypeIn == "alldesigners") {
                 showAllDesigners(selectedTypeIn);

             } else if (selectedTypeIn == "categories") {
                 getAndShowCategories(deptIn, selectedTypeIn);
                 unfilterDesignersByCategory();

             } else {
                 if (debugMode) console.log('Not a valid filter type value');
             }

         }

         // ------------
         function getAndShowCategories(deptIn, selectedTypeIn) {

             var categoryNodeTemplate = "<a href='#' data-href='{{categoryUrl}}' class='designeraz__categories__link'>{{categoryName}}</a>";
             var categoryUrlTemplate = "/mfexternal/category/categoryNavTree/rootCategoryCode/{{gender}}/categoryCode/{{departmentId}}shop?mode=L1";
             var categoryUrl = categoryUrlTemplate.replace("{{departmentId}}", deptIn).replace("{{gender}}", deptIn);


             if (debugMode) console.log('MF.designeraz.getAndShowCategories called', categoryUrl);

             if (!$(".designeraz__categories__link").length) {
                MF.busyOverlay.enable();
                 $.ajax({
                     url: categoryUrl,
                     cache: true
                 })
                     .done(function(data) {
                        MF.busyOverlay.disable();
                        if (debugMode) console.log('-------------------------------------------');
                        if (debugMode) console.log(data);
                         $.each(data, function(index, value) {
                             if (debugMode) console.log(data[index].name);
                             var categoryNode = categoryNodeTemplate
                                 .replace("{{categoryUrl}}", value.url)
                                 .replace("{{categoryName}}", value.name);

                             $(categoryNode)
                                 .appendTo("#designeraz__categories")
                                 .on('click', function(ev) {
                                     ev.preventDefault();
                                     filterDesignersByCategory(deptIn, value.code);
                                     selectAction = false;
                                 });
                         });
                         showCategories(selectedTypeIn);
                     })
                     .fail(function(error) {
                         console.log('getAndShowCategories error', error.status, error.statusText);
                         return false;
                     });
             } else {
                 showCategories(selectedTypeIn);
             }

         }

         // ------------
         function showCategories(selectedTypeIn) {
             $("#designeraz__categories").slideDown(100); // TODO optional - open an accordian instead
             $('#designeraz__index').slideUp(100);
            unfilterDesignersByCategory();
         }

         // ------------
         function showAllDesigners(selectedTypeIn) {
             $("#designeraz__categories").slideUp(100); // TODO optional - close an accordian instead
             $('#designeraz__index').slideDown(100);
             unfilterDesignersByCategory();
         }

         // --------------------------
         // filterDesignersByCategory: gray out and make unclickable the designers that do not have products with stock for a given category
         // --------------------------
         function filterDesignersByCategory(deptIn, categoryIn) { // it doesn't actually use the department passed in as the category code is unique across departments
             var cmsSiteUid = $('#designeraz__categories').data('site-id');
             var categoryDesignersUrl = "/mfexternal/exsearch/facet/{{defGender}}/{{cmsSiteUid}}/designer?subCategory={{categoryId}}"
                 .replace("{{cmsSiteUid}}", cmsSiteUid)
                 .replace("{{defGender}}", deptIn)
                 .replace("{{categoryId}}", categoryIn);

             if (debugMode) console.log('MF.designeraz.filterDesignersByCategory called', categoryDesignersUrl, "-----", deptIn, "-----", categoryIn);

             MF.busyOverlay.enable();

             $.ajax({ // get the designers for the given category

                 url: categoryDesignersUrl,
                 cache: true
             })
                 .done(function(data) {
                    MF.busyOverlay.disable();
                    $(".designeraz__list a.designeraz__list__item").removeClass('inactiveLink');
                     unfilterDesignersByCategory();
                     $('.designeraz__index__indexpoint').find('a').css({
                         'font-weight': 'normal',
                         'color': 'lightgray'
                     });
                     if (typeof data.values != 'undefined') {
                     $.each(data.values, function(index, value) {
                         $(".designeraz__list a.designeraz__list__item:contains('" + data.values[index].name + "')").removeClass("inactiveLink").css({
                             'font-weight': '500',
                             'color': 'black'
                         });
                         $('.designeraz__index__indexpoint').find('a:contains(' + data.values[index].name.substr(0, 1) + ')').css({
                             'font-weight': '500',
                             'color': 'black'
                         });
                     });
                     }
                     if (debugMode) console.log("done ajax and DOM work for designers for category", categoryIn)
                 })
                 .fail(function(error) {
                     if (debugMode) console.log('filterDesignersByCategory error', error.status, error.statusText);
                     unfilterDesignersByCategory();
                     $(".designeraz__list a.designeraz__list__item")
                         .addClass("inactiveLink"); // TODO check - if an error in the AJAX, should it graythem all out or enable them all?
                     return false;
                 });

         }

         function unfilterDesignersByCategory() {
            if(!$(".designeraz__list a.designeraz__list__item").hasClass('inactiveLink')) {
             $(".designeraz__list a.designeraz__list__item").addClass("inactiveLink").css({
                 'font-weight': 'normal',
                 'color': 'lightgray'
             });
         } else{
            $(".designeraz__list a.designeraz__list__item").css({
                 'font-weight': 'normal',
                 'color': 'black'
             });
         }
         }

         //-------------------
         // setupScrollHandler
         //-------------------
         function setupScrollHandler(breakpoint) {
             if (breakpoint == 'mobile') {

                 var headerHeight = $("#header").height(),
                     listHeight = $("#designeraz__filter__mobile").height() + $("#designeraz__list").height() + $("#designeraz__header").height() + 42,
                     backTopOffset = ($("#back-top").offset() || {
                         top: 0
                     }).top,
                     screenHeight = $(window).height();

                 var scrollTop = $(window).scrollTop();
                 var wHeight = $(window).height();
                 var headerHeight = headerHeight;
                 var listHeight = listHeight;
                 var backTopOffset = backTopOffset;
                 var AzContainer = $('.designeraz__index').detach().show();
                 $('#designeraz__mainContainer').prepend(AzContainer);
                 
                 if (scrollTop > 0) $('#designeraz__index').css({
                     "top": 0
                 });

                 $('.designeraz__index__indexpoint').css({
                     'height': wHeight+75
                 });

                if(scrollTop > 0) $('html, body').animate({scrollTop: 0 }, 100); 
                
                $(window).on('scroll.mobile',function() {
                     var screenHeight = $(window).height(),
                         topLocked,
                         bottomLocked,
                         newTop,
                         newBottom,
                         dinBottom

                     scrollTop = $(window).scrollTop();
                     if (debugMode) console.log(scrollTop);
                     if (scrollTop <= 0 && !topLocked) {
                         if (debugMode) console.log('top');
                         $('#designeraz__index').css({"position":"absolute","top":"0"});
                         topLocked = true;
                     } else if (scrollTop > 0 && scrollTop < (headerHeight)) {
                         $('#designeraz__index').css("position", "fixed");
                         if (debugMode) console.log('newTop');
                         newTop = (headerHeight) - (scrollTop);
                         if (newTop < 0)
                             newTop = 0;
                         $('#designeraz__index').css("top", newTop);
                         topLocked = false;
                     } else {
                        $('#designeraz__index').css("position", "fixed");
                         $('#designeraz__index').css("top", 0);
                         topLocked = true;
                     }
                });
             } else {
                var AzContainer = $('#designeraz__index').detach();
                $(window).off('scroll.mobile');
                 if ($('#designeraz__categories').is(':hidden')) {
                    (AzContainer).removeAttr( "style" ).insertAfter($('.designeraz__tabs'));
                    } else {
                    (AzContainer).removeAttr( "style" ).hide().insertAfter($('.designeraz__tabs'));
                    }
                
               }
         }
         function goToCategories() {
                getAndShowCategories(gender, "categories");
                unfilterDesignersByCategory();
         }

         function updatePage(breakpoint) {
            setupScrollHandler(breakpoint);
            if(breakpoint == 'mobile') buildMobileSelect();
         }

         function windowResize() {
             $window.unbind("resize.MFDesigners").bind("resize.MFDesigners", function() {
                 clearTimeout(resizeWin);
                 var resizeWin = setTimeout(updatePage(MF.breakpoint.getActive()), 10);
             });
         }
         return {
             init: init
         };

     })();

     window.MF = MF;

 }(jQuery, this, this.document));

 // Designer A-Z init
 $(function() {
     if ($("#designeraz__mainContainer").length) {
         MF.designeraz.init();
     }
 });