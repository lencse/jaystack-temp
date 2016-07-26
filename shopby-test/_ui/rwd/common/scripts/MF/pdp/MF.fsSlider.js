;(function($, updateImage, imageSize) {
    "use strict";

    var MF = window.MF || {};

    var defaults = {
        thumbnailsContainer: "[data-fsThumbnails]:visible",
        mainImageContainer: "#fsMainImage",
        controlButtonsContainer: "#fsSliderControl",
        sliderInformationContainer: "#fsSliderInfo",
        defaultImageIndex: 0
    };

    MF.fsSlider = (function() {

        var options,
            currentIndex,
            $sSlider,
            $mainImageContainer,
            $thumbnailContainer,
            $thumbnails,
            $controlButtonsContainer,
            $sliderInformationContainer;

        var resetAllThumbnailsHighlighting = function() {
            $thumbnailContainer.find(".thumbnail").removeClass("active");
        };

        var printSliderInfo = function() {
            $sliderInformationContainer.text($sSlider.slickCurrentSlide()+1 + "/" + $thumbnails.length);
        };

        var highlightThumbnail = function(thumbnail) {
            resetAllThumbnailsHighlighting();
            var current_thumbnail = _.isNumber(thumbnail) ? $thumbnails.eq(thumbnail) : $(thumbnail);
            $(current_thumbnail).find(".thumbnail").addClass("active");
            printSliderInfo();
        };

        var initThumbnails = function() {
            $thumbnailContainer.on("click", "li", function() {
                $sSlider.slickGoTo($(this).index());
                highlightThumbnail(this);
            });
        };

        var getSliderDOM = function() {
            var slides = "";

            $.each($thumbnails, function(index, element) {
                var newImgUrl = updateImage( $(element).data("full-image"), imageSize.fullscreenImage);
                slides += '<div><img src="'+ newImgUrl +'" />' + '</div>';
            });

            return slides;
        };

        var initSlider = function() {
            var slidesHTML = getSliderDOM();
            $mainImageContainer.html(slidesHTML);
            $sSlider = $mainImageContainer.slick();
        };

        var initArrowsControl = function() {
            $mainImageContainer.on("click.slick", ".slick-next, .slick-prev", function() {
                highlightThumbnail($sSlider.slickCurrentSlide());
            });
        };

        var initTouchControl = function() {
            $mainImageContainer.on("touchmove.slick touchstart.slick touchend.slick mousemove.slick", function() {
                highlightThumbnail($sSlider.slickCurrentSlide());
            });
        };

        var unslick = function() {
            if($sSlider) {
                $sSlider.unslick();
            }
        };

        var initGlobals = function(opts) {
            options = $.extend({}, defaults, opts);
            currentIndex = options.defaultImageIndex;
            $mainImageContainer = $(options.mainImageContainer);
            $thumbnailContainer = $(options.thumbnailsContainer);
            $thumbnails = $thumbnailContainer.find("li");
            $sliderInformationContainer = $(options.sliderInformationContainer);
            $controlButtonsContainer = $(options.controlButtonsContainer);
        };

        var init = function(opts) {

            initGlobals(opts);
            initThumbnails();
            initSlider();
            initArrowsControl();
            initTouchControl();

            highlightThumbnail($thumbnails[currentIndex]);
        };

        return {
            init: init,
            unslick: unslick
        };
    })();

    window.MF = MF;

}(jQuery, MF.imagePath.update, MF.imageSize));
