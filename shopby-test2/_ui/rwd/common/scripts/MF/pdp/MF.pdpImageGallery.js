;(function ($, window, document, stickyDescription, stickyNav, updateImage, imageSize) {
    'use strict';

    var MF = window.MF || {};

    MF.pdpImageGallery = (function () {

        var $mainGalleryImage,
            $mainGallery,
            $mainGalleryImageWrapper,
            $galleryPanel,
            $thumbGallery,
            $carouselDots,
            $carouselDotsList,
            $mainImgPrev,
            $mainImgNext,
            $videoThumb,
            $videoTemplate,
            $slickThumbGallery,
            largeThumbsEnabled = false,
            hasZoomImages = false,
            currentOutfit,
            videojsPlayer,
            loadedVideo = false,
            $videoTag;

        function init() {
            $thumbGallery = $(".gallery-panel .thumbs-gallery");
            $mainImgPrev = $(".gallery-panel .gallery-panel__main-image-prev");
            $mainImgNext = $(".gallery-panel .gallery-panel__main-image-next");
            $videoThumb = $("div[data-videothmb]");
            $galleryPanel = $(".gallery-panel");
            $mainGalleryImage = $(".gallery-panel__main-image img.main-image");
            $mainGalleryImageWrapper = $(".gallery-panel__main-image-carousel");
            $carouselDots = $(".carousel-dots", $galleryPanel);
            $carouselDotsList = $("ul", $carouselDots);
            $videoTag = $('#videoTag');

            hasZoomImages = $mainGalleryImageWrapper.closest('.gallery-panel__main-image').hasClass("has-zoom-images");

            var $videoTemplateHtml = $('#videoTemplate');

            getThumbnailImages();

            if ($videoTemplateHtml.length && $videoTemplateHtml.html().length > 0) {
                $videoTemplate = Handlebars.compile($('#videoTemplate').html());
            }

            $thumbGallery.on("click.mf.thumb.gallery", ".slick-slide", function() {
                hideVideo();
                var $activeThumb = $(this);
                $videoThumb.removeClass("thumb-active");
                $(".slick-slide", $thumbGallery).removeAttr("thumb-active").removeClass("thumb-active");
                $activeThumb.attr("thumb-active", "").addClass("thumb-active");
                changeMainImage($activeThumb);
                setOutfitCode($activeThumb);
                updateMobileDots(parseInt($activeThumb.attr("index")));
            });

            $mainImgPrev.on("click.mf.thumb.gallery", function() {
                var $gallery = $(".slick-slide", $thumbGallery),
                    activeThumbIndex = $gallery.index($("[thumb-active]")),
                    prevThumbIndex = activeThumbIndex - 1;

                if (prevThumbIndex !== undefined && $gallery.get(prevThumbIndex)) {
                    $gallery.get(prevThumbIndex).click();
                }
            });

            $mainImgNext.on("click.mf.thumb.gallery", function() {
                var $gallery = $(".slick-slide", $thumbGallery),
                    activeThumbIndex = $gallery.index($("[thumb-active]")),
                    nextThumbIndex = activeThumbIndex + 1;
                    // set nextThumbIndex to 0 if it equals $gallery.length;
                    nextThumbIndex = nextThumbIndex % $gallery.length;
                if (nextThumbIndex !== undefined && $gallery.get(nextThumbIndex)) {
                    $gallery.get(nextThumbIndex).click();
                }
            });

            initSlickThumbGallery();
            

            $(".view-large-thumbs-label").on("click.mf.thumb.gallery", function() {
                enableLargeThumbs();
            });

            $(".view-small-thumbs-label").on("click.mf.thumb.gallery", function() {
                disableLargeThumbs();
            });

            var dotsListHtml = "";
            _.each($(".slick-slide", $galleryPanel.find('.gallery-panel__carousel-wrapper')), function(element, index, list) {
                dotsListHtml += "<li class='" + (index === 0 ? "slick-active" : "") + "' data-index='" + index + "'>" + "<button type='button'>a</button>" + "</li>";
            });
            $carouselDotsList.html(dotsListHtml);

            $carouselDotsList.on("click", "li", function() {
                var $gallery = $(".slick-slide", $thumbGallery),
                    thumbIndex = $(this).data("index");

                $gallery.get(thumbIndex).click();
                $("li", $carouselDotsList).removeClass("slick-active");
                $(this).addClass("slick-active");
            });

            bindVideoClick();

        }

        
        function initSlickThumbGallery() {

            $mainGallery = $('.gallery-panel__main-image-carousel');
            $mainGallery.find('.slick__hide-before-init').removeClass('slick__hide-before-init');
            $mainGallery.find('.slick__invisible-before-init').removeClass('slick__invisible-before-init');
            $mainGallery.slick({
                adaptiveHeight: true,
                onBeforeChange: function(slideHandler, currentSlide, animSlide){
                    if(currentSlide != animSlide) {
                        //stop zoomed state of image
                        $('.gallery-panel__main-image-carousel [data-image-index="' + currentSlide + '"]').trigger('zoomout.zoom');

                        //highlight the new thumbnail
                        $('.thumbs-gallery').find('[data-main-img-url]:nth(' + animSlide + ')').trigger('click.mf.thumb.gallery');
                    }
                }
            });
            $slickThumbGallery = $thumbGallery.slick({
                infinite: false,
                arrows: true,
                slidesToShow: 5,
                slidesToScroll: 5,
                responsive: [
                    {
                        breakpoint: 966,
                        settings: {
                            infinite: false,
                            arrows: true,
                            slidesToShow: 4,
                            slidesToScroll: 4
                        }
                    }
                ]
            });

            var $activeSlick = $(".slick-slide.slick-active", $thumbGallery);

            if ($activeSlick.length) {
                $activeSlick.get(0).click();
            }
        }

        function getThumbnailImages(){
            $(".thumbs-gallery__thumb img").each(function() {
                var src = $(this).attr("src");
                $(this).attr("src", updateImage(src, imageSize.thumbnails));
            });
        }

        function getViewportSize(size){
            switch (MF.breakpoint.getActive()) {
                case "mobile":
                    return size[0];
                    break;
                case "tablet":
                    return size[1];
                    break;
                case "desktop":
                    return size[2];
                    break;
                case "desktop-large":
                    return size[3];
                    break;
                default:
                    return "500";
            };
        }

        function updateThumbnailImages(size){
            var regx = /(\/\/[^\d]+)(\d+)(.+)/g;
            var reqSize = getViewportSize(size);

            $(".thumbs-gallery__thumb img").each(function() {
                var newSize = $(this).attr("src").replace(regx, "$1" + reqSize + "$3");
                $( this ).attr("src", newSize);
            });
        }

        function enableLargeThumbs() {
            if (!largeThumbsEnabled) {
                updateThumbnailImages(imageSize.largeThumbnails);
                $slickThumbGallery.unslick();
                $mainGallery.unslick();
                $galleryPanel.addClass("large-thumbs-enabled");
                largeThumbsEnabled = true;
                stickyNav.disable();
                $(window).scrollTop(187);
                $thumbGallery.fadeIn();
                setTimeout( stickyDescription.stick, 500);
            }
        }

        function disableLargeThumbs() {
            if (largeThumbsEnabled) {
                updateThumbnailImages(imageSize.thumbnails);
                $(window).trigger('resize');
                $galleryPanel.removeClass("large-thumbs-enabled");
                largeThumbsEnabled = false;
                stickyDescription.unstick();
                stickyNav.enable();
                $(window).scrollTop(0);
                initSlickThumbGallery();
                $thumbGallery.fadeIn();
            }
        }

        function hideVideo() {
            $videoTag.fadeOut(100);
            loadedVideo = false;
            if(videojsPlayer) {
             //  videojsPlayer.pause();
            }
            $videoTag.parent().hide();
         }

        function loadVideo($videoThumb) {

            var videoData = {
                videoUrlPrefix: $videoThumb.data('videourlprefix'),
                videoProdId: $videoThumb.data('videoprodid'),
                videoProdType: $videoThumb.data('videotype')
            };

            if ( $videoTag.exists() ) {
                $videoTag.show();
                $videoTag.parent().show();

            } else {
                $(".gallery-panel__main-image .main-image__video-wrapper").empty().html($videoTemplate(videoData)).show();
                
                videojsPlayer = videojs("videoTag", { 
                    "autoplay": true, 
                    "preload": "none", 
                    "loop": "true"
                    }, function() { 
                        $('.vjs-control-bar').prepend('<a href="#" class="close-video" id="close-video" onclick="MF.pdpImageGallery.hide()">close</a>');
                        loadedVideo = true;
                        $('.vjs-control-bar').show();
                    });
                }

                //TODO: to make the poster image smaller
                //set the poster image and the play on tap for iPads
                videojsPlayer.poster(ACC.config.commonResourcePath + '/images/svg/small-play-icon.svg');
                $(videojsPlayer.contentEl()).find('video').click(function(){
                    this.play();
                })

                if ( $videoTag == undefined || !$videoTag.length ) {
                    $videoTag = $('#videoTag');
                }
        }

        function bindVideoClick() {
            if ($videoThumb.length > 0) {
                $videoThumb.on("click.mf.thumb.gallery", function() {
                    $(".slick-slide", $thumbGallery).removeClass("thumb-active");
                    $videoThumb.addClass("thumb-active");

                    if (loadedVideo == false) loadVideo($videoThumb);
                });
            }

            $('body').on('click', '#close-video', function(event) {
                event.preventDefault();
                hideVideo();
            });
        }


        function changeMainImage($activeThumb) {
            var index = $activeThumb.data('image-index');
            $mainGallery.slickGoTo(index);
            var mainImgUrl = $activeThumb.data("main-img-url"),
                zoomImgUrl = $activeThumb.data("main-img-zoom-url"),
                index = $activeThumb.data('image-index');

            var newMainImgUrl = updateImage(mainImgUrl, imageSize.mainImage);
            var newZoomImgUrl = updateImage(zoomImgUrl, imageSize.zoomImage);

            if (newMainImgUrl.length > 0 && hasZoomImages) {
                initZoom(index, newMainImgUrl, newZoomImgUrl);
            } else if (mainImgUrl.length > 0) {
                hideVideo();
                // $mainGalleryImage.attr("src", newMainImgUrl);
            }
        }

        function getOutfitCode() {
            return currentOutfit;
        }

        function setOutfitCode($target) {
            currentOutfit = $target.data("outfit-code");
        }

        function updateMobileDots(index) {
            var dots = $("li", $carouselDotsList);
            if (dots.length) {
                dots.removeClass("slick-active");
                $(dots.get(index)).addClass("slick-active");
            }
        }

        function initZoom(index, mainImgUrl, zoomImgUrl) {
            hideVideo();
            var imageWrapper = $('.gallery-panel__main-image-carousel [data-image-index="' + index + '"]');
            if (imageWrapper.data('alreadyInitialized')) {
                return;
            }
            imageWrapper.data('alreadyInitialized', true);

            imageWrapper.trigger("zoom.destroy");
            if ('ontouchstart' in window && false && (true || MF.breakpoint.getActive() === 'mobile' || MF.breakpoint.getActive() === 'tablet')) {
                var mc = new Hammer(document.getElementById("main-image-js")),
                    zoomOn = false;

                mc.on("doubletap", function(ev) {
                    var cX = ev.gesture.touches[0].pageX,
                        cY = ev.gesture.touches[0].pageY;

                    if (!zoomOn) {
                        zoomOn = true;
                        $(this).zoom({
                            url: zoomImgUrl,
                            on: 'click',
                            callback: function() {
                                var e = new jQuery.Event("click");
                                e.pageX = cX;
                                e.pageY = cY;
                                $mainGalleryImage.trigger(e);
                            },
                            onZoomOut: function() {
                                zoomOn = false;
                                imageWrapper.trigger("zoom.destroy");
                            }
                        });
                    } else {
                        zoomOn = false;
                        imageWrapper.trigger("zoom.destroy");
                    }
                });
            } else {
                imageWrapper.zoom({
                    url: zoomImgUrl,
                    on: 'click',
                    onZoomIn: function() {
                        imageWrapper.addClass("zoom-on");
                    },
                    onZoomOut: function() {
                        imageWrapper.removeClass("zoom-on");
                    }
                });
            }
        }

        return {
            init: init,
            getOutfitCode: getOutfitCode,
            hide : hideVideo
        };
        
    })();

    window.MF = MF;

}(jQuery, this, this.document, MF.stickyDescription, MF.stickyNav, MF.imagePath.update, MF.imageSize));

$(document).ready(function() {
    MF.pdpImageGallery.init();
});
