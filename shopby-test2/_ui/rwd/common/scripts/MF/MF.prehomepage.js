;
(function($, window, document) {
    'use strict';

    var MF = window.MF || {};

    MF.prehome = (function() {

        var defaults = {};
        var $window = $(window);
        var $isOut = $('.is-out');
        var $isHover = $('.is-hover');
        var $_slider = $('.ph-tpl');



        function init() {
            addPromos();
            updatePage();
            windowResize();
            //MF.scrollBars.init();
        }

        function imageMenu(breakpoint) {
            if (breakpoint != 'mobile') {

                $isHover.off('mouseenter').on('mouseenter', function() {
                    var $el = $(this).parent().find('.toggle').next('ul');
                    $isOut.css({
                        'background-color': '#000'
                    });
                    if (!$(this).hasClass('animated')) {
                        $(this).dequeue().stop().animate({
                            opacity: 0.33
                        }, 100);
                        $($el).dequeue().slideDown(200, 'easeInOutBounce');
                    }
                });
                $isOut.off('mouseleave').on('mouseleave', function() {
                    var $bg = $(this).find('.is-hover');
                    var $el = $bg.parent().find('.toggle').next('ul');

                    $($bg).addClass('animated').animate({
                        opacity: 1
                    }, 100, "linear", function() {
                        $(this).removeClass('animated').dequeue();
                        $($el).slideUp(100, 'easeInOutBounce').dequeue();
                    });
                });

            } else {
                
                $isHover.off('mouseenter').on('mouseenter', function() {
                    var $el = $(this).parent().find('.toggle').next('ul');
                    $(this).parent().find('.toggle').hide();
                    $isOut.css({
                        'background-color': '#000'
                    });
                    if (!$(this).hasClass('animated')) {
                        $(this).dequeue().stop().animate({
                            opacity: 0.33
                        }, 100);
                        $($el).dequeue().fadeIn(200);
                    }
                });
                $isOut.off('mouseleave').on('mouseleave', function() {
                    var $bg = $(this).find('.is-hover');
                    var $el = $bg.parent().find('.toggle').next('ul');

                    $($bg).addClass('animated').animate({
                        opacity: 1
                    }, 100, "linear", function() {
                        $(this).removeClass('animated').dequeue();
                        $($el).fadeOut(100, function(){
                            $(this).parent().find('.toggle').show();
                        }).dequeue();
                    });
                });    
                
            }
        }

        function getPreHomePromos(){
            return $.ajax({
                url: '/nms/stylereport/api/articles',
                data: {
                    videos: false,
                    currentWeek: true,
                    cache: true
                },
                dataType: 'json'
            });
        }

        function addPromos(){
            var template = $('#ph-tpl__slider-template').html();
            var compiledTemplate = Handlebars.compile( template );

            $.when( getPreHomePromos() ).done(function(results) {
                $(".ph-tpl").append( compiledTemplate( results ));
                MF.scrollBars.init();
            });
        }

        function updatePage() {
            imageMenu(MF.breakpoint.getActive());
            //MF.scrollBars.centerScrollBar('h-scrollbar');
        }

        function windowResize() {
            $window.off("resize.MFHome").on("resize.MFHome", function() {
                clearTimeout(resizeWin);
                var resizeWin = setTimeout(updatePage, 100);
            });
        }

        return {
            init: init
        };

    })();

    window.MF = MF;

}(jQuery, this, this.document));
    if ($('.ph-tpl__intro').length) MF.prehome.init();